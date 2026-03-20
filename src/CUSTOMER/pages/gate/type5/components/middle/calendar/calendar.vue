<template>
  <el-calendar ref="REF_calendar" style="--el-calendar-cell-width: auto">
    <template #header="{ date }">
      <div class="grid gap-4">
        <div class="flex items-center gap-3">
          <strong class="text-xl">{{ date }}</strong>
          <el-button-group>
            <el-button @click="selectDate('prev-month')"> 上個月 </el-button>
            <el-button @click="selectDate('today')">今天</el-button>
            <el-button @click="selectDate('next-month')"> 下個月 </el-button>
          </el-button-group>
        </div>
        <el-checkbox-group v-model="selectedDevices">
          <el-checkbox-button
            v-for="(item, i) in avaiablePump"
            :key="`pump${i}`"
            :label="item.gateName"
            :name="item.gateName"
            :value="item.gateName"
          >
            {{ item.gateName }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>

      <div v-if="$WRUD('w')">
        <el-button @click="$emit('edit')" title="新增排程" style="min-width: auto">
          <i class="fas fa-plus fa-fw"></i>
          新增排程
        </el-button>
        <myDelete @refresh="$emit('refresh')"></myDelete>
      </div>
    </template>
    <template #date-cell="{ data }">
      <strong class="block pb-1">{{ data.day.split('-')[2] }}</strong>
      <ul class="grid gap-1" style="color: initial">
        <calendarItem
          v-for="(item, i) in showDateItems(data.day)"
          :key="`${data.day}_${i}`"
          :model-value="item"
          @refresh="$emit('refresh')"
        >
        </calendarItem>
      </ul>
    </template>
  </el-calendar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { type item } from '@/CUSTOMER/Service/WaterPumpSchedules/Lists';
import type { CalendarDateType, CalendarInstance } from 'element-plus';
import calendarItem from './calendarItem.vue';
import myDelete from './delete.vue';

type pump = {
  gateName: string;
  [key: string]: any;
};

interface Prop {
  modelValue: item[];
  avaiablePump: pump[];
}

const props = withDefaults(defineProps<Prop>(), {
  modelValue: () => [],
  avaiablePump: () => []
});

defineEmits(['edit', 'refresh']);

const selectedDevices = ref<string[]>([]);

const REF_calendar = ref<CalendarInstance>();

const selectDate = (val: CalendarDateType) => {
  if (!REF_calendar.value) return;
  REF_calendar.value.selectDate(val);
};

const filtedItems = computed(() => {
  return props.modelValue.filter((item) => selectedDevices.value.includes(item.WaterPumpName));
});

const showDateItems = (date: string) => {
  const arr = filtedItems.value;
  return arr
    .filter((item) => item.DateTime.includes(date))
    .sort((a, b) => {
      if (a.WaterPumpName > b.WaterPumpName) return 1;
      if (a.WaterPumpName < b.WaterPumpName) return -1;
      return new Date(a.DateTime).getTime() - new Date(b.DateTime).getTime();
    });
};

watch(
  () => props.avaiablePump,
  (val) => {
    selectedDevices.value = val.map((item) => item.gateName);
  },
  {
    immediate: true
  }
);
</script>
