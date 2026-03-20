<template>
  <gateController
    v-for="(gateN, i) in avaiableGates"
    :key="`gate${i}`"
    :gateNumber="gateN"
    :model-value="data"
    class="mb-2 rounded-md bg-white p-3 shadow-sm md:mb-0"
  ></gateController>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import gateController from './gateController.vue';

const data = inject($gate);

const avaiableGates = computed<string[]>(() => {
  return data?.value?.Gate.DamSections.map((o) => o.DamSectionType.toString()) || [];
});
</script>
