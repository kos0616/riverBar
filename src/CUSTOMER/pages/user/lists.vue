<template>
  <main>
    <div class="mx-auto w-full">
      <div class="mb-5 flex flex-col items-center justify-between gap-8 sm:flex-row xl:gap-4">
        <totalInfo :model-value="stats"></totalInfo>
        <search :roles="rolesData"></search>
      </div>

      <div class="md:info-section gap-3 sm:grid">
        <div class="toolbar">
          <el-button
            @click="doCreate"
            :disabled="!$WRUD('w')"
            type="primary"
            :circle="$screenWidth.value < 640"
          >
            <i class="fa-solid fa-plus fa-fw"></i>
            <span class="hidden sm:inline">新增帳號</span>
          </el-button>
        </div>
        <my-table
          v-loading="loading"
          :data="filtedTableData"
          @cell-click="handleCellClick"
          row-class-name="cursor-pointer"
          height="calc(100vh - 350px)"
          stripe
        >
          <template #default="{ row }">
            <my-table-column :row="row" prop="UserName" label="帳號" fixed header-align="center">
            </my-table-column>
            <my-table-column :row="row" prop="ChiName" label="名稱" header-align="center">
            </my-table-column>
            <my-table-column
              :row="row"
              v-if="$screenWidth.value > 768"
              prop="Email"
              label="Email"
              header-align="center"
            >
            </my-table-column>
            <my-table-column :row="row" prop="Roles" label="角色" header-align="center">
              <template #default="prop">
                <div class="flex gap-1">
                  <el-tag v-for="(r, index) in prop.row.Roles" :key="index">{{
                    showRole(r)
                  }}</el-tag>
                </div>
              </template>
            </my-table-column>
            <my-table-column :row="row" prop="SiteCode" label="工作站" header-align="center">
              <template #default="prop">
                <span v-if="!loading">
                  {{ prop.row?.SiteCode === null ? '全部' : showStation(prop.row?.SiteCode) }}
                </span>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              prop="Lockout"
              label="禁止名單"
              width="100"
              header-align="center"
            >
              <template #default="prop">
                <span v-if="prop.row?.Lockout" class="text-el-danger">已封鎖</span>
                <span v-else>-</span>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              prop="IsLineLinked"
              label="綁定Line官方帳號"
              header-align="center"
            >
              <template #default="prop">
                <span v-if="prop.row?.IsLineLinked" class="text-el-success">有</span>
                <span v-else>無</span>
              </template>
            </my-table-column>
            <my-table-column
              :row="row"
              width="60"
              header-align="center"
              label="操作"
              prop="actions"
              type="actions"
              @click.stop
            >
              <template #default="prop">
                <el-dropdown trigger="click" class="ml-auto">
                  <button
                    title="功能"
                    class="xl-w-4 xl-h-4 h-8 w-8 rounded-full border-white text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-500 active:border"
                  >
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="goInfo(prop.row)" title="檢視">
                        <i class="fa-solid fa-eye fa-fw"></i>檢視
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="goEdit(prop.row)"
                        :disabled="!$WRUD('w')"
                        title="編輯"
                      >
                        <i class="fa-solid fa-edit fa-fw"></i>編輯
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click="doDelete(prop.row)"
                        :disabled="!$WRUD('w')"
                        divided
                        title="刪除"
                      >
                        <span :class="{ 'text-el-danger': $WRUD('w') }">
                          <i class="fa-solid fa-trash-can fa-fw"></i>刪除
                        </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </my-table-column>
          </template>
        </my-table>
      </div>
    </div>
    <create
      v-if="dialogCreate"
      v-model="dialogCreate"
      @close="dialogCreate = false"
      @success="handleCreated"
    />
    <info
      v-if="dialogInfo"
      v-model="dialogInfo"
      :id="selected?.UserName"
      @close="dialogInfo = false"
      :roles="rolesData"
    />
    <edit
      v-if="dialogEdit"
      v-model="dialogEdit"
      :id="selected?.UserName"
      @close="dialogEdit = false"
      @success="getLists()"
    />
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import Lists from './Service/Lists';
import RolesLists from '@/CUSTOMER/pages/role/Service/Lists';
import { useRoute } from 'vue-router';
import Stats from './Service/Stats';
import Delete from './Service/Delete';
import create from './create.vue';
import info from './info.vue';
import edit from './edit.vue';
import search from './search.vue';
import totalInfo from './totalInfo.vue';
import stationRights from '@/CUSTOMER/static/stationRights.json';

type item = Awaited<ReturnType<typeof Lists>>[number];

const tableData = ref<Awaited<ReturnType<typeof Lists>>>([]);

const rolesData = ref<Awaited<ReturnType<typeof RolesLists>>>();

const dialogCreate = ref(false);

const dialogInfo = ref(false);

const dialogEdit = ref(false);

const selected = ref<item>();

const loading = ref(false);

const stats = ref();

const getStats = async () => {
  const res = await Stats();
  stats.value = res;
};

const route = useRoute();

const filtedTableData = computed(() => {
  const query = route.query as { keyword?: string; position?: string; department?: string };
  return tableData.value?.filter((o) => {
    const isName =
      !query.keyword ||
      o.UserName.toLowerCase().includes(query.keyword.toLowerCase().trim()) ||
      o.ChiName.toLowerCase().includes(query.keyword.toLowerCase().trim());

    const isPosition = !query.position || o.Roles?.includes(query.position);

    const isDepartment = !query.department || o.SiteCode === query.department;
    return isName && isPosition && isDepartment;
  });
});

const getLists = async () => {
  try {
    loading.value = true;
    const res = await Lists();
    tableData.value = res;
  } finally {
    loading.value = false;
  }
};

const showRole = (str: string) => {
  return rolesData.value?.find((o) => o.Name === str)?.DisplayNmae || '未知角色';
};

const getRolesLists = async () => {
  rolesData.value = await RolesLists();
};

const goInfo = (row: item) => {
  selected.value = row;
  dialogInfo.value = true;
};

const goEdit = (row: item) => {
  selected.value = row;
  dialogEdit.value = true;
};

const doCreate = () => {
  dialogCreate.value = true;
};

const handleCellClick = (item: item, cell: any) => {
  /** 普通類別 非下拉功能列才能觸發 */
  const canTrigger = cell.type === 'default' && cell.property !== 'actions';
  if (canTrigger) goInfo(item);
};

const doDelete = async (row: item) => {
  const doDelete = await Delete(row.UserName);
  if (doDelete) {
    getLists();
  }
};

const handleCreated = async (acc: item) => {
  await getLists();
  selected.value = acc;
  dialogEdit.value = true;
};

const showStation = (str?: string) => {
  const arr = stationRights.map((o) => o.Stations).flat();
  return arr.find((o) => o.Station === str)?.Name || '';
};

onMounted(async () => {
  getRolesLists();
  await getLists();
  await getStats();
});
</script>
