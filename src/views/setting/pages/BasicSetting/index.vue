<template>
  <div class="w-full md:w-1/2">
    <a-spin :spinning="loading">
      <a-form
        ref="SiteBasicConfigFormRef"
        :model="SiteBasicConfigForm"
        :rules="SiteBasicConfigRules"
        layout="vertical"
      >
        <a-form-item label="站点标题" name="site_title">
          <a-input v-model:value="SiteBasicConfigForm.site_title" />
        </a-form-item>
        <a-form-item label="站点副标题" name="site_subtitle">
          <a-input v-model:value="SiteBasicConfigForm.site_subtitle" />
        </a-form-item>
        <a-form-item label="站点favicon" name="site_favicon">
          <InputPhoto v-model:url="SiteBasicConfigForm.site_favicon" />
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="handleSubmit">保存</a-button>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { message, type FormInstance } from "ant-design-vue";
import { adminUpsertSettingAPI, getBasicSettingAPI } from "@/api/setting";
import InputPhoto from "@/components/Input/photo.vue";
import type { BasicConfig } from "@/types/config";

const loading = ref(false);
const SiteBasicConfigForm = ref<BasicConfig>({
  site_title: "",
  site_subtitle: "",
  site_favicon: "",
});

const SiteBasicConfigRules = ref<Record<string, any[]>>({
  site_title: [
    { required: true, message: "请输入站点标题", trigger: "change" },
  ],
  site_subtitle: [
    { required: true, message: "请输入站点副标题", trigger: "change" },
  ],
});

const SiteBasicConfigFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  await SiteBasicConfigFormRef.value?.validate();
  console.log(SiteBasicConfigForm.value);
  await adminUpsertSettingAPI(SiteBasicConfigForm.value);
  await getBasicSetting();
  message.success("保存成功");
};

const getBasicSetting = async () => {
  loading.value = true;
  const res = await getBasicSettingAPI();
  SiteBasicConfigForm.value = res.data;
  loading.value = false;
};

onMounted(async () => {
  await getBasicSetting();
});
</script>

<style lang="scss" scoped></style>
