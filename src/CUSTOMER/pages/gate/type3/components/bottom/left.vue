<template>
  <div class="col-span-2 grid gap-4 sm:col-span-1 md:block">
    <component
      :is="$screenWidth.value >= 768 ? 'div' : card"
      title="現場燈號"
      style="--bg-color: #e05858; --text-color: white"
      icon="fa-solid fa-triangle-exclamation"
    >
      <div
        class="grid flex-1 grid-cols-2 rounded-md py-2 shadow-sm md:block md:bg-el-warning md:p-2"
      >
        <div v-for="i in data1" :key="i.Name" class="flex items-center space-x-2">
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

    <mobileWaterLevel v-if="$screenWidth.value < 768" class="mb-2"></mobileWaterLevel>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import showAlert from '../../../lib/showAlertCss';
import mobileWaterLevel from '../../../components/mobileWaterLevel.vue';
import card from '@/CUSTOMER/components/card.vue';
import day from 'dayjs';

const data = inject($gate);

/** 取得負面狀態 */
const getDebuff = (tag: string) => {
  try {
    return (
      data?.value?.Sections.find((o) => o.SectionType === 5)?.PLCs.find((o) => o.Tag === tag)
        ?.Value || false
    );
  } catch (error) {
    return false;
  }
};

const data1 = computed(() => {
  try {
    const lists = (data?.value?.Sections || []).find((s) => s.SectionType === 5)?.PLCs;
    const raw_list = lists?.map((item) => {
      /** 針對網路斷線，後端有其他的判斷 */
      const isAlert =
        item.Tag === '168' ? item.Status !== true : chkIsAlert(item.Value, item.Status);

      return {
        ...item,
        class: showAlert(isAlert),
        UpdateTime_f: day(item.UpdateTime).format('YYYY-MM-DD HH:mm:ss')
      };
    });

    const antiTheifIndex = raw_list?.findIndex((o) => o.Tag === '179');
    if (typeof antiTheifIndex === 'number' && antiTheifIndex !== -1) {
      const antiTheif = (raw_list || [])[antiTheifIndex];
      const antiTheifOn = {
        ...antiTheif,
        Name: '防盜系統啟動',
        class: showAlert(getDebuff('179'))
      };
      const antiTheifOff = {
        ...antiTheif,
        Name: '防盜系統解除',
        class: showAlert(getDebuff('179') === false)
      };
      raw_list?.splice(antiTheifIndex, 1, antiTheifOff);
      raw_list?.splice(antiTheifIndex, 0, antiTheifOn);
    }

    return raw_list;
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
