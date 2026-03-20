<template>
  <el-menu :unique-opened="true" :router="true" :default-active="$route.path" class="!border-0">
    <submenu :menuData="menuData"></submenu>
  </el-menu>
</template>

<script lang="ts" setup>
import submenu from './menuTree.vue';
defineProps(['menuData']);
</script>
