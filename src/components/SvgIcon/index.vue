<template>
  <svg
    :class="['svg-icon', customClass]"
    :style="{ width: size + 'px', height: size + 'px', fill: iconColor }"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 24 },
  color: { type: String, default: "currentColor" }, // 默认值
  customClass: { type: String, default: "" },
});

const iconColor = computed(() => {
  if (props.color === "currentColor") {
    return "#333";
  }
  return props.color;
});

const symbolId = computed(() => `#icon-${props.name}`);
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
