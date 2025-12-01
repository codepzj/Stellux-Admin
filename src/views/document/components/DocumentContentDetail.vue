<template>
  <div class="h-full flex flex-col p-2">
    <!-- 文档信息头部 -->
    <div class="flex-shrink-0">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ documentContent?.title || "文档详情" }}
          <a-popover title="文档信息" placement="right">
            <template #content>
              <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
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
                  {{ documentContent?.sort || 1 }}
                </div>
              </div>
            </template>
            <a-button type="link" size="small"> 详情 </a-button>
          </a-popover>
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
        </div>
      </div>
    </div>

    <!-- 文档内容编辑区域 -->
    <div class="h-full flex flex-col" style="min-height: 0">
      <MdWriter
        v-model:content="editingContent"
        mode="auto"
        style="height: 100%; min-height: 600px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import MdWriter from "@/components/MdWriter/index.vue";
import type { DocumentContentVO } from "@/types/document";
import { updateDocumentContentAPI } from "@/api/document";

const props = defineProps<{
  documentContent?: DocumentContentVO;
}>();

const emit = defineEmits<{
  (e: "update", content: DocumentContentVO): void;
}>();

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
