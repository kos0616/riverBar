<template>
  <div class="grid gap-2 lg:flex">
    <!-- PC版為狀態顯示，手機版包含自動充氣、水位與裝置開關 -->
    <div class="min-w-80 shrink-0 rounded bg-gray-200 xl:max-w-lg 2xl:w-[768px] 2xl:max-w-3xl">
      <left />
    </div>
    <!-- 電腦版操作流程 -->
    <div class="rounded bg-gray-200 p-2">
      <right
        v-if="$screenWidth.value >= 768"
        :class="{ 'pointer-events-none cursor-not-allowed grayscale': isUltraWarning }"
      />
    </div>
  </div>
  <top v-if="$screenWidth.value < 768"></top>
  <log />
</template>

<script lang="ts" setup>
import left from './left.vue';
import right from './right.vue';
import log from '../../../components/log.vue';
import top from '../middle/sections.vue';

defineProps({
  isUltraWarning: Boolean
});
</script>
