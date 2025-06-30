<template>
  <a-spin :spinning="loading">
    <a-form
      ref="SettingConfigFormRef"
      :model="SettingConfigForm"
      :rules="SettingConfigRules"
      layout="vertical"
    >
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点标题" name="site_title">
            <a-input v-model:value="SettingConfigForm.site_title" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点副标题" name="site_subtitle">
            <a-input v-model:value="SettingConfigForm.site_subtitle" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点图标" name="site_favicon">
            <a-input v-model:value="SettingConfigForm.site_favicon" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点头像" name="site_avatar">
            <a-input v-model:value="SettingConfigForm.site_avatar" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点描述" name="site_description">
            <a-input v-model:value="SettingConfigForm.site_description" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点关键词" name="site_keywords">
            <a-input v-model:value="SettingConfigForm.site_keywords" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点版权" name="site_copyright">
            <a-input v-model:value="SettingConfigForm.site_copyright" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点ICP" name="site_icp">
            <a-input v-model:value="SettingConfigForm.site_icp" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点ICP链接" name="site_icplink">
            <a-input v-model:value="SettingConfigForm.site_icplink" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="github用户名" name="github_username">
            <a-input v-model:value="SettingConfigForm.github_username" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div style="text-align: right; margin-top: 16px">
      <a-button type="primary" @click="handleSubmit">保存</a-button>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { message, type FormInstance } from "ant-design-vue";
import { adminUpsertSettingAPI, getSettingConfigAPI } from "@/api/setting";
import type { SettingConfigDTO, SettingConfigVO } from "@/types/setting";

const loading = ref(false);
const SettingConfigForm = ref<SettingConfigVO>({
  site_title: "",
  site_subtitle: "",
  site_favicon: "",
  site_avatar: "",
  site_description: "",
  site_keywords: "",
  site_copyright: "",
  site_icp: "",
  site_icplink: "",
  github_username: "",
});

const SettingConfigRules = ref<Record<string, any[]>>({
  site_title: [
    { required: true, message: "请输入站点标题", trigger: "change" },
  ],
  site_subtitle: [
    { required: true, message: "请输入站点副标题", trigger: "change" },
  ],
  site_favicon: [
    { required: true, message: "请输入站点图标", trigger: "change" },
  ],
  site_avatar: [
    { required: true, message: "请输入站点头像", trigger: "change" },
  ],
  site_description: [
    { required: true, message: "请输入站点描述", trigger: "change" },
  ],
  site_keywords: [
    { required: true, message: "请输入站点关键词", trigger: "change" },
  ],
  site_copyright: [
    { required: true, message: "请输入站点版权", trigger: "change" },
  ],
  site_icp: [{ required: true, message: "请输入站点ICP", trigger: "change" }],
  site_icplink: [
    { required: true, message: "请输入站点ICP链接", trigger: "change" },
  ],
  github_username: [
    { required: true, message: "请输入github用户名", trigger: "change" },
  ],
});

const SettingConfigFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  await SettingConfigFormRef.value?.validate();
  await adminUpsertSettingAPI(SettingConfigForm.value as SettingConfigDTO);
  await getSettingConfig();
  message.success("保存成功");
};

const getSettingConfig = async () => {
  loading.value = true;
  const res = await getSettingConfigAPI();
  SettingConfigForm.value = res.data;
  loading.value = false;
};

onMounted(async () => {
  await getSettingConfig();
});
</script>

<style lang="scss" scoped></style>
