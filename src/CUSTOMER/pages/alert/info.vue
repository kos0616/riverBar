<template>
  <el-dialog :model-value="modelValue" @close="$emit('close')" width="350" title="檢視詳情">
    <div class="grid gap-4">
      <div class="flex items-center">
        <h2 class="text-left">
          <strong class="block text-xl">{{ data?.Site }}</strong>
          <span class="text-lg">{{ data?.Location }}</span>
        </h2>
        <div class="ml-auto">
          <el-button @click="stopAlarm" :disabled="!$WRUD('w')">
            <span :class="{ 'text-el-danger': $WRUD('w') }">
              <i class="fa-solid fa-fw fa-triangle-exclamation"></i>
              暫停通知
            </span>
          </el-button>
        </div>
      </div>

      <div v-if="data?.HasLocationSetting" class="grid gap-5 text-center">
        <table v-loading="loading" class="w-full table-auto border-collapse bg-white">
          <thead>
            <tr>
              <th class="p-0 pb-2">
                <div class="rounded-l-full border-0 bg-[var(--color-label)] px-3 py-2">類別</div>
              </th>
              <th class="p-0 pb-2">
                <div class="border-0 bg-[var(--color-label)] px-3 py-2">觸發水位</div>
              </th>
              <th class="p-0 pb-2">
                <div class="rounded-r-full border-0 bg-[var(--color-label)] px-3 py-2">設定</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="transition hover:bg-[var(--color-label)]">
              <td class="text-nowrap border-b border-slate-300 px-3 py-1">一級警戒</td>
              <td class="border-b border-slate-300 px-3 py-1 text-right">
                {{ data?.FirstAlertWaterLevel || '-' }}
                ㎝
              </td>
              <td class="border-b border-slate-300 px-3 py-1">
                <el-switch
                  v-if="$WRUD('w')"
                  @click="triggerSwitch(1, data?.IsFirstAlertEnabled)"
                  :model-value="data?.IsFirstAlertEnabled || false"
                  inline-prompt
                  active-text="ON"
                  inactive-text="OFF"
                />
                <span v-else>{{ data?.IsFirstAlertEnabled ? 'ON' : 'OFF' }}</span>
              </td>
            </tr>
            <tr class="transition hover:bg-[var(--color-label)]">
              <td class="text-nowrap border-b border-slate-300 px-3 py-1">二級警戒</td>
              <td class="border-b border-slate-300 px-3 py-1 text-right">
                {{ data?.SecondAlertWaterLevel || '-' }}
                ㎝
              </td>
              <td class="border-b border-slate-300 px-3 py-1">
                <el-switch
                  v-if="$WRUD('w')"
                  @click="triggerSwitch(2, data?.IsSecondAlertEnabled)"
                  :model-value="data?.IsSecondAlertEnabled || false"
                  inline-prompt
                  active-text="ON"
                  inactive-text="OFF"
                />
                <span v-else>{{ data?.IsSecondAlertEnabled ? 'ON' : 'OFF' }}</span>
              </td>
            </tr>
            <tr class="transition hover:bg-[var(--color-label)]">
              <td class="text-nowrap border-b border-slate-300 px-3 py-1">三級警戒</td>
              <td class="border-b border-slate-300 px-3 py-1 text-right">
                {{ data?.ThirdAlertWaterLevel || '-' }}
                ㎝
              </td>
              <td class="border-b border-slate-300 px-3 py-1">
                <el-switch
                  v-if="$WRUD('w')"
                  @click="triggerSwitch(3, data?.IsThirdAlertEnabled)"
                  :model-value="data?.IsThirdAlertEnabled || false"
                  inline-prompt
                  active-text="ON"
                  inactive-text="OFF"
                />
                <span v-else>{{ data?.IsThirdAlertEnabled ? 'ON' : 'OFF' }}</span>
              </td>
            </tr>
            <tr class="transition hover:bg-[var(--color-label)]">
              <td class="text-nowrap border-b border-slate-300 px-3 py-1">枯水</td>
              <td class="border-b border-slate-300 px-3 py-1 text-right">
                {{ data?.LowWaterLevel || '-' }}
                ㎝
              </td>
              <td class="border-b border-slate-300 px-3 py-1">
                <el-switch
                  v-if="$WRUD('w')"
                  @click="triggerSwitch(0, data?.IsLowWaterAlertEnabled)"
                  :model-value="data?.IsLowWaterAlertEnabled || false"
                  inline-prompt
                  active-text="ON"
                  inactive-text="OFF"
                />
                <span v-else>{{ data?.IsLowWaterAlertEnabled ? 'ON' : 'OFF' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-center">
          <el-button
            v-if="data?.HasLocationSetting"
            tag="router-link"
            :to="`/iws/${data?.LocationCode}`"
            title="前往圖控"
            type="primary"
            :disabled="!$WRUD('r', 'iws')"
          >
            <i class="fa-solid fa-fw fa-chalkboard-user mr-1"></i>
            前往圖控
          </el-button>
        </div>
      </div>

      <h2 v-else class="text-lg">此水文設備並無閘控系統</h2>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import { ElMessage, ElMessageBox } from 'element-plus';
import { type item } from '@/CUSTOMER/Service/WaterLevelGauge';
import StopWaterLevelAlarm from '@/CUSTOMER/Service/system/StopWaterLevelAlarm';
const emit = defineEmits(['success', 'close']);

const loading = ref(false);

interface Prop {
  modelValue: boolean;
  data?: item;
}
const prop = defineProps<Prop>();

/** 觸發開關 */
const triggerSwitch = async (level: 0 | 1 | 2 | 3, currentValue?: boolean | null) => {
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  let allTags: string[] = [];
  let Tag = '';
  let device = '未知裝置';

  switch (level) {
    /** 枯水 */
    case 0:
      device = '枯水警戒開關';
      Tag = targetValue === true ? '675' : '';
      allTags = ['675'];
      break;
    case 1:
      device = '一級警戒開關';
      Tag = targetValue === true ? '672' : '';
      allTags = ['672'];
      break;
    case 2:
      device = '二級警戒開關';
      Tag = targetValue === true ? '673' : '';
      allTags = ['673'];
      break;
    case 3:
      device = '三級警戒開關';
      Tag = targetValue === true ? '674' : '';
      allTags = ['674'];
      break;
    default:
      break;
  }

  await controlDeviceByTag(targetValue, Tag, allTags, device);
};

/** 開關 */
const controlDeviceByTag = async (
  targetValue: boolean,
  openTags: string,
  allTags: string[],
  device: string
) => {
  const action = targetValue === true ? '啟動' : '關閉';
  try {
    await ElMessageBox.confirm(`請確認操作——${device}${action}。`, {
      type: 'info',
      center: true,
      showClose: false
    });
    loading.value = true;
    const code = prop.data?.LocationCode;
    if (!code) throw 'code';

    await sendControlSwitch({ code, openTags, allTags });
    ElMessage.success(`${device}已成功${action}`);
    emit('success');
  } catch (e) {
    if ((e as string) === 'cancel') {
      return;
    } else if ((e as string) === 'code') {
      ElMessage.warning('操作失敗: 工作站代碼無效');
      return;
    } else if (typeof e === 'string') {
      ElMessage.warning('操作失敗: ' + e);
    }
  } finally {
    loading.value = false;
  }
};

const stopAlarm = async () => {
  if (!prop.data?.LocationCode) {
    ElMessage.warning('操作失敗: 工作站代碼無效');
    return;
  }
  await StopWaterLevelAlarm(prop.data?.LocationCode, prop.data?.Location);
};
</script>
