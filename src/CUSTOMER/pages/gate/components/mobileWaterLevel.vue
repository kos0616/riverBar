<template>
  <card style="--bg-color: #00bdd6">
    <template #header>
      <div class="flex items-center text-white">
        <div>
          <small class="fa-stack">
            <i class="fa-solid fa-circle fa-inverse fa-stack-2x"></i>
            <i class="fa-stack-1x fa-solid fa-water text-[var(--bg-color)]"></i>
          </small>
          <span> 即時水位</span>
        </div>
        <div class="ml-auto grid gap-1">
          <div
            v-for="(item, i) in currentWaterLevels"
            :key="`waterLevel${i}`"
            class="flex w-[140px] justify-between rounded bg-white px-2 text-zinc-600"
          >
            {{ item?.name }}
            <span>{{ item.value ?? '-' }}</span>
          </div>
        </div>
      </div>
    </template>
  </card>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import card from '@/CUSTOMER/components/card.vue';

const data = inject($gate);

/** 抽水機形態才會有的有效容量值 */
const waterStorageValue = computed(() => {
  const PLCs = (data?.value?.Sections || []).find((s) => s.SectionType === 3)?.PLCs || [];
  const result = PLCs.find((o) => o.Tag === '267');

  return {
    name: '有效容量',
    value: result?.Value
  };
});

/** 目前水位 */
const currentWaterLevels = computed(() => {
  const currentWaterPLCs =
    (data?.value?.Sections || []).find((s) => s.SectionType === 3)?.PLCs || [];

  const arr = currentWaterPLCs
    .filter((o) => o.Tag.includes('251'))
    .map((o) => {
      const raw_name = o.Name;
      const name = raw_name.match(/(.*)即時水位/)?.[1] || '水位計';

      return {
        name,
        value: o.Value
      };
    });

  /** 僅在有效容量值出現時才加入 */
  if (waterStorageValue.value.value) {
    return [...arr, waterStorageValue.value];
  }

  return arr;
});
</script>
