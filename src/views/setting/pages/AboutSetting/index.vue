<template>
  <div class="w-full md:w-1/2">
    <a-spin :spinning="loading">
      <a-form
        ref="AboutConfigFormRef"
        :model="AboutConfigForm"
        :rules="AboutConfigRules"
        layout="vertical"
      >
        <a-form-item label="作者" name="author">
          <a-input v-model:value="AboutConfigForm.author" />
        </a-form-item>
        <a-form-item label="头像" name="avatar_url">
          <InputPhoto v-model:url="AboutConfigForm.avatar_url" />
        </a-form-item>
        <a-form-item label="左标签" name="left_tags">
          <a-select
            v-model:value="AboutConfigForm.left_tags"
            mode="tags"
            style="width: 100%"
            :token-separators="[',']"
            :options="leftTagOptions"
            :max-tag-count="3"
          >
            <template #maxTagPlaceholder="omittedValues">
              <span style="color: red">+ {{ omittedValues.length }} ...</span>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="右标签" name="right_tags">
          <a-select
            v-model:value="AboutConfigForm.right_tags"
            mode="tags"
            style="width: 100%"
            :token-separators="[',']"
            :options="rightTagOptions"
            :max-tag-count="3"
          >
            <template #maxTagPlaceholder="omittedValues">
              <span style="color: red">+ {{ omittedValues.length }} ...</span>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="知道我" name="know_me">
          <a-input v-model:value="AboutConfigForm.know_me" />
        </a-form-item>
        <a-form-item label="github用户名" name="github_username">
          <a-input v-model:value="AboutConfigForm.github_username" />
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="handleSubmit">保存</a-button>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { message, type FormInstance, type SelectProps } from "ant-design-vue";
import { adminUpsertAboutSettingAPI, getAboutSettingAPI } from "@/api/setting";
import InputPhoto from "@/components/Input/photo.vue";
import type { AboutConfig } from "@/types/config";
import type { Rule } from "ant-design-vue/es/form";

const loading = ref(false);
const AboutConfigForm = ref<AboutConfig>({
  author: "",
  avatar_url: "",
  left_tags: [],
  right_tags: [],
  know_me: "",
  github_username: "",
});


const checkTag = async (_rule: Rule, value: string[]) => {
  if (value.length > 3) {
    return Promise.reject("最多输入3个标签");
  }
  return Promise.resolve();
};

const AboutConfigRules = ref<Record<string, any[]>>({
  author: [{ required: true, message: "请输入作者", trigger: "change" }],
  avatar_url: [{ required: true, message: "请上传头像", trigger: "change" }],
  left_tags: [
    { required: true, message: "请输入左标签", trigger: "change" },
    { validator: checkTag, trigger: "change" },
  ],
  right_tags: [
    { required: true, message: "请输入右标签", trigger: "change" },
    { validator: checkTag, trigger: "change" },
  ],
  know_me: [{ required: true, message: "请输入知道我", trigger: "change" }],
  github_username: [
    { required: true, message: "请输入github用户名", trigger: "change" },
  ],
});

const leftTagOptions = ref<SelectProps["options"]>([
  { label: "🧠 技术探索者", value: "🧠 技术探索者" },
  { label: "🛠️ 创意实践者", value: "🛠️ 创意实践者" },
  { label: "🌐 架构与开发者", value: "🌐 架构与开发者" },
  { label: "📚 学习驱动者", value: "📚 学习驱动者" },
  { label: "⚙️ 系统优化者", value: "⚙️ 系统优化者" },
  { label: "🔍 细节把控者", value: "🔍 细节把控者" },
  { label: "💡 解决方案设计师", value: "💡 解决方案设计师" },
  { label: "🧩 代码艺术家", value: "🧩 代码艺术家" },
]);

const rightTagOptions = ref<SelectProps["options"]>([
  { label: "兴趣点燃灵感火花 ✨", value: "兴趣点燃灵感火花 ✨" },
  { label: "开源协作推动者 🧐", value: "开源协作推动者 🧐" },
  { label: "热情永不熄灭 🔥", value: "热情永不熄灭 🔥" },
  { label: "相信分享的力量 🤝", value: "相信分享的力量 🤝" },
  { label: "成长路上的同行者 🛤️", value: "成长路上的同行者 🛤️" },
  { label: "用代码改变世界 🌍", value: "用代码改变世界 🌍" },
  { label: "追求极致体验 🧭", value: "追求极致体验 🧭" },
  { label: "探索未来边界 🧬", value: "探索未来边界 🧬" },
]);

const AboutConfigFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  await AboutConfigFormRef.value?.validate();
  await adminUpsertAboutSettingAPI(AboutConfigForm.value);
  await getAboutSetting();
  message.success("保存成功");
};

const getAboutSetting = async () => {
  loading.value = true;
  const res = await getAboutSettingAPI();
  AboutConfigForm.value = res.data;
  loading.value = false;
};

onMounted(async () => {
  await getAboutSetting();
});
</script>

<style lang="scss" scoped></style>
