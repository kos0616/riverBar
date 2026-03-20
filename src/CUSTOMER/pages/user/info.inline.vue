<template>
  <main class="max-w-sm">
    <el-card>
      <template #header>
        <div class="flex">
          <el-button class="mr-auto" @click="$router.go(-1)" title="返回" link>
            <i class="fa-solid fa-chevron-left"></i>
            <span class="pl-1">返回</span>
          </el-button>
        </div>
      </template>
      <el-form
        v-loading="loading"
        :model="data"
        label-width="auto"
        :label-position="$screenWidth.value > 640 ? 'left' : 'top'"
      >
        <el-form-item label="使用者名稱">
          {{ data?.UserName }}
        </el-form-item>
        <el-form-item label="暱稱">
          {{ data?.ChiName }}
        </el-form-item>
        <el-form-item label="Email">
          {{ data?.Email }}
        </el-form-item>

        <el-form-item label="角色">
          <el-tag class="mr-1" v-for="(r, index) in data?.Roles" :key="index">{{ r }}</el-tag>
        </el-form-item>
      </el-form>
    </el-card>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Info, { type response, type Permission } from './Service/Info';
import { useBreadcrumbStore } from '@/CUSTOMER/pinia/breadcrumbs';
import { useRoute } from 'vue-router';

const data = ref<response>();
const tableData = ref<Permission[]>();

const props = defineProps(['id']);

const breadcrumbStore = useBreadcrumbStore();

const loading = ref(false);

const getInfo = async () => {
  try {
    loading.value = true;
    const res = await Info(props.id);
    data.value = res;
    tableData.value = res.Permissions;
    initBread(data.value.ChiName);
  } finally {
    loading.value = false;
  }
};

const route = useRoute();
const initBread = (label: string) => {
  if (!route.meta.breadcrumb) return;
  const breadcrumb = [...(route.meta.breadcrumb || []), { label }];
  breadcrumbStore.breadcrumbs = breadcrumb;
};

onMounted(async () => {
  await getInfo();
});
</script>
