<template>
  <div class="flex gap-8 h-full">
    <MdPreview
      class="md:!w-3/4 w-full"
      :modelValue="content"
      :theme="theme"
      :previewTheme="editorState.previewTheme"
      :codeTheme="editorState.codeTheme"
      :showCodeRowNumber="editorState.showCodeRowNumber"
      :autoFoldThreshold="editorState.autoFoldThreshold"
    />
    <div class="md:!w-1/4 !max-h-125 overflow-y-auto hidden md:block sticky top-10">
      <a-anchor
        class="w-full !max-h-125"
        affixed
        :items="anchorItems"
        :offset-top="0"
        :offset-bottom="100"
        @onChange="onChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { parseMarkdownToAnchorItems } from "@/utils/tool";
import { useSystemStore } from "@/store";

const systemStore = useSystemStore();
const props = defineProps({
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

const onChange = (link: string) => {
  console.log("Anchor:OnChange", link);
};

const theme = computed(() => systemStore.themeMode);

const anchorItems = computed(() => parseMarkdownToAnchorItems(props.content));
</script>
