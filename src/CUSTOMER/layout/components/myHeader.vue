<template>
  <header
    class="sticky top-0 z-20 border-b border-zinc-300 bg-[#f8fbfc] md:static"
    style="box-shadow: 0px 4px 15px 0px rgba(28, 98, 138, 0.15)"
  >
    <div class="flex justify-between px-5 py-3 md:px-3 md:py-2">
      <div class="flex flex-wrap items-center gap-2">
        <button @click="$emit('sidebarChanged')" title="開啟選單" type="button" class="">
          <img
            src="@/CUSTOMER/assets/icons/menu.svg"
            width="24"
            height="24"
            alt="menu"
            class="min-w-6"
          />
        </button>
        <strong class="flex items-center gap-1">
          <img :src="logo" alt="LOGO" height="30" width="30" class="aspect-square h-[30px]" />
          <span class="text-nowrap text-lg text-primary">{{ BRAND }}</span>
        </strong>
        <slot></slot>
      </div>
      <slot name="append"></slot>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import logo from '../../assets/logo.svg';
const BRAND = ref('水文監控系統');

defineEmits(['sidebarChanged']);
</script>
