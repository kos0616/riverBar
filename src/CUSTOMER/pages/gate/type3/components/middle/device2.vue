<template>
  <div class="flex flex-col gap-3 overflow-hidden p-3 pb-10">
    <waterLevelBall
      :model-value="waterLevels"
      :requiredWaterLevel="requiredWaterLevel"
    ></waterLevelBall>
    <div class="relative flex items-end">
      <global
        :maxium="maxium"
        :model-value="currentWaterLevel.value"
        :labels="waterLevels"
        class="absolute bottom-0 z-[1]"
      ></global>
      <waterLevel :model-value="waterLevels" :maxium="maxium"></waterLevel>
      <tofu
        :status-name="damStatus.name"
        :deg="damStatus.gateOpenDegree"
        :status="damStatus.status"
        :maxium="maxium"
        :water-level="currentWaterLevel.value"
      ></tofu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import waterLevel from '../../../components/graphics/waterLevel/basic.vue';
import global from '../../../components/graphics/waterLevel/global.vue';
import waterLevelBall from '../../../components/graphics/waterLevel/ball.vue';
import tofu from '../../../components/graphics/dam_tofu/index.vue';

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

const damStatus = computed(() => {
  const gateOpenDegree = getTag('259') as number;

  const status = {
    // 起立中
    isClosing: getTag('463'),
    // 倒伏中
    isOpening: getTag('464'),
    // 起立完成
    isClosed: getTag('220'),
    // 倒伏完成
    isOpened: getTag('219'),
    // 馬達異常+3E故障 || 馬達過載
    isMotorError: getTag('178') || getTag('111'),
    // 機箱操作
    isMotorOnline: getTag('459'),
    gateOpenDegree
  };
  return {
    ...status,
    name: getName(status),
    direction: getDirection(status),
    status: getStatus(status)
  };

  function getStatus(st: typeof status): 'error' | 'working' | 'online' | 'offline' {
    if (st.isMotorError) return 'error';
    if (st.isClosing || st.isOpening) return 'working';
    if (st.isOpened || st.isClosed) return 'online';
    return 'offline';
  }

  function getName(st: typeof status) {
    if (st.isClosed) return '起立完成';
    if (st.isOpened) return '倒伏完成';
    if (st.isClosing) return '起立中';
    if (st.isOpening) return '倒伏中';
    return '';
  }

  function getDirection(
    st: typeof status
  ): 'opening' | 'closing' | 'opened' | 'closed' | undefined {
    if (st.isClosed) return 'closed';
    if (st.isOpened) return 'opened';
    if (st.isClosing) return 'closing';
    if (st.isOpening) return 'opening';
    return undefined;
  }

  function getTag(tag: string) {
    try {
      return data?.value?.Gate.DamSections.find((o) => o.DamSectionType === 0)?.PLCs.find(
        (o) => o.Tag === tag
      )?.Value as boolean | number;
    } catch (error) {
      return null;
    }
  }
});
</script>
