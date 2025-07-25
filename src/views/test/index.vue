<template>
  <MdEditor
    v-model="editorState.content"
    :previewTheme="editorState.previewTheme"
    :codeTheme="editorState.codeTheme"
    class="!h-screen"
  />
</template>

<script setup>
import { ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const content = ref("Hello Editor!");
const editorState = reactive({
  content: "",
  previewTheme: "github",
  codeTheme: "github",
});
</script>
<style scoped></style>
