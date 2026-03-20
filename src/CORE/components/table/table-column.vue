<template>
  <el-table-column v-if="$screenWidth.value >= 991" v-bind="$attrs">
    <template #header>
      {{ label }}
    </template>
    <template #default="{ row }">
      <slot :row="row">{{ row[prop] }}</slot>
    </template>
  </el-table-column>

  <div v-else v-bind="$attrs" class="mb-2 flex flex-wrap justify-between py-1">
    <span class="text-[#5d6065]">{{ label }}</span>
    <slot :row="row">
      <span>{{ row[prop] }}</span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';

defineProps({
  /**
   * 額外傳入的 prop ，為 card-type 所使用
   * 若 card-type 中，使用 template 進行內容客製化，則可以不需要傳入row
   */
  row: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  /** el-table-column default label */
  label: {
    type: String,
    default: ''
  },
  /** el-table-column default prop */
  prop: {
    type: String,
    default: ''
  }
});
</script>
