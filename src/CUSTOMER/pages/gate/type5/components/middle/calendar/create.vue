<template>
  <div class="px-5 py-3">
    <div class="mb-2 border-b pb-2">
      <el-tooltip content="返回">
        <el-button @click="$emit('edit')" size="small" style="min-width: auto">
          <i class="fas fa-chevron-left fa-fw" style="font-size: 150%"></i>
        </el-button>
      </el-tooltip>
    </div>

    <div v-loading="isLoading" class="flex gap-2">
      <el-form @submit.prevent="handleCreate" :model="form" label-width="120" label-position="left">
        <h2 class="mb-3 text-lg">新增排程</h2>
        <el-form-item label="抽水機">
          <div>
            <el-checkbox-group v-model="form.WaterPumpNames" :max="2">
              <el-checkbox-button
                v-for="(device, i) in avaiablePump"
                :key="`devicec${i}`"
                :label="device.gateName"
                :name="device.gateName"
                :value="device.gateName"
              >
                {{ device.gateName }}
              </el-checkbox-button>
            </el-checkbox-group>
            <span class="block">＊最多選擇兩部抽水機</span>
          </div>
        </el-form-item>
        <hr class="mb-4" />
        <el-form-item label="日期">
          <fieldset class="flex items-center gap-2">
            <el-input v-model="form.DateFrom" :max="form.DateTo" type="date" />
            至
            <el-input v-model="form.DateTo" :min="form.DateFrom" type="date" />
          </fieldset>
        </el-form-item>
        <el-form-item label="啟動時間">
          <div>
            <el-input v-model="form.StartTime" :max="form.StopTime" type="time" />
          </div>
        </el-form-item>
        <el-form-item label="關閉時間">
          <div>
            <el-input v-model="form.StopTime" :min="form.StartTime" type="time" />
          </div>
        </el-form-item>
        <hr class="mb-4" />
        <el-form-item label="重複">
          <div class="grid">
            <label>
              <input
                @click="form.CustomDays = [1, 2, 3, 4, 5]"
                class="h-0 w-0 opacity-0"
                type="radio"
              />
              <i
                :class="
                  checkWeekDate(form.CustomDays || [], [1, 2, 3, 4, 5])
                    ? 'fa-circle-check'
                    : 'fa-circle'
                "
                class="far fa-fw text-primary"
              ></i>
              工作日(週一至週五)
            </label>
            <label>
              <input @click="form.CustomDays = [6, 0]" class="h-0 w-0 opacity-0" type="radio" />
              <i
                :class="
                  checkWeekDate(form.CustomDays || [], [6, 0]) ? 'fa-circle-check' : 'fa-circle'
                "
                class="far fa-fw text-primary"
              ></i>
              週末(週六, 週日)
            </label>

            <el-select v-model="form.CustomDays" placeholder="自訂" multiple>
              <el-option
                v-for="(item, i) in weekDay"
                :key="`week_${item}`"
                :label="`週${item}`"
                :value="i"
              />
            </el-select>
          </div>
        </el-form-item>
        <div class="py-3 text-center">
          <el-button native-type="submit" type="success">送出</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { isEqual } from 'lodash';
import Create from '@/CUSTOMER/Service/WaterPumpSchedules/Create';
import GenerateCreateRequest from '@/CUSTOMER/Service/WaterPumpSchedules/GenerateCreateRequest';
import { useRoute } from 'vue-router';
import day from 'dayjs';
import { ElMessageBox } from 'element-plus';

const firstDateOfMonth = day().startOf('month').format('YYYY-MM-DD');
const lastDateOfMonth = day().endOf('month').format('YYYY-MM-DD');

const route = useRoute();

const emit = defineEmits(['edit', 'created']);

type pump = {
  gateName: string;
  [key: string]: any;
};

interface Prop {
  avaiablePump: pump[];
}

withDefaults(defineProps<Prop>(), {
  avaiablePump: () => []
});

const weekDay = ['日', '一', '二', '三', '四', '五', '六'];

const checkWeekDate = (current: number[], value: number[]) => {
  return isEqual(current, value);
};

const isLoading = ref(false);

const form = ref<{
  DateFrom: string;
  DateTo: string;
  StartTime: string;
  StopTime: string;
  CustomDays: number[];
  WaterPumpNames: string[];
}>({
  DateFrom: firstDateOfMonth,
  DateTo: lastDateOfMonth,
  WaterPumpNames: [],
  CustomDays: [1, 2, 3, 4, 5],
  StartTime: '10:00',
  StopTime: '17:00'
});

const handleCreate = async () => {
  if (form.value.WaterPumpNames.length === 0) {
    ElMessageBox.alert('請至少選擇一部抽水機');
    return;
  }
  const LocationCode = route.params.id as string;

  /** 工作日 | 週末 */
  const WorkDay = checkWeekDate(form.value.CustomDays, [1, 2, 3, 4, 5]);
  const Weekend = checkWeekDate(form.value.CustomDays, [0, 6]);

  const request = {
    ...form.value,
    LocationCode,
    WorkDay,
    Weekend,
    /** 工作日或週末時，自定日期會清空 */
    CustomDays: WorkDay || Weekend ? [] : form.value.CustomDays
  };

  try {
    isLoading.value = true;
    /** 將新增表單送進後端格式化 */
    const req = await GenerateCreateRequest(request);
    /** 真正的POST */
    await Create(req);
    emit('created');
  } finally {
    isLoading.value = false;
  }
};
</script>
