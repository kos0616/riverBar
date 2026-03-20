<template>
  <div
    v-if="$screenWidth.value >= 768"
    class="col-span-4 rounded-md bg-white p-4 shadow-sm"
    v-loading="loading"
  >
    <div class="flex-1 items-center sm:flex">
      <strong class="mr-2 text-xl"> 倒伏堰 </strong>
    </div>
    <div class="mt-2 grid grid-cols-5 gap-4">
      <div>
        <div class="w-full px-1">
          <div class="mb-2 rounded-md bg-red-300 py-1 text-center text-black opacity-100">
            開度
            <strong>{{ A1.gateValue || '-' }}</strong>
            <small class="pl-1">度</small>
          </div>
          <div class="flex flex-col gap-[2px]">
            <button
              @click="handleGate('close')"
              :class="{ active: A1.isGateCloseBtnActive, disabled: !canEdit }"
              class="btn-gate"
            >
              <i
                :class="{ 'fa-beat-fade': A1.isGateCloseBtnActive }"
                class="fa-solid fa-fw fa-angles-up"
              ></i>
              起立
            </button>

            <button
              @click="handleGate('stop')"
              :class="{ active: A1.isGateStopBtnActive, disabled: !canEdit }"
              class="btn-gate"
            >
              <i class="fa-regular fa-fw fa-circle-stop"></i>
              停止
            </button>

            <button
              @click="handleGate('open')"
              :class="{ active: A1.isGateOpenBtnActive, disabled: !canEdit }"
              class="btn-gate"
            >
              <i
                :class="{ 'fa-beat-fade': A1.isGateOpenBtnActive }"
                class="fa-solid fa-fw fa-angles-down"
              ></i>
              倒伏
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="rounded-md border-4 border-el-success bg-el-success p-2 shadow-sm">
          <div v-for="i in remote" :key="i.name" class="flex items-center space-x-2 px-1">
            <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
            <p class="mb-0 text-gray-800">{{ i.name }}</p>
          </div>
        </div>
      </div>
      <div>
        <div class="rounded-md bg-el-success p-2 shadow-sm">
          <div v-for="i in A1.data1" :key="i.name" class="flex items-center space-x-2">
            <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
            <p class="mb-0 text-gray-800">{{ i.name }}</p>
          </div>
        </div>
      </div>
      <div class="col-span-2 sm:col-auto">
        <div class="rounded-md bg-el-warning p-2 shadow-sm">
          <div v-for="i in A1.data2" :key="i.name" class="flex items-center space-x-2">
            <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
            <p class="mb-0 text-gray-800">{{ i.name }}</p>
          </div>
        </div>
      </div>
      <div>
        <div
          v-if="$WRUD('w')"
          class="flex w-full flex-col gap-2 rounded border bg-gray-100 px-1 py-2"
        >
          <div class="w-full rounded-md py-1 text-center text-black opacity-100">指定開度</div>
          <h1
            @click="handleEdit"
            class="group flex items-center rounded border bg-white px-2 text-center text-2xl hover:bg-el-primary hover:text-white"
            role="button"
            title="編輯指定開度"
          >
            <i class="fas fa-edit text-sm text-gray-400 group-hover:text-white"></i>
            <div class="w-full text-right">{{ A1.specifyOpenin }}</div>
            <small>度</small>
          </h1>
          <button
            @click="handleGateOpenDegree"
            class="w-full rounded-md bg-gray-500 py-1 text-white opacity-100 hover:bg-gray-600"
          >
            {{ A1.startAtSpecifyOpening ? '關閉' : '啟動' }}
          </button>
        </div>
        <div v-else class="rounded-md bg-gray-200 py-1 text-center text-black opacity-100">
          指定開度
          <strong> {{ A1.specifyOpenin ?? '-' }}</strong>
          <small class="pl-1">度</small>
        </div>
      </div>
    </div>
  </div>
  <card v-else v-loading="loading" style="--bg-color: #ed7d2d" class="col-span-2">
    <template #header>
      <div class="flex text-white">
        <small class="fa-stack">
          <i class="fa-solid fa-circle fa-inverse fa-stack-2x"></i>
          <i class="fa-stack-1x fa-solid fa-gauge text-[var(--bg-color)]"></i>
        </small>
        <span>倒伏堰</span>
        <div class="ml-auto flex w-[140px] justify-between rounded bg-white px-2 text-zinc-600">
          目前開度(度)
          <span>{{ A1.gateValue || '-' }}</span>
        </div>
      </div>
    </template>

    <div class="grid gap-4 py-2">
      <div class="grid grid-cols-2">
        <div v-for="i in remote" :key="i.name" class="flex items-center space-x-2">
          <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
          <p class="mb-0 text-gray-800">{{ i.name }}</p>
        </div>
        <div v-for="i in A1.data1" :key="i.name" class="flex items-center space-x-2">
          <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
          <p class="mb-0 text-gray-800">{{ i.name }}</p>
        </div>
      </div>

      <div v-if="$WRUD('w')" class="flex flex-col gap-1 text-2xl">
        <button
          @click="handleGate('close')"
          :class="{ active: A1.isGateCloseBtnActive }"
          class="btn-gate"
        >
          <i
            :class="{ 'fa-beat-fade': A1.isGateCloseBtnActive }"
            class="fa-solid fa-fw fa-angles-up"
          ></i>
          起立
        </button>

        <button
          @click="handleGate('stop')"
          :class="{ active: A1.isGateStopBtnActive }"
          class="btn-gate"
        >
          <i class="fa-regular fa-fw fa-circle-stop"></i>
          停止
        </button>

        <button
          @click="handleGate('open')"
          :class="{ active: A1.isGateOpenBtnActive }"
          class="btn-gate"
        >
          <i
            :class="{ 'fa-beat-fade': A1.isGateOpenBtnActive }"
            class="fa-solid fa-fw fa-angles-down"
          ></i>
          倒伏
        </button>
      </div>

      <div v-if="canEdit" class="grid gap-2 rounded border bg-gray-100 px-2 py-2">
        <div class="flex gap-2">
          <div class="rounded-md py-1 text-center text-xl text-black opacity-100">指定開度</div>
          <h1
            @click="handleEdit"
            class="group flex flex-1 items-center rounded border bg-white px-2 text-center text-2xl hover:bg-el-primary hover:text-white"
            role="button"
            title="編輯指定開度"
          >
            <i class="fas fa-edit text-sm text-gray-400 group-hover:text-white"></i>
            <div class="w-full text-right">{{ A1.specifyOpenin }}</div>
            <small>度</small>
          </h1>
        </div>
        <button
          @click="handleGateOpenDegree"
          class="w-full rounded-md bg-gray-500 py-1 text-2xl text-white opacity-100 hover:bg-gray-600"
        >
          {{ A1.startAtSpecifyOpening ? '關閉' : '啟動' }}
        </button>
      </div>
      <div v-else class="rounded-md bg-gray-200 py-1 text-center text-black opacity-100">
        指定開度
        <strong> {{ A1.specifyOpenin ?? '-' }}</strong>
        <small class="pl-1">cm</small>
      </div>
    </div>
  </card>
