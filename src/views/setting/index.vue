<template>
  <a-spin :spinning="loading">
    <a-form
      ref="siteConfigFormRef"
      :model="siteConfigForm"
      :rules="siteConfigRules"
      layout="vertical"
    >
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点标题" name="siteTitle">
            <a-input v-model:value="siteConfigForm.siteTitle" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点副标题" name="siteSubtitle">
            <a-input v-model:value="siteConfigForm.siteSubtitle" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点URL" name="siteUrl">
            <a-input v-model:value="siteConfigForm.siteUrl" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点图标" name="siteFavicon">
            <a-input v-model:value="siteConfigForm.siteFavicon" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点头像" name="siteAvatar">
            <a-input v-model:value="siteConfigForm.siteAvatar" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点描述" name="siteDescription">
            <a-input v-model:value="siteConfigForm.siteDescription" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点关键词" name="siteKeywords">
            <a-input v-model:value="siteConfigForm.siteKeywords" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点版权" name="siteCopyright">
            <a-input v-model:value="siteConfigForm.siteCopyright" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点ICP" name="siteIcp">
            <a-input v-model:value="siteConfigForm.siteIcp" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="站点ICP链接" name="siteIcpLink">
            <a-input v-model:value="siteConfigForm.siteIcpLink" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="github用户名" name="githubUsername">
            <a-input v-model:value="siteConfigForm.githubUsername" />
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
import type { SettingConfigDTO } from "@/types/setting";

const loading = ref(false);
const siteConfigForm = ref<SettingConfigDTO>({
  siteTitle: "",
  siteSubtitle: "",
  siteUrl: "",
  siteFavicon: "",
  siteAvatar: "",
  siteDescription: "",
  siteKeywords: "",
  siteCopyright: "",
  siteIcp: "",
  siteIcpLink: "",
  githubUsername: "",
});

const siteConfigRules = ref<Record<string, any[]>>({
  siteTitle: [{ required: true, message: "请输入站点标题", trigger: "change" }],
  siteSubtitle: [
    { required: true, message: "请输入站点副标题", trigger: "change" },
  ],
  siteUrl: [{ required: true, message: "请输入站点URL", trigger: "change" }],
  siteFavicon: [
    { required: true, message: "请输入站点图标", trigger: "change" },
  ],
  siteAvatar: [
    { required: true, message: "请输入站点头像", trigger: "change" },
  ],
  siteDescription: [
    { required: true, message: "请输入站点描述", trigger: "change" },
  ],
  siteKeywords: [
    { required: true, message: "请输入站点关键词", trigger: "change" },
  ],
  siteCopyright: [
    { required: true, message: "请输入站点版权", trigger: "change" },
  ],
  siteIcp: [{ required: true, message: "请输入站点ICP", trigger: "change" }],
  siteIcpLink: [
    { required: true, message: "请输入站点ICP链接", trigger: "change" },
  ],
  githubUsername: [
    { required: true, message: "请输入github用户名", trigger: "change" },
  ],
});

const siteConfigFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  await siteConfigFormRef.value?.validate();
  await adminUpsertSettingAPI(siteConfigForm.value);
  await getSiteConfig();
  message.success("保存成功");
};

const getSiteConfig = async () => {
  loading.value = true;
  const res = await getSettingConfigAPI();
  console.log(res.data);
  siteConfigForm.value = res.data;
  loading.value = false;
};

onMounted(async () => {
  await getSiteConfig();
});
</script>

<style lang="scss" scoped></style>
