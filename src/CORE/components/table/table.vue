<template>
  <el-table v-if="$screenWidth.value >= 991" :data="data" v-bind="$attrs" class="table-loading">
    <template #empty>
      <div class="loading hidden text-xl">資料讀取中</div>
      <div class="no-data text-xl">
        <img src="./no-data.svg" alt="空資料夾" class="mx-auto" />
        暫無資料
      </div>
    </template>
    <slot></slot>
  </el-table>

  <div v-else v-bind="$attrs" class="table-loading pb-20">
    <template v-if="data.length === 0">
      <div class="loading hidden py-10 text-center text-xl">資料讀取中</div>
      <div class="no-data info-section bg-white pb-10 text-center text-xl">
        <img src="./no-data.svg" alt="空資料夾" class="mx-auto" />
        暫無資料
      </div>
    </template>
    <div
      v-for="(item, i) in data"
      @click="$emit('cell-click', item, { type: 'default', prop: item.prop })"
      :key="`table_${i}`"
      class="info-section mb-4 bg-white p-3"
    >
      <slot :row="item"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
/**
 * pb-20 是給手機版toolbar的高度
 */
defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => []
  }
});

/** 請不要設定 defineEmits 這將會取消 el-table的原生 'cell-click' */
// const emit = defineEmits(['cell-click']);

/**
 * 表格列點擊觸發
 * 無法完全比照 el-table
 * FIXME: 在具有 actions 的狀況下，可能會有問題
 * canTrigger = cell.type === 'default' && cell.property !== 'actions';
 * cell.property === 'active' 似乎因為 <template> 包裹的關係，無法取得 prop
 * 因此若將 type 修改為非規定的值，即可在PC版略過觸發
 */
// const onCellClick = (item: any) => {
//   emit('cell-click', item, { type: 'default', prop: item.prop });
// };
</script>

<style>
.table-loading[loading-number] .no-data {
  display: none;
}
.table-loading[loading-number] .loading {
  display: block;
}
</style>
