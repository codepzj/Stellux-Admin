<template>
  <a-card class="h-full overflow-y-auto">
    <PhotoWall
      :list="page.list"
      type="display"
      @selected-photos="(photos: string[]) => (selectedPhotos = photos)"
    >
      <template #left>
        <a-button
          type="primary"
          danger
          :disabled="selectedPhotos.length === 0"
          @click="
            () => {
              deleteModalOpen = true;
              confirmDelete = false;
            }
          "
        >
          删除
        </a-button>
      </template>
      <template #right>
        <Uploader @close="getList" />
      </template>
    </PhotoWall>
    <div class="flex justify-end my-4">
      <a-pagination
        v-model:current="page.page_no"
        v-model:page-size="page.page_size"
        :total="page.total_count"
        @change="getList"
      />
    </div>
    <a-modal
      v-model:open="deleteModalOpen"
      title="删除确认"
      @ok="handleDelete"
      @cancel="deleteModalOpen = false"
      :ok-button-props="{
        disabled: !confirmDelete,
        danger: true,
      }"
      centered
    >
      <p class="text-red-600 mb-3">此操作将永久删除选中的图片，无法恢复。</p>
      <p class="text-gray-600 mb-4">
        即将删除 {{ selectedPhotos.length }} 张图片
      </p>
      <div class="mt-4">
        <a-checkbox v-model:checked="confirmDelete">
          我确认删除选中的图片
        </a-checkbox>
      </div>
    </a-modal>
  </a-card>
</template>
<script setup lang="ts">
// @ts-ignore
import PhotoWall from "@/components/PhotoWall/index.vue";
import Uploader from "@/components/Uploader/index.vue";
import { deleteFilesByIdListAPI, queryFileList } from "@/api/file";
import type { FileVO } from "@/types/file";
import { message } from "ant-design-vue";
import type { PageData } from "@/types/dto";
import { API_BASE_URL } from "@/constant";

// 删除弹窗
const deleteModalOpen = ref(false);
const confirmDelete = ref(false);
const page = reactive<PageData<FileVO>>({
  page_no: 1,
  page_size: 24,
  total_count: 0,
  total_page: 0,
  list: [],
});

// 选中的图片
const selectedPhotos = ref<string[]>([]);
const selectedPhotosIdList = computed(() => {
  const relativeUrl = selectedPhotos.value.map(
    item => item.split(API_BASE_URL)[1]
  );
  return page.list
    .filter(item => relativeUrl.includes(item.url))
    ?.map(item => item.id);
});

const getList = async () => {
  try {
    const res = await queryFileList({
      page_no: page.page_no,
      page_size: page.page_size,
    });
    page.list = res.data.list;
    page.total_count = res.data.total_count;
  } catch (error: any) {
    message.error({
      content: error + "，图片列表获取失败",
    });
  }
};
// 异步获取图片列表
await getList();

const handleDelete = async () => {
  if (selectedPhotosIdList.value.length === 0) {
    message.info("请单击图片删除");
    return;
  }
  await deleteFilesByIdListAPI({
    id_list: selectedPhotosIdList.value,
  });
  message.success("删除成功");
  await getList();
  deleteModalOpen.value = false;
  confirmDelete.value = false;
};
</script>
<style scoped lang="scss"></style>