</template>

<script lang="ts" setup>
import { ref, computed, inject, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { $gate } from '@/CUSTOMER/provide';
import { useRoute } from 'vue-router';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import editState from '@/CUSTOMER/Service/editState';
import showAlert from '../../../lib/showAlertCss';
import { emitter } from '@/CUSTOMER/plugins/bus';
import card from '@/CUSTOMER/components/card.vue';

const data = inject($gate);

let loading = ref(false);

const getWRUD = (str: 'u' | 'r' | 'w' | 'd') => {
  if (!getCurrentInstance()) {
    console.error('getCurrentInstance is null');
    return false;
  }
  return getCurrentInstance()!.appContext.config.globalProperties.$WRUD(str);
};

const canEdit = getWRUD('w');

const A1 = computed(() => {
  const getTag = (tag: string) => {
    try {
      return (
        (data?.value?.Gate.DamSections.find((o) => o.DamSectionType === 0)?.PLCs.find(
          (o) => o.Tag === tag
        )?.Value as boolean | number) || false
      );
    } catch (error) {
      return false;
    }
  };

  const isGateOpenBtnActive = getTag('468');
  const isGateStopBtnActive = getTag('467');
  const isGateCloseBtnActive = getTag('466');
  const isOpening = getTag('464') || false;
  const isClosing = getTag('463') || false;

  return {
    /** 開度 */
    gateValue: getTag('259') || 0,
    specifyOpenin: getTag('317') as number,
    /** 機頭操作 */
    isMachine: getTag('205') || false,
    /** PLC操作 */
    isPLC: getTag('204') || false,
    /** 指定開度啟動/關閉 */
    startAtSpecifyOpening: getTag('472') || false,
    isGateOpenBtnActive: isGateOpenBtnActive && isOpening,
    isGateStopBtnActive: isGateStopBtnActive && !isOpening && !isClosing,
    isGateCloseBtnActive: isGateCloseBtnActive && isClosing,
    isOpening,
    isClosing,
    data1: [
      {
        name: '起立完成',
        class: showAlert(getTag('220'))
      },
      {
        name: '倒伏完成',
        class: showAlert(getTag('219'))
      },
      {
        name: '閘門起立中',
        class: showAlert(getTag('463'))
      },
      {
        name: '閘門倒伏中',
        class: showAlert(getTag('464'))
      }
    ],

    data2: [
      {
        name: '起立超極限',
        class: showAlert(getTag('469'))
      },
      {
        name: '馬達過載',
        class: showAlert(getTag('111'))
      },
      {
        name: '馬達異常',
        class: showAlert(false)
      },
      {
        name: '3E故障',
        class: showAlert(getTag('178'))
      },
      {
        name: '機箱操作',
        class: showAlert(getTag('459'))
      }
    ]
  };
});

const remote = computed(() => {
  const Site = A1.value.isMachine;
  const Remote = A1.value.isPLC;

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

/** 指定開度啟動 */
const handleGateOpenDegree = async () => {
  const currentValue = (A1.value.startAtSpecifyOpening as boolean) || false;
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  // 單一開關判定 472
  const allTags = ['472'];
  let Tag;

  if (targetValue === true) {
    Tag = '472';
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

const handleGate = async (status: 'open' | 'stop' | 'close') => {
  if (!canEdit) {
    ElMessageBox.alert('您未被授權操作，若要操作，請聯絡相關工作人員。', '權限不足');
    return;
  }
  const isSiteControl = A1.value.isMachine;
  if (isSiteControl) {
    ElMessageBox.alert(
      '目前閘控設施為現場控制模式，無法遠端操控，請人員至現場進行控制。',
      '現場控制中'
    );
    return;
  }

  const allTags = ['466', '467', '468'];
  const store = A1.value;
  let openTags;
  if (status === 'open' && !store.isOpening) openTags = '468';
  if (status === 'stop') openTags = '467';
  if (status === 'close' && !store.isClosing) openTags = '466';
  if (typeof openTags !== 'string') return;
  await controlBtn(status, { openTags, allTags });
};

const route = useRoute();

/** 三相開關 */
const controlBtn = async (
  status: 'open' | 'stop' | 'close',
  req: { openTags: string; allTags: string[] }
) => {
  const code = route.params.id as string;

  try {
    const action = getAction(status);
    const device = '倒伏偃';
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
    const actions = { open: '倒伏', stop: '停止', close: '起立' };
    return actions[status];
  }
};

const handleEdit = async () => {
  await editDeviceNumberByTag(A1.value.specifyOpenin, '317');
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
    }).then(async ({ value }) => value);

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
</script>
