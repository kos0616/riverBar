<template>
  <div class="flex flex-col gap-4 p-2 md:flex-row md:rounded md:bg-gray-200">
    <component
      :is="$screenWidth.value >= 768 ? 'div' : card"
      title="現場燈號"
      style="--bg-color: #e05858; --text-color: white"
      icon="fa-solid fa-triangle-exclamation"
    >
      <div
        class="grid grid-cols-2 rounded-md py-2 shadow-sm md:block md:border-4 md:border-el-warning md:bg-el-warning md:p-2"
      >
        <div v-for="i in warning_1" :key="i.Name" class="flex items-center space-x-2 px-1">
          <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
          <p class="mb-0 text-gray-800">
            <el-tooltip :content="`更新於：${i.UpdateTime_f}`">
              <span class="cursor-default">{{ i.Name }}</span>
            </el-tooltip>
            <el-tooltip v-if="i.Status === false" content="裝置異常">
              <i class="fas fa-triangle-exclamation cursor-help" title="裝置異常"></i>
            </el-tooltip>
          </p>
        </div>
      </div>
    </component>

    <mobileWaterLevel v-if="$screenWidth.value < 768"></mobileWaterLevel>

    <component
      :is="$screenWidth.value >= 768 ? 'div' : card"
      style="--bg-color: #ed7d2d; --text-color: white"
    >
      <template #header>
        <div class="flex text-white">
          <small class="fa-stack">
            <i class="fa-solid fa-circle fa-inverse fa-stack-2x"></i>
            <i class="fa-stack-1x fa-solid fa-gauge text-[var(--bg-color)]"></i>
          </small>
          <span> 橡皮壩</span>
          <div class="ml-auto flex w-[140px] justify-between rounded bg-white px-2 text-zinc-600">
            壓力㎏/㎠
            <span>{{ pressure }}</span>
          </div>
        </div>
      </template>
      <div
        class="grid grid-cols-2 rounded-md py-2 shadow-sm md:block md:border-4 md:border-el-success md:bg-el-success md:p-2"
      >
        <template v-for="i in status_1" :key="i.Name">
          <div class="flex items-center space-x-2 px-1">
            <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
            <p class="mb-0 text-gray-800">
              <el-tooltip :content="`更新於：${i.UpdateTime_f}`">
                <span class="cursor-default">{{ i.Name }}</span>
              </el-tooltip>
              <el-tooltip v-if="i.Status === false" content="裝置異常">
                <i class="fas fa-triangle-exclamation cursor-help" title="裝置異常"></i>
              </el-tooltip>
            </p>
          </div>
        </template>
      </div>
      <gateController v-if="$screenWidth.value < 768"></gateController>
    </component>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import card from '@/CUSTOMER/components/card.vue';
const data = inject($gate);
import showAlert from '../../../lib/showAlertCss';
import mobileWaterLevel from '../../../components/mobileWaterLevel.vue';
import gateController from './gateController.vue';
import day from 'dayjs';

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

const warning_1 = computed(() => {
  try {
    const lists = (data?.value?.Sections || []).find((s) => s.SectionType === 5)?.PLCs;
    return lists?.map((item) => {
      /** 針對網路斷線，後端有其他的判斷 */
      const isAlert =
        item.Tag === '168' ? item.Status !== true : chkIsAlert(item.Value, item.Status);

      return {
        ...item,
        class: showAlert(isAlert),
        UpdateTime_f: day(item.UpdateTime).format('YYYY-MM-DD HH:mm:ss')
      };
    });
  } catch (error) {
    return [];
  }
});
const status_1 = computed(() => {
  try {
    const lists = (data?.value?.Sections || []).find((s) => s.SectionType === 6)?.PLCs;
    return lists?.map((item: typePLC) => {
      return {
        ...item,
        class: showAlert(item.Value ? item.Value : false),
        UpdateTime_f: day(item.UpdateTime).format('YYYY-MM-DD HH:mm:ss')
      };
    });
  } catch (error) {
    return [];
  }
});

function chkIsAlert(err: string | boolean | number, st: boolean) {
  const isStatusError = !st;
  const isError = !!err;
  return isStatusError || isError;
}
</script>
