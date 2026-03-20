<template>
  <div class="glass-ball relative h-24 w-24 overflow-hidden rounded-full border border-white">
    <wave
      class="absolute bottom-0"
      :style="{ '--fill': waterLevelColor, height: waveHeight }"
    ></wave>
    <strong
      class="text-shadow absolute left-1/2 top-0 -translate-x-1/2 translate-y-1/3 text-3xl drop-shadow"
      :style="{ color: waterLevelColor }"
    >
      <template
        v-if="typeof currentWaterLevel?.value === 'number' && !isNaN(currentWaterLevel?.value)"
      >
        {{ fixFloat(currentWaterLevel.value) }}
      </template>
      <i v-else class="fa-solid fa-fw fa-triangle-exclamation"></i>
    </strong>
    <strong
      class="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 text-3xl text-white drop-shadow"
      style="-webkit-text-stroke: 0.5px #000000bb"
    >
      {{ requiredWaterLevel || '0' }}
    </strong>
  </div>
</template>

<script setup lang="ts">
/**
 * 半球狀的水位計
 * 放在左上角位置
 * 可以顯示當前水位、枯水位
 * 有波浪效果並且會依據水位變更高度與顏色
 */
import { computed } from 'vue';
import wave from '../assets/wave.vue';
import fixFloat from '@/CUSTOMER/utils/fixFloat';

const props = defineProps<{
  modelValue: Typelabel[];
  requiredWaterLevel?: number | null;
}>();

const waveHeight = computed(() => {
  const cur = currentWaterLevel.value?.value;
  const dry = dryWaterLevel.value;
  const alerts = alertWaterLevels.value;

  if (typeof cur !== 'number') return '80%';
  if (cur < (dry?.value ?? 0)) return 'auto';
  return alerts.some((o) => o.value < cur) ? '150%' : '80%';
});

const waterLevelColor = computed(() => {
  const cur = currentWaterLevel.value?.value;
  const dry = dryWaterLevel.value;
  const alerts = alertWaterLevels.value;

  if (typeof cur !== 'number') return '#29ABE2';
  if (cur < (dry?.value ?? 0)) return dry?.color || '#FFC000';

  return alerts.find((o) => o.value < cur)?.color || '#29ABE2';
});

/** 將其他的警戒水位由高至低排列 */
const alertWaterLevels = computed(() => {
  return (props.modelValue || [])
    .filter((o) => typeof o.value === 'number' && o.value !== 0)
    .filter((o) => !o.isDry && !o.isCurrent)
    .sort((a, b) => b.value - a.value);
});

const dryWaterLevel = computed(() => {
  return (props.modelValue || []).find((o) => o.isDry);
});

const currentWaterLevel = computed(() => {
  return (props.modelValue || []).find((o) => o.isCurrent);
});
</script>
<style lang="scss" scoped>
.glass-ball::before {
  content: '';
  @apply absolute inset-0 z-[1] block rounded-full;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 -4px 6px rgba(0, 0, 0, 0.2);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0)),
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0) 50%);
}

.text-shadow {
  text-shadow:
    1.5px 1.5px 0 #fff,
    -1.5px -1.5px 0 #fff,
    1.5px -1.5px 0 #fff,
    -1.5px 1.5px 0 #fff,
    1.5px 1.5px 0 #fff;
}
</style>
