<template>
  <div class="h-full overflow-x-hidden">
    <a-card class="h-full" :bordered="false">
      <div class="h-full flex">
        <SplitPanel>
          <template #left-content>
            <div class="w-full flex justify-end items-center gap-2">
              <a-tooltip title="新增文档">
                <Icon
                  class="cursor-pointer"
                  icon="ant-design:file-add-outlined"
                  height="18"
                  @click="openCreateFileOrFolderModal('leaf', document_id)"
                />
              </a-tooltip>
              <a-tooltip title="新增目录">
                <Icon
                  class="cursor-pointer"
                  icon="ant-design:folder-add-outlined"
                  height="20"
                  @click="openCreateFileOrFolderModal('parent', document_id)"
                />
              </a-tooltip>
            </div>

            <a-spin class="w-full mx-auto" :spinning="loading">
              <a-tree
                v-if="treeData?.length"
                v-model:expandedKeys="expandedKeys"
                v-model:selectedKeys="selectedKeys"
                :tree-data="treeData"
                @select="onHandleSelect"
                block-node
                show-icon
              >
                <template #title="{ title, key }">
                  <a-dropdown :trigger="['contextmenu']">
                    <div class="cursor-pointer w-full m-1">{{ title }}</div>
                    <template #overlay>
                      <a-menu v-if="isParent(key)">
                        <a-menu-item key="1" @click="handleRenameModalOpen(key)"
                          >重命名</a-menu-item
                        >
                        <a-menu-item
                          key="2"
                          @click="openCreateModal('parent', key, document_id)"
                          >新增目录</a-menu-item
                        >
                        <a-menu-item
                          key="3"
                          @click="openCreateModal('leaf', key, document_id)"
                          >新增文档</a-menu-item
                        >
                        <a-menu-item key="4" @click="deleteDocumentParent(key)"
                          >删除目录</a-menu-item
                        >
                      </a-menu>
                      <a-menu v-else>
                        <a-menu-item key="1" @click="handleRenameModalOpen(key)"
                          >重命名</a-menu-item
                        >
                        <a-menu-item key="2" @click="deleteDocumentLeaf(key)"
                          >删除文档</a-menu-item
                        >
                      </a-menu>
                    </template>
                  </a-dropdown>
                </template>

                <template #switcherIcon="{ dataRef, expanded }">
                  <SvgIcon
                    v-if="isParent(dataRef.key)"
                    :size="expanded ? 18 : 16"
                    :name="expanded ? 'folder-open' : 'folder'"
                    class="cursor-pointer"
                  />
                </template>

                <template #icon="{ key }">
                  <template v-if="isLeaf(key)">
                    <SvgIcon :size="16" name="md" />
                  </template>
                  <template
                    v-if="
                      isParent(key) &&
                      getChildrenLengthByKey(treeData, key) === 0
                    "
                  >
                    <SvgIcon :size="16" name="folder" />
                  </template>
                </template>
              </a-tree>
            </a-spin>
          </template>

          <template #right-content>
            <a-skeleton active v-if="loading" />
            <div v-else>
              <div class="pr-2.5">
                <DocumentDetail
                  class="mt-3"
                  v-model:content="documentDetail.content"
                />
              </div>
            </div>
          </template>
        </SplitPanel>
      </div>
    </a-card>

    <a-modal
      v-model:open="createModal.visible"
      :title="createModal.title"
      @ok="handleCreate"
      ok-text="创建"
      cancel-text="取消"
    >
      <div class="flex flex-col gap-2 py-4">
        <a-input
          v-model:value="createModal.input"
          placeholder="请输入标题"
          @keyup.enter="handleCreate"
        />
      </div>
    </a-modal>

    <a-modal
      v-model:open="renameDocumentModal.visible"
      title="重命名"
      @ok="handleRename"
      ok-text="确认"
      cancel-text="取消"
    >
      <div class="flex flex-col gap-2 py-4">
        <a-input
          v-model:value="renameDocumentModal.title"
          placeholder="请输入标题"
          @keyup.enter="handleRename"
        />
      </div>
    </a-modal>

    <a-modal
      v-model:open="createFileOrFolderModal.visible"
      :title="createFileOrFolderModal.title"
      @ok="handleCreateFileOrFolder"
      @cancel="createFileOrFolderModal.visible = false"
    >
      <div class="flex flex-col gap-2 py-4">
        <a-input
          v-model:value="createFileOrFolderModal.input"
          placeholder="请输入标题"
        />
        <a-tree-select
          v-model:value="createFileOrFolderModal.parent_id"
          :tree-data="selectTreeData"
          placeholder="请选择父目录"
          allow-clear
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          tree-default-expand-all
        />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick, computed, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { message, type TreeProps } from "ant-design-vue";
