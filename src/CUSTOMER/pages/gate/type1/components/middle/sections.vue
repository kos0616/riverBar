<template>
  <div class="gap-2 xl:flex">
    <div class="grid grow gap-4 rounded bg-gray-200 p-2 sm:grid-cols-2 xl:flex xl:grow-0">
      <spotlight :model-value="data"></spotlight>
      <waterLevelAlertNumber :model-value="data"></waterLevelAlertNumber>
    </div>

    <div
      v-if="$screenWidth.value > 767"
      class="flex flex-col gap-4 rounded bg-gray-200 p-2 lg:flex-row"
    >
      <div class="flex flex-col gap-2">
        <tag
          @click="editPLCDownWaterLevel"
          :title="PLCDownWaterLevel.name"
          :value="PLCDownWaterLevel.value"
          :unit="PLCDownWaterLevel.unit"
          style="--bg-color: #dc2626"
          class="cursor-pointer"
        ></tag>
        <tag
          v-for="(item, i) in tags01"
          :key="`tag01_${i}`"
          :title="item.name"
          :value="item.value"
          :unit="item.unit"
          style="--bg-color: #dc2626"
        ></tag>
        <tag
          v-for="(item, i) in tags03"
          :key="`tag01_${i}`"
          :title="item.name"
          :value="item.value"
          :unit="item.unit"
          style="--bg-color: #dc2626"
        ></tag>
      </div>

      <div class="flex flex-col gap-2">
        <tag
          v-for="(item, i) in tags02"
          :key="`tag02_${i}`"
          @click="
            $confirm('請確認是否要前往查看趨勢圖').then(() => {
              $router.push(showRouter(item.tag));
            })
          "
          :title="item.name"
          :value="item.value"
          :unit="item.unit"
          class="cursor-pointer"
          style="--bg-color: #06b6d4"
        ></tag>
        <tag
          @click="editRequiredWaterLevel"
          title="需求水位"
          :value="requiredWaterLevel ?? '-'"
          unit="㎝"
          style="--bg-color: #06b6d4"
          class="cursor-pointer"
        ></tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import tag from '@/CUSTOMER/components/tag.vue';
import { $gate } from '@/CUSTOMER/provide';
import spotlight from '../../../components/spotlight.vue';
import waterLevelAlertNumber from '../../../components/waterLevelAlertNumber.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import fixFloat from '@/CUSTOMER/utils/fixFloat';
import editState from '@/CUSTOMER/Service/editState';
import { useRoute } from 'vue-router';
import { emitter } from '@/CUSTOMER/plugins/bus';

const route = useRoute();
const loading = ref(false);
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

const editRequiredWaterLevel = async () => {
  const message = '請輸入需求水位(㎝)';
  await editDeviceNumberByTag(requiredWaterLevel.value ?? 0, '653', message);
};

/** 修改點位數字 */
const editDeviceNumberByTag = async (
  currentValue: number | string,
  Tag: string,
  message: string
) => {
  const code = route.params.id as string;

  try {
    const Value = await ElMessageBox.prompt(message, '編輯', {
      inputType: 'number',
      inputPattern: /^\d+(\.\d+)*$/,
      inputValue: `${currentValue || ''}`,
      inputErrorMessage: '請確認格式為數字'
    }).then(async ({ value }) => value);

    loading.value = true;
    await editState({ code, Tags: [{ Value, Tag }] });
    ElMessage.success('編輯成功');
    emitter.emit('refreshIws');
  } catch (e) {
    if ((e as string) === 'cancel') {
      return;
    } else if (typeof e === 'string') {
      ElMessage.warning('操作失敗: ' + e);
    }
  } finally {
    loading.value = false;
  }
};

/** PLC倒伏水位 */
const PLCDownWaterLevel = computed(() => {
  let value: number | '' = '';
  try {
    const PLCs = data?.value?.Sections.find((o) => o.SectionType === 4)?.PLCs || [];
    value = (PLCs.find((o) => o.Tag === '304')?.Value as number) || '';
  } catch (error) {
    value = '';
  }
  return {
    value,
    name: 'PLC倒伏水位',
    unit: '㎝'
  };
});

const editPLCDownWaterLevel = async () => {
  const message = '請輸入PLC倒伏水位(㎝)';
  await editDeviceNumberByTag(PLCDownWaterLevel.value.value ?? 0, '304', message);
};

const tags01 = computed(() => {
  const getTag = (tag: string) => {
    try {
      const PLCs = data?.value?.Sections.find((o) => o.SectionType === 4)?.PLCs || [];
      return PLCs.find((o) => o.Tag === tag)?.Value as number;
    } catch (error) {
      return '';
    }
  };
  return [
    {
      value: getTag('303'),
      name: '機械倒伏水位',
      unit: '㎝'
    },
  ];
});

const tags03 = computed(() => {
  const getTag = (tag: string) => {
    try {
      const PLCs = data?.value?.Sections.find((o) => o.SectionType === 4)?.PLCs || [];
      return PLCs.find((o) => o.Tag === tag)?.Value as number;
    } catch (error) {
      return '';
    }
  };
  return [
    {
      value: getTag('311'),
      name: '警戒壓力',
      unit: '㎏/㎠'
    },
    {
      value: getTag('310'),
      name: '極限壓力',
      unit: '㎏/㎠'
    }
  ];
});

const showRouter = (tag: string) => {
  const site = data?.value?.SiteCode;
  const location = data?.value?.LocationCode;
  const GateType = data?.value?.Gate.GateType;
  const Type = GateType === 4 ? 2 : GateType;
  const locationName = data?.value?.Name;

  return `/chart?id=${site}.${location}.${tag}&Name=${locationName}&Type=${Type}`;
};

const tags02 = computed(() => {
  const getTag = (tag: string) => {
    try {
      const PLCs = data?.value?.Sections.find((o) => o.SectionType === 3)?.PLCs || [];
      return PLCs.find((o) => o.Tag === tag)?.Value as number;
    } catch (error) {
      return '';
    }
  };
  return [
    {
      value: fixFloat(getTag('251')),
      name: '即時水位',
      unit: '㎝',
      tag: '251'
    },
    {
      value: getTag('252'),
      name: '警戒壓力',
      unit: '㎏/㎠',
      tag: '251'
    }
  ];
});
</script>
