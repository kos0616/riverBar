<template>
  <div v-if="$screenWidth.value >= 768" v-loading="loading">
    <div class="flex-1 items-center sm:flex">
      <strong class="mr-2 text-xl">{{ gateStatus.gateName || `${gateNumber}號水門` }}</strong>
    </div>
    <div class="mt-2 gap-2">
      <div class="flex w-full flex-col gap-2 px-1">
        <template v-if="!gateStatus.isGate">
          <div class="flex gap-[2px]">
            <button
              @click="handleGate('active')"
              :class="{ active: gateStatus.isWorking, disabled: !canEdit }"
              class="btn-gate !rounded-r-none rounded-l-lg"
            >
              <i
                :class="{ 'fa-beat-fade': gateStatus.isWorking, disabled: !canEdit }"
                class="fa-solid fa-fw fa-play"
              ></i>
              運轉
            </button>

            <button
              @click="handleGate('stop')"
              :class="{ active: gateStatus.isStop, disabled: !canEdit }"
              class="btn-gate !rounded-l-none rounded-r-lg"
            >
              <i class="fa-solid fa-fw fa-stop"></i>
              停止
            </button>
          </div>
          <div class="rounded-md border-4 border-el-success bg-el-success p-2 shadow-sm">
            <div v-for="i in remote" :key="i.name" class="flex items-center space-x-2 px-1">
              <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
              <p class="mb-0 text-gray-800">{{ i.name }}</p>
            </div>
          </div>

          <div class="rounded-md border-4 border-white px-1">
            <div class="flex items-center space-x-2 px-2">
              <div
                class="h-4 w-4 rounded-full border border-gray-400"
                :class="showAlert(gateStatus.isOnline)"
              ></div>
              <p class="mb-0 text-gray-800">運轉狀態</p>
            </div>
          </div>

          <div class="rounded-md bg-[#F9D8C0] p-2 shadow-sm">
            <div class="flex justify-between">
              <p class="mb-0 text-gray-800">電流量(A)</p>
              <strong>{{ gateStatus.electricValue }}</strong>
            </div>
            <div class="flex justify-between">
              <p class="mb-0 text-gray-800">輸出頻率(Hz)</p>
              <strong>{{ gateStatus.outputValue }}</strong>
            </div>
            <div class="flex justify-between">
              <p class="mb-0 text-gray-800">設定頻率(Hz)</p>
              <div>
                <el-tooltip content="編輯設定頻率">
                  <button
                    @click="handleEditHz"
                    class="rounded-md bg-white px-3 hover:bg-zinc-100"
                    type="button"
                  >
                    {{ gateStatus.configOutputValue }}
                  </button>
                </el-tooltip>
              </div>
            </div>
            <div class="flex items-center space-x-2 px-2">
              <div
                class="h-4 w-4 rounded-full border border-gray-400"
                :class="showAlert(gateStatus.isError)"
              ></div>
              <p class="mb-0 text-gray-800">故障狀態</p>
            </div>
          </div>
        </template>

        <div v-if="gateStatus.isGate" class="rounded-md bg-el-success p-2 shadow-sm">
          <div
            v-for="i in allStatus"
            :key="i.name"
            v-show="i.avaiable !== false"
            class="flex items-center space-x-2"
          >
            <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
            <p class="mb-0 text-gray-800">{{ i.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <card
    v-else
    v-loading="loading"
    :style="`--bg-color: ${gateStatus.isGate ? '#5c8a9b' : '#ed7d2d'}`"
  >
    <template #header>
      <div class="flex text-white">
        <small class="fa-stack">
          <i class="fa-solid fa-circle fa-inverse fa-stack-2x"></i>
          <i class="fa-stack-1x fa-solid fa-gauge text-[var(--bg-color)]"></i>
        </small>
        <span> {{ gateStatus.gateName || `${gateNumber}號水門` }}</span>
      </div>
    </template>
    <div class="grid gap-4 py-2">
      <div v-if="$WRUD('w') && !gateStatus.isGate" class="grid grid-cols-2 gap-1 text-2xl">
        <button
          @click="handleGate('active')"
          :class="{ active: gateStatus.isWorking }"
          class="btn-gate !rounded-r-none rounded-l-lg"
        >
          <i :class="{ 'fa-beat-fade': gateStatus.isWorking }" class="fa-solid fa-fw fa-play"></i>
          運轉
        </button>

        <button
          @click="handleGate('stop')"
          :class="{ active: gateStatus.isStop }"
          class="btn-gate !rounded-l-none rounded-r-lg"
        >
          <i class="fa-regular fa-fw fa-circle-stop"></i>
          停止
        </button>
      </div>

      <div class="grid grid-cols-2">
        <div v-for="i in remote" :key="i.name" class="flex items-center space-x-2">
          <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
          <p class="mb-0 text-gray-800">{{ i.name }}</p>
        </div>
        <div v-for="i in allStatus" :key="i.name" class="flex items-center space-x-2">
          <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
          <p class="mb-0 text-gray-800">{{ i.name }}</p>
        </div>
        <div v-if="!gateStatus.isGate" class="flex items-center space-x-2">
          <div
            class="h-4 w-4 rounded-full border border-gray-400"
            :class="showAlert(gateStatus.isOnline)"
          ></div>
          <p class="mb-0 text-gray-800">運轉狀態</p>
        </div>
      </div>

      <div v-if="!gateStatus.isGate" class="rounded-md bg-[#F9D8C0] p-2 shadow-sm">
        <div class="flex justify-between">
          <p class="mb-0 text-gray-800">電流量(A)</p>
          <strong>{{ gateStatus.electricValue }}</strong>
        </div>
        <div class="flex justify-between">
          <p class="mb-0 text-gray-800">輸出頻率(Hz)</p>
          <strong>{{ gateStatus.outputValue }}</strong>
        </div>
        <div class="flex justify-between">
          <p class="mb-0 text-gray-800">設定頻率(Hz)</p>
          <div>
            <el-tooltip content="編輯設定頻率">
              <button
                @click="handleEditHz"
                class="rounded-md bg-white px-3 hover:bg-zinc-100"
                type="button"
              >
                {{ gateStatus.configOutputValue }}
              </button>
            </el-tooltip>
          </div>
        </div>
        <div class="flex items-center space-x-2 px-2">
          <div
            class="h-4 w-4 rounded-full border border-gray-400"
            :class="showAlert(gateStatus.isError)"
          ></div>
          <p class="mb-0 text-gray-800">故障狀態</p>
        </div>
      </div>
    </div>
  </card>
</template>

<script lang="ts" setup>
import { ref, computed, getCurrentInstance } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import showAlert from '../../../lib/showAlertCss';
import editState from '@/CUSTOMER/Service/editState';
import { emitter } from '@/CUSTOMER/plugins/bus';
import card from '@/CUSTOMER/components/card.vue';

interface Prop {
  // '1' | '2' | '3' | '4'
  gateNumber: string;
  modelValue?: typeGate;
  allGates: string[];
}
const props = defineProps<Prop>();

const loading = ref(false);
const route = useRoute();

const getWRUD = (str: 'u' | 'r' | 'w' | 'd') => {
  if (!getCurrentInstance()) {
    console.error('getCurrentInstance is null');
    return false;
  }
  return getCurrentInstance()!.appContext.config.globalProperties.$WRUD(str);
};

const canEdit = getWRUD('w');

const gateStatus = computed(() => generateGate(props.gateNumber));

/**
 * 抽水馬達鎖
 * 只要啟用中的抽水馬達有 2部以上，便無法運轉其他馬達 */
const isMotorLocked = computed(() => {
  const activeMotors = props.allGates
    .map((o) => generateGate(o))
    .filter((o) => o.isGate === false && o.isWorking === true).length;
  return activeMotors >= 2;
});

function generateGate(index: string) {
  const gateNumber = Number(index);

  const gate = props.modelValue?.Gate.DamSections.find((o) => o.DamSectionType === gateNumber);
  const gateName = gate?.Name || `${gateNumber}號水門`;
  const PLCS = gate?.PLCs;
  const isOpening = getGateTag('217') || false;
  const isClosing = getGateTag('218') || false;

  return {
    isGate: typeof getGateTag('228') === 'undefined',
    gateName,
    isOpened: getGateTag('215') || false,
    isClosed: getGateTag('216') || false,
    isOpening,
    isClosing,
    isMotorOn: getGateTag('201'),

    isSiteOperation: getGateTag('205') || false,
    isRemoteOperation: getGateTag('204') || false,

    /** 幫浦系列參數 */
    /** 故障狀態 */
    isError: getGateTag('181') || false,
    isWorking: getGateTag('479') || false,
    isStop: getGateTag('480') || false,
    /** 運轉狀態 */
    isOnline: getGateTag('228') || false,
    /** 電流量 */
    electricValue: getGateTag('279') as number,
    /** 輸出頻率 */
    outputValue: getGateTag('272') as number,
    /** 設定頻率 */
    configOutputValue: getGateTag('352') as number
  };

  function getGateTag(tag: string) {
    return (PLCS || []).find((v) => v.Tag === `${tag}-${gateNumber}`)?.Value;
  }
}

const remote = computed(() => {
  const Site = gateStatus.value.isSiteOperation;
  const Remote = gateStatus.value.isRemoteOperation;

  return [
    {
      name: '現場操作',
      class: showAlert(Site)
    },
    {
      name: '遠端操作',
      class: showAlert(Remote)
    }
  ];
});

const allStatus = computed(() => {
  if (!gateStatus.value.isGate) return [];
  const g01 = gateStatus.value;
  return [
    {
      name: '全開',
      class: showAlert(g01.isOpened)
    },
    {
      name: '全關',
      class: showAlert(g01.isClosed)
    },
    {
      name: '閘門上升中',
      class: showAlert(g01.isOpening, { activeClass: 'gate-active' })
    },
    {
      name: '閘門下降中',
      class: showAlert(g01.isClosing, { activeClass: 'gate-active' })
    },
    {
      name: '機頭/配電盤',
      class: showAlert(g01.isMotorOn),
      avaiable: typeof g01.isMotorOn === 'boolean'
    }
  ];
});

const handleGate = async (status: 'active' | 'stop') => {
  if (!canEdit) {
    ElMessageBox.alert('您未被授權操作，若要操作，請聯絡相關工作人員。', '權限不足');
    return;
  }
  const isSiteControl = gateStatus.value.isSiteOperation;

  if (isSiteControl) {
    ElMessageBox.alert(
      '目前設備為現場控制模式，無法遠端操控，請人員至現場進行控制。',
      '現場控制中'
    );
    return;
  }
  if (status === 'active' && isMotorLocked.value === true) {
    ElMessageBox.alert('運轉中的幫浦已達最大值 2部，請先停止其他抽水幫浦再進行啟用', '操作失敗');
    return;
  }

  const gate = props.gateNumber;
  const allTags = [`479-${gate}`, `480-${gate}`];
  const store = gateStatus.value;
  let openTags;
  if (status === 'active') openTags = `479-${gate}`;
  if (status === 'stop') openTags = `480-${gate}`;
  if (typeof openTags !== 'string') return;
  await controlBtn(status, { openTags, allTags }, store.gateName);
};

/** 三相開關 */
const controlBtn = async (
  status: 'active' | 'stop',
  req: { openTags: string; allTags: string[] },
  device: string
) => {
  const code = route.params.id as string;

  try {
    const action = getAction(status);
    await ElMessageBox.confirm(`請確認操作——${device}${action}。`, {
      type: 'info',
      center: true,
      showClose: false
    });

    const { openTags, allTags } = req;
    await sendControlSwitch({ code, openTags, allTags });
    ElMessage.success(`準備${action}${device}`);
    emitter.emit('refreshIws');
  } catch (e) {
    if ((e as string) === 'cancel') {
      return;
    } else if (typeof e === 'string') {
      ElMessage.warning('操作失敗: ' + e);
    }
  }

  function getAction(status: 'active' | 'stop') {
    const actions = { active: '運轉', stop: '停止' };
    return actions[status];
  }
};
/** 編輯設定頻率 */
const handleEditHz = async () => {
  const gate = props.gateNumber;
  const store = gateStatus.value;
  await editDeviceNumberByTag(store.configOutputValue || 0, `352-${gate}`);
};

/** 修改點位數字 */
const editDeviceNumberByTag = async (currentValue: number | string, Tag: string) => {
  const code = route.params.id as string;

  try {
    const Value = await ElMessageBox.prompt('請輸入指定的頻率', '編輯設定頻率', {
      inputType: 'number',
      inputPattern: /^\d+(\.\d+)*$/,
      inputValue: `${currentValue || ''}`,
      inputErrorMessage: '請確認格式為數字'
    }).then(async ({ value }) => Number(value));

    loading.value = true;
    await editState({ code, Tags: [{ Value, Tag }] });
    ElMessage.success(`設定頻率調整為 ${Value}Hz`);
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
</script>

<style lang="scss">
.gate-active {
  animation: gate-brighter 1.5s infinite;
}

@keyframes gate-brighter {
  0%,
  49%,
  100% {
    background: #ea232f;
    border-color: rgb(154, 21, 21);
  }

  50%,
  99% {
    background: #3dcb61;
    border-color: green;
  }
}
</style>
