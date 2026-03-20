<template>
  <div style="height: 350px">
    <div class="flex h-full" style="--water-border: 3px">
      <!-- 標籤 -->
      <div class="relative z-10 my-[var(--water-border)] w-[7rem] rounded-l bg-zinc-100/75">
        <!-- 標籤過於接近的顯示 -->
        <template v-if="tooCloseLabel">
          <svg class="absolute left-0 top-0 h-full w-full">
            <line
              v-for="(label, i) in labelsTypeLeica"
              v-show="label.isCurrent !== true && label.value > 0"
              :key="`label_svg_${i}`"
              x1="calc(70% - 1px)"
              :y1="label.isDry ? `calc(80% + 2.27rem)` : `calc(${i * 20}% + 2.27rem + 10%)`"
              x2="calc(100% + 1px)"
              :y2="`calc(100% - ${showHeight(label.value || 0)})`"
              :stroke="label.color"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <div class="flex h-full flex-col">
            <div class="h-[10%] px-1 text-end">{{ maxium }}㎝</div>
            <div
              v-for="(label, i) in labelsTypeLeica"
              v-show="label.isCurrent !== true && label.value > 0"
              :key="`label${i}`"
              :class="{ 'mt-auto pt-0': label.isDry }"
              class="h-[20%] text-zinc-700"
            >
              <div
                class="relative grid w-[70%] pl-2 pr-1 before:absolute before:bottom-0 before:left-0 before:block before:w-full before:border-b-2 before:border-[var(--border)] before:content-['']"
                :style="`--border: ${label.color}`"
                style="line-height: 1"
              >
                <span>{{ label.name }}</span>
                <div class="text-end" style="line-height: 1.3">{{ label.value }}㎝</div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="absolute right-0 top-0 px-1">{{ maxium }}㎝</div>
          <div
            v-for="(label, i) in labels"
            v-show="label.isCurrent !== true && label.value > 0"
            :style="{
              bottom: showHeight(label.value || 0)
            }"
            :key="`label${i}`"
            class="absolute right-0 text-zinc-700 transition-all duration-1000"
            :class="{ 'translate-y-full': label.isDry }"
          >
            <div
              v-if="label.isDry"
              class="border-t-2 pl-2 pr-1"
              :style="`border-color: ${label.color}`"
            >
              <strong> {{ label.name }}</strong>
              <strong class="absolute bottom-2 translate-y-full" style="left: calc(50% - 1.5rem)">
                {{ label.value }}㎝
              </strong>
              <div
                class="triangle ml-1 inline-block self-start"
                :style="`--my-color: ${label.color}`"
              ></div>
            </div>

            <div v-else class="border-b-2 pl-2 pr-1" :style="`border-color: ${label.color}`">
              <strong> {{ label.name }}</strong>
              <strong class="absolute bottom-1 translate-y-full" style="left: calc(50% - 1.5rem)">
                {{ label.value }}㎝
              </strong>
              <div
                class="triangle ml-1 inline-block align-bottom"
                :style="`--my-color: ${label.color}`"
              ></div>
            </div>
          </div>
        </template>
      </div>
      <!-- 量筒 -->
      <div
        class="border-transition relative z-10 h-full w-2 overflow-hidden rounded-[1px] !border-x-0 bg-gray-300 shadow"
        style="border-width: var(--water-border)"
      >
        <!-- 警戒色 -->
        <div class="absolute bottom-0 top-0 w-full">
          <div
            v-for="(label, i) in sortWaterLevels(labels)"
            :key="`level_${i}`"
            class="absolute flex w-full transition-all duration-1000"
            :class="{ 'items-end': !label.isDry }"
            :style="{
              bottom: showHeight(label.start),
              top: `calc(100% - ${showHeight(label.end)})`,
              backgroundColor: label.color
            }"
          ></div>
        </div>
      </div>
      <!-- 目前水位 -->
      <div class="relative z-10 my-[var(--water-border)] w-[7rem]">
        <div
          v-if="checkCurrentWater && currentWaterLevel"
          class="absolute left-0 z-[2] transition-all duration-1000"
          :style="{
            bottom: showHeight(currentWaterLevel.value || 0)
          }"
        >
          <div class="pl-1 pr-2">
            <div
              class="triangle mr-1 inline-block align-bottom"
              :style="`--my-color: ${currentWaterLabelColor}`"
            ></div>
            <strong class="">{{ currentWaterLevel.name }}</strong>
            <strong class="absolute bottom-0 translate-y-full" style="right: calc(50% - 1.5rem)">
              {{ fixFloat(dynamicCurrentWaterValue) }}㎝
            </strong>
          </div>
        </div>
        <div
          v-if="gateHeight"
          :style="{ height: showHeight(gateHeight || 0) }"
          class="items-top absolute bottom-0 left-1 flex border-l-4 border-gray-400 pl-1 before:absolute before:left-0 before:top-0 before:block before:h-1 before:w-[12px] before:-translate-x-[8px] before:bg-gray-400 before:content-['']"
        >
          {{ gateHeight }}㎝
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 水位計
 * 元件高度暫定為 300px，可自由調整
 * 最高水位值也暫定為 300cm
 * 左側顯示警戒標籤，中央為量筒，右側為目前水位標籤
 */
