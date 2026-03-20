<template>
  <div class="grid gap-4">
    <div v-loading="loading" class="flex gap-5">
      <table v-for="(table, part) in breakedAllPermissions" :key="`table_${part}`" class="w-full">
        <thead>
          <tr>
            <th class="w-full text-nowrap rounded-l-xl bg-[#e3f3f0] px-3 py-3 text-left sm:px-5">
              功能
            </th>
            <th class="text-nowrap bg-[#e3f3f0] px-3 py-3 text-left sm:px-5">瀏覽</th>
            <th class="text-nowrap rounded-e-xl bg-[#e3f3f0] px-3 py-3 text-left sm:px-5">寫入</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in table"
            :key="`part_${part}_1_${i}`"
            class="border-b hover:bg-[#f5faf9]"
          >
            <td class="px-1 py-3">
              <label :for="`switch_${part}_1_${i}`">{{ item.SubjectName }}</label>
            </td>
            <template v-if="$WRUD('w')">
              <td class="px-1 py-3 text-center">
                <el-switch
                  v-if="(item.crud || []).includes('r')"
                  :id="`switch_r_${part}_${i}`"
                  @click="handleClick(item.SubjectId, 'r')"
                  :model-value="(userPermissions[item.SubjectId] || []).includes('r') || false"
                  title="編輯權限: 瀏覽"
                />
              </td>
              <td class="px-1 py-3 text-center">
                <el-switch
                  v-if="(item.crud || []).includes('w')"
                  :id="`switch_u_${part}_${i}`"
                  @click="handleClick(item.SubjectId, 'w')"
                  :model-value="(userPermissions[item.SubjectId] || []).includes('w') || false"
                  title="編輯權限: 寫入"
                />
              </td>
            </template>
            <template v-else>
              <td class="px-1 py-3 text-center">
                <i v-if="(item.crud || []).includes('r')" class="fas fa-eye text-gray-500"></i>
              </td>
              <td class="px-1 py-3 text-center">
                <i v-if="(item.crud || []).includes('w')" class="fas fa-edit text-gray-500"></i>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, getCurrentInstance } from 'vue';
import Info, { type response, type Permission } from './Service/Info';
import Permissions from './Service/Permissions';
import Delete from './Service/DeletePermissions';
import Create from './Service/CreatePermissions';
import { ElMessage } from 'element-plus';
import { emitter } from '@/CUSTOMER/plugins/bus';
import nodes from '@/CUSTOMER/static/nodes';

const width = getCurrentInstance()?.appContext.config.globalProperties.$screenWidth;

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

/** 拆成兩部分的 Permission, 但是在 mobile 模式會合併 */
const breakedAllPermissions = computed(() => {
  const arr = allPermissions.value || [];
  if (arr.length === 0) return [];

  if (width && width.value < 640) return [arr];

  const halfIndex = Math.ceil(arr.length / 2);
  const halfPermissions = [arr.slice(0, halfIndex), arr.slice(halfIndex)];
  return halfPermissions;
});
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
};

/** 取得總權限，但目前僅能取得使用者自己的總權限 */
const getAllPermissions = async () => {
  const res = await Permissions();

  allPermissions.value = res
    .map((o) => ({
      ...o,
      SubjectName: nodes.find((node) => node.route === o.SubjectId)?.name || o.SubjectName
    }))
    .reduce(reducePermission, []);
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

watch(
  () => props.id,
  async () => {
    try {
      loading.value = true;
      await getInfo();
    } finally {
      loading.value = false;
    }
  }
);

onMounted(async () => {
  try {
    loading.value = true;
    await getInfo();
    await getAllPermissions();
    emitter.on('save', async () => await handleSave());
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  emitter.off('save');
});
</script>
