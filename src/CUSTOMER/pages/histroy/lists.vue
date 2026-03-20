<template>
  <main>
    <div class="mx-auto w-full">
      <div class="text-end">
        <colorInfo></colorInfo>
      </div>
      <div class="flex">
        <h2 v-if="SiteName" class="mb-1 mr-2 text-xl font-bold">{{ SiteName }}</h2>
        <nav v-else class="my-nav flex gap-2">
          <label
            v-for="river in rivers"
            :key="river.Code"
            :class="{ active: activeRiver === river.Name }"
            class="my-label block whitespace-nowrap"
            role="button"
          >
            <input v-model="activeRiver" :value="river.Name" type="radio" class="hidden" />
            {{ river.Name }}
          </label>
        </nav>
        <el-button @click="dialogExport = true" type="" class="mb-1">
          <i class="fa-solid fa-download fa-fw"></i>
          批次匯出
        </el-button>
      </div>
      <div class="md:info-section" :class="{ '!rounded-tl-none': activeRiver === rivers[0].Name }">
        <my-table
          v-loading="loading"
          :data="filtedTableData"
          @cell-click="handleCellClick"
          row-class-name="cursor-pointer"
          stripe
          height="calc(100vh - 280px)"
          @sort-change="handleSortChange"
        >
          <template #default="{ row }">
            <my-table-column
              :row="row"
              prop="Location"
              label="監測點名稱"
              fixed
              min-width="220"
              header-align="center"
            >
            </my-table-column>
            <my-table-column
              :row="row"
              prop="WaterLevel"
              label="水位數值㎝"
              width="145"
              header-align="center"
              align="right"
              sortable="custom"
              property="WaterLevel"
            >
              <template #default="prop">
                <strong
                  v-if="typeof prop.row.WaterLevel === 'number'"
                  :style="{ color: customColorMethod(prop.row) }"
                  class="text-xl"
                >
                  {{ $formatNumber(prop.row.WaterLevel, 1) }}
                </strong>
                <strong v-else>-</strong>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              label="流量數值CMS"
              width="160"
              header-align="center"
              align="right"
              sortable="custom"
              property="FlowRate"
            >
              <template #default="prop">
                <strong
                  v-if="typeof prop.row.FlowRate === 'number'"
                  style="color: #3498db"
                  class="text-xl"
                >
                  {{ prop.row.FlowRate }}
                </strong>
                <strong v-else>-</strong>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              prop="LastUpdated"
              label="最後同步時間"
              width="200"
              header-align="center"
            >
            </my-table-column>

            <my-table-column
              :row="row"
              prop="LastUpdated"
              label="連線狀態"
              width="110"
              header-align="center"
            >
              <template #default="prop">
                <el-tag v-if="prop.row.Status === 'Good'" type="success"> 成功 </el-tag>
                <el-tag v-else type="danger"> 連線失敗 </el-tag>
              </template>
            </my-table-column>
            <my-table-column :row="row" prop="" label="電力狀態" width="110" header-align="center">
              <template #default>
                <el-tag type="success"> 市電 </el-tag>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              prop="IsDanger"
              label="狀態"
              width="110"
              header-align="center"
              sortable="custom"
              property="IsDanger"
            >
              <template #default="prop">
                <el-tag v-if="prop.row.IsDanger === true" type="danger"> 異常 </el-tag>
                <el-tag v-else type="success"> 正常 </el-tag>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              prop="actions"
              label="趨勢圖"
              width="110"
              header-align="center"
              @click.stop
            >
              <template #default="prop">
                <el-button
                  tag="router-link"
                  :to="`/chart?id=${prop.row.Id}&Name=${prop.row.Name}&Type=${prop.row.GateType}`"
                >
                  <i class="fa-solid fa-fw fa-chart-line"></i>
                  檢視
                </el-button>
              </template>
            </my-table-column>
          </template>
        </my-table>
      </div>
    </div>
    <info v-if="dialogInfo" v-model="dialogInfo" :data="selected" @close="dialogInfo = false" />

    <el-dialog
      v-if="dialogExport !== undefined"
      v-model="dialogExport"
      @close="$emit('close')"
      title="檢視詳細"
      width="600px"
    >
      <fieldset class="gap-2 sm:flex" v-loading="loading">
        <label>
          起始時間
          <el-input v-model="start" :max="end" type="datetime-local" />
        </label>
        <label>
          結束時間
          <el-input v-model="end" :min="start" type="datetime-local" />
        </label>
      </fieldset>
      <footer class="mt-5 text-center">
        <el-button type="primary" native-type="submit" @click="goExport"> 匯出 </el-button>
      </footer>
    </el-dialog>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, shallowRef, triggerRef, onUnmounted } from 'vue';
import info from './info.vue';
import Lists, { formater } from '@/CUSTOMER/Service/WaterLevelGauge';
import { computed } from 'vue';
import { useCounterAxios } from '@/CUSTOMER/pinia/axios';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';
import { emitter } from '@/CUSTOMER/plugins/bus';
import _rivers from '@/CUSTOMER/static/rivers.json';
import ExportData from '@/CUSTOMER/Service/WaterLevelGaugeHistoryExport';
import day from 'dayjs';
import colorInfo from '@/CUSTOMER/components/colorInfo.vue';

type item = Awaited<ReturnType<typeof Lists>>[number];

const counterAxios = useCounterAxios();

const tableData = shallowRef<item[]>([]);

const dialogInfo = ref(false);

const selected = ref<item>();

const loading = ref(false);

const dialogExport = ref(false);

const userInfoStore = useUserInfoStore();

