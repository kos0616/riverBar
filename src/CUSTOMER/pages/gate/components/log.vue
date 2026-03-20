<template>
  <div class="grid gap-2 pb-3 xl:flex">
    <div
      class="flex w-full gap-4 overflow-y-scroll rounded bg-gray-200 lg:flex-row"
      style="max-height: 250px; height: 250px"
    >
      <table class="w-full table-auto border-collapse">
        <thead class="bg-primary-500 text-white" style="position: sticky; top: -1px">
          <tr>
            <th class="w-10 text-nowrap border px-2">警報時間</th>
            <th class="text-nowrap border px-2">警報內容</th>
            <th class="text-nowrap border px-2">確認人員</th>
            <th class="w-10 text-nowrap border px-2">確認時間</th>
            <th class="w-5 text-nowrap border px-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(alarm, i) in alarms"
            :key="`alarm_${i}`"
            class="border-b border-gray-500 hover:bg-primary-300 hover:text-white"
          >
            <td class="text-nowrap px-2">{{ alarm.Time_f }}</td>
            <td class="text-nowrap px-2">{{ alarm.AlarmMessage }}</td>
            <td class="text-nowrap px-2">{{ alarm.CheckUser ?? '-' }}</td>
            <td class="text-nowrap px-2">{{ alarm.CheckTime_f ?? '-' }}</td>
            <td class="px-1">
              <el-button
                v-show="!alarm.CheckUser"
                @click="handleMarkAlarmChecked(alarm)"
                size="small"
              >
                解除
              </el-button>
            </td>
          </tr>
          <tr v-if="(alarms || []).length === 0">
            <td colspan="5" class="text-center">無資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="flex w-full gap-4 overflow-y-scroll rounded bg-gray-200 lg:flex-row"
      style="max-height: 250px; height: 250px"
    >
      <table class="w-full table-auto border-collapse">
        <thead class="bg-primary-500 text-white" style="position: sticky; top: -1px">
          <tr>
            <th class="w-10 text-nowrap border px-2">動作時間</th>
            <th class="text-nowrap border px-2">動作內容</th>
            <th class="text-nowrap border px-2">值</th>
            <th class="text-nowrap border px-2">使用者</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in history"
            :key="`log_${index}`"
            class="border-b border-gray-500 hover:bg-primary-300 hover:text-white"
          >
            <td class="text-nowrap px-2">{{ item.Time_f }}</td>
            <td class="text-nowrap px-2">{{ item.ActionDisplay }}</td>
            <td class="text-nowrap px-2">{{ item.TagAction_f }}</td>
            <td class="text-nowrap px-2">{{ item.UserName }}</td>
          </tr>
          <tr v-if="(history || []).length === 0">
            <td colspan="4" class="text-center">無資料</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import History, { formater } from '@/CUSTOMER/pages/log/Service/OperateHistory';
import Alarms from '../Service/GetLocationAlarmsByLocationCode';
import MarkAlarmChecked from '../Service/MarkAlarmChecked';
import { emitter } from '@/CUSTOMER/plugins/bus';

import { useRoute } from 'vue-router';
type TypeHistory = Awaited<ReturnType<typeof formater>>;
type TypeAlarms = Awaited<ReturnType<typeof Alarms>>;

const route = useRoute();

const id = route.params.id as string;

const history = ref<TypeHistory[]>([]);

const alarms = ref<TypeAlarms>([]);

const getHistory = async (query: string) => {
  const res = await History({ query, PageLimit: 50 });
  history.value = res.histories;
};
const getAlarms = async (query: string) => {
  const res = await Alarms(query);
  alarms.value = res;
};

const handleMarkAlarmChecked = async (alarm: TypeAlarms[number]) => {
  await MarkAlarmChecked(alarm);
  await getAlarms(id);
};

const getData = async () => {
  if (id) await Promise.all([getHistory(id), getAlarms(id)]);
};

// FIXME: timer
const timer = ref<NodeJS.Timeout>();

const update = async () => {
  timer.value = setTimeout(async () => {
    await getData();
    await update();
  }, 10000);
};

onMounted(async () => {
  await getData();
  await update();

  emitter.on('updateSignalR', async () => {
    // await getData();
  });
});

onUnmounted(() => {
  emitter.off('updateSignalR');
  clearTimeout(timer.value);
});
</script>
