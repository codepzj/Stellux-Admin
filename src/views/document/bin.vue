<template>
  <a-card class="h-full overflow-y-auto">
    <a-page-header
      :title="$route.meta.title"
      class="px-0!"
      @back="() => $router.back()"
      :backIcon="false"
    >
    </a-page-header>
    <a-table :data-source="docList" :loading="loading" :columns="columns">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          <a-tag :color="record.type === 'root' ? 'blue' : 'green'">
            {{ record.type === "root" ? "根文档" : "文档内容" }}
          </a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'deleted_at'">
          {{
            record.deleted_at
              ? dayjs(record.deleted_at).format("YYYY-MM-DD HH:mm:ss")
              : "-"
          }}
        </template>
        <template v-else-if="column.dataIndex === 'description'">
          <span class="text-sm text-gray-500 line-clamp-2">
            {{ record.description || "-" }}
          </span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a-button type="link" @click="handleRestore(record.id, record.type)"
            >恢复</a-button
          >
          <a-button
            type="link"
            @click="showDeleteModal(record.id, record.type)"
            danger
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
  getDocumentContentBinListAPI,
  restoreRootDocumentAPI,
  restoreDocumentContentAPI,
  deleteRootDocumentAPI,
  deleteDocumentContentAPI,
} from "@/api/document";
import type { DocumentRootVO, DocumentContentVO } from "@/types/document";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";

const loading = ref(false);
const docList = ref<
  (DocumentRootVO | (DocumentContentVO & { type: "root" | "content" }))[]
>([]);
const deleteModalOpen = ref(false);
const confirmDelete = ref(false);
const deleteItem = ref<{ id: string; type: "root" | "content" } | null>(null);

const getDocList = async () => {
  loading.value = true;
  try {
    // 同时获取根文档和文档内容的回收箱列表
    const [rootRes, contentRes] = await Promise.all([
      getDocumentBinListAPI({
        page_no: 1,
        page_size: 100,
      }),
      getDocumentContentBinListAPI({
        page_no: 1,
        page_size: 100,
      }),
    ]);

    // 合并两个列表，并标记类型
    const rootDocs = rootRes.data.list.map((doc: DocumentRootVO) => ({
      ...doc,
      type: "root" as const,
    }));
    const contentDocs = contentRes.data.list.map((doc: DocumentContentVO) => ({
      ...doc,
      type: "content" as const,
    }));

    // 按删除时间排序
    docList.value = [...rootDocs, ...contentDocs].sort((a, b) => {
      const timeA = a.deleted_at ? new Date(a.deleted_at).getTime() : 0;
      const timeB = b.deleted_at ? new Date(b.deleted_at).getTime() : 0;
      return timeB - timeA; // 降序，最新的在前
    });
  } catch (error) {
    console.error("获取回收箱列表失败:", error);
    message.error("获取回收箱列表失败");
  } finally {
    loading.value = false;
  }
};

// 显示删除确认弹窗
const showDeleteModal = (id: string, type: "root" | "content") => {
  deleteItem.value = { id, type };
  deleteModalOpen.value = true;
  confirmDelete.value = false;
};

// 删除确认
const handleDeleteConfirm = async () => {
  if (!deleteItem.value) return;

  try {
    if (deleteItem.value.type === "root") {
      await deleteRootDocumentAPI(deleteItem.value.id);
    } else {
      await deleteDocumentContentAPI(deleteItem.value.id);
    }
    await getDocList();
    message.success("删除成功");
    deleteModalOpen.value = false;
    confirmDelete.value = false;
    deleteItem.value = null;
  } catch (error) {
    message.error("删除失败");
  }
};

// 恢复文档
const handleRestore = async (id: string, type: "root" | "content") => {
  try {
    if (type === "root") {
      await restoreRootDocumentAPI(id);
    } else {
      await restoreDocumentContentAPI(id);
    }
    await getDocList();
    message.success("恢复成功");
  } catch (error) {
    message.error("恢复失败");
  }
};

const columns = ref([
  {
    title: "类型",
    dataIndex: "type",
    width: 100,
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 200,
    ellipsis: true,
  },
  {
    title: "别名",
    dataIndex: "alias",
    width: 150,
    ellipsis: true,
  },
  {
    title: "描述",
    dataIndex: "description",
    width: 300,
    ellipsis: true,
  },
  {
    title: "删除时间",
    dataIndex: "deleted_at",
    width: 180,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 150,
    fixed: "right",
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
