<template>
  <span :class="data.class" :style="showTextColor + data.style">
    <i
      v-if="options.some((o) => o.icon)"
      class="fa-fw"
      :class="data.icon"
      :title="showLabel(data.label)"
      style="cursor: help"
    />
    <template>{{ showLabel(data.label) }}</template>
  </span>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();

type option = {
  value?: string;
  label: string;
  color?: string;
  style?: string;
  icon?: string;
  class?: string;
};

const props = defineProps({
  /** 項目列表 */
  options: {
    type: Array as PropType<option[]>,
    required: true,
    default: () => []
  },
  /** 值 */
  value: {
    default: ''
  },
  /** 指定的value id名稱 */
  id: {
    type: String,
    default: 'value'
  }
});

const showLabel = (str: string) => {
  return i18n.te(str) ? i18n.t(str) : str;
};

/** 顯示文字顏色 */
const showTextColor = computed(() => {
  const color = data.value?.color;
  if (!color) return '';
  const IS_HEX = /#[0-9A-Fa-f]{6}/.test(color);
  return IS_HEX ? `color: ${color}` : `text-${color}`;
});

/** 篩出來的選項 */
const data = computed(() => {
  const result = props.options.find((x) => x[props.id as 'value'] === props.value);
  return result ? result : ({ label: 'Util.noData' } as option);
});
</script>
