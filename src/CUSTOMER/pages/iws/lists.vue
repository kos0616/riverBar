<template>
  <main>
    <div class="md:info-section mx-auto w-full">
      <el-table
        v-if="$screenWidth.value >= 768"
        v-loading="loading"
        :data="filtedTableData"
        stripe
        size="large"
        height="calc(100vh - 200px)"
      >
        <el-table-column prop="Name" label="工作站" width="100" header-align="center">
        </el-table-column>
        <el-table-column label="現地端" header-align="center">
          <template #default="prop">
            <div class="flex-wrap gap-2 sm:!flex portrait:grid portrait:grid-cols-1">
              <router-link
                v-for="gate in prop.row.Gates"
                :key="gate.LocationCode"
                :to="`/iws/${gate.LocationCode}`"
                class="my-button"
                :title="`前往 ${gate.Name}`"
                role="button"
              >
                {{ gate.Name }}
              </router-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <nav class="mb-2 flex gap-2 overflow-x-auto pb-2">
          <a
            v-for="(site, i) in filtedTableData"
            :key="`site_${i}`"
            :href="`#${site.SiteCode}`"
            class="my-button"
          >
            {{ site.Name }}
          </a>
        </nav>

        <section
          v-for="(item, i) in filtedTableData"
          :key="`item_${i}`"
          class="info-section mb-4 bg-white px-0"
          :id="item.SiteCode"
        >
          <h2 class="border-b border-[var(--el-color-primary-light-7)] px-3 pb-3">
            {{ item.Name }}工作站
          </h2>
          <nav class="flex flex-wrap gap-2 px-3 pt-3">
            <router-link
              v-for="gate in item.Gates"
              :key="gate.LocationCode"
              :to="`/iws/${gate.LocationCode}`"
              class="my-button"
              :title="`前往 ${gate.Name}`"
              role="button"
            >
              {{ gate.Name }}
            </router-link>
          </nav>
        </section>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import GetAllLocation, { type response } from '@/CUSTOMER/Service/GetAllLocation';
import workStations from '@/CUSTOMER/static/workStations.json';
import { onMounted } from 'vue';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';

const loading = ref(true);

const userInfoStore = useUserInfoStore();
const SiteCode = computed(() => userInfoStore.userInfo?.SiteCode);

const tableData = ref<Array<ReturnType<typeof formater>>>([]);

const filtedTableData = computed(() => {
  const arr = tableData.value;
  const key = SiteCode.value as string;
  return key ? arr.filter((o) => o.SiteCode === key) : arr;
});

const getInfo = async () => {
  try {
    loading.value = true;
    const res = (await GetAllLocation()).sort((a, b) => a.Sort - b.Sort);
    tableData.value = workStations.map((obj) => formater(obj.Name, obj.id, res));
  } finally {
    loading.value = false;
  }
};

function formater(Name: string, SiteCode: string, res: response) {
  const data = res.filter(({ LocationCode }) => LocationCode.includes(SiteCode));
  return { Name, SiteCode, Gates: data || {} };
}

onMounted(async () => {
  await getInfo();
});
</script>

<style lang="scss" scoped>
.my-button {
  @apply block text-nowrap rounded-full border border-[#cccccc] bg-white px-4 py-2 text-sm transition-colors;
  &:hover,
  &:focus {
    @apply border-gray-300 bg-gray-100;
  }
}
</style>
