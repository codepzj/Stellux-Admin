<template>
  <div>
    <a-button type="primary" @click="showModal"> 上传附件 </a-button>
  </div>
  <a-modal
    v-model:open="open"
    title="附件上传"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
    :destroyOnClose="true"
    @cancel="handleCancel"
  >
    <div class="flex flex-col items-center mt-10">
      <div id="uppy-dashboard" class="w-3/5"></div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/store";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import ImageEditor from "@uppy/image-editor";
import Compressor from "@uppy/compressor";
import XHR from "@uppy/xhr-upload";
import ZhHans from "@uppy/locales/lib/zh_CN";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/image-editor/dist/style.min.css";

const open = ref<boolean>(false);
const userStore = useUserStore();
let uppy: Uppy | null = null;

const initUppy = () => {
  if (uppy) {
    // 清理之前的uppy实例
    uppy = null;
  }

  uppy = new Uppy({
    locale: ZhHans,
    restrictions: {
      maxFileSize: 1024 * 1024 * 10,
      maxNumberOfFiles: 30,
      minNumberOfFiles: 1,
      allowedFileTypes: [
        "image/*",
        "video/*",
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".mp3",
        ".mp4",
      ],
    },
  })
    .use(Dashboard, {
      inline: true,
      target: "#uppy-dashboard",
      showProgressDetails: true,
      width: "100%",
    })
    .use(ImageEditor, {
      cropperOptions: {
        viewMode: 1,
        scalable: true,
        zoomable: true,
      },
    })
    .use(Compressor, {
      quality: 0.8,
    })
    .use(XHR, {
      endpoint: `${import.meta.env.VITE_API_URL}/admin-api/file/upload`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${userStore.access_token}`,
      },
    });
};

const showModal = () => {
  open.value = true;
  // 延迟初始化uppy，确保DOM已经渲染
  setTimeout(() => {
    initUppy();
    uppy?.upload().then(res => {
      console.log(res);
    });
  });
};

const emit = defineEmits<{
  (e: "close"): void;
}>();

const handleCancel = () => {
  open.value = false;
  if (uppy) {
    uppy = null;
  }
  emit("close");
};

onUnmounted(() => {
  if (uppy) {
    uppy = null;
  }
});
</script>

<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
    overflow-y: auto;
  }
}

::-webkit-scrollbar {
  width: 8px;
}

// uppy样式调整
#uppy-dashboard {
  .uppy-Dashboard {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    background: #fafafa;
  }

  .uppy-Dashboard-dropzone {
    border: none;
  }
}
</style>
