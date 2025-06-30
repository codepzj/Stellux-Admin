<template>
  <div>
    <div
      class="bg-white dark:bg-gray-800 min-h-[88vh] p-4 rounded-lg flex flex-col gap-4"
    >
      <div class="w-full">
        <a-skeleton :loading="loading" active :paragraph="{ rows: 10 }">
          <div v-if="data.github_username" class="w-full">
            <MdViewer :content="readme" />
          </div>
          <div v-else>
            <a-empty description="请先配置 GitHub 用户名" />
          </div>
        </a-skeleton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getSettingConfigAPI } from "@/api/setting";
import { getGithubReadmeAPI } from "@/api/dashboard";
import type { AboutConfig } from "@/types/config";

import MdViewer from "@/components/MdViewer/index.vue";
import { message } from "ant-design-vue";

const data = ref<AboutConfig>({
  author: "",
  avatar_url: "",
  left_tags: [],
  right_tags: [],
  know_me: "",
  github_username: "",
});

const readme = ref("");
const loading = ref(true);

onMounted(async () => {
  const res = await getSettingConfigAPI();
  data.value = res.data;

  if (data.value.github_username) {
    try {
      const readmeRes = await getGithubReadmeAPI(data.value.github_username);
      if (readmeRes.status === 200) {
        readme.value = readmeRes.data;
      }
    } catch (error) {
      message.error("获取 README 失败，请检查 GitHub 用户名是否正确");
      readme.value = "GitHub 用户名不存在";
    } finally {
      loading.value = false;
    }
  }
});
</script>
