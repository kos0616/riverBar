<template>
  <time :class="{ 'text-el-danger': ten_seconds }">
    <span> 更新時間: </span>
    <span class="font-mono">
      {{ date }}
      {{ time }}
    </span>
  </time>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue';
import { ref } from 'vue';
import { useCounterAxios } from '@/CUSTOMER/pinia/axios';

const counterAxios = useCounterAxios();
// API更新時間
const update = computed(() => counterAxios.update);

const showDate = () => update.value.toLocaleDateString();
const showTime = () => update.value.toLocaleTimeString();

const date = ref(showDate());
const time = ref(showTime());
// 超過十秒 顯示紅色
let ten_seconds = ref(false);

const initClock = () => {
  setInterval(() => (date.value = showDate()), 1000);
  setInterval(() => (time.value = showTime()), 1000);

  setInterval(() => {
    const now = new Date().getTime();
    // 更新時間+十秒
    const updatePlus10Seconds = update.value.getTime() + 10 * 1000;

    if (now > updatePlus10Seconds) {
      ten_seconds.value = true;
    } else {
      ten_seconds.value = false;
    }
  }, 1000);
};

onMounted(() => {
  initClock();
});
</script>
