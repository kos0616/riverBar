<template>
  <div class="w-48 border-b-[3px] border-gray-500" style="height: 350px">
    <!-- 設備 -->
    <div class="relative flex h-full flex-col">
      <motor
        :status="status"
        class="absolute left-1/2 top-[1px] w-3/5 -translate-x-1/2 -translate-y-full"
      />
      <!-- 水位 -->
      <div
        class="bg-water absolute bottom-0 w-full border-t-2 border-sky-200"
        :style="{ height: `calc(${currentWaterLevelHeight} - 2px)` }"
      ></div>

      <!-- 上半部區塊 -->
      <div>
        <div class="aspect-[14.5/1] w-full bg-blue-600 text-end text-white"></div>
        <div
          class="flex aspect-[3.33/1] items-center justify-center bg-gray-300"
          style="container-type: size"
        >
          <strong v-if="statusName" class="my-status text-[15cqw]">
            {{ statusName }}
          </strong>
        </div>
      </div>

      <!-- 圍牆 -->
      <div class="flex-1 border-x-[4px] border-dashed border-gray-400"></div>

      <!-- 下半部階梯與開度 -->
      <div class="absolute bottom-0 w-full">
        <div class="relative">
          <arrow
            class="absolute bottom-[70%] w-[70%]"
            style="left: calc(25% - 4%)"
            :style="{
              '--arrow-deg': `-${settedDeg ?? 0}deg`
            }"
          ></arrow>
          <div class="absolute top-0 h-full w-full" style="container-type: size">
            <span class="absolute left-2 top-0 text-[10cqw]">+0</span>
            <span class="absolute bottom-0 right-2 text-[10cqw]">-30</span>
            <div class="absolute bottom-0 w-full text-center">
              <span class="rounded border-2 border-gray-200 bg-white px-2 text-[8cqw] shadow">
                開度
                <b class="text-red-600">{{ deg ?? '-' }}°</b>
              </span>
            </div>
          </div>
          <div class="absolute bottom-0 right-2 w-full" style="container-type: size"></div>

          <div class="w-1/4 bg-gray-400 pb-[8%]"></div>
          <div class="bg-gray-400 pb-[13%]"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * 倒伏偃
 * 目前暫定 左右 border 與畫面錯位為 4px
 * 底部因為和量筒對齊，所以有 3px
 * 高度 ** 不包含馬達 ** 因此滿水位 300cm 不會淹到馬達
 * 接受開度、狀態名稱、目前水位、馬達狀態
 */
import { computed } from 'vue';
import arrow from './arrow.vue';
import motor from '../assets/motorDefault.vue';

const props = defineProps<{
  /** 開度 */
  deg?: number | string;
  /** 狀態名稱 */
  statusName?: '起立完成' | '倒伏完成' | '起立中' | '倒伏中' | '' | string;
  /** 目前水位 */
  waterLevel?: number;
  /** 馬達狀態 */
  status?: 'error' | 'working' | 'online' | 'offline';
  /** 滿水位 */
  maxium: number;
}>();

const showHeight = (v: number) => {
  return (v / props.maxium) * 100 + '%';
};

const settedDeg = computed(() => {
  const MAXIUM = 60;

  let n = props.deg;

  if (props.statusName === '起立完成') n = MAXIUM;
  if (props.statusName === '倒伏完成') n = 0;
  return n;
});

const currentWaterLevelHeight = computed(() => showHeight(props.waterLevel ?? 0));
</script>

<style src="../assets/style.css"></style>
