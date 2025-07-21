<template>
  <a-modal
    :open="visible"
    title="编辑文档内容"
    @ok="handleOk"
    @cancel="handleCancel"
    ok-text="保存"
    cancel-text="取消"
    width="800px"
  >
    <DocumentContentForm
      ref="formRef"
      :document_content="documentContent"
      :document_id="documentId"
      :parent_id="parentId"
      @submit="handleSubmit"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { message } from "ant-design-vue";
import DocumentContentForm from "./DocumentContentForm.vue";
import type {
  DocumentContentVO,
  DocumentContentEditRequest,
} from "@/types/document";
import { updateDocumentContentAPI } from "@/api/document";

const props = defineProps<{
  visible: boolean;
  documentContent?: DocumentContentVO;
  documentId: string;
  parentId?: string;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "success", content: DocumentContentVO): void;
}>();

const formRef = ref();

const handleSubmit = async (data: DocumentContentEditRequest) => {
  try {
    await updateDocumentContentAPI(data);

    // 更新本地数据
    const updatedContent = {
      ...props.documentContent,
      ...data,
      updated_at: new Date().toISOString(),
    } as DocumentContentVO;

    emit("success", updatedContent);
    message.success("保存成功");
    emit("update:visible", false);
  } catch (error) {
    message.error("保存失败");
  }
};

const handleOk = async () => {
  const success = await formRef.value?.submit();
  if (success) {
    await handleSubmit(formRef.value.formData);
  }
};

const handleCancel = () => {
  emit("update:visible", false);
};

// 监听visible变化，重置表单
watch(
  () => props.visible,
  newVisible => {
    if (newVisible) {
      // 弹窗打开时重置表单
      nextTick(() => {
        formRef.value?.reset();
      });
    }
  }
);
</script>
