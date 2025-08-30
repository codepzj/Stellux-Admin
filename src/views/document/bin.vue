<template>
  <a-card class="h-full overflow-y-auto">
    <a-page-header
      :title="$route.meta.title"
      class="!px-0"
      @back="() => $router.back()"
      :backIcon="false"
    >
    </a-page-header>
    <a-table :data-source="docList" :loading="loading" :columns="columns">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'deleted_at'">
          {{ dayjs(record.deleted_at).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
        <template v-else-if="column.dataIndex === 'description'">
          <span class="text-sm text-gray-500 line-clamp-2">
            {{ record.description }}
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'thumbnail'">
          <a-image
            :width="80"
            :src="record.thumbnail"
            :fallback="ImgFallback"
          />
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" @click="handleRestore(record.id)"
            >恢复</a-button
          >
          <a-button type="link" @click="showDeleteModal(record.id)" danger
            >删除</a-button
          >
        </template>
      </template>
    </a-table>

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
  getDocumentBinListAPI,
  restoreRootDocumentAPI,
  deleteRootDocumentAPI,
} from "@/api/document";
import type { DocumentRootVO } from "@/types/document";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import ImgFallback from "@/assets/png/img-fallback.png";
import { message } from "ant-design-vue";

const loading = ref(false);
const docList = ref<DocumentRootVO[]>([]);
const deleteModalOpen = ref(false);
const confirmDelete = ref(false);
const deleteDocId = ref("");

const getDocList = async () => {
  loading.value = true;
  const res = await getDocumentBinListAPI({
    page_no: 1,
    page_size: 10,
  });

  docList.value = res.data.list;
  loading.value = false;
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
  await getDocList();
  message.success("删除文档成功");
  deleteModalOpen.value = false;
  confirmDelete.value = false;
};

// 恢复文档
const handleRestore = async (id: string) => {
  await restoreRootDocumentAPI(id);
  await getDocList();
  message.success("恢复文档成功");
};

const columns = ref([
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "别名",
    dataIndex: "alias",
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "缩略图",
    dataIndex: "thumbnail",
  },
  {
    title: "删除时间",
    dataIndex: "deleted_at",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
]);

defineOptions({
  name: "DocumentBin",
});

onMounted(() => {
  getDocList();
});
</script>

<style lang="scss" scoped></style>
