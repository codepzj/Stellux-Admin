<template>
  <MdEditor
    v-model="content"
    :previewTheme="editorState.previewTheme"
    :codeTheme="editorState.codeTheme"
    :theme="theme"
    :showCodeRowNumber="editorState.showCodeRowNumber"
    :autoFoldThreshold="editorState.autoFoldThreshold"
    :toolbars="toolbars"
    class="!h-full"
  >
    <template #defToolbars>
      <MdPhoto @selected-picture="selectedPicture" />
    </template>
  </MdEditor>
</template>

<script setup>
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { useVModel } from "@vueuse/core";
import { useSystemStore } from "@/store";
import MdPhoto from "./plugins/md-photo.vue";

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});
const content = useVModel(props, "content");
const systemStore = useSystemStore();
const editorState = ref({
  previewTheme: "github",
  codeTheme: "github",
  showCodeRowNumber: false,
  autoFoldThreshold: 100,
});

const theme = computed(() => systemStore.themeMode);
const toolbars = [
  "bold",
  "underline",
  "italic",
  "-",
  "title",
  "strikeThrough",
  "sub",
  "sup",
  "quote",
  "unorderedList",
  "orderedList",
  "task",
  "-",
  "codeRow",
  "code",
  "link",
  "table",
  "mermaid",
  "katex",
  "-",
  0,
  "=",
  "pageFullscreen",
  "fullscreen",
  "preview",
  "previewOnly",
  "catalog",
];

const selectedPicture = picture => {
  // 如果图片为空，则不添加
  if (!picture) return;
  content.value = content.value + `![图片](${picture})`;
};
const emit = defineEmits(["update:content"]);

watch(
  () => props.content,
  newVal => {
    editorState.value.content = newVal;
  }
);

watch(
  () => editorState.value.content,
  newVal => {
    emit("update:content", newVal);
  }
);
</script>
<style scoped>
:deep(.md-editor-preview .md-editor-code .md-editor-code-head) {
  z-index: 0 !important;
}
</style>
