<template>
  <card
    v-loading="loading"
    style="--bg-color: #fca5a5"
    title="水位警戒"
    icon="fa-solid fa-volume-high"
  >
    <template #header>
      <div class="flex items-center">
        <div>
          <small class="fa-stack">
            <i class="fa-solid fa-circle fa-inverse fa-stack-2x"></i>
            <i class="fa-stack-1x fa-solid fa-volume-high text-[var(--bg-color)]"></i>
          </small>
          <span> 水位警戒</span>
        </div>
        <div v-if="$WRUD('w')" class="ml-auto">
          <el-tooltip content="暫停水位警戒通知">
            <el-button @click="stopAlarm" circle size="small" type="danger">
              <i class="fa-solid fa-bell-slash"></i>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </template>
    <template #body v-if="avaiableGates.length > 1">
      <div class="h-full bg-white">
        <div class="relative overflow-x-auto">
          <table class="w-full table-auto bg-white">
            <thead>
              <tr>
                <td class="border border-slate-300 text-center">
                  <button
                    v-if="$WRUD('w')"
                    @click="dialogEdit = true"
                    title="編輯"
                    type="button"
                    class="w-full hover:bg-slate-200"
                  >
                    <i class="fas fa-cogs text-el-danger"></i>
                  </button>
                </td>
                <th
                  v-for="(item, i) in ['一級', '二級', '三級', '枯水']"
                  :key="`thead1_${i}`"
                  class="text-nowrap border border-slate-300"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in avaiableGates"
                :key="`gate_${i}`"
                class="transition hover:bg-gray-100"
              >
                <th class="text-nowrap border border-slate-300">
                  {{ item.gateName || `${item.Number}號` }}
                </th>
                <td class="text-nowrap border border-slate-300 px-1 text-right">
                  <span :class="{ 'line-through': !item.alertWaterLevel_1_Switch }">
                    {{ showNumber(item.alertWaterLevel_1) }}
                  </span>
                </td>
                <td class="text-nowrap border border-slate-300 px-1 text-right">
                  <span :class="{ 'line-through': !item.alertWaterLevel_2_Switch }">
                    {{ showNumber(item.alertWaterLevel_2) }}
                  </span>
                </td>
                <td class="text-nowrap border border-slate-300 px-1 text-right">
                  <span :class="{ 'line-through': !item.alertWaterLevel_3_Switch }">
                    {{ showNumber(item.alertWaterLevel_3) }}
                  </span>
                </td>
                <td class="text-nowrap border border-slate-300 px-1 text-right">
                  <span :class="{ 'line-through': !item.dryWaterLevelSwitch }">
                    {{ showNumber(item.dryWaterLevel) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <el-dialog v-model="dialogEdit" title="水位警戒調整" width="700">
        <div class="relative overflow-x-auto">
          <table class="w-full table-auto bg-white">
            <thead>
              <tr>
                <th class="w-10 text-nowrap border border-slate-300 px-1">水門/警戒</th>
                <th
                  v-for="(item, i) in ['一級', '二級', '三級', '枯水']"
                  :key="`thead1_${i}`"
                  class="text-nowrap border border-slate-300"
                  colspan="2"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in avaiableGates"
                :key="`gate_${i}`"
                class="transition hover:bg-gray-100"
              >
                <th class="text-nowrap border border-slate-300">{{ item.Number }}號</th>

                <td class="text-nowrap border border-r-0 border-slate-300 px-1 text-right">
                  <button
                    :class="{ 'line-through': !item.alertWaterLevel_1_Switch }"
                    @click="item.editAlertWaterLevel_1"
                    class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
                    type="button"
                  >
                    <i
                      class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"
                    ></i>
                    {{ showNumber(item.alertWaterLevel_1) }}
                    ㎝
                  </button>
                </td>
                <td class="w-10 border border-l-0 border-slate-300 px-1">
                  <el-switch
                    @change="item.triggerAlertWaterLevel_1"
                    :model-value="item.alertWaterLevel_1_Switch || false"
                    inline-prompt
                    active-text="ON"
                    inactive-text="OFF"
                  />
                </td>

                <td class="text-nowrap border border-r-0 border-slate-300 px-1 text-right">
                  <button
                    :class="{ 'line-through': !item.alertWaterLevel_2_Switch }"
                    @click="item.editAlertWaterLevel_2"
                    class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
                    type="button"
                  >
                    <i
                      class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"
                    ></i>
                    {{ showNumber(item.alertWaterLevel_2) }}
                    ㎝
                  </button>
                </td>
                <td class="w-10 border border-l-0 border-slate-300 px-1">
                  <el-switch
                    @change="item.triggerAlertWaterLevel_2"
                    :model-value="item.alertWaterLevel_2_Switch || false"
                    inline-prompt
                    active-text="ON"
                    inactive-text="OFF"
                  />
                </td>

                <td class="text-nowrap border border-r-0 border-slate-300 px-1 text-right">
                  <button
                    :class="{ 'line-through': !item.alertWaterLevel_3_Switch }"
                    @click="item.editAlertWaterLevel_3"
                    class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
                    type="button"
                  >
                    <i
                      class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"
                    ></i>
                    {{ showNumber(item.alertWaterLevel_3) }}
                    ㎝
                  </button>
                </td>
                <td class="w-10 border border-l-0 border-slate-300 px-1">
                  <el-switch
                    @change="item.triggerAlertWaterLevel_3"
                    :model-value="item.alertWaterLevel_3_Switch || false"
                    inline-prompt
                    active-text="ON"
                    inactive-text="OFF"
                  />
                </td>

                <td class="text-nowrap border border-r-0 border-slate-300 px-1 text-right">
                  <button
                    :class="{ 'line-through': !item.dryWaterLevelSwitch }"
                    @click="item.editDryWaterLevel"
                    class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
                    type="button"
                  >
                    <i
                      class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"
                    ></i>
                    {{ showNumber(item.dryWaterLevel) }}
                    ㎝
                  </button>
                </td>
                <td class="w-10 border border-l-0 border-slate-300 px-1">
                  <el-switch
                    @change="item.triggerDryWaterLevel"
                    :model-value="item.dryWaterLevelSwitch || false"
                    inline-prompt
                    active-text="ON"
                    inactive-text="OFF"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-dialog>
    </template>
    <template #default v-if="avaiableGates.length === 1">
      <table class="w-full">
        <tbody>
          <tr class="transition hover:bg-gray-100">
            <th class="text-nowrap">一級</th>
            <td class="w-full px-1">
              <button
                v-if="$WRUD('w')"
                @click="avaiableGates[0].editAlertWaterLevel_1"
                title="一級警戒"
                type="button"
                class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
              >
                <i class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"></i>
                <strong>{{ showNumber(avaiableGates[0].alertWaterLevel_1) || '-' }}</strong>
                ㎝
              </button>
              <div v-else class="text-end">
                <strong>{{ showNumber(avaiableGates[0].alertWaterLevel_1) || '-' }}</strong>
                ㎝
              </div>
            </td>

            <td>
              <el-switch
                @click="avaiableGates[0].triggerAlertWaterLevel_1"
                v-if="typeof avaiableGates[0].alertWaterLevel_1_Switch === 'boolean' && $WRUD('w')"
                :model-value="avaiableGates[0].alertWaterLevel_1_Switch"
                inline-prompt
                active-text="ON"
                inactive-text="OFF"
              />
              <div
                v-else-if="typeof avaiableGates[0].alertWaterLevel_1_Switch === 'boolean'"
                class="pl-2 text-end"
              >
                {{ avaiableGates[0].alertWaterLevel_1_Switch ? 'ON' : 'OFF' }}
              </div>
              <i
                v-else
                title="開關離線中"
                class="fa-solid fa-triangle-exclamation fa-fw cursor-help text-el-danger"
              ></i>
            </td>
          </tr>
          <tr class="transition hover:bg-gray-100">
            <th class="text-nowrap">二級</th>
            <td class="w-full px-1">
              <button
                v-if="$WRUD('w')"
                @click="avaiableGates[0].editAlertWaterLevel_2"
                title="二級警戒"
                type="button"
                class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
              >
                <i class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"></i>
                <strong>{{ showNumber(avaiableGates[0].alertWaterLevel_2) || '-' }}</strong>
                ㎝
              </button>
              <div v-else class="text-end">
                <strong>{{ showNumber(avaiableGates[0].alertWaterLevel_2) || '-' }}</strong>
                ㎝
              </div>
            </td>

            <td>
              <el-switch
                @click="avaiableGates[0].triggerAlertWaterLevel_2"
                v-if="typeof avaiableGates[0].alertWaterLevel_2_Switch === 'boolean' && $WRUD('w')"
                :model-value="avaiableGates[0].alertWaterLevel_2_Switch"
                inline-prompt
                active-text="ON"
                inactive-text="OFF"
              />
              <div
                v-else-if="typeof avaiableGates[0].alertWaterLevel_2_Switch === 'boolean'"
                class="pl-2 text-end"
              >
                {{ avaiableGates[0].alertWaterLevel_2_Switch ? 'ON' : 'OFF' }}
              </div>
              <i
                v-else
                title="開關離線中"
                class="fa-solid fa-triangle-exclamation fa-fw cursor-help text-el-danger"
              ></i>
            </td>
          </tr>

          <tr class="transition hover:bg-gray-100">
            <th class="text-nowrap">三級</th>
            <td class="w-full px-1">
              <button
                v-if="$WRUD('w')"
                @click="avaiableGates[0].editAlertWaterLevel_3"
                title="三級警戒"
                type="button"
                class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
              >
                <i class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"></i>
                <strong>{{ showNumber(avaiableGates[0].alertWaterLevel_3) || '-' }}</strong>
                ㎝
              </button>
              <div v-else class="text-end">
                <strong>{{ showNumber(avaiableGates[0].alertWaterLevel_3) || '-' }}</strong>
                ㎝
              </div>
            </td>

            <td>
              <el-switch
                @click="avaiableGates[0].triggerAlertWaterLevel_3"
                v-if="typeof avaiableGates[0].alertWaterLevel_3_Switch === 'boolean' && $WRUD('w')"
                :model-value="avaiableGates[0].alertWaterLevel_3_Switch"
                inline-prompt
                active-text="ON"
                inactive-text="OFF"
              />
              <div
                v-else-if="typeof avaiableGates[0].alertWaterLevel_3_Switch === 'boolean'"
                class="pl-2 text-end"
              >
                {{ avaiableGates[0].alertWaterLevel_3_Switch ? 'ON' : 'OFF' }}
              </div>
              <i
                v-else
                title="開關離線中"
                class="fa-solid fa-triangle-exclamation fa-fw cursor-help text-el-danger"
              ></i>
            </td>
          </tr>

          <tr class="transition hover:bg-gray-100">
            <th class="text-nowrap">枯水</th>
            <td class="w-full px-1">
              <button
                v-if="$WRUD('w')"
                @click="avaiableGates[0].editDryWaterLevel"
                title="枯水警戒"
                type="button"
                class="group flex w-full items-center rounded border px-1 text-sm hover:bg-el-primary hover:text-white"
              >
                <i class="fas fa-edit mr-auto text-xs text-gray-500 group-hover:text-inherit"></i>
                <strong>{{ showNumber(avaiableGates[0].dryWaterLevel) || '-' }}</strong>
                ㎝
              </button>
              <div v-else class="text-end">
                <strong>{{ showNumber(avaiableGates[0].dryWaterLevel) || '-' }}</strong>
                ㎝
              </div>
            </td>

            <td>
              <el-switch
                @click="avaiableGates[0].triggerDryWaterLevel"
                v-if="typeof avaiableGates[0].dryWaterLevelSwitch === 'boolean' && $WRUD('w')"
                :model-value="avaiableGates[0].dryWaterLevelSwitch"
                inline-prompt
                active-text="ON"
                inactive-text="OFF"
              />
              <div
                v-else-if="typeof avaiableGates[0].dryWaterLevelSwitch === 'boolean'"
                class="pl-2 text-end"
              >
                {{ avaiableGates[0].dryWaterLevelSwitch ? 'ON' : 'OFF' }}
              </div>
              <i
                v-else
                title="開關離線中"
                class="fa-solid fa-triangle-exclamation fa-fw cursor-help text-el-danger"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import editState from '@/CUSTOMER/Service/editState';
import card from '@/CUSTOMER/components/card.vue';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
const route = useRoute();
const loading = ref(false);
import { emitter } from '@/CUSTOMER/plugins/bus';
import StopWaterLevelAlarm from '@/CUSTOMER/Service/system/StopWaterLevelAlarm';

interface Prop {
  modelValue?: typeGate;
}
const props = defineProps<Prop>();

const dialogEdit = ref(false);

const PLCs = computed(
  () => props.modelValue?.Sections.find((o) => o.SectionType === 2)?.PLCs || []
);

/** 取得各水門的警戒番號 */
const numberedGates = computed<string[]>(() => {
  /** 以正則表達式取得水門番號 */
  const numbers = PLCs.value
    .map((o) => o.Tag.match(/-(\d+)$/)?.[1] || undefined)
    .filter((str) => typeof str === 'string') as string[];
  const uniqueNumbers: string[] = [...new Set(numbers)];

  return uniqueNumbers;
});

const alertWaterLevel_1_Tag = '606';
const alertWaterLevel_2_Tag = '607';
const alertWaterLevel_3_Tag = '608';
const dryWaterLevel_Tag = '619';

/** 多重水門時，各級警戒會按照水門調整顯示 */
const avaiableGates = computed(() => {
  const arr = numberedGates.value;
  const result = arr.length ? arr.map(generateGate) : [generateGate()];
  return result.filter((o) => o.PLCs.length);
});

const showNumber = (n?: string | number | null) => {
  if (typeof n === 'string' || typeof n === 'number') {
    const data = Number(n);
    return !isNaN(data) ? Math.floor(data) : '-';
  }
  return '-';
};

const generateGate = (n?: string) => {
  const suffix = n ? `-${n}` : '';
  const datas = PLCs.value.filter((o) =>
    ['606', '607', '608', '619', '672', '673', '674', '675'].some((str) => str + suffix === o.Tag)
  );

  const alertWaterLevel_1 = getValue([alertWaterLevel_1_Tag], datas, n) as number;
  const alertWaterLevel_2 = getValue([alertWaterLevel_2_Tag], datas, n) as number;
  const alertWaterLevel_3 = getValue([alertWaterLevel_3_Tag], datas, n) as number;
  const dryWaterLevel = getValue([dryWaterLevel_Tag], datas, n) as number;

  const alertWaterLevel_1_Switch = getValue(['672'], datas, n) as boolean | undefined;
  const alertWaterLevel_2_Switch = getValue(['673'], datas, n) as boolean | undefined;
  const alertWaterLevel_3_Switch = getValue(['674'], datas, n) as boolean | undefined;
  const dryWaterLevelSwitch = getValue(['675'], datas, n) as boolean | undefined;

  return {
    gateName: getName(),
    Number: n || '1',
    PLCs: datas,
    dryWaterLevel,
    alertWaterLevel_1,
    alertWaterLevel_2,
    alertWaterLevel_3,
    dryWaterLevelSwitch,
    alertWaterLevel_1_Switch,
    alertWaterLevel_2_Switch,
    alertWaterLevel_3_Switch,
    triggerDryWaterLevel: () => switchAlertWaterLevel(dryWaterLevelSwitch, 0, n),
    triggerAlertWaterLevel_1: () => switchAlertWaterLevel(alertWaterLevel_1_Switch, 1, n),
    triggerAlertWaterLevel_2: () => switchAlertWaterLevel(alertWaterLevel_2_Switch, 2, n),
    triggerAlertWaterLevel_3: () => switchAlertWaterLevel(alertWaterLevel_3_Switch, 3, n),
    editDryWaterLevel: () => editAlertLevel(dryWaterLevel, 0, n),
    editAlertWaterLevel_1: () => editAlertLevel(alertWaterLevel_1, 1, n),
    editAlertWaterLevel_2: () => editAlertLevel(alertWaterLevel_2, 2, n),
    editAlertWaterLevel_3: () => editAlertLevel(alertWaterLevel_3, 3, n)
  };

  function getValue(
    tags: string[],
    PLCs: typePLC[],
    n?: string
  ): string | number | boolean | undefined {
    if (n) return PLCs.find((o) => tags.some((str) => o.Tag === `${str}-${n}`))?.Value;
    return PLCs.find((o) => tags.some((str) => str === o.Tag))?.Value;
  }

  function getName() {
    const name = props.modelValue?.Gate.DamSections.find(
      (o) => o.DamSectionType.toString() === n
    )?.Name;
    return typeof name === 'string' ? name.substring(0, 2) : name;
  }
};

/** 修改點位數字 */
const editDeviceNumberByTag = async (
  currentValue: number | string,
  Tag: string,
  device: string
) => {
  const code = route.params.id as string;

  try {
    const Value = await ElMessageBox.prompt('請輸入水位警戒值(㎝)', `修改 ${device}`, {
      inputType: 'number',
      inputPattern: /^\d+(\.\d+)*$/,
      inputValue: `${currentValue || ''}`,
      inputErrorMessage: '請確認格式為數字'
    }).then(async ({ value }) => value);

    loading.value = true;
    await editState({ code, Tags: [{ Value, Tag }] });
    ElMessage.success(`${device} 調整為 ${Value}㎝`);
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

const editAlertLevel = async (
  currentValue: number | undefined,
  alertWaterLevel: 0 | 1 | 2 | 3,
  n?: string
) => {
  const isMulity = Array.isArray(avaiableGates.value) && avaiableGates.value.length > 1;
  let Tag = '';
  let device = '';
  const suffix = n ? `-${n}` : '';
  const deviceName = isMulity ? `${n}號水門` : '';

  switch (alertWaterLevel) {
    case 0:
      Tag = dryWaterLevel_Tag + suffix;
      device = deviceName + '枯水警戒';
      break;
    case 1:
      Tag = alertWaterLevel_1_Tag + suffix;
      device = deviceName + alertWaterLevel + '級水位警戒';
      break;
    case 2:
      Tag = alertWaterLevel_2_Tag + suffix;
      device = deviceName + alertWaterLevel + '級水位警戒';
      break;
    case 3:
      Tag = alertWaterLevel_3_Tag + suffix;
      device = deviceName + alertWaterLevel + '級水位警戒';
      break;
    default:
      break;
  }
  await editDeviceNumberByTag(currentValue || 0, Tag, device);
};

const switchAlertWaterLevel = async (
  currentValue: boolean | undefined,
  alertWaterLevel: 0 | 1 | 2 | 3,
  n?: string
) => {
  const isMulity = Array.isArray(avaiableGates.value) && avaiableGates.value.length > 1;
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  let allTag: string[] = [];
  let Tag = '';
  let device = '';
  const suffix = n ? `-${n}` : '';
  const deviceName = isMulity ? `${n}號水門` : '';

  /** 欲送出的狀態 */

  switch (alertWaterLevel) {
    case 0:
      device = deviceName + '枯水警戒開關';
      Tag = targetValue === true ? '675' + suffix : '';
      allTag = ['675' + suffix];
      break;
    case 1:
      device = deviceName + '一級警戒開關';
      Tag = targetValue === true ? '672' + suffix : '';
      allTag = ['672' + suffix];
      break;
    case 2:
      device = deviceName + '二級警戒開關';
      Tag = targetValue === true ? '673' + suffix : '';
      allTag = ['673' + suffix];
      break;
    case 3:
      device = deviceName + '三級警戒開關';
      Tag = targetValue === true ? '674' + suffix : '';
      allTag = ['674' + suffix];
      break;
    default:
      break;
  }

  await controlDeviceByTag(targetValue, Tag, allTag, device);
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
    await ElMessageBox.confirm(`請確認操作——${action} ${device}。`, {
      type: 'info',
      center: true,
      showClose: false
    });

    loading.value = true;
    const code = route.params.id as string;
    await sendControlSwitch({ code, openTags, allTags });
    ElMessage.success(`${device}已成功${action}`);
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

const stopAlarm = async () => {
  const code = route.params.id as string;
  const name = props.modelValue?.Name || '水位警戒';
  await StopWaterLevelAlarm(code, name);
};
</script>
