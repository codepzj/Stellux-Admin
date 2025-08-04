<template>
  <div class="flex flex-col h-full bg-white">
    <div class="h-8">
      <DocumentHeader />
    </div>
    <div class="overflow-hidden h-full">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentHeader from "@/components/Header/document.vue";

defineOptions({
  name: "DocumentIndex",
});
</script>

<style lang="scss" scoped></style>
