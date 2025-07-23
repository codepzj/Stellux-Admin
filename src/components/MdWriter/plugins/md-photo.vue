<template>
  <NormalToolbar title="选择图片" @onClick="open = true">
    <Icon icon="fe:picture" height="18" width="18" />
  </NormalToolbar>
  <PhotoSelect v-model:open="open" @selected-picture="handler" />
</template>

<script setup lang="ts">
import { NormalToolbar } from "md-editor-v3";
import { Icon } from "@iconify/vue";
import PhotoSelect from "@/components/PhotoSelect/index.vue";

const open = ref(false);

const emit = defineEmits(["selected-picture"]);

const handler = (url: string) => {
  emit("selected-picture", url);
};
</script>
