<template>
  <div class="flex flex-col gap-3 overflow-hidden p-3 pb-10">
    <waterLevelBall
      :model-value="waterLevels"
      :maxium="maxium"
      :requiredWaterLevel="requiredWaterLevel"
    ></waterLevelBall>

    <div class="relative flex items-end">
      <global
        :maxium="maxium"
        :model-value="currentWaterLevel.value"
        :labels="waterLevels"
        class="absolute bottom-0 z-[1]"
      ></global>
      <waterLevel :model-value="waterLevels" :maxium="maxium" :gateHeight="gateHeight"></waterLevel>
      <decoration
        v-if="avaiableGates.length < 4 && avaiableGates.length !== 0"
        class="hidden xl:block"
      />
      <waterGate
        v-for="(gate, i) in avaiableGates"
        :key="`myGate_${i}`"
        :index="gate.index"
        :status-name="gate.statusName"
        :deg="gate.openDegree"
        :motorStatus="gate.motorStatus"
        :gateStatus="gate.gateStatus"
        :maxium="maxium"
        :water-level="currentWaterLevel.value"
        :direction="gate.direction"
        :gateHeight="gateHeight"
        :gateName="gate.gateName"
      ></waterGate>
      <decoration
        v-if="avaiableGates.length < 4 && avaiableGates.length !== 0"
        class="hidden xl:block"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 水門
 * ** 馬達 與 開度 為 absolute 浮空設置，是為了讓水門高度與水位計對齊 **
 * pb-5 為了讓水門的 開度顯示 有顯示的空間而設定
 */
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import decoration from '../../../components/graphics/dam_gate/decoration.vue';
import waterGate from '../../../components/graphics/dam_gate/index.vue';
import waterLevel from '../../../components/graphics/waterLevel/basic.vue';
import global from '../../../components/graphics/waterLevel/global.vue';
import waterLevelBall from '../../../components/graphics/waterLevel/ball.vue';

const data = inject($gate);

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

/** 水門高度 */
const gateHeight = computed(() => {
  const MapSections = data?.value?.Gate.MapSection.PLCs || [];
  return Number(MapSections.find((o) => o.Tag === '659')?.Value);
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

/** 取得可用的水門數量 */
const avaiableGates = computed(() => {
  const gates = data?.value?.Gate.DamSections.map((o) => o.DamSectionType.toString()) || [];
  return gates.map((n) => gateStatus(n));
});

const gateStatus = (index: string) => {
  const gateNumber = Number(index);
  const gate = data?.value?.Gate.DamSections.find((o) => o.DamSectionType === gateNumber);
  const gateName = (gate?.Name || '').toString();
  const PLCS = gate?.PLCs;

  const isGateOpenTooMuch = getGateTag('153') || false;
  const is3EError = getGateTag('178') || false;
  /** 馬達過扭力 */

  const status = {
    gateName,
    index: index,
    isGateError: isGateOpenTooMuch || is3EError,
    isMotorError: getGateTag('165') || false,
    isOpened: getGateTag('215') || false,
    isClosed: getGateTag('216') || false,
    isOpening: getGateTag('217') || false,
    isClosing: getGateTag('218') || false,
    isMotorOn: getGateTag('201') || false,
    openDegree: getGateTag('259') as number
  };

  return {
    ...status,
    /** 閘門方向 */
    direction: getDirection(status),
    statusName: getName(status),
    motorStatus: motorStatus(status),
    gateStatus: gateStatus(status)
  };

  function getName(st: typeof status) {
    if (st.isClosed) return '全關';
    if (st.isOpened) return '全開';
    if (st.isOpening) return '上升中';
    if (st.isClosing) return '下降中';
    return '';
  }
  function motorStatus(st: typeof status): 'error' | 'working' | 'online' | 'offline' {
    if (st.isMotorError) return 'error';
    if (st.isClosing || st.isOpening) return 'working';
    if (st.isMotorOn) return 'online';
    return 'offline';
  }

  function gateStatus(st: typeof status): 'error' | 'working' | 'online' | 'offline' {
    if (st.isGateError) return 'error';
    if (st.isClosing || st.isOpening) return 'working';
    if (st.isOpened || st.isClosed) return 'online';
    return 'offline';
  }

  function getDirection(st: typeof status): 'opening' | 'closing' | undefined {
    // if (st.isClosed) return 'closed';
    // if (st.isOpened) return 'opened';
    if (st.isClosing) return 'closing';
    if (st.isOpening) return 'opening';
    return undefined;
  }
  function getGateTag(tag: string) {
    return (PLCS || []).find((v) => v.Tag === `${tag}-${gateNumber}`)?.Value;
  }
};
</script>
