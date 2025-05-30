<template>
  <div>
    <div class="site-config-tab transition-none">
      <a-segmented
        v-model:value="defaultSetting"
        :options="SettingOptions"
        @change="(value: any) => $router.push({ name: value })"
      />
    </div>
    <div class="p-4">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
const SettingOptions = ref([
  {
    label: "基本设置",
    value: "BasicSetting",
  },
  {
    label: "SEO设置",
    value: "SEOSetting",
  },
  {
    label: "博客设置",
    value: "BlogSetting",
  },
]);
const defaultSetting = ref("BasicSetting");
const route = useRoute();
watchEffect(() => {
  console.log(route.name);
  defaultSetting.value = route.name as string;
});
</script>
<style lang="scss" scoped>
:deep(.ant-segmented-thumb) {
  transition: ease-in;
  background-color: var(--color-zinc-300);
}
:deep(.ant-segmented-item-label) {
  padding: 4px 16px;
  transition: none;
}
:deep(.ant-segmented-item-selected) {
  background-color: var(--color-zinc-300);
}
:deep(.ant-segmented) {
  transition: none;
}
</style>

<style lang="scss">
.dark {
  .site-config-tab {
    .ant-segmented-thumb {
      background-color: var(--color-zinc-800);
    }
    .ant-segmented-item-selected {
      background-color: var(--color-zinc-700);
    }
  }
}
</style>
