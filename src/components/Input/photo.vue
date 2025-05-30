<template>
  <div>
    <a-input v-model:value="url">
      <template #addonAfter>
        <div
          class="flex items-center justify-center"
          @click="open = true"
        >
          <Icon icon="fontisto:picture" class="cursor-pointer" />
        </div>
      </template>
    </a-input>
    <PhotoSelect v-model:open="open" @selected-picture="onSelectedPicture" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useVModel } from "@vueuse/core";
import PhotoSelect from "@/components/PhotoSelect/index.vue";

const props = defineProps<{
  url: string; // 输入框的值
}>();

const emit = defineEmits<{
  (e: "update:url", url: string): void;
}>();

const url = useVModel(props, "url", emit);

const open = ref(false);

const onSelectedPicture = (picture: string) => {
  url.value = picture;
  open.value = false;
}
</script>
