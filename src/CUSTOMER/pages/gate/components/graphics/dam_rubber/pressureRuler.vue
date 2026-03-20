<template>
  <div style="height: 350px">
    <div class="flex h-full gap-1" style="--water-border: 3px">
      <!-- 量筒 -->
      <div
        class="relative z-10 h-full w-6 rounded-[1px] border-white bg-gray-300 shadow"
        style="border-width: var(--water-border)"
      >
        <!-- 警戒色 -->
        <div class="absolute bottom-0 top-0 w-full">
          <div
            class="absolute bottom-0 w-full bg-orange-400 transition-all duration-1000"
            :style="{ top: `calc(100% - ${currentPressure}%)` }"
          ></div>
        </div>
        <!-- 刻度 -->
        <ul class="relative flex h-full flex-col justify-between">
          <li
            v-for="i in 11"
            :key="`dot${i}`"
            class="h-[2px] w-[10px] bg-slate-100 first:w-full first:bg-transparent last:bg-transparent"
          ></li>
        </ul>
      </div>
      <!-- 目前壓力 -->
      <div class="relative z-10 my-[var(--water-border)] w-[4rem] xl:w-[8rem]">
        <div class="absolute -left-1 top-0">
          <div class="rounded-br-full bg-white px-1 pr-4 shadow">
            <strong class="hidden pr-1 xl:inline">警戒壓力</strong>
            <span class="inline-block text-end">{{ MAXIUM }}</span>
          </div>
        </div>
        <div
          v-if="chkNumber"
          class="absolute left-0 z-[2] transition-all duration-1000"
          :style="{
            bottom: `${currentPressure}%`
          }"
        >
          <div class="flex translate-y-1/2 items-center justify-end">
            <div class="label label-left"></div>
            <div class="rounded-r bg-current pl-1 pr-2" style="text-shadow: 1px 1px 0px #333333ff">
              <span class="inline-block text-nowrap text-end text-white" ref="REF_currentNumber">
                {{ modelValue }} ㎏/㎠
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 壓力計
 * 元件高度暫定為 350px，可自由調整
 * 最大壓力值為 MAXIUM 或 0.18
 */
import { computed } from 'vue';

const props = defineProps<{
  modelValue?: number | null;
  maxPressure?: number | null;
}>();

const MAXIUM = props.maxPressure ?? 0.18;

const showPressure = (v: number) => {
  /** 壓力的最高值 */
  const percent = parseFloat(((v / MAXIUM) * 100).toFixed());
  return percent >= 100 ? 100 : percent;
};

const chkNumber = computed(() => typeof props.modelValue === 'number');

const currentPressure = computed(() => showPressure(Number(props.modelValue ?? 0) ?? 0));
</script>

<style lang="scss" scoped>
.label {
  @apply relative;
  height: 24px;
  width: 16px;

  &::after {
    @apply absolute top-1/2 h-0 w-0 -translate-y-1/2 border;
    content: '';
    right: 0; /* 調整三角形的位置 */
    border-width: 12px 0 12px 16px; /* 三角形大小 */
    /* 三角形顏色 */
    border-color: transparent transparent transparent currentColor;
  }
  &-left {
    &::after {
      left: 0;
      right: auto;
      border-width: 12px 16px 12px 0;
      border-color: transparent currentColor transparent transparent;
    }

    &::before {
      @apply absolute -left-full top-1/2 block h-2 w-[1.8rem] -translate-x-1/2 -translate-y-1/2 rounded border border-gray-400 bg-white shadow;
      content: '';
    }
  }
}
</style>
