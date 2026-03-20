<template>
  <el-popover :disabled="!$WRUD('w')" trigger="click" :width="300" ref="REF_popover">
    <template #reference>
      <li
        v-if="modelValue"
        :class="`${showBg(modelValue.Action)} ${$WRUD('w') ? 'cursor-pointer' : 'cursor-default'}`"
        class="rounded-lg p-1 px-2"
        title="排程檢視"
      >
        [{{ modelValue.WaterPumpName }}]
        {{ $day(modelValue.DateTime, 'HH:mm') }}
        {{ showAction(modelValue.Action) }}
        ({{ showStatus(modelValue.Status, modelValue.Result) }})

        <el-tooltip v-if="modelValue.Result === 'Failed'" content="失敗">
          <i class="fa-solid fa-triangle-exclamation fa-fw cursor-help text-el-danger"></i>
        </el-tooltip>
      </li>
    </template>
    <calendarModify @refresh="handleRefresh" :model-value="modelValue"></calendarModify>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type item } from '@/CUSTOMER/Service/WaterPumpSchedules/Lists';
import { type PopoverInstance } from 'element-plus';
import calendarModify from './calendarItemModify.vue';

const emit = defineEmits(['refresh']);

interface Prop {
  modelValue: item;
}

const props = defineProps<Prop>();

const REF_popover = ref<PopoverInstance>();

const handleRefresh = () => {
  REF_popover.value?.hide();
  emit('refresh');
};

const showBg = (Action: typeof props.modelValue.Action) => {
  switch (Action) {
    case 'Start':
      return 'bg-red-200';

    case 'Stop':
      return 'bg-green-200';
  }
};

const showAction = (Action: typeof props.modelValue.Action) => {
  switch (Action) {
    case 'Start':
      return '運轉';

    case 'Stop':
      return '停止';
  }
};

const showStatus = (
  Status: typeof props.modelValue.Status,
  Result: typeof props.modelValue.Result
) => {
  if (Result === 'Failed') return '失敗';

  switch (Status) {
    case 'Completed':
      return '完成';

    case 'InProgress':
      return '進行中';

    case 'Pending':
      return '等待';
  }
};
</script>