import { Icon } from "@iconify/vue";

import SvgIcon from "@/components/SvgIcon/index.vue";
import SplitPanel from "@/components/SplitPanel/index.vue";
import DocumentDetail from "./components/DocumentDetail.vue";

import {
  createDocumentAPI,
  deleteDocumentByIDListAPI,
  deleteDocumentLeafByIDAPI,
  getAllParentDocAPI,
  getDocumentByIDAPI,
  getDocumentTreeByIDAPI,
  renameDocumentAPI,
  saveDocumentAPI,
} from "@/api/document";

import { useDocumentStore } from "@/store/modules/document";
import {
  convertToTreeData,
  getChildrenLengthByKey,
  getAllChildIdByParentId,
  type TreeNode,
  convertToSelectTree,
} from "@/utils/convert";

import type { DocumentRequest, DocumentTreeVO } from "@/types/document";

const route = useRoute();
const document_id = ref(route.params.id as string);

const expandedKeys = ref<string[]>([document_id.value]);
const selectedKeys = ref<string[]>([]);
const loading = ref(true);
const docTreeData = ref<DocumentTreeVO[]>([]);
const treeData = ref<TreeProps["treeData"]>([]);
const selectTreeData = ref<TreeNode[]>([]);
const documentStore = useDocumentStore();

const documentDetail = ref({
  id: document_id.value,
  title: "",
  content: "",
});

const originDocument = ref({
  id: document_id.value,
  title: "",
  content: "",
});

const createModal = reactive({
  visible: false,
  title: "",
  type: "", 
  parent_id: "",
  document_id: "",
  input: "",
  expandedKey: "",
});

const createFileOrFolderModal = reactive({
  visible: false,
  title: "",
  type: "", 
  document_id: "",
  parent_id: "",
  input: "",
});

// 重命名文档
const renameDocumentModal = reactive({
  visible: false,
  id: "",
  title: "",
});

const openCreateModal = (
  type: "parent" | "leaf",
  parent_id: string,
  document_id: string
) => {
  createModal.visible = true;
  createModal.type = type;
  createModal.parent_id = parent_id;
  createModal.document_id = document_id;
  createModal.input = "";
  createModal.title = type === "parent" ? "新增目录" : "新增文档";
  createModal.expandedKey = parent_id; // 新增目录时，展开父目录
};

const openCreateFileOrFolderModal = (
  type: "parent" | "leaf",
  document_id: string
) => {
  createFileOrFolderModal.visible = true;
  createFileOrFolderModal.type = type;
  createFileOrFolderModal.parent_id = "";
  createFileOrFolderModal.document_id = document_id;
  createFileOrFolderModal.input = "";
  createFileOrFolderModal.title = type === "parent" ? "新增目录" : "新增文档";
};

const handleCreate = async () => {
  if (!createModal.input.trim()) {
    message.warning("请输入标题");
    return;
  }

  // 新增文档
  const createDocument: DocumentRequest = {
    title: createModal.input,
    content: "",
    parent_id: createModal.parent_id,
    document_id: createModal.document_id,
    document_type: createModal.type,
  };

  await createDocumentAPI(createDocument);
  expandedKeys.value = [...expandedKeys.value, createModal.expandedKey];
  await getDocumentTree(route.params.id as string);
  createModal.visible = false;
  message.success("创建成功");
};

const handleCreateFileOrFolder = async () => {
  if (!createFileOrFolderModal.input.trim()) {
    message.warning("请输入标题");
    return;
  }
  const createDocument: DocumentRequest = {
    title: createFileOrFolderModal.input,
    content: "",
    parent_id: createFileOrFolderModal.parent_id,
    document_id: createFileOrFolderModal.document_id,
    document_type: createFileOrFolderModal.type,
  };

  await createDocumentAPI(createDocument);
  await getDocumentTree(route.params.id as string);
  createFileOrFolderModal.visible = false;
  message.success("创建成功");
};

