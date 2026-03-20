<template>
  <div class="gap-2 sm:flex">
    <div class="grid grow gap-4 rounded bg-gray-200 p-2 sm:grid-cols-2 md:grid-cols-3 xl:grow-0">
      <spotlight :model-value="data"></spotlight>
      <waterLevelAlertNumber :model-value="data"></waterLevelAlertNumber>
      <gateAutoOpenControlNeo :model-value="data"></gateAutoOpenControlNeo>
    </div>
    <div
      v-if="$screenWidth.value > 767"
      class="flex flex-col gap-4 rounded bg-gray-200 p-2 lg:flex-row"
    >
      <div class="flex flex-col gap-2">
        <tag
          v-if="typeof custAvaiableValue.Value === 'number'"
          :title="custAvaiableValue.Name"
          :value="custAvaiableValue.Value ?? '-'"
          :unit="custAvaiableValue.unit"
          style="--bg-color: #06b6d4"
        ></tag>
        <tag
          v-for="(p, index) in PLC"
          :key="index"
          :title="p.name"
          :value="p.value"
          @click="
            $confirm('請確認是否要前往查看趨勢圖', p.name).then(() => {
              $router.push(showRouter(p.tag, p.name));
            })
          "
          unit="㎝"
          class="cursor-pointer"
          :style="`--bg-color: ${p.bg}`"
        ></tag>
        <tag
          @click="editRequiredWaterLevel"
          title="需求水位"
          :value="requiredWaterLevel ?? '-'"
          unit="㎝"
          style="--bg-color: #06b6d4"
          class="cursor-pointer"
        ></tag>
        <tag
          v-for="(p, index) in PLCs"
          :key="`PLC_${index}`"
          :title="p.Name"
          :value="p.Value ?? '-'"
          :unit="p.unit"
          style="--bg-color: #06b6d4"
        ></tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import tag from '@/CUSTOMER/components/tag.vue';
import spotlight from '../../../components/spotlight.vue';
import { $gate } from '@/CUSTOMER/provide';
import gateAutoOpenControlNeo from './gateAutoOpenControlNeo.vue';
import waterLevelAlertNumber from '../../../components/waterLevelAlertNumber.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import fixFloat from '@/CUSTOMER/utils/fixFloat';
import editState from '@/CUSTOMER/Service/editState';
import { useRoute } from 'vue-router';
import { emitter } from '@/CUSTOMER/plugins/bus';

const route = useRoute();
const loading = ref(false);
const data = inject($gate);

const showRouter = (tag: string, name: string) => {
  const site = data?.value?.SiteCode;
  const location = data?.value?.LocationCode;
  const GateType = data?.value?.Gate.GateType;
  const Type = GateType === 4 ? 2 : GateType;
  const locationName = data?.value?.Name;
  return `/chart?id=${site}.${location}.${tag}&Name=${locationName}${name}&Type=${Type}`;
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

/** 取得水位 */
const getWaterLevels = computed(() => {
  return data?.value?.Sections.find((o) => o.SectionType === 3)?.PLCs.filter((o) =>
    o.Tag.includes('251')
  );
});

const PLC = computed(() => {
  return getWaterLevels.value?.map((o) => ({
    value: fixFloat(o.Value as number),
    name: o.Name,
    tag: o.Tag,
    bg: '#06b6d4'
  }));
});

const custAvaiableValue = computed(() => {
  const PLCs = data?.value?.Sections.find((o) => o.SectionType === 3)?.PLCs || [];
  const result = PLCs.find((o) => o.Tag === '267');
  return { ...result, Name: '有效容量', unit: 'm³' };
});

const PLCs = computed(() => {
  const arr = [
    { Tag: '271', Name: '總累積量', unit: 'cms' },
    { Tag: '273', Name: '即時流量', unit: 'cmh' },
    { Tag: '654', Name: '滿水位', unit: '' }
  ];

  const PLCs = data?.value?.Sections.find((o) => o.SectionType === 3)?.PLCs || [];
  return arr.map((item) => {
    const data = PLCs.find((o) => o.Tag === item.Tag);
    return { ...data, ...item, Value: fixFloat(data?.Value as number) };
  });
});
</script>
