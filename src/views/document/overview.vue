<template>
  <a-card class="h-full overflow-y-auto">
    <div class="flex justify-end gap-2">
      <a-button @click="$router.push({ name: 'DocumentBin' })">回收箱</a-button>
      <a-button type="primary" @click="handleOpenCreateModal"
        >新增文档</a-button
      >
    </div>
    <a-skeleton :loading="loading" active>
      <div class="py-4">
        <a-empty
          v-if="docList.length === 0"
          description="暂无文档"
          class="py-16"
        />
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <a-card v-for="doc in docList" :key="doc.id">
            <div class="flex justify-between items-center gap-2 px-2 py-4">
              <div class="flex items-center gap-2">
                <SvgIcon name="document" />
                <span
                  class="text-lg font-bold cursor-pointer"
                  @click="
                    $router.push({
                      name: 'DocumentContentDetail',
                      params: { id: doc.id },
                    })
                  "
                >
                  {{ doc.title }}
                </span>
                <SvgIcon name="global" :size="14" v-if="doc.is_public" />
                <SvgIcon name="lock" :size="14" v-else />
              </div>
              <div class="cursor-pointer">
                <a-dropdown :trigger="['click']" placement="bottomRight">
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="handleEdit(doc.id)"
                        >编辑</a-menu-item
                      >
                      <a-menu-item @click="handleSoftDelete(doc.id)"
                        >删除</a-menu-item
                      >
                      <a-menu-item danger @click="showDeleteModal(doc.id)"
                        >永久删除</a-menu-item
                      >
                    </a-menu>
                  </template>
                  <Icon
                    icon="iconamoon:menu-kebab-horizontal"
                    height="18"
                    width="18"
                  />
                </a-dropdown>
              </div>
            </div>
            <div class="flex justify-start gap-2 px-2 py-4">
              <div class="text-sm text-zinc-500 line-clamp-2">
                {{ doc.description }}
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </a-skeleton>

    <!-- 新增文档弹窗 -->
    <a-modal
      v-model:open="showModal"
      title="新增文档"
      @ok="handleOk"
      @cancel="handleCreateCancel"
    >
      <a-form layout="vertical" :model="createDoc" :rules="rules" ref="formRef">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="标题" name="title">
              <a-input
                v-model:value="createDoc.title"
                placeholder="请输入标题"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="别名" name="alias">
              <a-input
                v-model:value="createDoc.alias"
                placeholder="请输入别名"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="排序" name="sort">
              <a-input-number
                v-model:value="createDoc.sort"
                :min="1"
                :max="9999"
                placeholder="请输入排序"
                class="w-full"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="描述" name="description">
          <a-input
            v-model:value="createDoc.description"
            placeholder="请输入描述"
          />
        </a-form-item>

        <a-form-item label="封面" name="thumbnail">
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 whitespace-nowrap"
              >图片链接：</span
            >
            <a-input
              v-model:value="createDoc.thumbnail"
              placeholder="输入图片链接或从相册选择"
              style="flex: 1"
            />
            <a-button
              type="link"
              size="small"
              @click="createThumbnailModalOpen = true"
            >
              <template #icon>
                <Icon icon="solar:gallery-bold-duotone" />
              </template>
              从相册选择
            </a-button>
          </div>
        </a-form-item>
        <a-form-item label="是否公开">
          <a-switch v-model:checked="createDoc.is_public" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑文档弹窗 -->
    <a-modal
      v-model:open="editModalOpen"
      title="编辑文档"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
    >
      <a-form layout="vertical" :model="editDoc" :rules="rules" ref="formRef">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="标题" name="title">
              <a-input v-model:value="editDoc.title" placeholder="请输入标题" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="别名" name="alias">
              <a-input v-model:value="editDoc.alias" placeholder="请输入别名" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="排序" name="sort">
              <a-input-number
                v-model:value="editDoc.sort"
                :min="1"
                :max="9999"
                placeholder="请输入排序"
                class="w-full"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="描述" name="description">
          <a-input
            v-model:value="editDoc.description"
            placeholder="请输入描述"
          />
        </a-form-item>
        <a-form-item label="封面" name="thumbnail">
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 whitespace-nowrap"
              >图片链接：</span
            >
            <a-input
              v-model:value="editDoc.thumbnail"
              placeholder="输入图片链接或从相册选择"
              style="flex: 1"
            />
            <a-button
              type="link"
              size="small"
              @click="editThumbnailModalOpen = true"
            >
              <template #icon>
                <Icon icon="solar:gallery-bold-duotone" />
              </template>
              从相册选择
            </a-button>
          </div>
        </a-form-item>
        <a-form-item label="是否公开">
          <a-switch v-model:checked="editDoc.is_public" />
        </a-form-item>
      </a-form>
    </a-modal>
    <PhotoSelect
      v-model:open="createThumbnailModalOpen"
      @selected-picture="handleCreateSelectedPicture"
    />
    <PhotoSelect
      v-model:open="editThumbnailModalOpen"
      @selected-picture="handleEditSelectedPicture"
    />

    <!-- 删除确认弹窗 -->
    <a-modal
      v-model:open="deleteModalOpen"
      title="删除确认"
      @ok="handleDeleteConfirm"
      @cancel="deleteModalOpen = false"
      :ok-button-props="{
        disabled: !confirmDelete,
        danger: true,
      }"
      centered
    >
      <p class="text-red-600 mb-3">此操作将永久删除该文档，无法恢复。</p>
      <div class="mt-4">
        <a-checkbox v-model:checked="confirmDelete">
          我确认删除该文档
        </a-checkbox>
      </div>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
