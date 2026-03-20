<template>
  <div
    v-if="$screenWidth.value >= 768"
    class="grid grid-cols-5 gap-2 rounded-lg border-white bg-zinc-400/75 p-2 shadow-sm"
  >
    <card
      v-if="blowerStatus && intakeStatus"
      v-loading="loading"
      name="手動充氣"
      :hideStatus="true"
      :showSwitch="true"
      :switchStatus="isManualIntakeOn"
      @switch="changeManualIntake"
    >
      <blower></blower>
    </card>
    <card name="鼓風機" :status="blowerStatus">
      <blower :status="blowerStatus"></blower>
    </card>
    <card name="進氣閥" :status="intakeStatus">
      <valve :status="intakeStatus"></valve>
    </card>
    <card
      name="排氣閥"
      :status="exhaustStatus"
      :showSwitch="true"
      :switchStatus="exhaustStatus === 'working'"
      @switch="changeExhaust"
    >
      <valve :status="exhaustStatus"></valve>
    </card>
    <card
      name="排水閥"
      :status="drainStatus"
      :showSwitch="true"
      :switchStatus="drainStatus === 'working'"
      @switch="changeDrain"
    >
      <valve :status="drainStatus"></valve>
    </card>
    <card name="抽水機" status="online">
      <socker status="online"></socker>
    </card>
    <card name="逸氣槽" status="online">
      <img src="../../assets/dam-rubber-air-outer.svg" alt="逸氣槽" />
    </card>
    <card name="承水桶" :status="waterBucketStatus">
      <img src="../../assets/dam-rubber-bucket.svg" alt="承水桶" />
    </card>
    <card name="抽水機" status="online">
      <motor status="online"></motor>
    </card>

    <card name="集水井" status="online">
      <img src="../../assets/dam-rubber-well.svg" alt="集水井" />
    </card>
  </div>
  <div v-else class="flex flex-col gap-1 py-2 text-2xl">
    <label
      v-if="blowerStatus && intakeStatus"
      class="flex items-center justify-between border-b pb-1"
    >
      <strong> 手動充氣 </strong>
      <el-switch
        v-if="$WRUD('w')"
        @click="changeManualIntake"
        :model-value="isManualIntakeOn"
        inline-prompt
        active-text="ON"
        inactive-text="OFF"
        size="large"
      />
      <span v-else>
        {{ isManualIntakeOn ? '運作中' : '停止' }}
      </span>
    </label>

    <label class="flex items-center justify-between border-b pb-1">
      <strong>鼓風機</strong>
      <el-switch
        v-if="$WRUD('w')"
        @click="changeBlower"
        :model-value="blowerStatus === 'working'"
        inline-prompt
        active-text="ON"
        inactive-text="OFF"
        size="large"
      />
      <span v-else>
        {{ blowerStatus === 'working' ? '運作中' : '停止' }}
      </span>
    </label>
    <label class="flex items-center justify-between border-b pb-1">
      <strong>進氣閥</strong>

      <el-switch
        v-if="$WRUD('w')"
        @click="changeIntake"
        :model-value="intakeStatus === 'working'"
        inline-prompt
        active-text="ON"
        inactive-text="OFF"
        size="large"
      />
      <span v-else>
        {{ intakeStatus === 'working' ? '運作中' : '停止' }}
      </span>
    </label>

    <label class="flex items-center justify-between border-b pb-1">
      <strong>排氣閥</strong>
      <el-switch
        v-if="$WRUD('w')"
        @click="changeExhaust"
        :model-value="exhaustStatus === 'working'"
        inline-prompt
        active-text="ON"
        inactive-text="OFF"
        size="large"
      />
      <span v-else>
        {{ exhaustStatus === 'working' ? '運作中' : '停止' }}
      </span>
    </label>
    <label class="flex items-center justify-between pb-1">
      <strong> 排水閥 </strong>
      <el-switch
        v-if="$WRUD('w')"
        @click="changeDrain"
        :model-value="drainStatus === 'working'"
        inline-prompt
        active-text="ON"
        inactive-text="OFF"
        size="large"
      />
      <span v-else>
        {{ drainStatus === 'working' ? '運作中' : '停止' }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
/**
 * 橡皮壩設備顯示區
 * 通過 prop data 整理設備數據
 */
import blower from './blower.vue';
import card from './card.vue';
import valve from './valve.vue';
import socker from './socker.vue';
import motor from '../../assets/motorDefault.vue';
import { computed, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import { emitter } from '@/CUSTOMER/plugins/bus';

const props = defineProps<{
  modelValue?: typeGate;
}>();

const route = useRoute();

const emit = defineEmits(['loading']);

const loading = ref(false);

/** 即時壓力 */
const pressure = computed(() => {
  try {
    return (props.modelValue?.Sections || [])
      .find((o) => o.SectionType === 3)
      ?.PLCs.find((o) => o.Tag === '252')?.Value as number;
  } catch (error) {
    return null;
  }
});

/** 手動充氣開關狀態 */
const isManualIntakeOn = computed(() => {
  return getPLC('905') || false;
});

/** 手動充氣 */
const changeManualIntake = async () => {
  const currentValue = isManualIntakeOn.value;
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  // 412 鼓風機單開關 401 進氣閥on 402 進氣閥off
  const allTags = ['412', '401', '402'];
  let openTags;

  if (targetValue === true) {
    openTags = ['412', '401'];
  } else {
    openTags = ['402'];
  }

  try {
    const code = route.params.id as string;
    const action = targetValue === true ? '啟動' : '關閉';
    await ElMessageBox.confirm(showMsg(action), {
      type: 'info',
      center: true,
      showClose: false
    });

    loading.value = true;
    emit('loading', true);
    await sendControlSwitch({ code, openTags, allTags });
    ElMessage.success(`手動充氣已成功${action}`);
    emitter.emit('refreshIws');
  } catch (e) {
    if ((e as string) === 'cancel') {
      return;
    } else if (typeof e === 'string') {
      ElMessage.warning('操作失敗: ' + e);
    }
  } finally {
    emit('loading', false);
    loading.value = false;
  }

  function showMsg(action: '關閉' | '啟動') {
    let msg = `請確認操作——${action}手動充氣`;
    const v = Number(pressure.value);
    if (action === '啟動' && v >= 0.19) msg = `目前警戒壓力為 ${v}，請確認操作`;
    return msg;
  }
};

/** 鼓風機 */
const blowerStatus = computed(() => {
  const tag = getPLC('412');
  const isOnline = tag === true;
  const isWorking = tag === true;
  const isError = getDebuff('104');
  const isExists = typeof tag === 'boolean';

  if (isError) return 'error';
  if (isWorking) return 'working';
  if (isOnline) return 'online';
  if (isExists) return 'offline';
  return undefined;
});

const changeBlower = async () => {
  const currentValue = blowerStatus.value === 'working';
  /** 欲送出的狀態 */
  const targetValue = !currentValue;

  // 412 單開關
  const allTags = ['412'];
  let Tag;

  if (targetValue === true) {
    Tag = '412';
  } else {
    Tag = '';
  }
  await controlDeviceByTag(targetValue, Tag, allTags);
};

/** 進氣閥 */
const intakeStatus = computed(() => {
  const on = getPLC('401');
  const off = getPLC('402');
  const isOnline = on === true;
  const isWorking = getDeviceStatus('207');
  const isError = getDebuff('101');
  const isExists = [on, off].some((b) => typeof b === 'boolean');

  if (isError) return 'error';
  if (isWorking) return 'working';
  if (isOnline) return 'online';
  if (isExists) return 'offline';
  return undefined;
});

const changeIntake = async () => {
  const currentValue = intakeStatus.value === 'working';
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  // 401開 402關
  const allTags = ['401', '402'];
  let Tag;

  if (targetValue === true) {
    Tag = '401';
  } else {
    Tag = '402';
  }
  await controlDeviceByTag(targetValue, Tag, allTags);
};

/** 排氣閥 */
const exhaustStatus = computed(() => {
  const on = getPLC('404');
  const off = getPLC('405');
  const isOnline = on === true;
  const isWorking = getDeviceStatus('209');
  const isError = getDebuff('102');
  const isExists = [on, off].some((b) => typeof b === 'boolean');

  if (isError) return 'error';
  if (isWorking) return 'working';
  if (isOnline) return 'online';
  if (isExists) return 'offline';
  return undefined;
});

const changeExhaust = async () => {
  const currentValue = exhaustStatus.value === 'working';
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  // 404開 405關
  const allTags = ['404', '405'];
  let Tag;

  if (targetValue === true) {
    Tag = '404';
  } else {
    Tag = '405';
  }
  await controlDeviceByTag(targetValue, Tag, allTags);
};

/** 排水閥 */
const drainStatus = computed(() => {
  const on = getPLC('407');
  const off = getPLC('408');
  const isOnline = on === true;
  const isWorking = getDeviceStatus('211');
  const isError = getDebuff('103');
  const isExists = [on, off].some((b) => typeof b === 'boolean');

  if (isError) return 'error';
  if (isWorking) return 'working';
  if (isOnline) return 'online';
  if (isExists) return 'offline';
  return undefined;
});

const changeDrain = async () => {
  const currentValue = drainStatus.value === 'working';
  /** 欲送出的狀態 */
  const targetValue = !currentValue;
  // 407開 408關
  const allTags = ['407', '408'];
  let Tag;

  if (targetValue === true) {
    Tag = '407';
  } else {
    Tag = '408';
  }
  await controlDeviceByTag(targetValue, Tag, allTags);
};

/** 承水桶 */
const waterBucketStatus = computed(() => {
  const isError = getDebuff('175');
  if (isError) return 'error';
  return 'online';
});

/** 取得 PLC 資訊 */
const getPLC = (tag: string) => {
  try {
    const boolean = props.modelValue?.Gate?.MapSection.PLCs.find((o) => o.Tag === tag)
      ?.Value as boolean;
    return boolean;
  } catch (error) {
    return null;
  }
};

/** 取得負面狀態 */
const getDebuff = (tag: string) => {
  try {
    const boolean = (props.modelValue?.Sections || [])
      .find((o) => o.SectionType === 5)
      ?.PLCs.find((o) => o.Tag === tag)?.Value as boolean;
    return boolean;
  } catch (error) {
    return null;
  }
};

/** 取得設備狀態 */
const getDeviceStatus = (tag: string) => {
  try {
    const boolean = (props.modelValue?.Sections || [])
      .find((o) => o.SectionType === 6)
      ?.PLCs.find((o) => o.Tag === tag)?.Value as boolean;
    return boolean;
  } catch (error) {
    return null;
  }
};

/** 開關 */
const controlDeviceByTag = async (targetValue: boolean, openTags: string, allTags: string[]) => {
  try {
    const code = route.params.id as string;
    const action = targetValue === true ? '啟動' : '關閉';
    const device = getDevice(openTags || allTags[0]);
    await ElMessageBox.confirm(`請確認操作——${action}${device}。`, {
      type: 'info',
      center: true,
      showClose: false
    });

    emit('loading', true);
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
    emit('loading', false);
  }

  function getDevice(id: string) {
    const ids = {
      '412': '鼓風機',
      '401': '進氣閥',
      '402': '進氣閥',
      '404': '排氣閥',
      '405': '排氣閥',
      '407': '排水閥',
      '408': '排水閥'
    } as Record<string, string>;
    return ids[id];
  }
};
</script>
