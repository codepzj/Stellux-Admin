<template>
  <div class="w-full">
    <a-spin :spinning="loading">
      <a-form
        ref="SiteSeoConfigFormRef"
        :model="SiteSeoConfig"
        :rules="SiteSeoConfigRules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="站点作者" name="site_author">
              <a-input
                v-model:value="SiteSeoConfig.site_author"
                placeholder="例如：浩瀚星河 / stellux"
                show-count
                :maxlength="10"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="站点URL" name="site_url">
              <a-input
                v-model:value="SiteSeoConfig.site_url"
                placeholder="博客地址"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24">
            <a-form-item label="站点 robots 指令" name="robots">
              <a-select
                v-model:value="SiteSeoConfig.robots"
                placeholder="选择 robots 指令"
              >
                <a-select-option value="index,follow"
                  >index,follow</a-select-option
                >
                <a-select-option value="noindex,follow"
                  >noindex,follow</a-select-option
                >
                <a-select-option value="index,nofollow"
                  >index,nofollow</a-select-option
                >
                <a-select-option value="noindex,nofollow"
                  >noindex,nofollow</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xs="24">
            <a-form-item label="站点描述" name="site_description">
              <a-textarea
                v-model:value="SiteSeoConfig.site_description"
                placeholder="简要描述你的站点，有助于搜索引擎收录"
                :rows="4"
                show-count
                :maxlength="200"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24">
            <a-form-item label="站点关键词" name="site_keywords">
              <a-select
                v-model:value="siteKeywords"
                mode="tags"
                style="width: 100%"
                :token-separators="[',']"
                placeholder="按回车分隔多个关键词"
                :options="siteKeywordOptions"
                @change="onChangeKeywords"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="OpenGraph 图像" name="og_image">
              <InputPhoto v-model:url="SiteSeoConfig.og_image" />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="OpenGraph 类型" name="og_type">
              <a-select
                v-model:value="SiteSeoConfig.og_type"
                placeholder="选择 OG 类型"
              >
                <a-select-option value="website">website</a-select-option>
                <a-select-option value="article">article</a-select-option>
                <a-select-option value="profile">profile</a-select-option>
                <a-select-option value="book">book</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="Twitter 卡片类型" name="twitter_card">
              <a-select
                v-model:value="SiteSeoConfig.twitter_card"
                placeholder="选择卡片类型"
              >
                <a-select-option value="summary">summary</a-select-option>
                <a-select-option value="summary_large_image"
                  >summary_large_image</a-select-option
                >
                <a-select-option value="app">app</a-select-option>
                <a-select-option value="player">player</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item label="Twitter 账号" name="twitter_site">
              <a-input
                v-model:value="SiteSeoConfig.twitter_site"
                placeholder="例如：@your_twitter"
                prefix="@"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { message, type FormInstance, type SelectProps } from "ant-design-vue";
import { adminUpsertSeoSettingAPI, getSeoSettingAPI } from "@/api/setting";
import InputPhoto from "@/components/Input/photo.vue";
import type { SeoConfig } from "@/types/config";

const loading = ref(false);
const siteKeywordOptions = ref<SelectProps["options"]>([
  {
    value: "知识库",
    label: "知识库",
  },
]);
const siteKeywords = ref<string[]>([]);
const SiteSeoConfig = ref<SeoConfig>({
  site_author: "",
  site_url: "",
  site_description: "",
  site_keywords: "",
  robots: "",
  og_image: "",
  og_type: "",
  twitter_card: "",
  twitter_site: "",
});

const SiteSeoConfigRules = ref<Record<string, any[]>>({
  site_author: [
    { required: true, message: "请输入站点作者", trigger: "change" },
  ],
  site_url: [
    { required: true, message: "请输入站点URL", trigger: "change" },
  ],
  site_description: [
    { required: true, message: "请输入站点描述", trigger: "change" },
  ],
  site_keywords: [
    { required: true, message: "请输入站点关键词", trigger: "change" },
  ],
  robots: [{ required: true, message: "请输入站点robots", trigger: "change" }],
  og_image: [
    { required: true, message: "请输入OpenGraph 图像", trigger: "change" },
  ],
  og_type: [
    { required: true, message: "请输入OpenGraph 类型", trigger: "change" },
  ],
  twitter_card: [
    { required: true, message: "请输入Twitter 卡片类型", trigger: "change" },
  ],
  twitter_site: [
    { required: true, message: "请输入Twitter 账号", trigger: "change" },
  ],
});

const SiteSeoConfigFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  await SiteSeoConfigFormRef.value?.validate();
  await adminUpsertSeoSettingAPI(SiteSeoConfig.value);
  await getSeoSetting();
  message.success("保存成功");
};

const getSeoSetting = async () => {
  loading.value = true;
  const res = await getSeoSettingAPI();
  SiteSeoConfig.value = res.data;
  siteKeywords.value = SiteSeoConfig.value.site_keywords.split(",");
  loading.value = false;
};

const onChangeKeywords = (value: string[]) => {
  SiteSeoConfig.value.site_keywords = value.join(",");
};

onMounted(async () => {
  await getSeoSetting();
});
</script>

<style lang="scss" scoped></style>
