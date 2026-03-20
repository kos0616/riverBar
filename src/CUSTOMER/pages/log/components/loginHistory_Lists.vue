<template>
  <my-table
    v-loading="loading || pageLoading"
    :data="tableData"
    @cell-click="handleCellClick"
    row-class-name="cursor-pointer"
    stripe
    height="calc(100vh - 400px)"
  >
    <template #default="{ row }">
      <my-table-column
        :row="row"
        prop="UserName"
        label="帳號(姓名)"
        fixed
        min-width="120"
        header-align="center"
      >
      </my-table-column>
      <my-table-column
        :row="row"
        prop="LoginTime_f"
        label="登入時間"
        width="200"
        header-align="center"
      >
      </my-table-column>
      <my-table-column :row="row" prop="Device" label="裝置" min-width="180" header-align="center">
        <template #default="prop">
          {{ prop.row.OS }},
          {{ prop.row.Device }}
        </template>
      </my-table-column>
      <my-table-column
        :row="row"
        prop="Browser"
        label="瀏覽器"
        min-width="180"
        header-align="center"
      >
      </my-table-column>
      <my-table-column :row="row" prop="IpAddress" label="IP" width="140" header-align="center">
      </my-table-column>
      <my-table-column
        :row="row"
        prop="Succeeded"
        label="登入狀態"
        width="100"
        header-align="center"
      >
        <template #default="prop">
          <el-tag v-if="prop.row.Succeeded" type="success">
            <i class="fas fa-fw fa-check"></i>
            成功
          </el-tag>
          <el-tag v-else-if="prop.row.Succeeded === false" type="danger">
            <i class="fas fa-fw fa-times"></i>
            失敗
          </el-tag>
          <el-tag v-else type="info">
            <i class="fas fa-fw fa-triangle-exclamation"></i>
            錯誤
          </el-tag>
        </template>
      </my-table-column>
    </template>
  </my-table>
  <info v-if="dialogInfo" v-model="dialogInfo" :data="selected" @close="dialogInfo = false" />
  <div class="pb-10 pt-3 text-center sm:text-left md:pb-0">
    <div class="el-pagination is-background">
      <button
        @click="handlePage(-1)"
        :disabled="pageLoading || page === 0"
        type="button"
        class="btn-prev is-first"
        aria-label="上一頁"
        aria-disabled="true"
      >
        <i class="el-icon"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"
            ></path></svg
        ></i>
      </button>
      <button
        @click="handlePage(1)"
        :disabled="pageLoading || pageFull"
        type="button"
        class="btn-next is-last"
        aria-label="下一頁"
        aria-disabled="false"
      >
        <i class="el-icon"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
            ></path></svg
        ></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Lists from '../Service/LoginHistory';
import info from './loginHistory_Info.vue';
import { ElMessage } from 'element-plus';

type response = Awaited<ReturnType<typeof Lists>>;
type item = response[number];

const tableData = ref<response>([]);

const dialogInfo = ref(false);

const selected = ref<item>();

const loading = ref(false);

const page = ref(0);
const pageLoading = ref(false);
const pageFull = ref(false);

const handlePage = async (n: 1 | -1) => {
  page.value += n;
  try {
    pageLoading.value = true;
    tableData.value = [];
    const res = await Lists(page.value);
    if (res.length === 0) {
      ElMessage('已無更多資料');
      pageFull.value = true;
      page.value -= n;
      return;
    }
    tableData.value = res;
    pageFull.value = false;
  } finally {
    pageLoading.value = false;
  }
};

const getLists = async () => {
  const res = await Lists();
  tableData.value = res;
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

onMounted(async () => {
  try {
    loading.value = true;
    await getLists();
  } finally {
    loading.value = false;
  }
});
</script>
