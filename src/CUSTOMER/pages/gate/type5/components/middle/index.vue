<template>
  <div class="gap-2 xl:flex xl:justify-start">
    <div class="min-w-80 shrink-0 rounded bg-gray-200 xl:max-w-lg 2xl:w-[768px] 2xl:max-w-3xl">
      <ul class="flex gap-2 overflow-x-auto rounded-t">
        <li v-for="group in 0" :key="group">
          <label
            :class="{ active: activeGroup === group }"
            class="relative block whitespace-nowrap px-3 py-1 pb-2 after:absolute after:bottom-0 after:left-0 after:block after:h-0 after:w-full after:bg-primary-400 after:transition-all after:content-[''] has-[:checked]:bg-white has-[:checked]:text-primary-400 has-[:checked]:after:h-1"
          >
            <input v-model="activeGroup" :value="group" type="radio" class="hidden" />
            群組{{ group }}
          </label>
        </li>
        <li class="relative ml-auto block whitespace-nowrap px-3 py-1 pb-2">
          <router-link
            :to="`/camera/${$route.params.id}`"
            title="前往監控畫面"
            class="hover:text-primary-400"
          >
            <i class="fa-solid fa-fw fa-network-wired"></i>
            監控
          </router-link>
        </li>
      </ul>

      <nav v-if="!activeCamera" class="grid grid-cols-2">
        <myCamera
          v-for="(camera, i) in cameras"
          :key="`camera${i}`"
          @click="activeCamera = camera"
          :img="camera.img"
          :label="camera.label"
          class="outline outline-2 -outline-offset-2 hover:outline-white hover:brightness-125"
        >
        </myCamera>
      </nav>
      <myCamera
        v-else
        @click="activeCamera = null"
        :img="activeCamera.img"
        :label="activeCamera.label"
      >
      </myCamera>
    </div>
    <div
      v-if="$screenWidth.value >= 768"
      :class="{ 'pointer-events-none cursor-not-allowed grayscale': isUltraWarning }"
    >
      <top class="xl:mb-2" />

      <div
        :style="`--border: ${isWarning ? '#000' : 'transparent'}`"
        :class="[isWarning ? 'warning' : '', isWorking ? 'working' : '']"
        class="object bg-stripes rounded"
      >
        <div class="px-3 py-2 text-end">
          <calendar :isLoading="isLoading" :modelValue="tableData" @refresh="getLists"></calendar>
        </div>
        <gateImage class="absolute bottom-3 right-2 z-[2]"></gateImage>
        <device :modelValue="tableData" class="h-auto max-w-full"></device>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, onMounted } from 'vue';
import myCamera from '@/CUSTOMER/components/camera.vue';
import gateImage from '../../../components/gateImage.vue';
import device from './device.vue';
import top from './top.vue';
import calendar from './calendar/index.vue';
import { $gate } from '@/CUSTOMER/provide';
import Lists from '@/CUSTOMER/Service/WaterPumpSchedules/Lists';

const data = inject($gate);

defineProps({
  isUltraWarning: Boolean
});

const tableData = ref<Awaited<ReturnType<typeof Lists>>>([]);

const isLoading = ref(false);

const getLists = async () => {
  try {
    isLoading.value = true;
    const res = await Lists();
    tableData.value = res;
  } finally {
    isLoading.value = false;
  }
};

const isWarning = computed(() => {
  try {
    return (data?.value?.Sections || [])
      .find((s) => s.SectionType === 5)
      ?.PLCs.some((o) => {
        /** 防盜解除 #145 */
        if (o.Tag === '179') return false;
        return o.Value === true;
      });
  } catch (error) {
    return false;
  }
});

const isWorking = computed(() => {
  /** 指定的作用中標籤 */
  // '904', '909', '916', '920', '924' = isDowning
  // '902', '907', '914', '918', '922' = isUping
  const tags = ['905', '412', '904', '909', '916', '920', '924', '902', '907', '914', '918', '922'];
  try {
    return data?.value?.Gate.MapSection.PLCs.filter((o) => tags.includes(o.Tag)).some(
      (o) => o.Value === true
    );
  } catch (error) {
    return false;
  }
});

const cameras = computed(() => {
  try {
    return data?.value?.Cameras.map((o) => ({ label: o.Name, img: o.Url })) || [];
  } catch (error) {
    return [];
  }
});

const activeCamera = ref<{ label: string; img: string } | null>(null);
const activeGroup = ref(0);

onMounted(async () => {
  await getLists();
});
</script>
