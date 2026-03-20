<template>
  <div class="flex flex-col gap-3 overflow-clip p-3 pb-10 pt-12">
    <div class="flex items-center gap-2">
      <waterLevelBall
        :model-value="waterLevels"
        :requiredWaterLevel="requiredWaterLevel"
      ></waterLevelBall>
    </div>
    <div class="flex items-end">
      <waterLevel :model-value="waterLevels" :maxium="maxium" class="mr-auto"></waterLevel>
      <rubber
        :status-name="damStatus.name"
        :pressure="pressure"
        :max-pressure="maxPressure"
        :direction="damStatus.direction"
        :maxium="maxium"
        :water-level="currentWaterLevel.value"
      ></rubber>
      <pressureRuler
        :model-value="pressure"
        :max-pressure="maxPressure"
        class="md:pr-[40px] lg:pr-0 xl:pr-[0] 2xl:pr-[62px]"
      ></pressureRuler>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import waterLevel from '../../../components/graphics/waterLevel/basic.vue';
import waterLevelBall from '../../../components/graphics/waterLevel/ball.vue';
import rubber from '../../../components/graphics/dam_rubber/index.vue';
import pressureRuler from '../../../components/graphics/dam_rubber/pressureRuler.vue';

const data = inject($gate);

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

/** 橡皮壩壓力改由警戒壓力進行判斷，若為 null 則由前端預設的0.18取代 */
const maxPressure = computed(() => {
  const PLCs = data?.value?.Sections.find((o) => o.SectionType === 4)?.PLCs || [];
  return PLCs.find((o) => o.Tag === '311')?.Value as number;
});

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

/** 即時壓力 */
const pressure = computed(() => {
  try {
    return (data?.value?.Sections || [])
      .find((o) => o.SectionType === 3)
      ?.PLCs.find((o) => o.Tag === '252')?.Value as number;
  } catch (error) {
    return null;
  }
});

const damStatus = computed(() => {
  const status = {
    isOpened: getBoolean('903'),
    isClosed: getBoolean('901'),
    isOpening: getBoolean('904'),
    isClosing: getBoolean('902'),
    isWorking: getBoolean('412')
  };

  return { ...status, name: getName(status), direction: getDirection(status) };

  function getName(st: typeof status) {
    if (st.isClosed) return '起立完成';
    if (st.isOpened) return '倒伏完成';
    if (st.isClosing) return '起立中';
    if (st.isOpening) return '倒伏中';
    if (st.isWorking) return '動作中';
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
});

const getBoolean = (tag: string) => {
  try {
    const boolean = data?.value?.Gate?.MapSection.PLCs.find((o) => o.Tag === tag)?.Value as boolean;
    return boolean;
  } catch (error) {
    return null;
  }
};
</script>
