<template>
  <main>
    <div class="mx-auto w-full">
      <div class="grid p-3">
        <h2 v-if="SiteName" class="mb-1 text-xl font-bold">{{ SiteName }}</h2>
        <nav v-else class="my-nav mb-3 hidden gap-2 lg:flex">
          <label
            v-for="site in sites"
            :key="site.SiteCode"
            :class="{
              'border-transparent !bg-el-primary text-white': activeSite === site.SiteCode
            }"
            class="block whitespace-nowrap rounded-lg border bg-white px-4 py-2 shadow-sm transition-colors"
            role="button"
          >
            <input v-model="activeSite" :value="site.SiteCode" type="radio" class="hidden" />
            {{ site.Name }}
          </label>
        </nav>

        <nav class="my-nav hidden gap-2 lg:flex">
          <label
            v-for="location in filtedTableData"
            :class="{ 'bg-el-primary text-white': activeLocation === location.LocationCode }"
            :key="location.LocationCode"
            class="my-label block whitespace-nowrap"
            role="button"
          >
            <input
              v-model="activeLocation"
              :value="location.LocationCode"
              type="radio"
              class="hidden"
            />
            {{ location.Name }}
          </label>
        </nav>

        <div class="mb-3 flex overflow-hidden rounded-full bg-white lg:hidden">
          <span v-if="SiteName" class="text-nowrap px-2">{{ SiteName }}</span>
          <el-select
            v-else
            placeholder="全部"
            v-model="activeSite"
            style="
              --el-fill-color-blank: transparent;
              --el-border-color: transparent;
              --el-border-color-hover: transparent;
              --el-color-primary: transparent;
              box-shadow: 0px 4px 20px 0px rgba(28, 98, 138, 0.15);
            "
          >
            <el-option
              v-for="site in sites"
              :key="`opt_${site.SiteCode}`"
              :value="site.SiteCode"
              :label="site.Name"
            >
              {{ site.Name }}
            </el-option>
          </el-select>

          <el-select
            v-model="activeLocation"
            style="
              --el-fill-color-blank: transparent;
              --el-border-color: transparent;
              --el-border-color-hover: transparent;
              --el-color-primary: transparent;
              box-shadow: 0px 4px 20px 0px rgba(28, 98, 138, 0.15);
            "
          >
            <el-option
              v-for="location in filtedTableData"
              :key="`xs_${location.LocationCode}`"
              :value="location.LocationCode"
              :label="location.Name"
            >
              {{ location.Name }}
            </el-option>
          </el-select>
        </div>
        <div v-if="loading" class="py-10 text-center text-2xl">
          <i class="fa-solid fa-circle-notch fa-spin text-[150%]"></i>
          <div class="py-2">資料讀取中</div>
        </div>
        <section
          v-else
          class="info-section"
          :class="{ '!rounded-tl-none': activeLocation === filtedTableData[0]?.LocationCode }"
        >
          <nav v-if="!activeCamera" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <myCamera
              v-for="(camera, i) in selectedLocationCameras(currentPage)"
              :key="`camera${i}`"
              @click="activeCamera = camera"
              :img="isCameraRefresh ? imgPlaceholder : camera.Url"
              :label="camera.Name"
              :ratio="'aspect-[4/3]'"
              class="outline outline-2 -outline-offset-2 hover:outline-white hover:brightness-125"
            >
            </myCamera>
          </nav>
          <myCamera
            v-else
            @click="activeCamera = null"
            :img="isCameraRefresh ? imgPlaceholder : activeCamera.Url"
            :label="activeCamera.Name"
            :ratio="'aspect-[4/3]'"
          >
          </myCamera>
        </section>

        <el-pagination
          class="mt-5"
          background
          v-model:current-page="currentPage"
          layout="prev, pager, next"
          :page-size="PAGE_SIZE"
          :hide-on-single-page="true"
          :total="selectedLocationCameras().length"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
/**
 * CCTV 和 防災 CCTV
 * 目前僅API不同
 */
import { onMounted, ref, computed, watch } from 'vue';
import GetDisasterCameras from '@/CUSTOMER/Service/Location/GetDisasterCameras';

import GetAllLocation from '@/CUSTOMER/Service/GetAllLocation';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';
import workStations from '@/CUSTOMER/static/workStations.json';
import myCamera from '@/CUSTOMER/components/camera.vue';

const imgPlaceholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC';

const userInfoStore = useUserInfoStore();

type mergedData = ((typeof allCameras.value)[number] & (typeof allLocations.value)[number])[];

const activeCamera = ref<{ Name: string; Url: string } | null>(null);

const allCameras = ref<Awaited<ReturnType<typeof GetDisasterCameras>>>([]);
const allLocations = ref<Awaited<ReturnType<typeof GetAllLocation>>>([]);

/** 使用者被綁定的工作站 */
const SiteCode = computed(() => userInfoStore.userInfo.SiteCode);
const SiteName = computed(() => userInfoStore.SiteName);

/** 工作站 */
const _sites = [{ Name: '全部', id: '' }, ...workStations];
const activeSite = ref('');
const activeLocation = ref('');

const sites = computed(() => {
  return _sites.map((obj) => formater(obj.Name, obj.id, tableData.value));
  function formater(Name: string, SiteCode: string, res: mergedData) {
    const data = res.filter(({ LocationCode }) => LocationCode.includes(SiteCode));
    return { Name, SiteCode, Location: data || [] };
  }
});

const filtedTableData = computed(() => {
  const arr = tableData.value;
  const mySite = SiteCode.value;
  const myLocation = activeSite.value;
  if (mySite) return arr.filter((o) => o.LocationCode.includes(mySite));
  if (myLocation)
    return arr.filter((o) => (myLocation === '全部' ? true : o.LocationCode.includes(myLocation)));
  return arr;
});

const PAGE_SIZE = 12;

const selectedLocationCameras = (currentPage?: number) => {
  const arr =
    filtedTableData.value.find((o) => o.LocationCode === activeLocation.value)?.Cameras || [];
  if (currentPage) {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return arr.slice(startIndex, endIndex);
  } else return arr;
};

const currentPage = ref(1);

const loading = ref(false);

const tableData = ref<mergedData>([]);

const getLists = async () => {
  try {
    loading.value = true;
    [allCameras.value, allLocations.value] = await Promise.all([
      GetDisasterCameras(),
      GetAllLocation()
    ]);

    const mergedData = allCameras.value.map((camera) => {
      const location = allLocations.value.find((loc) => loc.LocationCode === camera.LocationCode);
      return { ...camera, ...location };
    });

    tableData.value = mergedData as mergedData;
    activeLocation.value = filtedTableData.value[0]?.LocationCode;
  } finally {
    loading.value = false;
  }
};

const isCameraRefresh = ref(false);
watch(
  () => selectedLocationCameras(currentPage.value),
  () => {
    isCameraRefresh.value = true;
    setTimeout(() => {
      isCameraRefresh.value = false;
    }, 100);
  }
);

watch(activeSite, () => {
  activeLocation.value = filtedTableData.value[0]?.LocationCode;
});

onMounted(async () => {
  await getLists();
});
</script>
