<template>
  <div class="flex gap-8 h-full">
    <MdPreview
      class="md:!w-3/4 w-full"
      :modelValue="content"
      theme="light"
      :previewTheme="editorState.previewTheme"
      :codeTheme="editorState.codeTheme"
      :showCodeRowNumber="editorState.showCodeRowNumber"
      :autoFoldThreshold="editorState.autoFoldThreshold"
    />
  </div>
</template>

<script lang="ts" setup>
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

defineProps({
  content: {
    type: String,
    default: "",
  },
});

const editorState = ref({
  previewTheme: "github",
  codeTheme: "github",
  showCodeRowNumber: false,
  autoFoldThreshold: 100,
});
</script>
