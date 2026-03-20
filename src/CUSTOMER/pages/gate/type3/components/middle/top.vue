<template>
  <div class="gap-2 sm:flex">
    <div
      class="grid grow gap-4 rounded bg-gray-200 p-2 sm:grid-cols-2 md:grid-cols-3 xl:flex xl:grow-0"
    >
      <spotlight :modelValue="data"></spotlight>
      <waterLevelAlertNumber :model-value="data"></waterLevelAlertNumber>
      <card style="--bg-color: #67e8f9" title="水位狀態" icon="fa-solid fa-water">
        <div class="flex h-full flex-col justify-between gap-2">
          <div>
            超全開極限開度
            <button
              v-if="$WRUD('w')"
              @click="editGateMaxiumOpen"
              type="button"
              class="group flex w-full items-center rounded border p-1 px-3 hover:bg-el-primary hover:text-white"
            >
              <i class="fas fa-edit mr-auto text-sm text-gray-500 group-hover:text-inherit"></i>
              <strong class="mr-1">{{ gateMaxiumOpen }}</strong>
              度
            </button>
            <div v-else class="text-end">
              <strong class="mr-1">{{ gateMaxiumOpen }}</strong>
              度
            </div>
          </div>

          <div>
            自動倒伏水位
            <button
              v-if="$WRUD('w')"
              @click="editAutoDownValue"
              type="button"
              class="group flex w-full items-center rounded border p-1 px-3 hover:bg-el-primary hover:text-white"
            >
              <i class="fas fa-edit mr-auto text-sm text-gray-500 group-hover:text-inherit"></i>
              <strong class="mr-1">{{ gateAutoDownValue }}</strong>
              ㎝
            </button>
            <div v-else class="text-end">
              <strong class="mr-1">{{ gateAutoDownValue }}</strong>
              ㎝
            </div>
          </div>

          <label
            title="設定自動倒伏模式"
            class="group flex items-center justify-between"
            role="button"
          >
            <span class="group-hover:text-el-danger"> 自動倒伏模式 </span>
            <el-switch
              v-if="$WRUD('w')"
              @click="switchGateAutoCloseMode"
              :model-value="gateAutoCloseMode"
              inline-prompt
              active-text="ON"
              inactive-text="OFF"
            />
            <span v-else class="pl-1">{{ gateAutoCloseMode ? 'ON' : 'OFF' }}</span>
          </label>
        </div>
      </card>
    </div>

    <div
      v-if="$screenWidth.value > 767"
      class="flex flex-col gap-4 rounded bg-gray-200 p-2 lg:flex-row xl:grow"
    >
      <div class="flex flex-col gap-2">
        <tag
          v-for="(tag, i) in tags"
          :key="`tag${i}`"
          @click="
            $confirm('請確認是否要前往查看趨勢圖').then(() => {
              $router.push(showRouter(tag.tag));
            })
          "
          :title="tag.title"
          :value="tag.value"
          unit="㎝"
          style="--bg-color: #06b6d4"
          class="cursor-pointer"
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
import card from '@/CUSTOMER/components/card.vue';
import tag from '@/CUSTOMER/components/tag.vue';
import { $gate } from '@/CUSTOMER/provide';
import spotlight from '../../../components/spotlight.vue';
import waterLevelAlertNumber from '../../../components/waterLevelAlertNumber.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import editState from '@/CUSTOMER/Service/editState';
import { useRoute } from 'vue-router';
import fixFloat from '@/CUSTOMER/utils/fixFloat';
import { emitter } from '@/CUSTOMER/plugins/bus';

const data = inject($gate);
const route = useRoute();
const loading = ref(false);

const showRouter = (tag: string) => {
  const site = data?.value?.SiteCode;
  const location = data?.value?.LocationCode;
  const GateType = data?.value?.Gate.GateType;
  const Type = GateType === 4 ? 2 : GateType;
  const locationName = data?.value?.Name;

  return `/chart?id=${site}.${location}.${tag}&Name=${locationName}&Type=${Type}`;
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

const tags = computed(() => {
  return [
    {
      title: '即時水位',
      value: fixFloat(currentWaterHeight.value as number),
      tag: '251'
    },
    {
      title: '警戒水位',
      value: alertWaterHeight.value,
      tag: '251'
    },
    {
      title: '滿水位',
      value: maxiumWaterLevel.value,
      tag: '251'
    },
    {
      title: '貯水位',
      value: storedWaterLevel.value,
      tag: '251'
    }
  ];
});

const getTag = (tag: string) => {
  try {
    return data?.value?.Gate.MapSection.PLCs.find((o) => o.Tag === tag)?.Value;
  } catch (error) {
    return '-';
  }
};
/** 儲水位 */
const storedWaterLevel = computed(() => getTag('653'));
/** 滿水位 */
const maxiumWaterLevel = computed(() => getTag('654'));
/** 水位計 */
const currentWaterHeight = computed(() => getTag('251'));
/** 警戒水位 */
const alertWaterHeight = computed(() => getTag('605'));

const getDamTag = (tag: string) => {
  try {
    return data?.value?.Sections.find((o) => o.SectionType === 7)?.PLCs.find((o) => o.Tag === tag)
      ?.Value as number | boolean;
  } catch (error) {
    return '-';
  }
};

// 超全開極限開度
const gateMaxiumOpen = computed(() => getDamTag('320') as number);
// 自動倒伏水位
const gateAutoDownValue = computed(() => getDamTag('314') as number);
const gateAutoCloseMode = computed(() => getDamTag('369') as boolean);

const editGateMaxiumOpen = async () => {
  const message = '請輸入超全開極限開度 (㎝)';
  await editDeviceNumberByTag(gateMaxiumOpen.value, '320', message);
};

const editAutoDownValue = async () => {
  const message = '請輸入自動倒伏水位 (㎝)';
  await editDeviceNumberByTag(gateAutoDownValue.value, '314', message);
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

// 改變自動關門模式
const switchGateAutoCloseMode = async () => {
  const currentValue = gateAutoCloseMode.value;
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  // 單一開關判定 369
  const allTags = ['369'];
  let Tag;

  if (targetValue === true) {
    Tag = '369';
  } else {
    Tag = [];
  }
  await controlDeviceByTag(targetValue, Tag, allTags, '自動關門模式');
};

/** 開關 */
const controlDeviceByTag = async (
  targetValue: boolean,
  openTags: string | string[],
  allTags: string[],
  device: string
) => {
  const action = targetValue === true ? '啟動' : '關閉';
  try {
    await ElMessageBox.confirm(`請確認操作——${action}${device}。`, {
      type: 'info',
      center: true,
      showClose: false
    });

    loading.value = true;
    const code = route.params.id as string;
    await sendControlSwitch({ code, openTags, allTags });
    ElMessage.success(`${device}已成功${action}`);
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
</script>
