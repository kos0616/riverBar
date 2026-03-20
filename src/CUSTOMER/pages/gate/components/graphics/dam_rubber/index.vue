<template>
  <div class="flex w-[30rem] items-end border-b-[3px] border-gray-500" style="height: 350px">
    <img src="../assets/dam-rubber.svg" class="w-[7rem] scale-x-100" alt="dam left" />
    <!-- 設備 -->
    <div class="relative h-full flex-1">
      <div class="absolute left-0 top-[10%] w-full text-center" style="container-type: inline-size">
        <strong v-if="statusName" class="my-status text-[17cqw]">
          {{ statusName }}
        </strong>
      </div>
      <!-- 箭頭 -->
      <img
        v-if="['closing', 'opening'].includes(direction || '')"
        :class="{ 'rotate-180': direction === 'opening' }"
        src="../assets/arrow.svg"
        alt="direction"
        class="absolute bottom-0 left-1/2 z-[2] w-6 -translate-x-1/2"
      />
      <!-- 水位 -->
      <!-- <div
        class="bg-water absolute bottom-0 w-full border-t-2 border-sky-200"
        :style="{ height: `calc(${currentWaterLevelHeight} - 2px)` }"
      ></div> -->
      <!-- 橡皮 -->
      <div
        :style="`mask-image: radial-gradient(ellipse 54% ${100 - currentPressure}% at top center, #0000 90%, #000 0);`"
        class="bg-rubber absolute -left-2 -right-2 bottom-0 z-[1]"
        style="height: 60%"
      ></div>
      <!-- 流水 -->
      <div
        v-if="['closing', 'opening', 'opened'].includes(direction || '')"
        :style="`mask-image: radial-gradient(ellipse 115% ${100 - currentPressure}% at top center, #0000 90%, #000 0);`"
        class="bg-water absolute bottom-0 left-1/2 z-[1] w-1/2 -translate-x-1/2"
        style="height: 62%"
      ></div>
    </div>
    <img
      src="../assets/dam-rubber.svg"
      class="w-[7rem] translate-y-[1px] -scale-x-100"
      alt="dam right"
    />
  </div>
</template>
<script setup lang="ts">
/**
 * 橡皮壩
 * 目前水位封印中
 */
import { computed } from 'vue';

const props = defineProps<{
  /** 壓力 */
  pressure?: number | null;
  /** 警戒壓力 */
  maxPressure?: number | null;
  /** 狀態名稱 */
  statusName?: string;
  /** 狀態 */
  direction?: 'opening' | 'closing' | 'opened' | 'closed';
  /** 滿水位 */
  // maxium: number;
  /** 目前水位 */
  // waterLevel?: number;
  /** 壩體狀態 */
  // status?: 'error' | 'working' | 'online' | 'offline';
}>();

// const showHeight = (v: number) => {
//   return (v / props.maxium) * 100 + '%';
// };

// const currentWaterLevelHeight = computed(() => showHeight(props.waterLevel ?? 0));

const showPressure = (v: number) => {
  /** 壓力的最高值 */
  const MAXIUM = props.maxPressure ?? 0.18;
  const percent = parseFloat(((v / MAXIUM) * 100).toFixed());
  return percent >= 100 ? 100 : percent;
};

/** 顯示 */
const currentPressure = computed(() => showPressure(Number(props.pressure ?? 0) ?? 0));
</script>

<style src="../assets/style.css"></style>
<style scoped>
.bg-rubber {
  background: linear-gradient(
    to bottom,
    #b3b3b3 0%,
    #a2a2a2 5.35%,
    #717171 22.37%,
    #484848 39.28%,
    #292929 55.73%,
    #121212 71.6%,
    #050505 86.65%,
    #000000 100%
  );
}
</style>
