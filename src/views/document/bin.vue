<template>
  <div>
    <a-page-header class="!px-0">
      <div class="flex justify-between">
        <a-segmented v-model:value="activeKey" :options="data" />
      </div>
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
          <a-button type="link" @click="showDeleteConfirm(record.id)" danger
            >删除</a-button
          >
        </template>
      </template>
    </a-table>
  </div>
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
import { message, Modal } from "ant-design-vue";

const activeKey = ref("1");
const loading = ref(false);
const docList = ref<DocumentRootVO[]>([]);

const getDocList = async () => {
  loading.value = true;
  const res = await getDocumentBinListAPI({
    page_no: 1,
    page_size: 10,
  });

  docList.value = res.data.list;
  loading.value = false;
};

// 显示删除确认框
const showDeleteConfirm = (id: string) => {
  Modal.confirm({
    title: "删除文档",
    content: "确定永久删除该文档吗？此操作不可恢复！",
    okText: "删除",
    cancelText: "取消",
    okType: "danger",
    onOk: async () => {
      return await handleDelete(id);
    },
    onCancel: () => {
      console.log("撤销文档删除");
    },
  });
};

// 恢复文档
const handleRestore = async (id: string) => {
  await restoreRootDocumentAPI(id);
  await getDocList();
  message.success("恢复文档成功");
};

// 删除文档
const handleDelete = async (id: string) => {
  await deleteRootDocumentAPI(id);
  await getDocList();
  message.success("删除文档成功");
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

const data = ref([
  {
    label: "文档",
    value: "1",
  },
  {
    label: "文件",
    value: "2",
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
