<template>
  <card
    v-if="spotlights_1.isExists"
    v-loading="loading"
    style="--bg-color: #fed7aa"
    title="投光燈"
    icon="fa-regular fa-lightbulb"
  >
    <div class="flex h-full flex-col justify-between gap-1">
      <label title="調整開關" class="group flex items-center justify-between" role="button">
        <span class="text-nowrap group-hover:text-el-danger">
          1號
          <small v-if="spotlights_1.isDisconnected" class="text-el-danger">
            <i class="fa-solid fa-triangle-exclamation"></i>
            離線
          </small>
        </span>
        <el-switch
          v-if="$WRUD('w')"
          @click="switchSpotlights"
          :model-value="spotlights_1.isOn"
          inline-prompt
          active-text="ON"
          inactive-text="OFF"
        />
        <span v-else>
          {{ spotlights_1.isOn ? 'ON' : 'OFF' }}
        </span>
      </label>
      <div>
        自動關燈時間
        <button
          v-if="$WRUD('w')"
          @click="editSpotlightAutocloseTimer"
          type="button"
          class="group flex w-full items-center rounded border p-1 px-3 hover:bg-el-primary hover:text-white"
        >
          <i class="fas fa-edit mr-auto text-sm text-gray-500 group-hover:text-inherit"></i>
          <strong class="text-xl">{{ spotlights_1.OffTime }}</strong>
          分鐘
        </button>
        <div v-else class="text-end">
          <strong class="text-xl">{{ spotlights_1.OffTime }}</strong>
          分鐘
        </div>
      </div>
    </div>
  </card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import editState from '@/CUSTOMER/Service/editState';
import card from '@/CUSTOMER/components/card.vue';
import { emitter } from '@/CUSTOMER/plugins/bus';

const route = useRoute();
const loading = ref(false);

interface Prop {
  modelValue?: typeGate;
}
const props = defineProps<Prop>();

const spotlights_1 = computed(() => {
  const getTag = (tag: string) => {
    try {
      const data = props.modelValue;
      // 第一個燈號的tag '413' || '414' || '415' || '301'
      const PLCs = data?.Sections.find((o) => o.SectionType === 1)?.PLCs || [];
      return PLCs.find((o) => o.Tag === tag)?.Value as boolean | number;
    } catch (error) {
      return undefined;
    }
  };

  /** 單一開關(415) */
  const isSingleTag = getTag('415') !== undefined;
  /** 雙開關(413,414) */
  const isSwitchTags = getTag('413') !== undefined && getTag('414') !== undefined;

  const isOn = isSingleTag ? getTag('415') === true : getTag('413');
  const isOff = isSingleTag ? getTag('415') === false : getTag('414');

  return {
    isOn: (isOn === true && isOff === false) || false,
    isOff: (isOn === false && isOff === true) || false,
    OffTime: (getTag('301') || '-') as string,
    isDisconnected: isOn === false && isOff === false,
    isSingleTag,
    /** 兩種判定皆否，判斷投光燈不存在 */
    isExists: isSingleTag || isSwitchTags
  };
});

/** 開關 */
const controlDeviceByTag = async (targetValue: boolean, openTags: string, allTags: string[]) => {
  const action = targetValue === true ? '啟動' : '關閉';
  const device = '投光燈';
  try {
    await ElMessageBox.confirm(`請確認操作——${device}${action}。`, {
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

/** 修改點位數字 */
const editDeviceNumberByTag = async (currentValue: number | string, Tag: string) => {
  const code = route.params.id as string;

  try {
    const Value = await ElMessageBox.prompt('請輸入自動關燈時間(分鐘)', '編輯投光燈', {
      inputType: 'number',
      inputPattern: /^\d+(\.\d+)*$/,
      inputValue: `${currentValue || ''}`,
      inputErrorMessage: '請確認格式為數字'
    }).then(async ({ value }) => value);

    loading.value = true;
    await editState({ code, Tags: [{ Value, Tag }] });
    ElMessage.success(`自動關燈時間調整為 ${Value}分鐘`);
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

// 改變投光燈
const switchSpotlights = async () => {
  const targetDevice = spotlights_1.value;
  const currentValue = targetDevice.isOn;
  /** 欲送出的狀態 */
  const targetValue = !currentValue;

  let allTags: string[] = [];
  let Tag: string = '';

  /** 單開關的情況下，僅會針對415操作 */
  if (targetDevice.isSingleTag) {
    allTags = ['415'];
    Tag = targetValue === true ? '415' : '';
  } else {
    // 413開 414關
    allTags = ['413', '414'];
    Tag = targetValue === true ? '413' : '414';
  }
  await controlDeviceByTag(targetValue, Tag, allTags);
};

const editSpotlightAutocloseTimer = async () => {
  await editDeviceNumberByTag(spotlights_1.value.OffTime, '301');
};
</script>
