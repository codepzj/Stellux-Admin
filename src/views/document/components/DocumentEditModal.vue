<template>
  <a-modal
    :open="visible"
    :title="documentContent?.is_dir ? '编辑目录' : '编辑文档'"
    @ok="handleOk"
    @cancel="handleCancel"
    ok-text="保存"
    cancel-text="取消"
    width="600px"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      class="w-full"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="标题" name="title">
            <a-input
              v-model:value="formData.title"
              placeholder="请输入标题"
              :maxlength="100"
              show-count
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="别名" name="alias">
            <a-input
              v-model:value="formData.alias"
              placeholder="请输入别名"
              :maxlength="50"
              show-count
            />
          </a-form-item>
        </a-col>
      </a-row>
      <!-- 非目录才有描述 -->
      <a-form-item v-if="!documentContent?.is_dir" label="描述" name="description">
        <a-textarea
          v-model:value="formData.description"
          placeholder="请输入描述"
          :rows="3"
          :maxlength="200"
          show-count
        />
      </a-form-item>

      <a-form-item label="排序" name="sort">
        <a-input-number
          v-model:value="formData.sort"
          placeholder="请输入排序"
          :min="0"
          :max="9999"
          class="w-full"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import type { DocumentContentVO } from "@/types/document";
import { updateDocumentContentAPI } from "@/api/document";

const props = defineProps<{
  visible: boolean;
  documentContent?: DocumentContentVO;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "success", content: DocumentContentVO): void;
}>();

const formRef = ref<FormInstance>();

const formData = reactive({
  title: "",
  alias: "",
  description: "",
  sort: 0,
});

const rules = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { min: 1, max: 100, message: "标题长度在1-100个字符", trigger: "blur" },
  ],
  alias: [
    { required: true, message: "请输入别名", trigger: "blur" },
    { min: 1, max: 50, message: "别名长度在1-50个字符", trigger: "blur" },
  ],
  description: [
    { max: 200, message: "描述长度不能超过200个字符", trigger: "blur" },
  ],
  sort: [
    {
      type: "number",
      min: 0,
      max: 9999,
      message: "排序值在0-9999之间",
      trigger: "blur",
    },
  ],
};

// 监听文档内容变化，用于编辑模式
watch(
  () => props.documentContent,
  newContent => {
    if (newContent) {
      formData.title = newContent.title;
      formData.alias = newContent.alias;
      formData.description = newContent.description;
      formData.sort = newContent.sort;
    }
  },
  { immediate: true }
);

// 提交表单
const handleOk = async () => {
  try {
    await formRef.value?.validate();

    if (!props.documentContent) {
      message.error("文档信息不存在");
      return;
    }

    await updateDocumentContentAPI({
      id: props.documentContent.id,
      document_id: props.documentContent.document_id,
      title: formData.title,
      content: props.documentContent.content,
      description: formData.description,
      alias: formData.alias,
      parent_id: props.documentContent.parent_id,
      is_dir: props.documentContent.is_dir,
      sort: formData.sort,
    });

    // 更新本地数据
    const updatedContent = {
      ...props.documentContent,
      title: formData.title,
      alias: formData.alias,
      description: formData.description,
      sort: formData.sort,
      updated_at: new Date().toISOString(),
    };

    emit("success", updatedContent);
    message.success("保存成功");
    emit("update:visible", false);
  } catch (error) {
    console.error("保存失败:", error);
  }
};

const handleCancel = () => {
  emit("update:visible", false);
};
</script>

<style lang="scss" scoped>
:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
