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
                  @click="
                    openCreateFileOrFolderModal(
                      'file',
                      document_id,
                      document_id
                    )
                  "
                />
              </a-tooltip>
              <a-tooltip title="新增目录">
                <Icon
                  class="cursor-pointer"
                  icon="ant-design:folder-add-outlined"
                  height="20"
                  @click="
                    openCreateFileOrFolderModal('dir', document_id, document_id)
                  "
                />
              </a-tooltip>
            </div>

            <a-spin class="w-full mx-auto" :spinning="loading">
              <a-tree
                v-if="treeData?.length"
                class="!mt-4"
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
                      <a-menu v-if="isDir(key)">
                        <a-menu-item key="1" @click="handleEditModalOpen(key)"
                          >编辑目录</a-menu-item
                        >
                        <a-menu-item
                          key="2"
                          @click="openCreateModal('dir', key, document_id)"
                          >新增目录</a-menu-item
                        >
                        <a-menu-item
                          key="3"
                          @click="openCreateModal('file', key, document_id)"
                          >新增文档</a-menu-item
                        >
                        <a-menu-item key="4" @click="deleteDocumentParent(key)"
                          >删除目录</a-menu-item
                        >
                      </a-menu>
                      <a-menu v-else>
                        <a-menu-item key="1" @click="handleEditModalOpen(key)"
                          >编辑文档</a-menu-item
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
                    v-if="isDir(dataRef.key)"
                    :size="expanded ? 18 : 16"
                    :name="expanded ? 'folder-open' : 'folder'"
                    class="cursor-pointer"
                  />
                </template>

                <template #icon="{ key }">
                  <template v-if="isFile(key)">
                    <SvgIcon :size="16" name="md" />
                  </template>
                  <template
                    v-if="
                      isDir(key) && getChildrenLengthByKey(treeData, key) === 0
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
            <div v-else class="h-full">
              <!-- 调试信息 -->
              <div
                v-if="selectedKeys.length === 0"
                class="flex items-center justify-center h-full text-gray-500"
              >
                <div class="text-center">
                  <Icon
                    icon="ant-design:file-text-outlined"
                    class="text-4xl mb-2"
                  />
                  <p>请选择一个文档进行编辑</p>
                </div>
              </div>

              <!-- 目录节点提示 -->
              <div
                v-else-if="selectedKeys.length > 0 && isDir(selectedKeys[0])"
                class="flex items-center justify-center h-full text-gray-500"
              >
                <div class="text-center">
                  <Icon
                    icon="ant-design:folder-outlined"
                    class="text-4xl mb-2"
                  />
                  <p>这是一个目录，请选择具体的文档进行编辑</p>
                </div>
              </div>

              <!-- 文档编辑器 -->
              <div
                v-else-if="
                  selectedKeys.length > 0 &&
                  isFile(selectedKeys[0]) &&
                  documentDetail
                "
                class="h-full pr-2.5"
              >
                <DocumentContentDetail
                  class="h-full"
                  :document-content="documentDetail"
                  @update="handleDocumentUpdate"
                />
              </div>

              <!-- 加载中状态 -->
              <div
                v-else-if="
                  selectedKeys.length > 0 &&
                  isFile(selectedKeys[0]) &&
                  !documentDetail
                "
                class="flex items-center justify-center h-full"
              >
                <a-spin size="large" />
              </div>
            </div>
          </template>
        </SplitPanel>
      </div>
    </a-card>

    <!-- 新增文档/目录弹窗 -->
    <a-modal
      :open="createModal.visible"
      :title="createModal.title"
      @ok="handleCreate"
      @cancel="createModal.visible = false"
      ok-text="创建"
      cancel-text="取消"
      width="800px"
    >
      <DocumentContentForm
        ref="createFormRef"
        :document_id="createModal.document_id"
        :parent_id="createModal.parent_id"
        :is_dir="createModal.type === 'dir'"
        :parent_tree_data="getParentTreeData(treeData)"
      />
    </a-modal>

    <!-- 新增文档/目录[根级别]弹窗 -->
    <a-modal
      :open="createFileOrFolderModal.visible"
      :title="createFileOrFolderModal.title"
      @ok="handleCreateFileOrFolder"
      @cancel="createFileOrFolderModal.visible = false"
      width="800px"
    >
      <DocumentContentForm
        ref="createFileOrFolderFormRef"
        :document_id="createFileOrFolderModal.document_id"
        :parent_id="createFileOrFolderModal.parent_id"
        :is_dir="createFileOrFolderModal.type === 'dir'"
        :parent_tree_data="getParentTreeData(treeData)"
      />
    </a-modal>

    <!-- 编辑文档信息弹窗 -->
    <DocumentEditModal
      :visible="editModal.visible"
      :document-content="editModal.documentContent"
      :parent_tree_data="
        getParentTreeFilterKey(treeData, editModal.documentContent?.id || '')
      "
      @update:visible="editModal.visible = $event"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { message, type TreeProps } from "ant-design-vue";
