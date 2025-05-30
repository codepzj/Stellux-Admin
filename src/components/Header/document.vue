<template>
  <div class="flex h-14 w-full items-center justify-between px-4 dark:bg-dark">
    <!-- 左侧 Logo 区域 -->
    <div
      :class="[
        'flex items-center',
        sidebarStore.collapse ? 'justify-center' : 'justify-start',
      ]"
    >
      <div
        v-if="$route.name === 'DocumentContent'"
        class="cursor-pointer text-zinc-600 dark:text-zinc-300 flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-all duration-300 border border-zinc-300 dark:border-zinc-600"
        @click="$router.push({ name: 'DocumentOverview' })"
      >
        <Icon icon="icon-park-outline:back" width="18" height="18" />
        <span class="text-sm font-medium">返回概览</span>
      </div>
      <!-- 编辑 / 预览切换 -->
      <div
        v-if="$route.name === 'DocumentContent'"
        class="h-full flex items-center"
      >
        <a-select
          v-model:value="documentStore.mode"
          class="w-24 text-center"
          :bordered="false"
        >
          <a-select-option value="preview" @click="setMode('preview')">
            <span class="text-xs">预览模式</span>
          </a-select-option>
          <a-select-option value="edit" @click="setMode('edit')">
            <span class="text-xs">编辑模式</span>
          </a-select-option>
        </a-select>
      </div>
      <div
        v-if="
          $route.name === 'DocumentContent' && documentStore.editDocumentTitle
        "
        class="cursor-pointer ml-6 flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300"
        :title="documentStore.editDocumentTitle"
      >
        ✏️
        <span class="font-medium text-zinc-700 dark:text-white">
          {{ documentStore.editDocumentTitle }}
        </span>
      </div>
    </div>

    <!-- 右侧操作区域 -->
    <div class="flex items-center gap-2">
      <!-- 编辑操作按钮 -->
      <div v-if="$route.name === 'DocumentContent'">
        <a-button
          v-for="button in documentStore.actionButtonList"
          :disabled="button.disabled"
          :key="button.name"
          type="primary"
          @click="button.action"
        >
          {{ button.name }}
        </a-button>
      </div>

      <!-- 全屏/设置按钮 -->
      <FullScreen class="hidden md:block" />
      <Setting class="hidden md:block" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { FullScreen, Setting } from "./components";
import { useSidebarStore } from "@/store";
import { useDocumentStore } from "@/store/modules/document";

const documentStore = useDocumentStore();
const sidebarStore = useSidebarStore();

const setMode = (newMode: "preview" | "edit") => {
  documentStore.setMode(newMode);
};
</script>