function filterTree(data: TreeNode[]): TreeNode[] {
  return data
    .filter(item => isParent(item.value)) // 先过滤当前层满足条件的节点
    .map((item: TreeNode) => ({
      ...item,
      children: item.children ? filterTree(item.children) : [], // 递归过滤子节点
    }));
}

const getDocumentTree = async (id: string) => {
  loading.value = true;
  const res = await getDocumentTreeByIDAPI(id);
  docTreeData.value = res.data;
  treeData.value = convertToTreeData(docTreeData.value);
  selectTreeData.value = convertToSelectTree(docTreeData.value);
  selectTreeData.value = filterTree(selectTreeData.value);
  console.log(selectTreeData.value);
  selectTreeData.value=[{
    label: "根目录",
    value: id,
      children: [
        ...selectTreeData.value,
      ],
    },
  ];
  loading.value = false;
};

const getParentDoc = async () => {
  const res = await getAllParentDocAPI(document_id.value);
  expandedKeys.value = [
    ...expandedKeys.value,
    ...res.data.map(item => item.id),
  ];
};

const deleteDocumentLeaf = async (id: string) => {
  await deleteDocumentLeafByIDAPI(id);
  await getDocumentTree(route.params.id as string);
};

const deleteDocumentParent = async (id: string) => {
  const childIds = getAllChildIdByParentId(treeData.value, id);
  await deleteDocumentByIDListAPI(childIds);
  await getDocumentTree(route.params.id as string);
};

const handleRenameModalOpen = (id: string) => {
  renameDocumentModal.visible = true;
  renameDocumentModal.id = id;
  renameDocumentModal.title = docTreeData.value.find(item => item.id === id)
    ?.title as string;
};

const handleRename = async () => {
  await renameDocumentAPI(renameDocumentModal.id, renameDocumentModal.title);
  await getDocumentTree(route.params.id as string);
  renameDocumentModal.visible = false;
  message.success("重命名成功");
};

const saveDocument = async () => {
  await saveDocumentAPI({
    id: documentDetail.value.id,
    title: documentDetail.value.title,
    content: documentDetail.value.content,
  });
  originDocument.value.title = documentDetail.value.title;
  originDocument.value.content = documentDetail.value.content;
  message.success("保存成功");
};

const onHandleSelect = async (keys: string[]) => {
  const key = keys[0];
  if (isLeaf(key)) {
    const res = await getDocumentByIDAPI(key);
    documentDetail.value = {
      id: res.data.id,
      title: res.data.title,
      content: res.data.content,
    };
    originDocument.value = {
      id: res.data.id,
      title: res.data.title,
      content: res.data.content,
    };
  }
};

const isParent = (id: string): boolean =>
  docTreeData.value.find(item => item.id === id)?.document_type === "parent";

const isLeaf = (id: string): boolean =>
  docTreeData.value.find(item => item.id === id)?.document_type === "leaf";

const isDocumentAlreadyEdit = computed(() => {
  return (
    documentDetail.value.title !== originDocument.value.title ||
    documentDetail.value.content !== originDocument.value.content
  );
});

watchEffect(() => {
  documentStore.setActionButtonList([
    {
      name: "保存",
      disabled: !isDocumentAlreadyEdit.value,
      action: saveDocument,
    },
  ]);
  documentStore.setEditDocumentTitle(documentDetail.value.title);
});

// 页面加载逻辑（先加载文档树，然后加载首页）
onMounted(async () => {
  await getDocumentTree(document_id.value);
  await nextTick();

  await getParentDoc();
});
</script>

<style lang="scss" scoped>
:deep(.ant-card-body) {
  height: 100%;
  padding: 10px 0 10px 10px;
}

:deep(.ant-tree .ant-tree-switcher) {
  width: 18px;
  display: flex;
  align-items: center;
}
:deep(.ant-tree .ant-tree-switcher-noop) {
  width: 0;
}
:deep(.ant-tree .ant-tree-node-content-wrapper) {
  display: flex;
  align-items: center;
  line-height: 22px;
  user-select: none;
  padding: 0;
}
:deep(.ant-tree .ant-tree-title) {
  width: 100%;
}
:deep(.ant-tree .ant-tree-indent-unit) {
  display: inline-block;
  width: 18px;
}
</style>
