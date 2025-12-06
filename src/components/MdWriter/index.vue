<template>
  <div class="md-writer-container">
    <v-md-editor
      ref="editorRef"
      :toc-nav-position-right="true"
      v-model="content"
      height="100%"
      left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link customImage code"
      :toolbar="toolbar"
    />
    <PhotoSelect
      v-model:open="photoSelectOpen"
      @selected-picture="handleSelectedPicture"
    />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import PhotoSelect from "@/components/PhotoSelect/index.vue";

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:content"]);
const content = useVModel(props, "content", emit);

const editorRef = ref<any>(null);
const photoSelectOpen = ref(false);

const toolbar = {
  customImage: {
    title: "插入图片",
    icon: "v-md-icon-img",
    action() {
      photoSelectOpen.value = true;
    },
  },
};

const handleSelectedPicture = (picture: string) => {
  if (!picture) return;
  editorRef.value?.insert((selected: string) => {
    return {
      text: `![${selected || "图片"}](${picture})`,
      selected: selected || "图片",
    };
  });
};
</script>

<style scoped lang="scss">
.md-writer-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);

  :deep(.v-md-editor) {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    flex: 1;

    // 减小工具栏悬浮效果
    .v-md-editor__toolbar {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
    }

    // 减小目录导航悬浮效果
    .v-md-editor__toc-nav {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06) !important;
    }

    // 移除其他悬浮元素的效果
    .v-md-editor__preview,
    .v-md-editor__textarea {
      box-shadow: none !important;
    }
  }
}
</style>
