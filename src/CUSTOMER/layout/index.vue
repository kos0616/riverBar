<template>
  <div class="my-bg flex min-h-[100dvh] flex-col">
    <myHeader v-if="!isBigScreen" @sidebar-changed="isShowSideBar = !isShowSideBar"></myHeader>
    <nav
      v-if="!isBigScreen"
      :class="{ 'showModal -translate-x-full opacity-75': !isShowSideBar }"
      class="fixed left-0 top-0 z-[1001] h-dvh w-full overflow-y-auto bg-white opacity-100 shadow transition-all duration-300 will-change-transform"
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

    <div class="flex grow items-stretch">
      <div
        :class="isBigScreen && isShowSideBar ? 'max-w-52' : 'max-w-0'"
        class="relative transition-all duration-500 will-change-transform"
      >
        <button
          v-if="isBigScreen"
          @click="isShowSideBar = !isShowSideBar"
          :class="
            isBigScreen && isShowSideBar ? 'translate-x-1/2 rounded' : 'translate-x-full rounded-r'
          "
          title="開關選單"
          type="button"
          class="absolute right-0 top-14 z-[1] flex h-6 w-6 items-center justify-center bg-primary transition-all duration-500 will-change-transform hover:bg-primary-500"
        >
          <i
            :class="{ 'rotate-180': isBigScreen && isShowSideBar }"
            class="fas fa-chevron-right fa-fw text-white transition-transform"
            style="font-size: 75%"
          ></i>
        </button>
        <nav
          class="flex h-full max-h-svh flex-col overflow-scroll bg-white/75 py-7 backdrop-blur-lg lg:rounded-r-3xl"
          style="box-shadow: 0px 4px 20px 0px rgba(28, 98, 138, 0.15)"
        >
          <h1 class="mb-10 flex items-center gap-2 text-nowrap px-5">
            <img
              :src="logo"
              alt="LOGO"
              height="30"
              width="30"
              class="aspect-square h-[30px] min-w-[30px]"
            />
            <span class="hidden text-xl font-bold text-primary sm:inline">{{ BRAND }}</span>
          </h1>

          <sidebarMenu :model-value="links"></sidebarMenu>
          <sidebarSubmenu class="mt-auto"></sidebarSubmenu>
        </nav>
      </div>

      <div class="md-px-0 container mx-auto w-full grow overflow-x-auto px-3 pt-8">
        <topInfo class="hidden lg:block"></topInfo>
        <myTitle></myTitle>
        <router-view></router-view>
      </div>
    </div>
    <div
      v-if="!isBigScreen && isShowSideBar"
      @click="isShowSideBar = false"
      class="animate-fade-in fixed inset-0 z-[1000] bg-zinc-900/50 backdrop-blur-[2px]"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue';
import myHeader from './components/myHeader.vue';
import logo from '@/CUSTOMER/assets/logo.svg';
import sidebarSubmenu from './components/sidebarSubmenu.vue';
import sidebarMenu from './components/sidebarMenu.vue';
import useAuth from './API/useAuth';
import { onBeforeRouteUpdate } from 'vue-router';
import generateRoutes from '../lib/generateRoutes';
import topInfo from './components/topInfo.vue';
import myTitle from './components/title.vue';

useAuth();

const BRAND = ref('水文監控系統');

const height = getCurrentInstance()?.appContext.config.globalProperties.$screenHeight;
const width = getCurrentInstance()?.appContext.config.globalProperties.$screenWidth;

/**
 * 在畫面夠大的時候，才會啟用 static sidebar
 * 否則會用浮動式來顯示 sidebar */
const isBigScreen = computed(() => {
  try {
    const h = height?.value || 0;
    const w = width?.value || 0;
    return w >= 640 && h >= 480;
  } catch (error) {
    return false;
  }
});

const isShowSideBar = ref(false);

const links = ref<ReturnType<typeof generateRoutes>>([]);

onMounted(() => {
  links.value = generateRoutes();
  if (isBigScreen.value === true) isShowSideBar.value = true;
});

onBeforeRouteUpdate(() => {
  isShowSideBar.value = isBigScreen.value === true ? isShowSideBar.value : false;
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
