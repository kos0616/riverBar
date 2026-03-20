<template>
  <template v-for="(value, i) in menuData">
    <el-sub-menu
      :index="value.name"
      :key="`submenu_${i}`"
      v-if="Array.isArray(value.children) && value.children.length > 0"
    >
      <template #title>
        <i class="fa-fw mr-1" :class="value.icon"> </i>
        {{ showNodeName(value.name) }}
      </template>
      <menuTree :menuData="value.children"></menuTree>
    </el-sub-menu>

    <el-menu-item v-else :index="`/${value.route}`" :key="`menu_${i}`">
      <router-link :to="`/${value.route}`" class="block w-full">
        <i class="fa-fw mr-1 !align-middle" :class="value.icon"> </i>
        {{ showNodeName(value.name) }}
      </router-link>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import menuTree from './menuTree.vue';
import type { menu } from './type';
const $i18n = useI18n();

defineProps({
  menuData: {
    type: Array as PropType<menu[]>,
    default: () => []
  }
});

/** 客製化語系常數 */
const VITE_APP_NAME = import.meta.env.VITE_APP_NAME;

const showNodeName = (str: string) => {
  if ($i18n.te(`${VITE_APP_NAME}.${str}`)) return $i18n.t(`${VITE_APP_NAME}.${str}`);
  if ($i18n.te(`Permission.${str}`)) return $i18n.t(`Permission.${str}`);
  return str;
};
</script>
