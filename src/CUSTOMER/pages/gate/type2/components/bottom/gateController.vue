<template>
  <div v-if="$screenWidth.value >= 768" v-loading="loading">
    <div class="flex-1 items-center sm:flex">
      <strong class="mr-2 text-xl">{{ gateStatus.gateName || `${gateNumber}號水門` }}</strong>
    </div>
    <div class="mt-2 grid grid-cols-2 gap-2">
      <div class="flex w-full flex-col gap-2 px-1">
        <div class="rounded-md bg-red-300 py-1 text-center text-black opacity-100">
          開度
          <strong>{{ gateStatus.openDegree }}</strong>
          <small class="pl-1">㎝</small>
        </div>
        <div class="flex flex-col gap-[2px]">
          <button
            @click="handleGate('open')"
            :class="{ active: gateStatus.isGateOpenBtnActive, disabled: !canEdit }"
            class="btn-gate"
          >
            <i
              :class="{ 'fa-beat-fade': gateStatus.isGateOpenBtnActive, disabled: !canEdit }"
              class="fa-solid fa-fw fa-angles-up"
            ></i>
            上升
          </button>

          <button
            @click="handleGate('stop')"
            :class="{ active: gateStatus.isGateStopBtnActive, disabled: !canEdit }"
            class="btn-gate"
          >
            <i class="fa-regular fa-fw fa-circle-stop"></i>
            停止
          </button>

          <button
            @click="handleGate('close')"
            :class="{ active: gateStatus.isGateCloseBtnActive, disabled: !canEdit }"
            class="btn-gate"
          >
            <i
              :class="{ 'fa-beat-fade': gateStatus.isGateCloseBtnActive }"
              class="fa-solid fa-fw fa-angles-down"
            ></i>
            下降
          </button>
        </div>

        <div
          v-if="$WRUD('w') && gateStatus.specifyOpenin !== undefined"
          class="flex w-full flex-col gap-2 rounded border bg-gray-100 px-1 py-2"
        >
          <div class="w-full rounded-md py-1 text-center text-black opacity-100">指定開度</div>
          <h1
            @click="handleEditSpecifyOpenin"
            class="group flex items-center rounded border bg-white px-2 text-center text-2xl hover:bg-el-primary hover:text-white"
            role="button"
            title="編輯指定開度"
          >
            <i class="fas fa-edit text-sm text-gray-400 group-hover:text-white"></i>
            <div class="w-full text-right">{{ gateStatus.specifyOpenin }}</div>
            <small>cm</small>
          </h1>
          <button
            @click="handleGateOpenDegree"
            class="w-full rounded-md bg-gray-500 py-1 text-white opacity-100 hover:bg-gray-600"
          >
            {{ gateStatus.startAtSpecifyOpening ? '關閉' : '啟動' }}
          </button>
        </div>
        <div
          v-else-if="gateStatus.specifyOpenin !== undefined"
          class="rounded-md bg-gray-200 py-1 text-center text-black opacity-100"
        >
          指定開度
          <strong> {{ gateStatus.specifyOpenin ?? '-' }}</strong>
          <small class="pl-1">cm</small>
        </div>
      </div>

      <div class="grid gap-2">
        <div class="rounded-md border-4 border-el-success bg-el-success p-2 shadow-sm">
          <div v-for="i in remote" :key="i.name" class="flex items-center space-x-2 px-1">
            <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
            <p class="mb-0 text-gray-800">{{ i.name }}</p>
          </div>
        </div>

        <div class="rounded-md bg-el-success p-2 shadow-sm">
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
        <div
          v-if="Array.isArray(allError) && allError.some((o) => o.avaiable !== false)"
          class="rounded-md bg-el-warning p-2 shadow-sm"
        >
          <div
            v-for="i in allError"
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
  <card v-else v-loading="loading" style="--bg-color: #ed7d2d">
    <template #header>
      <div class="flex text-white">
        <small class="fa-stack">
          <i class="fa-solid fa-circle fa-inverse fa-stack-2x"></i>
          <i class="fa-stack-1x fa-solid fa-gauge text-[var(--bg-color)]"></i>
        </small>
        <span> {{ gateStatus.gateName || `${gateNumber}號水門` }}</span>
        <div class="ml-auto flex w-[140px] justify-between rounded bg-white px-2 text-zinc-600">
          目前開度㎝
          <span>{{ gateStatus.openDegree ?? '-' }}</span>
        </div>
      </div>
    </template>
    <div class="grid gap-4 py-2">
      <div class="grid grid-cols-2">
        <div v-for="i in remote" :key="i.name" class="flex items-center space-x-2">
          <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
          <p class="mb-0 text-gray-800">{{ i.name }}</p>
        </div>
        <div v-for="i in allStatus" :key="i.name" class="flex items-center space-x-2">
          <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
          <p class="mb-0 text-gray-800">{{ i.name }}</p>
        </div>
      </div>

      <div v-if="$WRUD('w')" class="grid gap-1 text-2xl">
        <button
          @click="handleGate('open')"
          :class="{ active: gateStatus.isGateOpenBtnActive }"
          class="btn-gate"
        >
          <i
            :class="{ 'fa-beat-fade': gateStatus.isGateOpenBtnActive }"
            class="fa-solid fa-fw fa-angles-up"
          ></i>
          上升
        </button>

        <button
          @click="handleGate('stop')"
          :class="{ active: gateStatus.isGateStopBtnActive }"
          class="btn-gate"
        >
          <i class="fa-regular fa-fw fa-circle-stop"></i>
          停止
        </button>

        <button
          @click="handleGate('close')"
          :class="{ active: gateStatus.isGateCloseBtnActive }"
          class="btn-gate"
        >
          <i
            :class="{ 'fa-beat-fade': gateStatus.isGateCloseBtnActive }"
            class="fa-solid fa-fw fa-angles-down"
          ></i>
          下降
        </button>
      </div>

      <div
        v-if="gateStatus.specifyOpenin !== undefined && canEdit"
        class="grid gap-2 rounded border bg-gray-100 px-2 py-2"
      >
        <div class="flex gap-2">
          <div class="rounded-md py-1 text-center text-xl text-black opacity-100">指定開度</div>
          <h1
            @click="handleEditSpecifyOpenin"
            class="group flex flex-1 items-center rounded border bg-white px-2 text-center text-2xl hover:bg-el-primary hover:text-white"
            role="button"
            title="編輯指定開度"
          >
            <i class="fas fa-edit text-sm text-gray-400 group-hover:text-white"></i>
            <div class="w-full text-right">{{ gateStatus.specifyOpenin }}</div>
            <small>cm</small>
          </h1>
        </div>
        <button
          @click="handleGateOpenDegree"
          class="w-full rounded-md bg-gray-500 py-1 text-2xl text-white opacity-100 hover:bg-gray-600"
        >
          {{ gateStatus.startAtSpecifyOpening ? '關閉' : '啟動' }}
        </button>
      </div>
      <div
        v-else-if="gateStatus.specifyOpenin !== undefined"
        class="rounded-md bg-gray-200 py-1 text-center text-black opacity-100"
      >
        指定開度
        <strong> {{ gateStatus.specifyOpenin ?? '-' }}</strong>
        <small class="pl-1">cm</small>
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

