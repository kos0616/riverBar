<template>
  <figure
    class="m-0 flex items-center gap-2 overflow-hidden rounded-lg border-[3px] border-white bg-white shadow-sm"
  >
    <div
      v-if="$slots.default"
      :class="classes"
      class="flex aspect-square h-full max-w-20 items-center justify-center p-1"
    >
      <slot></slot>
    </div>
    <figcaption class="flex h-full flex-col text-nowrap">
      <span>{{ name }}</span>
      <strong v-if="hideStatus !== true" :style="statusShowing.style" class="text-lg">
        {{ statusShowing.name }}
      </strong>
      <el-switch
        v-if="showSwitch === true"
        :model-value="switchStatus"
        @click="$emit('switch')"
        inline-prompt
        active-text="ON"
        inactive-text="OFF"
      >
      </el-switch>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  /** 設備名稱 */
  name?: string;
  /** 設備狀態 */
  status?: 'error' | 'working' | 'online' | 'offline';
  hideStatus?: boolean;
  /** 啟動器 */
  showSwitch?: boolean;
  switchStatus?: boolean;
}>();

defineEmits(['switch']);

const classes = computed(() => {
  switch (props.status) {
    case 'error':
      return 'bg-amber-100';
    case 'online':
      return 'bg-green-100';
    case 'working':
      return 'bg-red-100';
    default:
      return 'bg-zinc-200';
  }
});

const statusShowing = computed(() => {
  switch (props.status) {
    case 'error':
      return { name: '錯誤', style: 'color: #f39c12' };
    case 'online':
      return { name: '待機', style: 'color: #27ae60' };
    case 'working':
      return { name: '運作中', style: 'color: #e74c3c' };
    case 'offline':
      return { name: '離線' };
    default:
      return { name: '無訊號' };
  }
});
</script>
