<template>
  <div>
    <el-form v-loading="isLoading" @submit.prevent="handleDoModify">
      <fieldset class="grid gap-2">
        <div class="flex justify-between">
          <span class="text-lg">
            [{{ modelValue.WaterPumpName }}]
            {{ showAction(modelValue.Action) }}
          </span>
          <button
            @click="handleDelete"
            type="button"
            title="刪除排程"
            class="rounded-lg px-2 hover:bg-gray-100"
          >
            <i class="fas fa-trash-alt fa-fw text-el-danger"></i>
          </button>
        </div>
        <el-input v-model="form.DateTime" type="datetime-local" />
        <el-button native-type="submit" type="primary">送出</el-button>
      </fieldset>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { type item } from '@/CUSTOMER/Service/WaterPumpSchedules/Lists';
import DoModify from '@/CUSTOMER/Service/WaterPumpSchedules/DoModify';
import Delete from '@/CUSTOMER/Service/WaterPumpSchedules/Delete';
import { ref, watch } from 'vue';

interface Prop {
  modelValue: item;
}

const emit = defineEmits(['refresh']);

const props = defineProps<Prop>();

const form = ref({
  DateTime: ''
});

const isLoading = ref(false);

const handleDelete = async () => {
  try {
    isLoading.value = true;
    await Delete(props.modelValue);
    emit('refresh');
  } finally {
    isLoading.value = false;
  }
};

const handleDoModify = async () => {
  try {
    isLoading.value = true;
    await DoModify({ id: props.modelValue.Id, DateTime: form.value.DateTime });
    emit('refresh');
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.modelValue,
  (value) => {
    form.value.DateTime = value.DateTime;
  },
  { immediate: true }
);

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