const gateStatus = computed(() => {
  const gateNumber = Number(props.gateNumber);

  const gate = props.modelValue?.Gate.DamSections.find((o) => o.DamSectionType === gateNumber);
  const gateName = gate?.Name || `${gateNumber}號水門`;
  const PLCS = gate?.PLCs;

  const isGateOpenTooMuch = getGateTag('153');
  const isGateCloseTooMuch = getGateTag('154');
  const is3EError = getGateTag('178');
  /** 馬達過扭力 */
  const isGateOverload = getGateTag('165');

  const isGateOpenBtnActive = getGateTag('466');
  const isGateStopBtnActive = getGateTag('467');
  const isGateCloseBtnActive = getGateTag('468');
  const isOpening = getGateTag('217') || false;
  const isClosing = getGateTag('218') || false;

  /** 指定開度 若為 undefined，則隱藏區塊， null 代表id存在 因此會繼續顯示 */
  const specifyOpenin = getGateTag('317') as number | undefined | null;
  /** 指定開度啟動/關閉 */
  const startAtSpecifyOpening = getGateTag('472');

  return {
    gateName,
    isGateError: isGateCloseTooMuch || isGateOpenTooMuch || is3EError || false,
    isMotorError: isGateOverload || false,
    isOpened: getGateTag('215') || false,
    isClosed: getGateTag('216') || false,
    isOpening,
    isClosing,
    isMotorOn: getGateTag('201'),
    openDegree: getGateTag('259') ?? 0,
    isSiteOperation: getGateTag('205') || false,
    isRemoteOperation: getGateTag('204') || false,
    isGateOverload,
    is3EError,
    isGateOpenTooMuch,
    isGateCloseTooMuch,
    isGateOpenBtnActive: isGateOpenBtnActive && isOpening,
    isGateStopBtnActive: isGateStopBtnActive && !isOpening && !isClosing,
    isGateCloseBtnActive: isGateCloseBtnActive && isClosing,
    specifyOpenin,
    startAtSpecifyOpening
  };

  function getGateTag(tag: string) {
    return (PLCS || []).find((v) => v.Tag === `${tag}-${gateNumber}`)?.Value;
  }
});

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
const allError = computed(() => {
  const g01 = gateStatus.value;
  return [
    {
      name: '過扭力',
      class: showAlert(g01.isGateOverload),
      avaiable: typeof g01.isGateOverload === 'boolean'
    },
    {
      name: '3E Relay欠相',
      class: showAlert(g01.is3EError),
      avaiable: typeof g01.is3EError === 'boolean'
    },
    {
      name: '超全開(ON)',
      class: showAlert(g01.isGateOpenTooMuch),
      avaiable: typeof g01.isGateOpenTooMuch === 'boolean'
    },
    {
      name: '超全關(ON)',
      class: showAlert(g01.isGateCloseTooMuch),
      avaiable: typeof g01.isGateCloseTooMuch === 'boolean'
    }
  ];
});

