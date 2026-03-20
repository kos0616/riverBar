<template>
  <el-dialog :model-value="modelValue" @close="$emit('close')" title="檢視詳情" width="280">
    <div class="grid gap-4 text-center">
      <h2 class="text-left">
        <strong class="block text-xl">{{ data?.Site }}</strong>
        <span class="text-lg">{{ data?.Location }}</span>
      </h2>

      <div>
        <div class="text-lg">即時水位</div>
        <strong
          v-if="typeof data?.WaterLevel === 'number'"
          :style="{ color: customColorMethod(data) }"
          class="text-4xl"
        >
          {{ $formatNumber(data?.WaterLevel, 1) }}
          <small>㎝</small>
        </strong>
        <strong v-else>-</strong>
      </div>

      <div v-if="data?.FlowRate">
        <div class="text-lg">流量數值CMS</div>
        <strong class="text-4xl">
          {{ data?.FlowRate }}
        </strong>
      </div>

      <div>
        <el-button
          v-if="data?.HasLocationSetting"
          tag="router-link"
          :to="`/iws/${data?.LocationCode}`"
          :disabled="!$WRUD('r', 'iws')"
          type="primary"
          title="前往圖控"
        >
          <i class="fa-solid fa-fw fa-chalkboard-user mr-1"></i>
          前往圖控
        </el-button>
      </div>
    </div>
    <!--  <div class="flex flex-col gap-8">
      <div class="text-center">
        <div class="text-lg">
          即時水位 / 最高水位
          <small>(㎝)</small>
        </div>
        <strong class="text-4xl">
          <span :style="{ color: customColorMethod(data?.CurrentWaterLevel) }">
            {{ data?.CurrentWaterLevel }}
          </span>
          / {{ data?.MaxWaterLevel }}
        </strong>

        <el-progress
          :percentage="calculate(data?.CurrentWaterLevel, data?.MaxWaterLevel)"
          :color="customColorMethod(data?.CurrentWaterLevel)"
        />
      </div>
      <div class="text-center">
        <div class="text-lg">
          即時壓力 / 極限壓力
          <small>(㎏/㎠)</small>
        </div>
        <strong class="text-4xl"> {{ data?.CurrentPressure }} / {{ data?.MaxPressure }} </strong>

        <el-progress
          :percentage="calculate(data?.CurrentPressure, data?.MaxPressure)"
          color="#8e44ad"
        />
      </div>
      <div class="text-center">
        <div class="text-lg">
          水門開度 / 最大開度
          <small>(㎝)</small>
        </div>
        <strong class="text-4xl">
          {{ data?.CurrentWaterGateOpenDeg }} / {{ data?.MaxWaterGateOpenDeg }}
        </strong>
        <el-progress
          :percentage="calculate(data?.CurrentWaterGateOpenDeg, data?.MaxWaterGateOpenDeg)"
          color="#95a5a6"
        />
      </div>
      <div class="text-center">
        <div class="text-lg">
          倒伏堰開度 / 最大開度
          <small>(㎝)</small>
        </div>
        <strong class="text-4xl">
          {{ data?.CurrentGateOpenDeg }} / {{ data?.MaxGateOpenDeg }}
        </strong>
        <el-progress
          :percentage="calculate(data?.CurrentGateOpenDeg, data?.MaxGateOpenDeg)"
          color="#95a5a6"
        />
      </div> 
    </div>-->
  </el-dialog>
</template>

<script lang="ts" setup>
import { type item } from '@/CUSTOMER/Service/WaterLevelGauge';

defineEmits(['close']);

// type response = {
//   CurrentWaterLevel: string;
//   MaxWaterLevel: string;
//   CurrentPressure: string;
//   MaxPressure: string;
//   CurrentWaterGateOpenDeg: string;
//   MaxWaterGateOpenDeg: string;
//   CurrentGateOpenDeg: string;
//   MaxGateOpenDeg: string;
// };

interface Prop {
  modelValue: boolean;
  data?: item;
}
defineProps<Prop>();

/** calculatePercent */
// const calculate = (cur?: string, max?: string) => {
//   return Math.floor((Number(cur || '0') / Number(max || '0')) * 100);
// };

// const customColorMethod = (cur?: string) => {
//   const n = Number(cur || 0);
//   if (n < 80) return '#f39c12';
//   if (n > 160) return '#DE3B40FF';
//   return '#3498db';
// };

const customColorMethod = (cur?: item) => {
  const n = Number(cur?.WaterLevel || 0);

  if (typeof cur?.LowWaterLevel === 'number' && cur.LowWaterLevel !== 0 && n < cur?.LowWaterLevel) {
    return '#f39c12';
  }
  if (
    typeof cur?.ThirdAlertWaterLevel === 'number' &&
    cur?.ThirdAlertWaterLevel !== 0 &&
    n > cur?.ThirdAlertWaterLevel
  )
    return '#8E24AA';
  if (
    typeof cur?.SecondAlertWaterLevel === 'number' &&
    cur?.SecondAlertWaterLevel !== 0 &&
    n > cur?.SecondAlertWaterLevel
  )
    return '#FF7043';
  if (
    typeof cur?.FirstAlertWaterLevel === 'number' &&
    cur?.FirstAlertWaterLevel !== 0 &&
    n > cur?.FirstAlertWaterLevel
  )
    return '#DE3B40FF';
  return '#3498db';
};
</script>
