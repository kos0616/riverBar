<template>
  <main>
    <div class="mb-3 flex-row-reverse items-end gap-4 md:flex">
      <div
        v-if="alarmSetting"
        class="inline-block overflow-hidden rounded-lg border border-yellow-400 bg-yellow-100 py-1"
      >
        <h3 class="px-3 py-1 text-left font-bold text-yellow-600" style="font-size: 110%">
          <i class="fa-solid fa-bell fa-fw"></i>
          水位警示設定
        </h3>
        <div class="flex gap-4 px-5 py-1 hover:bg-yellow-200">
          <span class="mr-auto">警示通知</span>
          <el-tag v-if="alarmSetting.Enable" type="success">
            <i class="fas fa-check fa-fw"></i>
            啟用
          </el-tag>
          <el-tag v-else type="danger">
            <i class="fas fa-times fa-fw"></i>
            關閉
          </el-tag>
        </div>
        <div class="flex gap-3 px-5 py-1 hover:bg-yellow-200">
          <span class="mr-auto">通知頻率</span>
          <span>
            <b>{{ alarmSetting.Period }}</b>
            分鐘
          </span>
        </div>
      </div>
      <colorInfo></colorInfo>
    </div>

    <div class="mx-auto w-full">
      <h2 v-if="SiteName" class="mb-1 text-xl font-bold">{{ SiteName }}</h2>
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
      <div class="md:info-section" :class="{ '!rounded-tl-none': activeRiver === rivers[0].Name }">
        <my-table
          v-loading="loading"
          :data="filtedTableData"
          @cell-click="handleCellClick"
          row-class-name="cursor-pointer"
          stripe
          height="calc(100vh - 380px)"
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
              align="right"
              header-align="center"
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
              prop="waterGates"
              label="一級警戒"
              width="100"
              header-align="center"
            >
              <template #default="prop">
                <el-tag v-if="prop.row.IsFirstAlertEnabled" type="success">
                  <i class="fas fa-check fa-fw"></i>
                  啟用
                </el-tag>
                <el-tag v-else type="danger">
                  <i class="fas fa-times fa-fw"></i>
                  關閉
                </el-tag>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              prop="waterGates"
              label="二級警戒"
              width="100"
              header-align="center"
            >
              <template #default="prop">
                <el-tag v-if="prop.row.IsSecondAlertEnabled" type="success">
                  <i class="fas fa-check fa-fw"></i>
                  啟用
                </el-tag>
                <el-tag v-else type="danger">
                  <i class="fas fa-times fa-fw"></i>
                  關閉
                </el-tag>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              prop="waterGates"
              label="三級警戒"
              width="100"
              header-align="center"
            >
              <template #default="prop">
                <el-tag v-if="prop.row.IsThirdAlertEnabled" type="success">
                  <i class="fas fa-check fa-fw"></i>
                  啟用
                </el-tag>
                <el-tag v-else type="danger">
                  <i class="fas fa-times fa-fw"></i>
                  關閉
                </el-tag>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              prop="waterGates"
              label="枯水警報"
              width="100"
              header-align="center"
            >
              <template #default="prop">
                <el-tag v-if="prop.row.IsLowWaterAlertEnabled" type="success">
                  <i class="fas fa-check fa-fw"></i>
                  啟用
                </el-tag>
                <el-tag v-else type="danger">
                  <i class="fas fa-times fa-fw"></i>
                  關閉
                </el-tag>
              </template>
            </my-table-column>
          </template>
        </my-table>
      </div>
    </div>
    <info
      v-if="dialogInfo"
      v-model="dialogInfo"
      :data="selected"
      @close="dialogInfo = false"
      @success="getLists"
    />
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue';
import info from './info.vue';
import Lists from '@/CUSTOMER/Service/WaterLevelGauge';
import { computed } from 'vue';
import { useCounterAxios } from '@/CUSTOMER/pinia/axios';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';
import _rivers from '@/CUSTOMER/static/rivers.json';
import { emitter } from '@/CUSTOMER/plugins/bus';
import WaterLevelAlarmConfig from '@/CUSTOMER/Service/system/water-level-alarm-config';
import colorInfo from '@/CUSTOMER/components/colorInfo.vue';

type item = Awaited<ReturnType<typeof Lists>>[number];

const counterAxios = useCounterAxios();

const tableData = ref<item[]>([]);

const dialogInfo = ref(false);

const selected = ref<item>();

const loading = ref(false);

const userInfoStore = useUserInfoStore();

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

const getLists = async () => {
  try {
    loading.value = true;
    const getter = await Lists();
    tableData.value = getter;
    updateInfo();
    // 更新時間
    counterAxios.actions_axios_update();
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
    return '#f39c12';
  }
  if (
    typeof cur?.ThirdAlertWaterLevel === 'number' &&
    cur?.ThirdAlertWaterLevel !== 0 &&
    n > cur?.ThirdAlertWaterLevel
  )
    return '#8E24AA';
  if (
    typeof cur?.SecondAlertWaterLevel === 'number' &&
    cur?.SecondAlertWaterLevel !== 0 &&
    n > cur?.SecondAlertWaterLevel
  )
    return '#FF7043';
  if (
    typeof cur?.FirstAlertWaterLevel === 'number' &&
    cur?.FirstAlertWaterLevel !== 0 &&
    n > cur?.FirstAlertWaterLevel
  )
    return '#DE3B40FF';
  return '#3498db';
};

// 更新資料
const updateTableSignalR = (event: {
  LocationCode: string;
  Tag: string;
  value: number | string;
  upDateTime: string;
  tag: string;
}) => {
  const item = tableData.value.find((item) => item.Tag === event.tag);
  if (!item) return;
  if (event.Tag.includes('251')) item.WaterLevel = Number(event.value);
  item.LastUpdatedTime = event.upDateTime;
};

onMounted(async () => {
  await getLists();
  await getInfo();
  emitter.on('updateSignalR', async ({ Tag, value, upDateTime, LocationCode, tag }) => {
    updateTableSignalR({ LocationCode, Tag, value, upDateTime, tag });
  });
});

onUnmounted(() => {
  emitter.off('updateSignalR');
});

const alarmSetting = ref<Awaited<ReturnType<typeof WaterLevelAlarmConfig>> | undefined>(undefined);

const getInfo = async () => {
  const getter = await WaterLevelAlarmConfig();
  if (getter) {
    alarmSetting.value = getter;
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

onMounted(async () => {
  await getInfo();
});
</script>
