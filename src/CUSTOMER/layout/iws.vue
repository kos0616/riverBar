<template>
  <div class="my-bg flex min-h-[100dvh] flex-col">
    <myHeader @sidebar-changed="isShowSideBar = !isShowSideBar">
      <breadcrumb class="mx-auto"></breadcrumb>
      <template #append>
        <div class="hidden lg:flex">
          <topInfo>
            <clock v-if="$route.name === 'gates'"></clock>
          </topInfo>
        </div>
      </template>
    </myHeader>
    <nav
      :class="{ 'showModal -translate-x-full opacity-75': !isShowSideBar }"
      class="fixed left-0 top-0 z-[1001] h-dvh w-full overflow-y-auto bg-white opacity-100 shadow transition-transform duration-300 will-change-transform lg:w-auto lg:rounded-r-3xl"
    >
      <div class="px-5 py-3">
        <button
          @click="isShowSideBar = false"
          title="關閉選單"
          type="button"
          class="text-slate-500 transition-colors hover:text-primary-400"
        >
          <i class="icomoon icon-close"></i>
        </button>
      </div>
      <sidebarMenu :model-value="links"></sidebarMenu>
      <sidebarSubmenu class="mt-auto border-t md:border-t-0"></sidebarSubmenu>
    </nav>
    <router-view class="grow"></router-view>
    <div
      @click="isShowSideBar = false"
      v-if="isShowSideBar"
      class="animate-fade-in fixed inset-0 z-[1000] bg-zinc-900/50 backdrop-blur-[2px]"
    />
  </div>
</template>

<script lang="ts" setup>
/**
 * 緊湊版本 layout 供給需要更大空間利用度的 iws 與 cameras
 * 要注意的是，麵包屑也被放在上緣
 */
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import useAuth from './API/useAuth';
import generateRoutes from '../lib/generateRoutes';
import breadcrumb from './components/breadcrumb.vue';
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarSubmenu from './components/sidebarSubmenu.vue';
import myHeader from './components/myHeader.vue';
import topInfo from './components/topInfo.vue';
import clock from './components/clock.vue';

useAuth();

const isShowSideBar = ref(false);

const links = ref<ReturnType<typeof generateRoutes>>([]);

onMounted(() => {
  links.value = generateRoutes();
});

onBeforeRouteUpdate(() => {
  isShowSideBar.value = false;
});
</script>

<style lang="scss" scoped>
.animate-fade-in {
  animation: fade-in 0.3s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 100;
  }
}
</style>
