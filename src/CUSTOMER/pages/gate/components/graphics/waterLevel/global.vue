<template>
  <div
    v-if="checkCurrentWater"
    class="w-full border-b-[3px] border-transparent"
    style="height: 350px"
  >
    <div
      class="absolute w-full border-t-[4px] border-dashed"
      :style="{
        bottom: `calc(${currentWaterLevelHeight} - 4px)`,
        borderColor: currentWaterLabelColor
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
/**
 * 整體水位計
 * 作為貫穿整個畫面的水位計
 * 會顯示目前水位
 * 排列在水位計後方，設備前方
 * 4px 的 border 會與水位計錯位
 */
import { computed } from 'vue';

interface Prop {
  /** 目前水位 */
  modelValue?: number;
  labels: Typelabel[];
  /** 滿水位 */
  maxium: number;
}

const props = withDefaults(defineProps<Prop>(), { labels: () => [] });

/** 檢查目前水位有效值 */
const checkCurrentWater = computed(() => {
  const N = props.modelValue;
  return typeof N === 'number' && !isNaN(N);
});

const showHeight = (v: number) => {
  return (v / props.maxium) * 100 + '%';
};

const currentWaterLevelHeight = computed(() => showHeight(props.modelValue ?? 0));

const currentWaterLabelColor = computed(() => {
  const cur = props.modelValue || 0;
  const dry = props.labels.find((o) => o.isDry);
  if (typeof cur === 'number' && dry && cur <= (dry?.value || 0)) return dry.color;
  console.log(props.labels);

  const color =
    [...props.labels]
      .filter((o) => !o.isCurrent && !o.isDry && o.value !== 0 && o.value <= cur)
      .sort((a, b) => b.value - a.value)[0]?.color ?? '#60a5fa';

  return color;
});
</script>
