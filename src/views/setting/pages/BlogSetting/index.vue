<template>
  <div class="w-full md:w-1/2">
    <a-spin :spinning="loading">
      <a-form
        ref="BlogConfigFormRef"
        :model="BlogConfigForm"
        :rules="BlogConfigRules"
        layout="vertical"
      >
        <a-form-item label="博客头像" name="blog_avatar">
          <InputPhoto v-model:url="BlogConfigForm.blog_avatar" />
        </a-form-item>
        <a-form-item label="博客标题" name="blog_title">
          <a-input v-model:value="BlogConfigForm.blog_title" />
        </a-form-item>
        <a-form-item label="博客副标题" name="blog_subtitle">
          <a-input v-model:value="BlogConfigForm.blog_subtitle" />
        </a-form-item>
        <a-form-item label="博客欢迎语" name="blog_welcome">
          <a-input v-model:value="BlogConfigForm.blog_welcome" />
        </a-form-item>
        <a-form-item label="博客座右铭" name="blog_motto">
          <a-input v-model:value="BlogConfigForm.blog_motto" />
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="handleSubmit">保存</a-button>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { message, type FormInstance } from "ant-design-vue";
import { adminUpsertBlogSettingAPI, getBlogSettingAPI } from "@/api/setting";
import InputPhoto from "@/components/Input/photo.vue";
import type { BlogConfig } from "@/types/config";

const loading = ref(false);
const BlogConfigForm = ref<BlogConfig>({
  blog_avatar: "",
  blog_title: "",
  blog_subtitle: "",
  blog_welcome: "",
  blog_motto: "",
});

const BlogConfigRules = ref<Record<string, any[]>>({
  blog_avatar: [{ required: true, message: "请输入博客头像", trigger: "change" }],
  blog_title: [{ required: true, message: "请输入博客标题", trigger: "change" }],
  blog_subtitle: [{ required: true, message: "请输入博客副标题", trigger: "change" }],
  blog_welcome: [{ required: true, message: "请输入博客欢迎语", trigger: "change" }],
  blog_motto: [{ required: true, message: "请输入博客座右铭", trigger: "change" }],
});

const BlogConfigFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  await BlogConfigFormRef.value?.validate();
  console.log(BlogConfigForm.value);
  await adminUpsertBlogSettingAPI(BlogConfigForm.value);
  await getBlogSetting();
  message.success("保存成功");
};

const getBlogSetting = async () => {
  loading.value = true;
  const res = await getBlogSettingAPI();
  BlogConfigForm.value = res.data;
  loading.value = false;
};

onMounted(async () => {
    await getBlogSetting();
});
</script>

<style lang="scss" scoped></style>
