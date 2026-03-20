<template>
  <div v-loading="loading" class="flex-1 rounded bg-gray-200 p-2">
    <div class="sm:flex">
      <div class="flex flex-col gap-2 bg-gray-200 p-2 text-xl" style="width: 350px">
        <h1 class="px-3 font-bold">橡皮壩自動充氣流程</h1>
        <div class="rounded-md border-4 border-el-success bg-el-success p-2 shadow-sm">
          <div v-for="i in remote" :key="i.name" class="flex items-center space-x-2 px-1">
            <div class="h-4 w-4 rounded-full border border-gray-400" :class="i.class"></div>
            <p class="mb-0 text-gray-800">{{ i.name }}</p>
          </div>
        </div>
        <div class="flex flex-col gap-[2px]">
          <button
            @click="auto_inflatable"
            :class="{ 'fa-fade': isAutoUp, disabled: !canEdit }"
            class="btn-gate-cust"
            style="--bg: rgb(248, 113, 113)"
          >
            <i class="fa-solid fa-fw fa-arrows-up-to-line"></i>
            自動充氣
          </button>
          <button
            @click="prostrate"
            :class="{ 'fa-fade': isAutoDown, disabled: !canEdit }"
            class="btn-gate-cust"
            style="--bg: rgb(107, 114, 128)"
          >
            <i class="fa-solid fa-fw fa-arrows-down-to-line"></i>
            自動倒伏
          </button>
        </div>
      </div>
      <div class="flex bg-gray-200 px-2">
        <el-steps :active="step_active" finish-status="success" class="bg-transparent">
          <el-step title="Step 1">
            <template #description>
              <div
                v-for="(step, index) in stepGroup.step1"
                :key="index"
                class="m-1 inline-block w-full text-nowrap rounded-md py-1 text-center text-base"
                :class="step.isActive ? step.class : 'bg-gray-300 text-black'"
              >
                <span>
                  {{ step.name }}
                </span>
              </div>
            </template>
          </el-step>
          <el-step title="Step 2">
            <template #description>
              <div
                v-for="(step, index) in stepGroup.step2"
                :key="index"
                class="m-1 inline-block w-full text-nowrap rounded-md py-1 text-center text-base"
                :class="step.isActive ? step.class : 'bg-gray-300 text-black'"
              >
                <span>
                  {{ step.name }}
                </span>
              </div>
            </template>
          </el-step>
          <el-step title="Step 3">
            <template #description>
              <div
                v-for="(step, index) in stepGroup.step3"
                :key="index"
                class="m-1 inline-block w-full text-nowrap rounded-md py-1 text-center text-base"
                :class="step.isActive ? step.class : 'bg-gray-300 text-black'"
              >
                <span>
                  {{ step.name }}
                </span>
              </div>
            </template>
          </el-step>

          <el-step title="Step 4">
            <template #description>
              <div
                v-for="(step, index) in stepGroup.step4"
                :key="index"
                class="m-1 inline-block w-full text-nowrap rounded-md py-1 text-center text-base"
                :class="step.isActive ? step.class : 'bg-gray-300 text-black'"
              >
                <span>
                  {{ step.name }}
                </span>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus';
