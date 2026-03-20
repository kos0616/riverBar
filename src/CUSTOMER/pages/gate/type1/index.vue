<template>
  <div class="flex flex-col gap-2 p-2">
    <middle :isUltraWarning="isUltraWarning" />
    <bottom :isUltraWarning="isUltraWarning" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import middle from './components/middle/index.vue';
import bottom from './components/bottom/index.vue';

const route = useRoute();
/** 超級錯誤: 停電 */
const isUltraWarning = computed(() => route.query.onerror === 'true');
</script>
