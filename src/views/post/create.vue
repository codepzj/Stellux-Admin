<template>
  <a-card class="h-full overflow-y-auto">
    <PostContentWriter mode="create" v-model:post-form="postForm" />
  </a-card>
</template>

<script setup lang="ts">
defineOptions({ name: "PostCreate" });
import PostContentWriter from "./components/PostContentWriter.vue";
import type { PostReq } from "@/types/post";
import { useUserStore } from "@/store";

const userStore = useUserStore();
const userInfo = userStore.userInfo;

const postForm = ref<PostReq>({
  created_at: new Date().toISOString(),
  title: "",
  content: "",
  description: "",
  author: userInfo?.nickname || "", // 作者
  alias: "",
  category_id: "",
  tags_id: [],
  is_publish: true,
  is_top: false,
  thumbnail: "",
});
</script>

<style lang="scss" scoped></style>
