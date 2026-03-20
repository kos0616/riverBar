<template>
  <div class="flex gap-3 overflow-hidden p-3 pb-10">
    <div class="grid gap-3">
      <waterLevelBall
        :model-value="waterLevels"
        :maxium="maxium"
        :requiredWaterLevel="requiredWaterLevel"
      ></waterLevelBall>
      <waterLevel :model-value="waterLevels" :maxium="maxium"></waterLevel>
    </div>

    <div class="grid flex-1 grid-cols-2 rounded-lg bg-gray-300 p-3">
      <waterPump
        v-for="(gate, i) in avaiablePump"
        :key="`myGate_${i}`"
        :index="gate.index"
        :status-name="gate.statusName"
        :status="gate.pumpStatus"
        :gateName="gate.gateName"
        :schedules="gate.schedules"
        class="border-[#bbb] odd:border-r-2 [&:nth-child(4n)]:border-t-2 [&:nth-child(4n-1)]:border-t-2"
      ></waterPump>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 抽水機
 */
import { computed, inject, watch, ref } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import waterLevel from '../../../components/graphics/waterLevel/basic.vue';
import waterLevelBall from '../../../components/graphics/waterLevel/ball.vue';
import waterPump from '../../../components/graphics/water_pump/index.vue';
import Lists from '@/CUSTOMER/Service/WaterPumpSchedules/Lists';
import day from 'dayjs';
import _ from 'lodash';

const data = inject($gate);

interface Prop {
  modelValue: Awaited<ReturnType<typeof Lists>>;
}
const props = defineProps<Prop>();

const schedules = ref<Record<string, { start: string; end: string }[]>>({});

const showSchedules = () => {
  schedules.value = {};
  const res = props.modelValue;
  const today = day().format('YYYY-MM-DD');
  const todays = res.filter((o) => o.DateTime.includes(today));
  const obj = _.groupBy(todays, 'WaterPumpName') || {};

  Object.entries(obj).forEach(([key, value]) => {
    value
      .sort((a, b) => a.DateTime.localeCompare(b.DateTime))
      .forEach((cur, index, arr) => {
        if (cur.Action === 'Start' && arr[index + 1]?.Action === 'Stop') {
          if (!schedules.value[key]) schedules.value[key] = [];
          schedules.value[key].push({ start: cur.DateTime, end: arr[index + 1].DateTime });
        }
      });
  });
};

/** 需糗水位 */
const requiredWaterLevel = computed(() => {
  try {
    return (data?.value?.Sections || [])
      .find((o) => o.SectionType === 3)
      ?.PLCs.find((o) => o.Tag === '653')?.Value as number;
  } catch (error) {
    return null;
  }
});

/** 滿水位 */
const maxium = computed(() => {
  const MapSections = data?.value?.Gate.MapSection.PLCs || [];
  return Number(MapSections.find((o) => o.Tag === '654')?.Value) ?? 300;
});

/** 目前水位 */
const currentWaterLevel = computed(() => {
  const currentWaterPLCs =
    (data?.value?.Sections || []).find((s) => s.SectionType === 3)?.PLCs || [];
  const obj = currentWaterPLCs.find((o) => o.Tag === '251') as typePLC;

  return {
    name: obj?.Name || '即時水位',
    value: Number(obj?.Value),
    isCurrent: true,
    color: '#00bfff'
  };
});

/** 所有水位 包含警戒、目前水位、枯水位 */
const waterLevels = computed(() => {
  const alertTags = ['606-1', '607-1', '608-1', '619-1', '606', '607', '608', '619'];
  const PLCs = (data?.value?.Sections || []).find((s) => s.SectionType === 2)?.PLCs || [];

  const alerts = PLCs.filter((o) => alertTags.includes(o.Tag)).map(setAlert);

  return [...alerts, currentWaterLevel.value];

  function setAlert(item: typePLC) {
    switch (item.Tag) {
      case '606':
      case '606-1':
        return { name: '一級警戒', value: Number(item.Value), color: '#C1272D' };
      case '607':
      case '607-1':
        return { name: '二級警戒', value: Number(item.Value), color: '#FF7043' };
      case '608':
      case '608-1':
        return { name: '三級警戒', value: Number(item.Value), color: '#8E24AA' };
      case '619':
      case '619-1':
        return { name: '枯水水位', value: Number(item.Value), color: '#FFC000', isDry: true };
      default:
        return { name: '未知水位', value: Number(item.Value), color: '#CCCCCC' };
    }
  }
});

/** 取得可用的幫浦數量，水門會在 svg 內被排除 */
const avaiablePump = computed(() => {
  const pumps =
    data?.value?.Gate.DamSections
      // 僅有 PLC Tag 包含 228 的才是幫浦
      .filter((g) => g.PLCs.some((p) => p.Tag.includes('228')))
      .map((o) => o.DamSectionType.toString()) || [];
  return pumps.map((n) => pumpStatus(n));
});

const pumpStatus = (index: string) => {
  const gateNumber = Number(index);
  const gate = data?.value?.Gate.DamSections.find((o) => o.DamSectionType === gateNumber);
  const gateName = (gate?.Name || '').toString();
  const PLCS = gate?.PLCs;

  const status = {
    gateName,
    index: index,
    isError: getGateTag('181') || false,
    isWorking: getGateTag('479') || false,
    isStop: getGateTag('480') || false,
    isOnline: getGateTag('228') || false,
    /** 電流量 */
    electricValue: getGateTag('279') as number,
    /** 輸出頻率 */
    output: getGateTag('272') as number,
    /** 設定頻率 */
    configOutput: getGateTag('352') as number,
    schedules: schedules.value[gateName] || []
  };

  return {
    ...status,
    statusName: getName(status),
    pumpStatus: pumpStatus(status)
  };

  function getName(st: typeof status) {
    if (st.isWorking) return '運轉中';
    if (st.isStop) return '停止';
    return '';
  }

  function pumpStatus(st: typeof status): 'error' | 'working' | 'online' | 'offline' {
    if (st.isError) return 'error';
    if (st.isWorking || st.isOnline) return 'working';
    if (st.isStop) return 'online';
    return 'offline';
  }

  function getGateTag(tag: string) {
    return (PLCS || []).find((v) => v.Tag === `${tag}-${gateNumber}`)?.Value;
  }
};

watch(() => props.modelValue, showSchedules, { immediate: true });
</script>
