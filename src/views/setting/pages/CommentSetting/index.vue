<template>
  <div class="w-full md:w-1/2">
    <a-spin :spinning="loading">
      <a-form
        ref="CommentConfigFormRef"
        :model="CommentConfigForm"
        :rules="CommentConfigRules"
        layout="vertical"
      >
        <a-form-item label="twikoo环境ID" name="env_id">
          <a-input v-model:value="CommentConfigForm.env_id" />
        </a-form-item>
        <a-form-item label="评论类型" name="allow_comment_type">
          <a-select
            v-model:value="CommentConfigForm.allow_comment_type"
            style="width: 100%"
            :options="commentTypeOptions"
          >
          </a-select>
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="handleSubmit">保存</a-button>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { message, type FormInstance, type SelectProps } from "ant-design-vue";
import { adminUpsertCommentSettingAPI, getCommentSettingAPI } from "@/api/setting";
import type { CommentConfig } from "@/types/config";
import type { Rule } from "ant-design-vue/es/form";

const loading = ref(false);
const CommentConfigForm = ref<CommentConfig>({
  env_id: "",
  allow_comment_type: "forbidden",
});


const checkTag = async (_rule: Rule, value: string[]) => {
  if (value.length > 3) {
    return Promise.reject("最多输入3个标签");
  }
  return Promise.resolve();
};

const CommentConfigRules = ref<Record<string, any[]>>({
  env_id: [{ required: true, message: "请输入环境ID", trigger: "change" }],
  allow_comment_type: [
    { required: true, message: "请选择评论类型", trigger: "change" },
    { validator: checkTag, trigger: "change" },
  ],
});

const commentTypeOptions = ref<SelectProps["options"]>([
  { label: "禁止评论", value: "forbidden" },
  { label: "文章评论", value: "post" },
  { label: "文档评论", value: "doc" },
  { label: "所有评论", value: "all" },
]);



const CommentConfigFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  await CommentConfigFormRef.value?.validate();
  await adminUpsertCommentSettingAPI(CommentConfigForm.value);
  await getCommentSetting();
  message.success("保存成功");
};

const getCommentSetting = async () => {
  loading.value = true;
  const res = await getCommentSettingAPI();
  CommentConfigForm.value = res.data;
  loading.value = false;
};

onMounted(async () => {
  await getCommentSetting();
});
</script>

<style lang="scss" scoped></style>
