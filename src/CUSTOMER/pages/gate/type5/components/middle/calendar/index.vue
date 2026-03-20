<template>
  <div>
    <el-button @click="dialogInfo = true" title="排程" class="group text-center">
      <i class="fas fa-calendar-days fa-fw"></i>
      排程
    </el-button>
    <el-dialog
      v-model="dialogInfo"
      :width="isEditing ? '700' : '90%'"
      :append-to-body="true"
      title="排程設定"
    >
      <calendar
        v-loading="isLoading"
        v-if="!isEditing"
        @edit="isEditing = true"
        @refresh="getLists"
        :model-value="modelValue"
        :avaiablePump="avaiablePump"
      ></calendar>
      <create
        v-else
        @edit="isEditing = false"
        @created="
          isEditing = false;
          getLists();
        "
        :avaiablePump="avaiablePump"
      ></create>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, watch } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import Lists from '@/CUSTOMER/Service/WaterPumpSchedules/Lists';
import calendar from './calendar.vue';
import create from './create.vue';

const emit = defineEmits(['refresh']);

interface Prop {
  isLoading: boolean;
  modelValue: Awaited<ReturnType<typeof Lists>>;
}
defineProps<Prop>();

const data = inject($gate);

/** 取得可用的幫浦數量，水門會在 svg 內被排除 */
const avaiablePump = computed(() => {
  const pumpStatus = (index: string) => {
    const gateNumber = Number(index);
    const gate = data?.value?.Gate.DamSections.find((o) => o.DamSectionType === gateNumber);
    const gateName = (gate?.Name || '').toString();
    const PLCS = gate?.PLCs;

    const status = {
      gateName,
      index: index,
      isError: getGateTag('181') || false,
      isWorking: getGateTag('479') || false,
      isStop: getGateTag('480') || false,
      isOnline: getGateTag('228') || false,
      /** 電流量 */
      electricValue: getGateTag('279') as number,
      /** 輸出頻率 */
      output: getGateTag('272') as number,
      /** 設定頻率 */
      configOutput: getGateTag('352') as number
    };

    return {
      ...status,
      statusName: getName(status),
      pumpStatus: pumpStatus(status)
    };

    function getName(st: typeof status) {
      if (st.isWorking) return '運轉中';
      if (st.isStop) return '停止';
      return '';
    }

    function pumpStatus(st: typeof status): 'error' | 'working' | 'online' | 'offline' {
      if (st.isError) return 'error';
      if (st.isWorking) return 'working';
      if (st.isStop || st.isOnline) return 'online';
      return 'offline';
    }

    function getGateTag(tag: string) {
      return (PLCS || []).find((v) => v.Tag === `${tag}-${gateNumber}`)?.Value;
    }
  };

  const pumps =
    data?.value?.Gate.DamSections
      // 僅有 PLC Tag 包含 228 的才是幫浦
      .filter((g) => g.PLCs.some((p) => p.Tag.includes('228')))
      .map((o) => o.DamSectionType.toString()) || [];
  return pumps.map((n) => pumpStatus(n));
});

const getLists = async () => {
  emit('refresh');
};

const dialogInfo = ref(false);

const isEditing = ref(false);

watch(
  dialogInfo,
  async (v) => {
    if (v === true) await getLists();
  },
  { immediate: true }
);
</script>
