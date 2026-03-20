<template>
  <el-dialog :model-value="modelValue" @close="$emit('close')" width="500" title="檢視帳號">
    <el-form
      v-loading="loading"
      :model="data"
      label-position="left"
      label-width="120"
      class="my-form"
    >
      <el-form-item label="帳號">
        {{ data?.UserName }}
      </el-form-item>
      <el-form-item label="名稱">
        {{ data?.ChiName }}
      </el-form-item>
      <el-form-item label="Email">
        {{ data?.Email }}
      </el-form-item>

      <el-form-item label="角色">
        <el-tag class="mr-1" v-for="(r, index) in data?.Roles" :key="index">
          {{ showRole(r) }}
        </el-tag>
      </el-form-item>
      <el-form-item label="工作站權限">
        <span v-if="!loading">
          {{ data?.SiteCode === null ? '全部' : showStation(data?.SiteCode) }}
        </span>
      </el-form-item>

      <el-form-item label="綁定Line官方帳號">
        <span v-if="data?.isLineLinked" class="text-el-success">有</span>
        <span v-else>無</span>
      </el-form-item>

      <el-form-item label="禁止名單">
        <span :class="data?.Lockout ? 'text-red-500' : ''">
          {{ showLockout(data?.Lockout) }}
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Info, { type response, type Permission } from './Service/Info';
import RolesLists from '@/CUSTOMER/pages/role/Service/Lists';
import stationRights from '@/CUSTOMER/static/stationRights.json';

defineEmits(['success', 'close']);

interface Prop {
  modelValue: boolean;
  id?: string;
  roles?: Awaited<ReturnType<typeof RolesLists>>;
}
const props = defineProps<Prop>();

const data = ref<response>();
const tableData = ref<Permission[]>();

const loading = ref(false);

const getInfo = async () => {
  try {
    if (!props.id) return;
    loading.value = true;
    const res = await Info(props.id);
    data.value = res;
    tableData.value = res.Permissions;
  } finally {
    loading.value = false;
  }
};

const showRole = (str: string) => {
  return (props.roles || []).find((o) => o.Name === str)?.DisplayNmae || '未知角色';
};

const showStation = (str?: string) => {
  const arr = stationRights.map((o) => o.Stations).flat();
  return arr.find((o) => o.Station === str)?.Name || 'N/A';
};

const showLockout = (Lockout?: boolean) => {
  return Lockout ? '已封鎖' : '未封鎖';
};

onMounted(async () => {
  await getInfo();
});
</script>
