<template>
  <a-card class="h-full">
    <a-tabs
      v-model:activeKey="activeKey"
      tab-position="left"
      @change="(key: string) => $router.push({ name: key })"
      class="!mt-8"
    >
      <a-tab-pane v-for="item in tabMeta" :key="item.key" :tab="item.title">
        <router-view></router-view>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script lang="ts" setup>
const activeKey = ref("UserEditBasic");
const tabMeta = [
  {
    key: "UserEditBasic",
    title: "基本信息",
  },
  {
    key: "UserEditResetPassword",
    title: "重置密码",
  },
];
</script>
