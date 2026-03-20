<template>
  <div class="info-section">
    <div class="mb-3 flex justify-between gap-2">
      <el-select v-loading="loading" v-model="selectedLocation" class="max-w-sm">
        <el-option
          v-for="(location, i) in locationData"
          :key="`location_${i}`"
          :label="location.Name"
          :value="location.id"
        >
        </el-option>
      </el-select>

      <el-button @click="drawer = true" type="info">
        <i class="fas fa-database fa-fw"></i>
        資料檢視
      </el-button>
    </div>

    <div class="grid items-end gap-2 lg:flex lg:gap-4">
      <fieldset>
        快捷查詢
        <br />
        <el-button-group>
          <el-button @click="setDate(24)">今日</el-button>
          <el-button @click="setDate(72)">近三日</el-button>
          <el-button @click="setDate()"><i class="fa-regular fa-fw fa-clock"></i>自訂</el-button>
        </el-button-group>
      </fieldset>
      <fieldset class="gap-2 sm:flex lg:border-x lg:px-4">
        <label>
          起始時間
          <el-input v-model="start" :max="end" type="datetime-local" />
        </label>
        <label>
          結束時間
          <el-input v-model="end" :min="start" type="datetime-local" />
        </label>
      </fieldset>
      <fieldset>
        間隔設定
        <br />
        <el-radio-group v-model="step">
          <el-radio-button label="時" value="hour" />
          <el-radio-button label="分" value="min" />
        </el-radio-group>
      </fieldset>
      <label class="ml-auto">
        <el-button @click="search" type="primary">
          <i class="fas fa-search fa-fw"></i>
          送出
        </el-button>
      </label>
    </div>

    <el-drawer v-model="drawer" :append-to-body="true" size="350" title="資料檢視">
      <el-button @click="exportReport(tableData)" type="primary" class="mb-2">
        <i class="fa-solid fa-download fa-fw"></i>
        匯出資訊
      </el-button>
      <table class="w-full table-auto border-collapse border border-slate-400 bg-white">
        <thead>
          <tr>
            <th class="border border-slate-300 bg-gray-100 px-3 py-2 text-left">時間</th>
            <th class="border border-slate-300 bg-gray-100 px-3 py-2 text-left">水位(㎝)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index" class="transition hover:bg-gray-100">
            <td class="border border-slate-300 px-3 py-1">
              {{ item.Time }}
            </td>
            <td class="border border-slate-300 px-3 py-1 text-right">
              {{ item.WaterLevel }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <template #footer>
          <el-pagination layout="prev, pager, next" :total="tableData.length" /> 
      </template>-->
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ElMessageBox } from 'element-plus';
import day from 'dayjs';
import { type item } from '@/CUSTOMER/Service/WaterLevelGaugeHistory';
import Lists from '@/CUSTOMER/Service/WaterLevelGauge';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const locationData = ref<{ id: string; Name: string }[]>([]);

const loading = ref(false);

const selectedLocation = ref('');

watch(selectedLocation, (v) => {
  const target = locationData.value.find((o) => o.id === v);
  router.push({
    query: { ...target }
  });
});

const getLists = async () => {
  try {
    loading.value = true;
    const getter = await Lists();
    const stationId = showId(route.query.id as string);
    locationData.value = getter
      /** 過濾出同工作站的點位 */
      .filter((o) => o.Id.includes(stationId))
      .map((item) => ({
        id: item.Id,
        Name: item.Name,
        Type: item.GateType
      }));
  } finally {
    loading.value = false;
  }
};

const today = day().format('YYYY-MM-DD');
const tomorrow = day().add(1, 'day').format('YYYY-MM-DD');

const start = ref(`${today}T00:00`);
const end = ref(`${tomorrow}T00:00`);
const step = ref<'hour' | 'min'>('min');

const drawer = ref(false);
const emit = defineEmits(['updateValue']);

const { tableData } = defineProps({
  tableData: {
    type: Array<item>
  }
});

/** 自訂快捷查詢，若為自訂，則要求用戶自訂時間 */
const setDate = (n?: number) => {
  let $start = '';
  let $end = '';
  if (n === 24) {
    $start = `${today}T00:00`;
    $end = `${tomorrow}T00:00`;
    start.value = $start;
    end.value = $end;
    search();
  } else if (n === 72) {
    $start = day(tomorrow).subtract(72, 'hours').format('YYYY-MM-DDT00:00');
    $end = `${tomorrow}T00:00`;
    start.value = $start;
    end.value = $end;
    search();
  } else if (!n) {
    ElMessageBox.prompt('輸入您想要回推多久的時間 (0-1440小時)', '自訂查詢時段', {
      inputType: 'number',
      inputPattern: /^\d+(\.\d+)*$/,
      inputValue: '24',
      inputErrorMessage: '請確認格式為數字'
    }).then((res) => {
      $end = day().format('YYYY-MM-DDTHH:mm');
      $start = day($end).subtract(Number(res.value), 'hours').format('YYYY-MM-DDTHH:mm');
      start.value = $start;
      end.value = $end;
      search();
    });
  }
};

const search = () => {
  emit('updateValue', {
    start: start.value,
    end: end.value,
    step: step.value
  });
};

const exportReport = (tableData?: item[]) => {
  if (!tableData) {
    ElMessageBox.alert('請確認是否有資料', '無資料可匯出', {
      type: 'warning'
    });
    return;
  }
  //確保 UTF-8 編碼
  let csvContent = '\uFEFF時間,水位(㎝)\n';

  tableData.forEach((item) => {
    // 簡化時間格式
    const simpleTime = item.Time.replace(' ', 'T');
    csvContent += `${simpleTime},${item.WaterLevel}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `趨勢圖報表.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

onMounted(async () => {
  await getLists();
  selectedLocation.value = route.query.id as string;
});

function showId(id: string) {
  // Id: 'S05.S05P01.251';
  return id.split('.')[0];
}
</script>