const today = day().format('YYYY-MM-DD');
const tomorrow = day().add(1, 'day').format('YYYY-MM-DD');

const start = ref(`${today}T00:00`);
const end = ref(`${tomorrow}T00:00`);

/** 水系 */
const rivers = computed(() => [{ Name: '全部', Code: '' }, ..._rivers]);
const activeRiver = ref('全部');

/** 使用者被綁定的工作站 */
const SiteCode = computed(() => userInfoStore.userInfo.SiteCode);
const SiteName = computed(() => userInfoStore.SiteName);

const filtedTableData = computed(() => {
  const arr = tableData.value;
  const mySite = SiteCode.value;
  const myRiver = activeRiver.value;
  if (mySite) return arr.filter((o) => o.LocationCode.includes(mySite)).sort(sorter);
  if (myRiver)
    return arr.filter((o) => (myRiver === '全部' ? true : o.RiverSystem === myRiver)).sort(sorter);
  return arr.sort(sorter);
});

const goExport = async () => {
  try {
    loading.value = true;
    const getter = await ExportData({ start: start.value, end: end.value });
    if (getter) {
      downloadCSV(`${today}趨勢圖報表.csv`, getter);
    }
  } finally {
    loading.value = false;
  }
};

const downloadCSV = (filename: string, data: any) => {
  const BOM = '\uFEFF'; // 加入 BOM 以防止 Excel 開啟時亂碼
  const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getLists = async () => {
  try {
    loading.value = true;
    const getter = await Lists();
    tableData.value = getter;
    // 更新時間
    counterAxios.actions_axios_update();
    updateInfo();
  } finally {
    loading.value = false;
  }
};

const updateInfo = () => {
  const Id = selected.value?.Id;
  selected.value = tableData.value.find((o) => o.Id === Id);
};

const goInfo = (row: item) => {
  selected.value = row;
  dialogInfo.value = true;
};

const handleCellClick = (item: item, cell: any) => {
  /** 普通類別 非下拉功能列才能觸發 */
  const canTrigger = cell.type === 'default' && cell.property !== 'actions';
  if (canTrigger) goInfo(item);
};

const customColorMethod = (cur?: item) => {
  const n = Number(cur?.WaterLevel || 0);

  if (typeof cur?.LowWaterLevel === 'number' && cur.LowWaterLevel !== 0 && n < cur?.LowWaterLevel) {
    // #f39c12 - 橙色
    return '#f39c12';
  }
  if (
    typeof cur?.ThirdAlertWaterLevel === 'number' &&
    cur?.ThirdAlertWaterLevel !== 0 &&
    n > cur?.ThirdAlertWaterLevel
  )
    // #8E24AA - 紫色
    return '#8E24AA';
  if (
    typeof cur?.SecondAlertWaterLevel === 'number' &&
    cur?.SecondAlertWaterLevel !== 0 &&
    n > cur?.SecondAlertWaterLevel
  )
    // #FF7043 - 淺橘紅色
    return '#FF7043';
  if (
    typeof cur?.FirstAlertWaterLevel === 'number' &&
    cur?.FirstAlertWaterLevel !== 0 &&
    n > cur?.FirstAlertWaterLevel
  )
    // #DE3B40FF - 紅色;
    return '#DE3B40FF';
  // #3498db - 藍色
  return '#3498db';
};

// 更新資料
const updateTableSignalR = (event: {
  LocationCode: string;
  Tag: string;
  value: number | string;
  upDateTime: string;
  tag: string;
  status: boolean;
}) => {
  const index = tableData.value.findIndex((item) => item.Tag === event.tag);
  if (index !== -1 && event.Tag.includes('251')) {
    const item = tableData.value[index];
    item.WaterLevel = Number(event.value);
    item.LastUpdatedTime = event.upDateTime;
    item.Status = event.status ? 'Good' : 'Bad';
    /** reformate: cause Status need to be set */
    tableData.value[index] = { ...formater(item) };
    triggerRef(tableData);
  }
};

const sortConfig = ref({
  prop: '',
  order: null as 'descending' | 'ascending' | null
});

const handleSortChange = ({
  order,
  prop
}: {
  order: 'descending' | 'ascending' | null;
  prop: string;
}) => {
  sortConfig.value.prop = prop;
  sortConfig.value.order = order;
};

const sorter = (a: item, b: item) => {
  const { prop, order } = sortConfig.value;
  if (!prop || !order) return 0;

  const aVal = a[prop as keyof typeof a] ?? '';
  const bVal = b[prop as keyof typeof b] ?? '';
  if (order === 'ascending') {
    return aVal > bVal ? 1 : -1;
  }
  return aVal < bVal ? 1 : -1;
};

/**
 * 當此頁從縮小/頁籤切換中返回時，會立即向後端取得最新的列表頁資訊
 * 原因是來自老油條設置的關係，會導致此頁在非可見狀態時，遺漏掉 SignalR 的更新
 */
const handleVisibilityChange = async () => {
  const isPageVisible = document.visibilityState === 'visible';
  if (isPageVisible) await getLists();
};

onMounted(async () => {
  await getLists();
  document.addEventListener('visibilitychange', handleVisibilityChange);
  emitter.on('updateSignalR', async ({ Tag, value, upDateTime, LocationCode, tag, status }) => {
    /** 加上老油條設定，當用戶將畫面縮小或切換到其他頁籤時，不進行資料更新 */
    if (typeof document.visibilityState !== 'undefined' && document.visibilityState === 'hidden')
      return;

    updateTableSignalR({ LocationCode, Tag, value, upDateTime, tag, status });
  });
});

onUnmounted(() => {
  emitter.off('updateSignalR');
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>
