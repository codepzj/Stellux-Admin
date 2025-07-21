<template>
  <div class="h-full flex flex-col">
    <!-- 文档信息头部 -->
    <div
      class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {{ documentContent?.title || "文档详情" }}
        </h2>
        <div class="flex items-center gap-2">
          <a-button
            type="primary"
            size="small"
            :loading="saving"
            @click="handleSave"
          >
            保存
          </a-button>
          <a-button size="small" @click="handleEdit">
            {{ isEditing ? "预览" : "编辑" }}
          </a-button>
          <a-tag v-if="isEditing" color="blue" size="small">编辑模式</a-tag>
          <a-tag v-else color="green" size="small">预览模式</a-tag>
        </div>
      </div>

      <!-- 文档元信息折叠面板 -->
      <a-collapse class="mb-2" :bordered="false">
        <a-collapse-panel key="meta" header="文档信息">
          <div
            class="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400"
          >
            <div>
              <span class="font-medium">创建时间：</span>
              {{ formatDate(documentContent?.created_at) }}
            </div>
            <div>
              <span class="font-medium">更新时间：</span>
              {{ formatDate(documentContent?.updated_at) }}
            </div>
            <div>
              <span class="font-medium">别名：</span>
              {{ documentContent?.alias || "-" }}
            </div>
            <div>
              <span class="font-medium">排序：</span>
              {{ documentContent?.sort || 0 }}
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <!-- 文档内容编辑区域 -->
    <div v-if="isEditing" class="h-full flex flex-col" style="min-height: 0">
      <MdWriter
        v-model:content="editingContent"
        mode="auto"
        style="height: 100%; min-height: 600px"
      />
    </div>
    <div v-else class="h-full overflow-auto p-4">
      <div v-if="documentContent?.content" class="prose max-w-none">
        <MdViewer :content="documentContent.content" />
      </div>
      <div v-else class="text-gray-500 text-center py-8">
        <Icon icon="ant-design:file-text-outlined" class="text-2xl mb-2" />
        <p>暂无内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { Icon } from "@iconify/vue";
import MdWriter from "@/components/MdWriter/index.vue";
import MdViewer from "@/components/MdViewer/index.vue";
import type { DocumentContentVO } from "@/types/document";
import { updateDocumentContentAPI } from "@/api/document";

const props = defineProps<{
  documentContent?: DocumentContentVO;
}>();

const emit = defineEmits<{
  (e: "update", content: DocumentContentVO): void;
}>();

const isEditing = ref(true); // 默认进入编辑模式
const saving = ref(false);
const editingContent = ref("");

// 监听文档内容变化
watch(
  () => props.documentContent?.content,
  newContent => {
    if (newContent !== undefined) {
      editingContent.value = newContent;
    }
  },
  { immediate: true }
);

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("zh-CN");
};

// 切换编辑模式
const handleEdit = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    editingContent.value = props.documentContent?.content || "";
  }
};

// 保存文档内容
const handleSave = async () => {
  if (!props.documentContent) {
    message.error("文档信息不存在");
    return;
  }

  saving.value = true;
  try {
    await updateDocumentContentAPI({
      id: props.documentContent.id,
      document_id: props.documentContent.document_id,
      title: props.documentContent.title,
      content: editingContent.value,
      description: props.documentContent.description,
      alias: props.documentContent.alias,
      parent_id: props.documentContent.parent_id,
      is_dir: props.documentContent.is_dir,
      sort: props.documentContent.sort,
    });

    // 更新本地数据
    const updatedContent = {
      ...props.documentContent,
      content: editingContent.value,
      updated_at: new Date().toISOString(),
    };

    emit("update", updatedContent);
    message.success("保存成功");
    isEditing.value = false;
  } catch (error) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};
</script>

<style lang="scss" scoped>
:deep(.ant-btn) {
  height: 32px;
}
</style>
