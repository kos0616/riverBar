<template>
  <card
    v-if="avaiableGates.length"
    v-loading="loading"
    style="--bg-color: #67e8f9"
    title="自動開門設定"
    icon="fa-solid fa-water"
  >
    <div v-if="avaiableGates.length" class="flex h-full flex-col justify-between gap-1">
      <table class="w-full">
        <tbody>
          <tr
            v-for="(gate, i) in avaiableGates"
            :key="`gate_${i}`"
            class="transition hover:bg-gray-100"
          >
            <td class="text-nowrap">
              <el-tooltip v-if="gate.name" :content="gate.name">
                <div class="w-8 overflow-hidden text-clip">{{ gate.name }}</div>
              </el-tooltip>
              <span v-else>{{ gate.Number }}號</span>
            </td>

            <td class="w-full px-1">
              <button
                v-if="$WRUD('w')"
                @click="gate.triggerWaterLevel"
                type="button"
                class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
              >
                <i class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"></i>
                <strong class="">{{ gate.Value || '-' }}</strong>
                ㎝
              </button>
              <div v-else class="text-end">{{ gate.Value || '-' }} ㎝</div>
            </td>

            <td>
              <el-switch
                v-if="$WRUD('w')"
                @click="gate.triggerSwitch"
                :model-value="gate.isActive"
                inline-prompt
                active-text="AUTO"
                inactive-text="OFF"
              />
              <span v-else class="pl-1">{{ gate.isActive ? 'AUTO' : 'OFF' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import card from '@/CUSTOMER/components/card.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import editState from '@/CUSTOMER/Service/editState';
import { emitter } from '@/CUSTOMER/plugins/bus';

interface Prop {
  modelValue?: typeGate;
}
const props = defineProps<Prop>();

const loading = ref(false);

const PLCs = computed(
  () => props.modelValue?.Sections.find((o) => o.SectionType === 7)?.PLCs || []
);

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

    const waterLevelTag = getWaterLevelTag(datas, n);
    const waterLevel = getValue(['312', '612'], datas, n) as number;
    const _name = getName('669', datas, n) || getName('433', datas, n) || `水門${n || '1'}`;
    const name = _name.replace(/自動.*$/, '');
    return {
      name,
      Number: n || '1',
      PLCs: datas,
      /** 自動開門水位 */
      Value: waterLevel,
      isActive,
      triggerTag,
      triggerSwitch: () => triggerSwitch(isActive, triggerTag, n || '1', name),
      /** 變更自動開門水位 */
      triggerWaterLevel: () => triggerWaterLevel(waterLevel, waterLevelTag, n || '1', name)
    };
  }

  function getName(tag: string, PLCs: typePLC[], n?: string) {
    return PLCs.find((o) => o.Tag === `${tag}-${n}`)?.Name;
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

  type WaterLevelTag = '312' | '612';

  /** 獲取可供水位設定的Tag， 注意這邊輸出的 Tag 不會帶 index ex: 312 */
  function getWaterLevelTag(PLCs: typePLC[], n?: string): WaterLevelTag | undefined {
    const Tags = ['312', '612'] as const;
    if (n) return Tags.find((str) => PLCs.some((o) => o.Tag === `${str}-${n}`));
    return Tags.find((str) => PLCs.some((o) => o.Tag === str));
  }

  /** 觸發開關 */
  async function triggerSwitch(
    currentValue: boolean,
    tag: TriggerTag | undefined,
    index: string,
    name: string
  ) {
    /** 欲送出的狀態 */
    const targetValue = !currentValue;
    let allTags: string[] = [];
    let Tag = '';
    const suffix = index ? `-${index}` : '';

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

    await controlDeviceByTag(targetValue, Tag, allTags, name);
  }

  async function triggerWaterLevel(
    currentValue: number,
    tag: WaterLevelTag | undefined,
    index: string,
    name: string
  ) {
    const suffix = index ? `-${index}` : '';
    const Tag = tag + suffix;
    await editDeviceNumberByTag(currentValue, Tag, name);
  }
});

/** 開關 */
const controlDeviceByTag = async (
  targetValue: boolean,
  openTags: string,
  allTags: string[],
  device: string
) => {
  const action = targetValue === true ? '啟動自動開門' : '關閉自動開門';
  try {
    await ElMessageBox.confirm(`請確認操作——${device} ${action}。`, {
      type: 'info',
      center: true,
      showClose: false
    });

    loading.value = true;
    const code = props.modelValue?.LocationCode;
    if (!code) throw 'code';

    await sendControlSwitch({ code, openTags, allTags });
    ElMessage.success(`${device}已成功設置 ${action}`);
    emitter.emit('refreshIws');
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

/** 修改點位數字 */
const editDeviceNumberByTag = async (
  currentValue: number | string,
  Tag: string,
  device: string
) => {
  const code = props.modelValue?.LocationCode;
  if (!code) throw 'code';

  try {
    const Value = await ElMessageBox.prompt('請輸入自動開門水位(㎝)', device, {
      inputType: 'number',
      inputPattern: /^\d+(\.\d+)*$/,
      inputValue: `${currentValue || ''}`,
      inputErrorMessage: '請確認格式為數字'
    }).then(async ({ value }) => value);

    loading.value = true;
    await editState({ code, Tags: [{ Value, Tag }] });
    ElMessage.success(`自動開門水位調整為 ${Value}㎝`);
    emitter.emit('refreshIws');
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
</script>