import { ref, getCurrentInstance, computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import { useRoute } from 'vue-router';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import showAlert from '../../../lib/showAlertCss';
import { emitter } from '@/CUSTOMER/plugins/bus';

const data = inject($gate);

const getWRUD = (str: 'u' | 'r' | 'w' | 'd') => {
  if (!getCurrentInstance()) {
    console.error('getCurrentInstance is null');
    return false;
  }
  return getCurrentInstance()!.appContext.config.globalProperties.$WRUD(str);
};

const canEdit = getWRUD('w');

/** step 為 0 to 4, 4代表 4已完成 */
const step_active = computed(() => {
  const group = stepGroup.value;
  const isUp = group.step4[1].isActive;

  if (isUp === true) return 4;
  if (group.step4.some(isCompleted)) return 3;
  if (group.step3.some(isCompleted)) return 2;
  if (group.step2.some(isCompleted)) return 1;
  return 0;

  function isCompleted(step: any) {
    return !step.isWarning && step.isActive === true;
  }
});

const getDamSection = (tag: string) => {
  try {
    return (data?.value?.Gate.DamSections || [])
      .map((o) => o.PLCs)
      .reduce((a, b) => [...a, ...b], [])
      .find((d) => {
        return d.Tag === tag;
      })?.Value as boolean;
  } catch (error) {
    return false;
  }
};

const remote = computed(() => {
  const Site = getDamSection('205');
  const Remote = getDamSection('204');

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

const isAutoUp = computed(() => getDamSection('453'));

const isAutoDown = computed(() => getDamSection('454'));

const stepGroup = computed(() => {
  return {
    step1: [
      {
        name: '承水桶正常',
        isActive: getDamSection('221'),

        class: 'dynamic-color-working-shine text-white'
      },
      {
        name: '排水閥放水',
        isActive: getDamSection('213'),
        class: 'dynamic-color-working-shine text-white'
      },
      {
        name: '排水閥過載',
        isActive: getDamSection('103'),
        class: 'bg-el-warning text-black',
        isWarning: true
      }
    ],

    step2: [
      // 排氣閥ON 404 排氣閥OFF 405
      {
        name: '排氣閥全關',
        isActive: false,
        class: 'dynamic-color-working-shine text-white'
      },
      {
        name: '關閉排氣閥',
        isActive: getDamSection('405'),

        class: 'dynamic-color-working-shine text-white'
      },
      {
        name: '排氣閥過載',
        isActive: getDamSection('102'),
        class: 'bg-el-warning text-black',
        isWarning: true
      }
    ],
    step3: [
      {
        name: '進氣閥全關',
        isActive: getDamSection('402'),
        class: 'dynamic-color-working-shine text-white'
      },
      {
        name: '開啟進氣閥',
        isActive: getDamSection('401'),
        class: 'dynamic-color-working-shine text-white'
      },
      {
        name: '進氣閥過載',
        isActive: getDamSection('101'),
        class: 'bg-el-warning text-black',
        isWarning: true
      }
    ],
    step4: [
      {
        name: '鼓風機運轉中',
        isActive: getDamSection('412'),
        class: 'dynamic-color-working-shine text-white'
      },
      {
        name: '起立完成',
        isActive: ['901', '906', '913', '917', '921'].some((str) => getDamSection(str)),
        class: 'dynamic-color-working-shine text-white'
      },
      {
        name: '起立失敗',
        isActive: getDamSection('471'),
        class: 'bg-el-warning text-black',
        isWarning: true
      },
      {
        name: '鼓風機過載',
        isActive: getDamSection('104'),
        class: 'bg-el-warning text-black',
        isWarning: true
      }
    ]
  };
});

const loading = ref(false);
const route = useRoute();

const isSiteControl = computed(() => getDamSection('205') === true);

const auto_inflatable = async () => {
  if (!canEdit) {
    ElMessageBox.alert('您未被授權操作，若要操作，請聯絡相關工作人員。', '權限不足');
    return;
  }
  if (isSiteControl.value) {
    ElMessageBox.alert(
      '目前閘控設施為現場控制模式，無法遠端操控，請人員至現場進行控制。',
      '現場控制中'
    );
    return;
  }

  const code = route.params.id as string;
  const openTags = '453';
  const allTags = ['453', '454'];

  try {
    // 及時壓力
    const value = data?.value?.Sections.find((d) => d.SectionType === 3)?.PLCs.find(
      (d) => d.Tag === '252'
    )?.Value;
    const v = Number(value);
    let msg = `請確認操作——自動充氣`;
    if (v >= 0.19) msg = `目前警戒壓力為 ${v}，請確認操作——自動充氣`;

    await ElMessageBox.confirm(msg, {
      type: 'info',
      center: true,
      showClose: false
    });

    loading.value = true;
    await sendControlSwitch({ code, openTags, allTags, isRubber: true });
    ElMessage.success('操作成功');
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

const prostrate = async () => {
  if (!canEdit) {
    ElMessageBox.alert('您未被授權操作，若要操作，請聯絡相關工作人員。', '權限不足');
    return;
  }
  if (isSiteControl.value) {
    ElMessageBox.alert(
      '目前閘控設施為現場控制模式，無法遠端操控，請人員至現場進行控制。',
      '現場控制中'
    );
    return;
  }
  const code = route.params.id as string;
  const openTags = '454';
  const allTags = ['453', '454'];

  try {
    await ElMessageBox.confirm('請確認操作——自動倒伏', {
      type: 'info',
      center: true,
      showClose: false
    });

    loading.value = true;
    await sendControlSwitch({ code, openTags, allTags, isRubber: true });
    ElMessage.success('操作成功');
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
<style lang="scss" scoped>
// ref .btn-gate 啟動色為紅色
.btn-gate-cust {
  @apply bg-[var(--bg)] px-3 py-1 font-medium text-white first-of-type:rounded-t-md last-of-type:rounded-b-md;
  &:hover,
  &:focus,
  &:active {
    @apply bg-gray-600;
  }
  &.active {
    @apply bg-[--active-bg] text-white;
  }
  &[disabled],
  &.disabled {
    @apply cursor-not-allowed bg-gray-400 text-gray-200;
  }
}

.dynamic-color-working-shine {
  animation: working-brighter 1.5s infinite;
}
@keyframes working-brighter {
  0%,
  49%,
  100% {
    background: #f20804;
  }

  50%,
  99% {
    background: #72be38;
  }
}
</style>
