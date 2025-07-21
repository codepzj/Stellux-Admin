<template>
  <div class="flex h-8 w-full items-center justify-between px-4 dark:bg-dark">
    <!-- 左侧 Logo 区域 -->
    <div
      :class="[
        'flex items-center',
        sidebarStore.collapse ? 'justify-center' : 'justify-start',
      ]"
    >
      <div
        v-if="$route.name === 'DocumentContent'"
        class="cursor-pointer flex items-center gap-1 px-2 py-0.5 my-1 rounded-md border border-zinc-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        @click="$router.push({ name: 'DocumentOverview' })"
      >
        <Icon icon="icon-park-outline:back" width="16" height="16" />
        <span class="text-sm font-medium">返回</span>
      </div>
    </div>

    <!-- 右侧操作区域 -->
    <div class="flex items-center gap-2">
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

const sidebarStore = useSidebarStore();
</script>
