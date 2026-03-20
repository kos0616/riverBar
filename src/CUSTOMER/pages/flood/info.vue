<template>
  <el-dialog :model-value="modelValue" @close="$emit('close')" title="檢視詳情" width="280">
    <div class="text-center">
      <h2 class="mb-4 text-left">
        <strong class="block text-xl">{{ data?.Site }}</strong>
        <span class="text-lg">{{ data?.Location }}</span>
      </h2>

      <div v-if="data?.HasLocationSetting && avaiableGates.length" class="grid gap-4">
        <table v-loading="loading" class="w-full table-auto border-collapse bg-white">
          <thead>
            <tr>
              <th class="p-0 pb-2">
                <div class="rounded-l-full border-0 bg-[var(--color-label)] px-3 py-2">水門</div>
              </th>
              <th class="p-0 pb-2">
                <div class="border-0 bg-[var(--color-label)] px-3 py-2">開門水位(㎝)</div>
              </th>
              <th class="p-0 pb-2">
                <div class="rounded-r-full border-0 bg-[var(--color-label)] px-3 py-2">設定</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(gate, i) in avaiableGates"
              :key="`gate_${i}`"
              class="transition hover:bg-[var(--color-label)]"
            >
              <td class="border-b border-slate-300 px-3 py-1">{{ gate.Number }}號</td>
              <td class="border-b border-slate-300 px-3 py-1 text-right">
                {{ gate.Value || '-' }}
              </td>
              <td class="border-b border-slate-300 px-3 py-1">
                <el-switch
                  v-if="$WRUD('w')"
                  @click="gate.triggerSwitch"
                  :model-value="gate.isActive"
                  inline-prompt
                  active-text="AUTO"
                  inactive-text="OFF"
                />
                <span v-else>{{ gate.isActive ? 'AUTO' : 'OFF' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-center">
          <el-button
            v-if="data?.HasLocationSetting"
            tag="router-link"
            :to="`/iws/${data?.LocationCode}`"
            :disabled="!$WRUD('r', 'iws')"
            type="primary"
            title="前往圖控"
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
import { computed, ref } from 'vue';
import { type item } from '@/CUSTOMER/Service/WaterLevelGauge';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import { ElMessage, ElMessageBox } from 'element-plus';

const emit = defineEmits(['success', 'close']);

const loading = ref(false);

interface Prop {
  modelValue: boolean;
  data?: item;
}
const prop = defineProps<Prop>();

const PLCs = computed(() => prop.data?.Section?.PLCs || []);

/** 取得水門番號 */
const numberedGates = computed<string[]>(() => {
  /** 以正則表達式取得水門番號 */
  const numbers = PLCs.value
    .map((o) => o.Tag.match(/-(\d+)$/)?.[1] || undefined)
    .filter((str) => typeof str === 'string') as string[];
  const uniqueNumbers: string[] = [...new Set(numbers)];

  return uniqueNumbers;
});

/** 整理出帶番號的水門，或是單一水門，並且賦予水門開關 */
const avaiableGates = computed(() => {
  const arr = numberedGates.value;
  const result = arr.length ? arr.map(generateGate) : [generateGate()];
  return result.filter((o) => o.PLCs.length);

  function generateGate(n?: string) {
    const suffix = n ? `-${n}` : '';
    const datas = PLCs.value.filter((o) =>
      ['669', '431', '432', '433', '312', '612'].some((str) => str + suffix === o.Tag)
    );

    const isActive = getValue(['431', '433', '669'], datas, n) === true;
    const triggerTag = getTriggerTag(datas, n);

    return {
      Number: n || '1',
      PLCs: datas,
      Value: getValue(['312', '612'], datas, n) as number,
      isActive,
      triggerTag,
      triggerSwitch: () => triggerSwitch(isActive, triggerTag, n)
    };
  }

  function getValue(tags: string[], PLCs: typePLC[], n?: string) {
    if (n) return PLCs.find((o) => tags.some((str) => o.Tag === `${str}-${n}`))?.Value;
    return PLCs.find((o) => tags.some((str) => str === o.Tag))?.Value;
  }
  type TriggerTag = '431' | '433' | '669';

  /** 獲取可供開關設定的Tag， 注意這邊輸出的 Tag 不會帶 index ex: 669 */
  function getTriggerTag(PLCs: typePLC[], n?: string): TriggerTag | undefined {
    const Tags = ['431', '433', '669'] as const;
    if (n) return Tags.find((str) => PLCs.some((o) => o.Tag === `${str}-${n}`));
    return Tags.find((str) => PLCs.some((o) => o.Tag === str));
  }

  /** 觸發開關 */
  async function triggerSwitch(currentValue: boolean, tag: TriggerTag | undefined, n?: string) {
    /** 欲送出的狀態 */
    const targetValue = !currentValue;
    let allTags: string[] = [];
    let Tag = '';
    const suffix = n ? `-${n}` : '';
    const device = n ? `${n}號水門` : '1號水門';

    switch (tag) {
      case '431':
        Tag = targetValue === true ? '431' + suffix : '432' + suffix;
        allTags = ['431' + suffix, '432' + suffix];
        // open: 431, close 432
        break;
      case '433':
        Tag = targetValue === true ? '433' + suffix : '';
        allTags = ['433' + suffix];
        // opne/close: 433
        break;
      case '669':
        Tag = targetValue === true ? '669' + suffix : '';
        allTags = ['669' + suffix];
        // open/cose: 669
        break;
      default:
        break;
    }

    await controlDeviceByTag(targetValue, Tag, allTags, device);
  }
});

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

/** calculatePercent */
// const calculate = (cur?: string, max?: string) => {
//   return Math.floor((Number(cur || '0') / Number(max || '0')) * 100);
// };

// const customColorMethod = (cur?: string) => {
//   const n = Number(cur || 0);
//   if (n < 80) return '#f39c12';
//   if (n > 160) return '#DE3B40FF';
//   return '#3498db';
// };
</script>
