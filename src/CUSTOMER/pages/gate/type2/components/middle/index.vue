<template>
  <div class="gap-2 xl:flex xl:justify-start">
    <div class="min-w-80 rounded bg-gray-200 xl:max-w-lg 2xl:w-[768px] 2xl:max-w-3xl">
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
      <develope v-if="$route.query.dev"></develope>
      <div
        v-else-if="isType2"
        class="object bg-stripes rounded"
        :style="`--border: ${isWarning ? '#000' : 'transparent'}`"
        :class="[isWarning ? 'warning' : '', isWorking ? 'working' : '']"
      >
        <gateImage class="absolute bottom-3 right-2 z-[2]"></gateImage>
        <deviceType2 class="h-auto max-w-full"></deviceType2>
      </div>
      <div
        v-else
        class="object bg-stripes rounded"
        :style="`--border: ${isWarning ? '#000' : 'transparent'}`"
        :class="[isWarning ? 'warning' : '', isWorking ? 'working' : '']"
      >
        <gateImage class="absolute bottom-3 right-2 z-[2]"></gateImage>
        <device2 class="h-auto max-w-full"></device2>
      </div>
      <div
        v-if="$route.query.test"
        class="object bg-stripes flex-1 rounded 2xl:max-w-[1136px]"
        :style="`--border: ${isWarning ? '#000' : 'transparent'}`"
        :class="[isWarning ? 'warning' : '', isWorking ? 'working' : '']"
      >
        <gateImage class="absolute bottom-3 right-2"></gateImage>
        <device class="h-auto max-w-full"></device>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue';
import myCamera from '@/CUSTOMER/components/camera.vue';
import device from './device.vue';
import device2 from './device2.vue';
import deviceType2 from './device_type2.vue';
import top from './top.vue';
import { $gate } from '@/CUSTOMER/provide';
import gateImage from '../../../components/gateImage.vue';
import develope from '../../../components/develope.vue';

defineProps({
  isUltraWarning: Boolean
});

const data = inject($gate);

/** 水門的顯示方式，當為type2 時，每張示意圖僅會有一個水門 */
const isType2 = computed(() => data?.value?.Gate.GateType === 4);

/** 取得所有水門的PLC 並且平面化 */
const flatGateTags = computed(
  () => data?.value?.Gate.DamSections.map((o) => o.PLCs).reduce((a, b) => [...a, ...b], []) || []
);

const isWarning = computed(() => {
  /** 水門出狀況的標籤 */
  const gateWarningTags = ['165-', '178-', '153-'];

  try {
    /** 檢查水門是否有出狀況 */
    const isGateWarning = flatGateTags.value.some((PLC) =>
      gateWarningTags.some((tag) => PLC.Tag.includes(tag) && PLC.Value === true)
    );
    /** 檢查其餘設備狀況 */
    const isPLCWarning = (data?.value?.Sections || [])
      .find((s) => s.SectionType === 5)
      ?.PLCs.some((o) => {
        /** 防盜解除 #145 */
        if (o.Tag === '179') return false;
        return o.Value === true;
      });
    return isGateWarning || isPLCWarning;
  } catch (error) {
    return false;
  }
});

const isWorking = computed(() => {
  /** 水門運作中的標籤 */
  const gateWorkingTags = ['217-', '218-'];

  try {
    return flatGateTags.value.some((PLC) =>
      gateWorkingTags.some((tag) => PLC.Tag.includes(tag) && PLC.Value === true)
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
const activeGroup = ref(1);
</script>