const handleGate = async (status: 'open' | 'stop' | 'close') => {
  if (!canEdit) {
    ElMessageBox.alert('您未被授權操作，若要操作，請聯絡相關工作人員。', '權限不足');
    return;
  }
  const isSiteControl = gateStatus.value.isSiteOperation;

  if (isSiteControl) {
    ElMessageBox.alert(
      '目前閘控設施為現場控制模式，無法遠端操控，請人員至現場進行控制。',
      '現場控制中'
    );
    return;
  }

  const gate = props.gateNumber;
  const allTags = [`466-${gate}`, `467-${gate}`, `468-${gate}`];
  const store = gateStatus.value;
  let openTags;
  if (status === 'open' && !store.isOpening) openTags = `466-${gate}`;
  if (status === 'stop') openTags = `467-${gate}`;
  if (status === 'close' && !store.isClosing) openTags = `468-${gate}`;
  if (typeof openTags !== 'string') return;
  await controlBtn(status, { openTags, allTags }, store.gateName);
};

/** 三相開關 */
const controlBtn = async (
  status: 'open' | 'stop' | 'close',
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

  function getAction(status: 'open' | 'stop' | 'close') {
    const actions = { open: '上升', stop: '停止', close: '下降' };
    return actions[status];
  }
};

const handleEditSpecifyOpenin = async () => {
  const gate = props.gateNumber;
  const store = gateStatus.value;
  await editDeviceNumberByTag(store.specifyOpenin || 0, `317-${gate}`);
};

/** 修改點位數字 */
const editDeviceNumberByTag = async (currentValue: number | string, Tag: string) => {
  const code = route.params.id as string;

  try {
    const Value = await ElMessageBox.prompt('請輸入指定開度', '編輯指定開度', {
      inputType: 'number',
      inputPattern: /^\d+(\.\d+)*$/,
      inputValue: `${currentValue || ''}`,
      inputErrorMessage: '請確認格式為數字'
    }).then(async ({ value }) => Number(value));

    loading.value = true;
    await editState({ code, Tags: [{ Value, Tag }] });
    ElMessage.success(`指定開度調整為 ${Value}度`);
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

/** 指定開度啟動 */
const handleGateOpenDegree = async () => {
  const gate = props.gateNumber;
  const store = gateStatus.value;
  const currentValue = (store.startAtSpecifyOpening as boolean) || false;
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  // 單一開關判定 472
  const allTags = [`472-${gate}`];
  let Tag;

  if (targetValue === true) {
    Tag = `472-${gate}`;
  } else {
    Tag = [];
  }
  await controlDeviceByTag(targetValue, Tag, allTags, '指定開度');
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
