<template>
  <el-popover :disabled="!$WRUD('w')" trigger="click" :width="380">
    <template #reference>
      <el-button title="刪除排程" style="min-width: auto" class="!border-el-danger">
        <span class="text-el-danger">
          <i class="fas fa-edit fa-fw"></i>
          刪除排程
        </span>
      </el-button>
    </template>
    <el-form
      v-loading="isLoading"
      @submit.prevent="handleDelete"
      :model="form"
      label-position="top"
    >
      <el-form-item label="刪除日期">
        <fieldset class="flex items-center gap-2">
          <el-input v-model="form.DateFrom" :max="form.DateTo" required="true" type="date" />
          至
          <el-input v-model="form.DateTo" :min="form.DateFrom" required="true" type="date" />
        </fieldset>
        請注意：此舉動將會刪除這段期間內的所有排程。
      </el-form-item>
      <el-button native-type="submit" class="w-full">確認</el-button>
    </el-form>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BatchDelete from '@/CUSTOMER/Service/WaterPumpSchedules/BatchDelete';
import day from 'dayjs';

const firstDateOfMonth = day().startOf('month').format('YYYY-MM-DD');
const lastDateOfMonth = day().endOf('month').format('YYYY-MM-DD');

const emit = defineEmits(['refresh']);

const route = useRoute();

const isLoading = ref(false);

const form = ref({
  DateFrom: firstDateOfMonth,
  DateTo: lastDateOfMonth
});

const handleDelete = async () => {
  const locationCode = route.params.id as string;

  const request = {
    locationCode,
    start: form.value.DateFrom + 'T00:00:00',
    end: form.value.DateTo + 'T23:59:59'
  };

  try {
    isLoading.value = true;
    await BatchDelete(request);
    emit('refresh');
  } finally {
    isLoading.value = false;
  }
};
</script>
