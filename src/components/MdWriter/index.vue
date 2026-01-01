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
import { onMounted, onUnmounted, nextTick } from "vue";
import { message } from "ant-design-vue";

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

// 滚动同步相关
let isScrolling = false;
let textareaElement: HTMLElement | null = null;
let previewElement: HTMLElement | null = null;
let textareaScrollHandler: ((e: Event) => void) | null = null;
let previewScrollHandler: ((e: Event) => void) | null = null;

// 同步滚动函数
const syncScroll = (source: HTMLElement, target: HTMLElement) => {
  if (isScrolling) return;
  isScrolling = true;

  const sourceScrollTop = source.scrollTop;
  const sourceScrollHeight = source.scrollHeight;
  const sourceClientHeight = source.clientHeight;

  // 避免除零
  const sourceMaxScroll = sourceScrollHeight - sourceClientHeight;
  if (sourceMaxScroll <= 0) {
    isScrolling = false;
    return;
  }

  const sourceScrollRatio = sourceScrollTop / sourceMaxScroll;

  const targetScrollHeight = target.scrollHeight;
  const targetClientHeight = target.clientHeight;
  const targetMaxScroll = targetScrollHeight - targetClientHeight;

  if (targetMaxScroll <= 0) {
    isScrolling = false;
    return;
  }

  const targetScrollTop = sourceScrollRatio * targetMaxScroll;

  // 使用 requestAnimationFrame 实现更流畅的同步，减少延迟
  requestAnimationFrame(() => {
    target.scrollTop = targetScrollTop;
    // 使用 setTimeout 确保滚动完成后再重置标志
    setTimeout(() => {
      isScrolling = false;
    }, 0);
  });
};

// 初始化滚动同步
const initScrollSync = () => {
  nextTick(() => {
    if (!editorRef.value) return;

    // 查找编辑区和预览区的 DOM 元素
    const editorEl = editorRef.value.$el as HTMLElement;
    if (!editorEl) return;

    // 查找 textarea 元素（编辑区）- 可能是 textarea 本身或其父容器
    const textareaWrapper = editorEl.querySelector(
      ".v-md-editor__textarea-wrapper"
    ) as HTMLElement;
    textareaElement =
      (textareaWrapper?.querySelector(
        ".v-md-editor__textarea"
      ) as HTMLElement) || textareaWrapper;

    // 查找 preview 元素（预览区）- 可能是预览容器本身
    const previewWrapper = editorEl.querySelector(
      ".v-md-editor__preview-wrapper"
    ) as HTMLElement;
    previewElement =
      (previewWrapper?.querySelector(".v-md-editor__preview") as HTMLElement) ||
      previewWrapper;

    if (!textareaElement || !previewElement) {
      // 如果找不到，延迟重试
      setTimeout(initScrollSync, 100);
      return;
    }

    // 创建滚动处理函数
    textareaScrollHandler = () => {
      if (previewElement && !isScrolling) {
        syncScroll(textareaElement!, previewElement);
      }
    };

    previewScrollHandler = () => {
      if (textareaElement && !isScrolling) {
        syncScroll(previewElement!, textareaElement);
      }
    };

    // 监听编辑区滚动
    textareaElement.addEventListener("scroll", textareaScrollHandler, {
      passive: true,
    });

    // 监听预览区滚动
    previewElement.addEventListener("scroll", previewScrollHandler, {
      passive: true,
    });
  });
};

// 清理滚动监听
const cleanupScrollSync = () => {
  if (textareaElement && textareaScrollHandler) {
    textareaElement.removeEventListener("scroll", textareaScrollHandler);
  }
  if (previewElement && previewScrollHandler) {
    previewElement.removeEventListener("scroll", previewScrollHandler);
  }
  textareaElement = null;
  previewElement = null;
  textareaScrollHandler = null;
  previewScrollHandler = null;
};

// 复制代码按钮点击处理
let copyCodeClickHandler: ((e: Event) => void) | null = null;
let copySuccessHandler: ((e: ClipboardEvent) => void) | null = null;
let isCopying = false;
let copyTimeout: ReturnType<typeof setTimeout> | null = null;

// 初始化复制代码按钮监听
const initCopyCodeListener = () => {
  nextTick(() => {
    if (!editorRef.value) return;

    const editorEl = editorRef.value.$el as HTMLElement;
    if (!editorEl) return;

    const previewWrapper = editorEl.querySelector(
      ".v-md-editor__preview-wrapper"
    ) as HTMLElement;

    if (!previewWrapper) {
      setTimeout(initCopyCodeListener, 200);
      return;
    }

    // 监听 clipboard copy 事件，检测复制成功
    copySuccessHandler = (_e: ClipboardEvent) => {
      if (isCopying) {
        message.success("复制成功");
        isCopying = false;
        // 移除监听器，避免在其他地方复制时也触发
        if (copySuccessHandler) {
          document.removeEventListener("copy", copySuccessHandler);
        }
      }
    };

    // 使用事件委托，监听所有复制按钮的点击
    copyCodeClickHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains("v-md-copy-code-btn")) {
        isCopying = true;
        // 添加 clipboard 事件监听
        document.addEventListener("copy", copySuccessHandler!, { once: true });

        // 清除之前的超时
        if (copyTimeout) {
          clearTimeout(copyTimeout);
        }

        // 设置超时，如果 clipboard 事件没有触发，则直接显示成功消息
        copyTimeout = setTimeout(() => {
          if (isCopying) {
            message.success("复制成功");
            isCopying = false;
          }
        }, 300);
      }
    };

    // 在预览区域使用事件委托
    previewWrapper.addEventListener("click", copyCodeClickHandler);
  });
};

onMounted(() => {
  // 延迟初始化，确保编辑器已完全渲染
  setTimeout(initScrollSync, 100);
  // 初始化复制代码按钮监听
  setTimeout(initCopyCodeListener, 100);
});

onUnmounted(() => {
  cleanupScrollSync();
  // 清理复制代码监听器
  if (editorRef.value && copyCodeClickHandler) {
    const editorEl = editorRef.value.$el as HTMLElement;
    if (editorEl) {
      const previewWrapper = editorEl.querySelector(
        ".v-md-editor__preview-wrapper"
      ) as HTMLElement;
      if (previewWrapper) {
        previewWrapper.removeEventListener("click", copyCodeClickHandler);
      }
    }
  }
  if (copySuccessHandler) {
    document.removeEventListener("copy", copySuccessHandler);
  }
  if (copyTimeout) {
    clearTimeout(copyTimeout);
  }
  copyCodeClickHandler = null;
  copySuccessHandler = null;
  isCopying = false;
  copyTimeout = null;
});
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

    // 修复 blockquote 样式问题
    .v-md-editor-preview {
      .github-markdown-body {
        blockquote {
          margin: 16px 0 !important;
          padding: 0 1em !important;
          color: #6a737d !important;
          border-left: 0.25em solid #dfe2e5 !important;
          background-color: transparent !important;
          box-sizing: border-box !important;
          display: block !important;
          width: 100% !important;

          p {
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }

          & > *:first-child {
            margin-top: 0 !important;
          }

          & > *:last-child {
            margin-bottom: 0 !important;
          }
        }
      }
    }
  }
}
</style>
