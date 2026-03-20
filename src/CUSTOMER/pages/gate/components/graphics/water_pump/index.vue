<template>
  <div class="flex items-center justify-center gap-3 p-3">
    <div class="flex min-w-40 flex-col gap-2">
      <strong
        class="text-nowrap rounded border-2 border-zinc-700 bg-zinc-600 px-4 text-center text-white shadow-sm"
      >
        <template v-if="gateName">{{ gateName }}</template>
        <template v-else>抽水幫浦 {{ index }} </template>
      </strong>

      <strong
        v-for="(schedule, i) in schedules"
        :key="`schedule_${i}`"
        class="text-nowrap rounded border-2 border-zinc-700 bg-zinc-600 px-4 text-white shadow-sm"
      >
        <i class="fas fa-fw fa-clock"></i>
        {{ $day(schedule.start, 'HH:mm') }} - {{ $day(schedule.end, 'HH:mm') }}
      </strong>

      <strong class="my-status text-center text-lg">
        {{ statusName || '-' }}
      </strong>
    </div>
    <motor :status="status" class="w-[80px]"></motor>
  </div>
</template>

<script setup lang="ts">
import motor from '../assets/waterPump.vue';

defineProps<{
  /** 狀態名稱 */
  statusName?: '運轉中' | '停止' | '' | string;
  /** 馬達狀態 */
  status?: 'error' | 'working' | 'online' | 'offline';
  /** 閘門編號 */
  index?: string;
  /** 水門拆分時似乎有流域問題，因此用 gateName 取代 index */
  gateName?: string;
  schedules: { start: string; end: string }[];
}>();
</script>
