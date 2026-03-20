<template>
  <div class="bg-gray-950 p-3">
    <ul class="flex gap-2 overflow-hidden rounded rounded-t bg-gray-200">
      <li v-for="(group, i) in []" :key="`camera${i}`">
        <label
          :class="{ active: activeGroup === i }"
          class="relative block px-3 py-1 pb-2 after:absolute after:bottom-0 after:left-0 after:block after:h-0 after:w-full after:bg-primary-400 after:transition-all after:content-[''] has-[:checked]:bg-white has-[:checked]:text-primary-400 has-[:checked]:after:h-1"
        >
          <input v-model="activeGroup" :value="i" type="radio" class="hidden" />
          {{ group }}
        </label>
      </li>

      <li class="ml-auto block px-3 py-1 pb-2">
        <router-link
          :to="`/iws/${$route.params.id}`"
          title="返回操控畫面"
          class="hover:text-primary-400"
        >
          <i class="fa-solid fa-fw fa-computer"></i>
          返回
        </router-link>
      </li>
    </ul>

    <nav v-if="!activeCamera" class="grid grid-cols-3">
      <myCamera
        v-for="(camera, i) in cameras"
        :key="`camera${i}`"
        @click="activeCamera = camera"
        :img="camera.Url"
        :label="camera.Name"
        class="outline outline-2 -outline-offset-2 hover:outline-white hover:brightness-125"
      >
      </myCamera>
    </nav>
    <myCamera
      v-else
      @click="activeCamera = null"
      :img="activeCamera.Url"
      :label="activeCamera.Name"
    >
    </myCamera>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, computed } from 'vue';
import Info, { type response } from '../gate/Service/Info';
import { onMounted } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import { useBreadcrumbStore } from '@/CUSTOMER/pinia/breadcrumbs';
import myCamera from '@/CUSTOMER/components/camera.vue';
// TODO: getData every 5sec

const breadStore = useBreadcrumbStore();

const props = defineProps(['id']);

const loading = ref(true);

const activeCamera = ref<{ Name: string; Url: string } | null>(null);
const activeGroup = ref(0);

const data = ref<response>();
provide($gate, data);

const cameras = computed(() => data.value?.Cameras || []);

const setBread = (gate: typeGate) => {
  breadStore.breadcrumbs = [
    { label: '苗栗站', href: '/iws/S01' },
    { label: gate.Name, href: `/gate/${gate.LocationCode}` }
  ];
};

const getInfo = async (id: string) => {
  try {
    loading.value = true;
    data.value = await Info(id);
    setBread(data.value);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getInfo(props.id);
});
</script>
