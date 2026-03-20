<template>
  <main class="max-w-sm">
    <el-card>
      <template #header>
        <div class="flex">
          <el-button class="mr-auto" @click="$router.go(-1)" title="返回" link>
            <i class="fa-solid fa-chevron-left"></i>
            <span class="pl-1">返回</span>
          </el-button>
          <el-button type="primary" @click="handleSave" round>
            <i class="fa-solid fa-save fa-fw"></i>
            儲存
          </el-button>
        </div>
      </template>

      <el-skeleton :loading="loading" animated>
        <template #template>
          <h2 class="mb-1 text-lg">
            <el-skeleton-item variant="p" style="width: 10rem" />
          </h2>
        </template>
        <template #default>
          <h2 class="mb-1 text-lg">
            {{ data?.DisplayNmae }}
            <span v-if="data?.Name">({{ data?.Name }})</span>
          </h2>
        </template>
      </el-skeleton>
      <el-table v-loading="loading" :data="allPermissions" stripe>
        <el-table-column prop="SubjectName" label="功能" header-align="center"> </el-table-column>
        <!-- <el-table-column prop="w" label="新增" width="54" align="center">
          <template #default="prop">
            <button
              @click="handleClick(prop.row.SubjectId, 'w')"
              v-if="(prop.row.crud || []).includes('w')"
              :class="
                (userPermissions[prop.row.SubjectId] || []).includes('w')
                  ? 'text-el-success'
                  : 'text-gray-400'
              "
              title="編輯權限: 新增"
            >
              <i class="fa-fw fa-solid fa-plus"></i>
            </button>
          </template>
        </el-table-column> -->
        <el-table-column prop="r" label="瀏覽" width="54" align="center" header-align="center">
          <template #default="prop">
            <button
              @click="handleClick(prop.row.SubjectId, 'r')"
              v-if="(prop.row.crud || []).includes('r')"
              :class="
                (userPermissions[prop.row.SubjectId] || []).includes('r')
                  ? 'text-el-success'
                  : 'text-gray-400'
              "
              title="編輯權限: 瀏覽"
            >
              <i class="fa-fw fa-solid fa-eye"></i>
            </button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="u" label="編輯" width="54" align="center">
          <template #default="prop">
            <button
              @click="handleClick(prop.row.SubjectId, 'u')"
              v-if="(prop.row.crud || []).includes('u')"
              :class="
                (userPermissions[prop.row.SubjectId] || []).includes('u')
                  ? 'text-el-success'
                  : 'text-gray-400'
              "
              title="編輯權限: 編輯"
            >
              <i class="fa-fw fa-solid fa-edit"></i>
            </button>
          </template>
        </el-table-column>
        <el-table-column prop="d" label="刪除" width="54" align="center">
          <template #default="prop">
            <button
              @click="handleClick(prop.row.SubjectId, 'd')"
              v-if="(prop.row.crud || []).includes('d')"
              :class="
                (userPermissions[prop.row.SubjectId] || []).includes('d')
                  ? 'text-el-success'
                  : 'text-gray-400'
              "
              title="編輯權限: 刪除"
            >
              <i class="fa-fw fa-solid fa-trash-alt"></i>
            </button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import Info, { type response, type Permission } from './Service/Info';
import Permissions from './Service/Permissions';
import Delete from './Service/DeletePermissions';
import Create from './Service/CreatePermissions';
import { ElMessage } from 'element-plus';
import { useBreadcrumbStore } from '@/CUSTOMER/pinia/breadcrumbs';
import { useRoute } from 'vue-router';

const breadcrumbStore = useBreadcrumbStore();

type typePermission = Omit<Permission, 'Code' | 'ActionName' | 'ActionId'> & {
  /** w r u d */
  crud: string[];
};

// 格式化 並且收集權限列表
function reducePermission(cur: typePermission[], nex: Permission) {
  const exist = cur.find((o) => o.SubjectId === nex.SubjectId);
  if (exist) {
    exist.crud.push(nex.ActionId);
  } else {
    cur.push({
      SubjectId: nex.SubjectId,
      SubjectName: nex.SubjectName,
      crud: [nex.ActionId]
    });
  }
  return cur;
}

function permissionToCodes(obj: Record<string, string[] | undefined>) {
  return Object.entries(obj)
    .map(([key, values]) => values?.map((str) => `${key}-${str}`))
    .flat()
    .filter((o) => typeof o === 'string') as string[];
}

const data = ref<response>();

const allPermissions = ref<ReturnType<typeof reducePermission>>();
/** 用戶權限 */
const userPermissions = ref<Record<string, string[] | undefined>>({});

const props = defineProps(['id']);

const loading = ref(false);
/** 用戶預設的權限(未改變) */
const defaultPermissionCodes = computed(() => data.value?.Permissions.map((o) => o.Code));

/** 取得新增與刪除的項目 */
const generateRequest = () => {
  const current = defaultPermissionCodes.value || [];
  const arr = permissionToCodes(userPermissions.value);
  const deleted = current.filter((element) => !arr.includes(element));
  const created = arr.filter((element) => !current.includes(element));
  return { deleted, created };
};

const handleSave = async () => {
  const { deleted, created } = generateRequest();
  const name = data.value?.Name;
  if (!name) return;
  try {
    loading.value = true;
    if (deleted.length) await Delete({ name, codes: deleted });
    if (created.length) await Create({ name, codes: created });
    await getInfo();
    ElMessage.success('編輯成功');
  } finally {
    loading.value = false;
  }
};

const getInfo = async () => {
  const res = await Info(props.id);
  data.value = res;

  userPermissions.value = res.Permissions.reduce(reducePermission, []).reduce(
    (acc, cur) => {
      acc[cur.SubjectId] = cur.crud;
      return acc;
    },
    {} as Record<string, string[]>
  );
  initBread(data.value.DisplayNmae);
};

/** 取得總權限，但目前僅能取得使用者自己的總權限 */
const getAllPermissions = async () => {
  const res = await Permissions();
  allPermissions.value = res.reduce(reducePermission, []);
};

/** 點擊方格編輯權限 */
const handleClick = (node: string, crud: 'w' | 'r' | 'u' | 'd') => {
  let userNode = userPermissions.value[node] || [];

  const isArr = Array.isArray(userNode);
  if (!isArr) userNode = [];

  const findIndex = userNode.indexOf(crud);
  if (findIndex !== -1) {
    if (crud === 'r') {
      userNode = [];
    } else {
      userNode.splice(findIndex, 1);
    }
  } else {
    userNode = addPermission(crud);
  }

  userPermissions.value[node] = userNode;

  /** 增修刪時，附贈讀取權限 */
  function addPermission(right: typeof crud) {
    const hasRead = userNode.includes('r');
    if (hasRead) {
      return [...userNode, right];
    } else if (right !== 'r') {
      return [...userNode, right, 'r'];
    } else {
      return ['r'];
    }
  }
};

const route = useRoute();
const initBread = (label: string) => {
  if (!route.meta.breadcrumb) return;
  const breadcrumb = [...(route.meta.breadcrumb || []), { label }];
  breadcrumbStore.breadcrumbs = breadcrumb;
};

onMounted(async () => {
  try {
    loading.value = true;
    await getInfo();
    await getAllPermissions();
  } finally {
    loading.value = false;
  }
});
</script>
