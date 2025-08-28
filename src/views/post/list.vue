<template>
  <a-card class="h-full overflow-y-auto">
    <PostList :type="postType" />
  </a-card>
</template>
<script setup lang="ts">
import PostList from "./components/PostList.vue";

type PostType = "publish" | "draft" | "bin";
const postType = ref<PostType>("publish");
const route = useRoute();

watch(
  () => route.query.type,
  newType => {
    postType.value = (newType as PostType) || "publish";
  },
  { immediate: true }
);
</script>
