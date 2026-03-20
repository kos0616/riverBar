<template>
  <div class="p-5">
    <h2>DEV PAGE</h2>
    <button @click="$bus.emit('refreshIws')">Trigger</button>
    {{ $screenWidth.value > 1 }}
    {{ $screenWidth }}
  </div>
</template>

<script lang="ts" setup>
// import { getCurrentInstance, onMounted } from 'vue';
// import { ElMessage } from 'element-plus';
// import { emitter } from '@/CUSTOMER/plugins/bus';
// const screenWidth = getCurrentInstance()?.appContext.config.globalProperties.$screenWidth;

// const bus = getCurrentInstance()?.appContext.config.globalProperties.$bus;
// onMounted(() => {
//   bus?.on('refreshIws', async () => {
//     ElMessage.success('Refreshed');
//   });

//   // emitter.on('refreshIws', async () => {
//   //   ElMessage.success('Refreshed from emitter');
//   // });
// });

// // const isDev = import.meta.env.DEV;

// const getInfo = async () => {
// await GetDisasterCameras();
// await Tester();
//   await GetLocationCameras();
// };

// onMounted(async () => {
// await getInfo();
//   await GetDisasterCameras();
//   await GetLocationCameras();
// });
</script>
