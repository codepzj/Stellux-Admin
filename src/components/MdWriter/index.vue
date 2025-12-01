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
    box-shadow: 1px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    flex: 1;
  }
}
</style>