import { ref, watch, computed } from 'vue';
import fixFloat from '@/CUSTOMER/utils/fixFloat';

const props = defineProps<{
  modelValue: Typelabel[];
  /** 滿水位 */
  maxium: number;
  /** 水門高度 */
  gateHeight?: number;
}>();

/** 最大水位值 */
const _MAX = props.maxium;

const showHeight = (v: number) => {
  return (v / props.maxium) * 100 + '%';
};

const labels = computed(() =>
  (props.modelValue || []).filter((o) => typeof o.value === 'number' && o.value !== 0)
);

/** 萊卡型態的標籤排列，用於標籤彼此過於接近時 */
const labelsTypeLeica = computed(() => {
  const arr = labels.value;
  return arr
    .filter((o) => o.isCurrent !== true)
    .sort((a, b) => a.value - b.value)
    .sort((a) => (a.isDry ? 0 : -1));
});

/** 目前水位 */
const currentWaterLevel = computed(() => labels.value.find((o) => o.isCurrent));

/** 檢查目前水位有效值 */
const checkCurrentWater = computed(() => {
  const N = currentWaterLevel.value?.value;
  return typeof N === 'number' && !isNaN(N);
});

const currentWaterLabelColor = computed(() => {
  const cur = currentWaterLevel.value?.value || 0;
  const dry = labels.value.find((o) => o.isDry);
  if (typeof cur === 'number' && dry && cur <= (dry?.value || 0)) return dry.color;
  const color =
    [...labels.value]
      .filter((o) => !o.isCurrent && !o.isDry && o.value !== 0 && o.value <= cur)
      .sort((a, b) => b.value - a.value)[0]?.color ?? currentWaterLevel.value?.color;

  return color;
});

/** 顯示量筒的值 */
const sortWaterLevels = (labels: Typelabel[]) => {
  const arr = [...labels]
    // 排序警戒值，將目前水位提前，將枯水擺至最前
    .sort((a, b) => a.value - b.value)
    .sort((a) => (a.isCurrent ? -1 : 0))
    .sort((a) => (a.isDry ? -1 : 0));

  const result = arr.map((o, i, arr) => {
    /** 將枯水設為最底部 */
    if (i === 0 && o.isDry) return { ...o, start: 0, end: o.value };
    /** 目前水位改為枯水至一級水位的值 */
    if (i === 0 && o.isCurrent) return { ...o, start: 0, end: arr[i + 1]?.value ?? _MAX };
    else if (o.isCurrent) return { ...o, start: arr[0].value, end: arr[i + 1]?.value ?? _MAX };

    // 一般水位範圍
    return { ...o, start: o.value, end: arr[i + 1]?.value ?? _MAX };
  });
  return result;
};

/** 警戒值彼此過於接近時，將會隱藏 */
const tooClose = (v: number = 0) => {
  return labels.value
    .filter((o) => !o.isCurrent && !o.isDry)
    .some((o) => v !== o.value && v > o.value && v - o.value < 40);
};

/** 警戒值彼此過度接近時，改為type 2: leica 型態 */
const tooCloseLabel = computed(() => {
  return labels.value.filter((o) => !o.isCurrent && !o.isDry).some((o) => tooClose(o.value));
});

/** 動態化的即時水位 */
const dynamicCurrentWaterValue = ref(0);

watch(
  currentWaterLevel,
  (newVal, oldVal) => {
    const start = oldVal?.value || 0;
    const end = newVal?.value || 0;
    let startTimer = 0;

    window.requestAnimationFrame(step);

    const changeInValue = end - start;

    const DURATION = 1500; // 动画持续时间，单位毫秒

    function step(timestamp: number) {
      if (!startTimer) startTimer = timestamp;
      const progress = timestamp - startTimer;
      const easeProgress = easeOut(Math.min(progress / DURATION, 1));

      dynamicCurrentWaterValue.value = start + easeProgress * changeInValue;
      if (progress < DURATION) window.requestAnimationFrame(step);
    }

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 2); // 使用 cubic easing 函数
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.triangle {
  @apply border;
  content: '';
  border-width: 20px 12px 0 12px; /* 三角形大小 */
  /* 三角形顏色 */
  border-color: var(--my-color) transparent transparent transparent;
  &.self-start {
    border-width: 0 12px 20px 12px; /* 三角形大小 */
    /* 三角形顏色 */
    border-color: transparent transparent var(--my-color) transparent;
  }
  // &-left {
  //   &::after {
  //     left: 0;
  //     right: auto;
  //     border-width: 12px 16px 12px 0;
  //     border-color: transparent currentColor transparent transparent;
  //   }

  //   &::before {
  //     @apply shadow absolute block border-gray-400 top-1/2 -translate-y-1/2 h-2 rounded w-[1.8rem] bg-white border -left-full -translate-x-1/2;
  //     content: '';
  //   }
  // }
}
</style>