import { Icon } from "@iconify/vue";

import SvgIcon from "@/components/SvgIcon/index.vue";
import SplitPanel from "@/components/SplitPanel/index.vue";
import DocumentContentDetail from "./components/DocumentContentDetail.vue";
import DocumentContentForm from "./components/DocumentContentForm.vue";
import DocumentEditModal from "./components/DocumentEditModal.vue";

import {
  deleteDocumentByIdListAPI,
  deleteDocumentContentAPI,
  getDocumentContentByDocumentIdAPI,
  getDocumentContentAPI,
  getDocumentTreeDataAPI,
} from "@/api/document";

import {
  convertToTreeData,
  getChildrenLengthByKey,
  getAllChildIdByParentId,
  type TreeNode,
  convertToSelectTree,
} from "@/utils/convert";

import type { DocumentTreeVO, DocumentContentVO } from "@/types/document";

const route = useRoute();
const document_id = ref(route.params.id as string);

const expandedKeys = ref<string[]>([document_id.value]);
const selectedKeys = ref<string[]>([]);
const loading = ref(true);
const docTreeData = ref<DocumentTreeVO[]>([]);
const treeData = ref<TreeProps["treeData"]>([]);
const selectTreeData = ref<TreeNode[]>([]);

const documentDetail = ref<DocumentContentVO | undefined>();
const originDocument = ref<DocumentContentVO | undefined>();

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

const createFormRef = ref();
const createFileOrFolderFormRef = ref();

// 编辑文档信息
const editModal = reactive({
  visible: false,
  documentContent: undefined as DocumentContentVO | undefined,
});

const openCreateModal = (
  type: "dir" | "file",
  parent_id: string,
  document_id: string
) => {
  createModal.visible = true;
  createModal.type = type;
  createModal.parent_id = parent_id;
  createModal.document_id = document_id;
  createModal.input = "";
  createModal.title = type === "dir" ? "新增目录" : "新增文档";
  createModal.expandedKey = parent_id; // 新增目录时，展开父目录
};

const openCreateFileOrFolderModal = (
  type: "dir" | "file",
  document_id: string,
  parent_id: string
) => {
  createFileOrFolderModal.visible = true;
  createFileOrFolderModal.type = type;
  createFileOrFolderModal.parent_id = parent_id;
  createFileOrFolderModal.document_id = document_id;
  createFileOrFolderModal.input = "";
  createFileOrFolderModal.title = type === "dir" ? "新增目录" : "新增文档";
};

const handleCreate = async () => {
  const success = await createFormRef.value?.submit();
  if (success) {
    createModal.visible = false;
    createFormRef.value?.resetFields?.(); // 如果有reset方法
    await getDocumentTree(route.params.id as string);
    message.success("创建成功");
  }
};

const handleCreateFileOrFolder = async () => {
  const success = await createFileOrFolderFormRef.value?.submit();
  if (success) {
    createFileOrFolderModal.visible = false;
    createFileOrFolderFormRef.value?.resetFields?.(); // 如果有reset方法
    await getDocumentTree(route.params.id as string);
    message.success("创建成功");
  }
};

function filterTree(data: TreeNode[]): TreeNode[] {
  return data
    .filter(item => isDir(item.value)) // 先过滤当前层满足条件的节点
    .map((item: TreeNode) => ({
      ...item,
      children: item.children ? filterTree(item.children) : [], // 递归过滤子节点
    }));
}

// 过滤出只有目录的树形数据，用于父级选择
function filterDirTree(
  data: TreeProps["treeData"] = []
): TreeProps["treeData"] {
  return data
    .filter(item => isDir(item.key as string))
    .map(item => ({
      ...item,
      children: item.children ? filterDirTree(item.children) : [],
    }));
}

// 获取父级目录树形数据
const getParentTreeData = (
  data: TreeProps["treeData"] = []
): TreeProps["treeData"] => {
  return [
    {
      key: document_id.value,
      title: "根目录",
      children: filterDirTree(data),
    },
  ];
};

