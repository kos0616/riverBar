<template>
  <gateController
    v-for="(gateN, i) in avaiableGates"
    :key="`gate${i}`"
    :gateNumber="gateN"
    :model-value="data"
    :all-gates="avaiableGates"
    class="mb-2 rounded-md bg-white p-3 shadow-sm md:mb-0"
  ></gateController>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import gateController from './gateController.vue';

const data = inject($gate);

const avaiableGates = computed<string[]>(() => {
  return (
    (data?.value?.Gate.DamSections || [])
      /** 水門置頂，而水門沒有 228 Tag */
      .sort((a) => (a.PLCs.some((o) => o.Tag.includes('228')) ? 1 : -1))
      .map((o) => o.DamSectionType.toString()) || []
  );
});
</script>