import {
  createRootDocumentAPI,
  deleteRootDocumentAPI,
  updateRootDocumentAPI,
  getRootDocumentListAPI,
  softDeleteRootDocumentAPI,
} from "@/api/document";
import type {
  DocumentRootEditRequest,
  DocumentRootRequest,
  DocumentRootVO,
} from "@/types/document";
import { message } from "ant-design-vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import PhotoSelect from "@/components/PhotoSelect/index.vue";
import type { FormInstance } from "ant-design-vue";
import { Icon } from "@iconify/vue";
import { watch } from "vue";

const docList = ref<DocumentRootVO[]>([]);
const showModal = ref(false);
const editModalOpen = ref(false);
const createThumbnailModalOpen = ref(false);
const editThumbnailModalOpen = ref(false);
const deleteModalOpen = ref(false);
const confirmDelete = ref(false);
const deleteDocId = ref("");
const loading = ref(false);
const formRef = ref<FormInstance>();
const editDoc = ref<DocumentRootEditRequest>({
  id: "",
  title: "",
  alias: "",
  description: "",
  thumbnail: "",
  document_type: "root",
  is_public: false,
  sort: 1,
});
const rules: Record<string, any> = {
  title: [{ required: true, message: "请输入标题" }],
  alias: [{ required: true, message: "请输入别名" }],
  description: [{ required: true, message: "请输入描述" }],
  sort: [
    { required: true, message: "请输入排序", type: "number", trigger: "blur" },
    {
      type: "number",
      min: 1,
      max: 9999,
      message: "排序值在1-9999之间",
      trigger: "blur",
    },
  ],
};

// 新增文档
const createDoc = ref<DocumentRootRequest>({
  title: "",
  alias: "",
  description: "",
  thumbnail: "",
  document_type: "root",
  is_public: true,
  sort: 1,
});

// 获取所有根文档
const getAllDoc = async () => {
  loading.value = true;
  try {
    const res = await getRootDocumentListAPI({ page_no: 1, page_size: 100 });
    docList.value = res.data.list.sort(
      (a: DocumentRootVO, b: DocumentRootVO) => {
        if (a.sort !== b.sort) {
          return a.sort - b.sort;
        }
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
    );
  } catch (error) {
    message.error("获取文档列表失败");
  } finally {
    loading.value = false;
  }
};

// 编辑文档
const handleEdit = (id: string) => {
  const doc = docList.value.find(doc => doc.id === id);
  if (doc) {
    editDoc.value = {
      id: doc.id,
      title: doc.title,
      alias: doc.alias,
      description: doc.description,
      thumbnail: doc.thumbnail,
      document_type: "root",
      is_public: doc.is_public,
      sort: doc.sort,
    };
  }
  editModalOpen.value = true;
};

// 显示删除确认弹窗
const showDeleteModal = (id: string) => {
  deleteDocId.value = id;
  deleteModalOpen.value = true;
  confirmDelete.value = false;
};

// 删除确认
const handleDeleteConfirm = async () => {
  await deleteRootDocumentAPI(deleteDocId.value);
  await getAllDoc();
  message.success("文档删除成功");
  deleteModalOpen.value = false;
  confirmDelete.value = false;
};

// 软删除文档
const handleSoftDelete = async (id: string) => {
  await softDeleteRootDocumentAPI(id);
  await getAllDoc();
  message.success("文档软删除成功");
};

// 打开新增文档弹窗
const handleOpenCreateModal = () => {
  // 根据当前已有的根文档数量自动设置排序值
  const count = docList.value.length;
  createDoc.value.sort = count + 1;
  showModal.value = true;
};

// 清空新增文档
const clearCreateDoc = () => {
  createDoc.value.title = "";
  createDoc.value.alias = "";
  createDoc.value.is_public = false;
  createDoc.value.description = "";
  createDoc.value.thumbnail = "";
  createDoc.value.sort = 1;
};

// 清空编辑文档
const clearEditDoc = () => {
  editDoc.value.id = "";
  editDoc.value.title = "";
  editDoc.value.alias = "";
  editDoc.value.description = "";
  editDoc.value.thumbnail = "";
  editDoc.value.document_type = "root";
  editDoc.value.is_public = false;
  editDoc.value.sort = 1;
};

// 新增文档
const handleOk = async () => {
  await formRef.value?.validate();
  await createRootDocumentAPI(createDoc.value);

  message.success("文档创建成功");
  showModal.value = false;
  clearCreateDoc();
  await getAllDoc();
};

const handleCreateSelectedPicture = (picture: string) => {
  createDoc.value.thumbnail = picture;
};

const handleEditSelectedPicture = (picture: string) => {
  editDoc.value.thumbnail = picture;
};

const handleCreateCancel = () => {
  clearCreateDoc();
  showModal.value = false;
};

const handleEditOk = async () => {
  await formRef.value?.validate();
  await updateRootDocumentAPI(editDoc.value);

  message.success("文档编辑成功");
  editModalOpen.value = false;
  clearEditDoc();
  await getAllDoc();
};

const handleEditCancel = () => {
  clearEditDoc();
  editModalOpen.value = false;
};

// 监听弹窗打开，自动更新排序值
watch(showModal, isOpen => {
  if (isOpen) {
    // 根据当前已有的根文档数量自动设置排序值
    const count = docList.value.length;
    createDoc.value.sort = count + 1;
  }
});

onMounted(getAllDoc);
</script>

<style lang="scss" scoped>
:deep(.ant-card .ant-card-body) {
  padding: 12px;
  border-radius: 0 0 8px 8px;
}
</style>
