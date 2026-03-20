<template>
  <div class="grid flex-wrap gap-2 lg:flex">
    <!-- 左邊區塊 -->
    <div class="min-w-80 shrink-0 rounded bg-gray-200 p-2 xl:max-w-lg 2xl:w-[768px] 2xl:max-w-3xl">
      <left />
    </div>
    <!-- 右邊區塊 -->
    <div
      :class="{ 'pointer-events-none cursor-not-allowed grayscale': isUltraWarning }"
      class="grid flex-wrap gap-2 rounded bg-gray-200 p-2 md:grid-cols-2 lg:flex"
    >
      <right />
    </div>
  </div>
  <top
    :class="{ 'pointer-events-none cursor-not-allowed grayscale': isUltraWarning }"
    v-if="$screenWidth.value < 768"
  ></top>
  <log />
</template>

<script lang="ts" setup>
import left from './left.vue';
import right from './right.vue';
import log from '../../../components/log.vue';
import top from '../middle/top.vue';

defineProps({
  isUltraWarning: Boolean
});
</script>