// 获取父级目录树形数据，传入key，并排除key下所有直接子目录
const getParentTreeFilterKey = (
  data: TreeProps["treeData"] = [],
  key: string
): TreeProps["treeData"] => {
  // 获取完整的父级目录树
  const allTreeData = getParentTreeData(data);

  // 递归过滤掉key节点及其所有子节点
  function filterNode(
    nodes: TreeProps["treeData"] = []
  ): TreeProps["treeData"] {
    return nodes
      .filter(item => item.key !== key)
      .map(item => ({
        ...item,
        children: item.children ? filterNode(item.children) : [],
      }));
  }

  // allTreeData 可能为 undefined，需做判空处理
  if (!allTreeData) return [];
  // allTreeData 是一个数组，通常只有一个根节点
  return allTreeData.map(root => ({
    ...root,
    children: root.children ? filterNode(root.children) : [],
  }));
};

const getDocumentTree = async (id: string) => {
  loading.value = true;
  try {
    console.log("获取文档内容列表, document_id:", id);
    const res = await getDocumentTreeDataAPI(id);
    console.log("文档内容数据:", res.data);
    docTreeData.value = res.data;
    treeData.value = convertToTreeData(docTreeData.value);
    selectTreeData.value = convertToSelectTree(docTreeData.value);
    selectTreeData.value = filterTree(selectTreeData.value);
    console.log("转换后的树形数据:", treeData.value);
    console.log("转换后的选择树形数据:", filterDirTree(treeData.value));
    selectTreeData.value = [
      {
        label: "根目录",
        value: id,
        children: [...selectTreeData.value],
      },
    ];
  } catch (error) {
    console.error("获取文档内容失败:", error);
    message.error("获取文档内容失败");
  } finally {
    loading.value = false;
  }
};

const getParentDoc = async () => {
  const res = await getDocumentContentByDocumentIdAPI(document_id.value);
  expandedKeys.value = [
    ...expandedKeys.value,
    ...res.data.map(item => item.id),
  ];
};

const deleteDocumentLeaf = async (id: string) => {
  await deleteDocumentContentAPI(id);
  await getDocumentTree(route.params.id as string);
};

const deleteDocumentParent = async (id: string) => {
  const childIds = getAllChildIdByParentId(treeData.value, id);
  await deleteDocumentByIdListAPI(childIds);
  await getDocumentTree(route.params.id as string);
};

const handleEditModalOpen = async (id: string) => {
  try {
    const res = await getDocumentContentAPI(id);
    editModal.documentContent = res.data;
    editModal.visible = true;
  } catch (error) {
    console.error("获取文档信息失败:", error);
    message.error("获取文档信息失败");
  }
};

const handleEditSuccess = async (updatedContent: DocumentContentVO) => {
  // 更新本地数据
  const index = docTreeData.value.findIndex(
    item => item.id === updatedContent.id
  );
  if (index !== -1) {
    docTreeData.value[index] = {
      ...docTreeData.value[index],
      title: updatedContent.title,
      sort: updatedContent.sort,
    };
  }

  // 如果当前选中的是编辑的文档，也更新详情
  if (documentDetail.value?.id === updatedContent.id) {
    documentDetail.value = updatedContent;
    originDocument.value = { ...updatedContent };
  }

  // 重新生成树形数据
  treeData.value = convertToTreeData(docTreeData.value);
  selectTreeData.value = convertToSelectTree(docTreeData.value);
  selectTreeData.value = filterTree(selectTreeData.value);

  // 重新生成选择树形数据
  await getDocumentTree(route.params.id as string);

  message.success("编辑成功");
};

const onHandleSelect = async (keys: string[]) => {
  console.log("选中节点:", keys);
  const key = keys[0];

  if (!key) {
    documentDetail.value = undefined;
    originDocument.value = undefined;
    return;
  }

  if (isFile(key)) {
    console.log("选中文档节点:", key);
    try {
      const res = await getDocumentContentAPI(key);
      console.log("获取文档内容成功:", res.data);
      documentDetail.value = res.data;
      originDocument.value = { ...res.data };
    } catch (error) {
      message.error("获取文档内容失败");
      documentDetail.value = undefined;
      originDocument.value = undefined;
    }
  } else {
    console.log("选中目录节点:", key);
    documentDetail.value = undefined;
    originDocument.value = undefined;
  }
};

const handleDocumentUpdate = (updatedContent: DocumentContentVO) => {
  documentDetail.value = updatedContent;
  originDocument.value = { ...updatedContent };
};

// 判断当前节点是否是目录
const isDir = (id: string): boolean => {
  const item = docTreeData.value.find(item => item.id === id);
  const result = item?.is_dir === true;
  return result;
};

// 判断当前节点是否是文档
const isFile = (id: string): boolean => {
  const item = docTreeData.value.find(item => item.id === id);
  const result = item?.is_dir === false;
  return result;
};

// 页面加载逻辑(先加载文档树, 然后加载首页)
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
