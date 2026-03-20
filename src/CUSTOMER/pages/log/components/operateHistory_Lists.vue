<template>
  <my-table
    v-loading="loading"
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
      ></my-table-column>
      <my-table-column :row="row" prop="Time_f" label="操作時間" width="210" header-align="center">
      </my-table-column>
      <my-table-column
        :row="row"
        prop="LocationName"
        label="站點"
        min-width="220"
        header-align="center"
      >
      </my-table-column>
      <my-table-column
        :row="row"
        prop="ActionDisplay"
        label="操作內容"
        min-width="230"
        header-align="center"
      >
      </my-table-column>
      <my-table-column
        :row="row"
        prop="TagAction_f"
        label="設定值"
        width="80"
        header-align="center"
      >
      </my-table-column>
      <my-table-column :row="row" prop="IPAddress" label="IP" width="160" header-align="center">
      </my-table-column>
    </template>
  </my-table>
  <info v-if="dialogInfo" v-model="dialogInfo" :data="selected" @close="dialogInfo = false" />
  <div class="pb-10 pt-3 text-center sm:text-left md:pb-0">
    <el-pagination
      @current-change="handlePage"
      background
      layout="prev, pager, next"
      :total="pagination.TotalNumber"
      :page-size="pagination.PageLimit"
      :page-count="pagination.TotalPages"
      :hide-on-single-page="true"
      v-model:current-page="currentPage"
      :disabled="loading"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router';
import Lists, { type Pagination, formater, type request } from '../Service/OperateHistory';
import info from './operateHistory_Info.vue';

type item = ReturnType<typeof formater>;

const route = useRoute();
const router = useRouter();

const tableData = ref<item[]>([]);

const currentPage = ref(1);

const pagination = ref<Pagination>({
  PageLimit: 0,
  TotalNumber: 0,
  TotalPages: 0
});

const dialogInfo = ref(false);

const selected = ref<item>();

const loading = ref(false);

const getLists = async (query?: request) => {
  try {
    loading.value = true;
    tableData.value = [];
    currentPage.value = query?.PageNumber ? Number(query.PageNumber) : 1;
    const res = await Lists(query);
    tableData.value = res.histories;
    pagination.value = res.Pagination;
  } finally {
    loading.value = false;
  }
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

const handlePage = async (n: number) => {
  currentPage.value = n;
  const req = { ...route.query, PageNumber: currentPage.value };
  router.push({ query: req });
};

onMounted(async () => {
  try {
    loading.value = true;
    const search = route.query as request;
    await Promise.all([getLists(search)]);
  } finally {
    loading.value = false;
  }
});

onBeforeRouteUpdate(async (to) => {
  try {
    loading.value = true;
    const search = to.query as request;
    await getLists(search);
  } finally {
    loading.value = false;
  }
});
</script>
