<template>
  <figure class="group relative">
    <nav
      class="absolute left-0 right-0 top-0 z-[1] hidden justify-end gap-2 bg-slate-300/75 px-3 py-1 text-sm backdrop-blur-sm transition-colors hover:bg-slate-300 group-hover:flex"
    >
      <button @click="$emit('click')" type="button" title="放大畫面" class="hover:text-primary-400">
        <i class="fa-regular fa-fw fa-window-maximize"></i>
        放大
      </button>
      <!-- <button @click="" title="子母畫面" class="hover:text-primary-400">
        <i class="fa-regular fa-fw fa-window-restore"></i>
        子母
      </button> -->
      <button
        @click="handleNewWindow(videoUrl)"
        type="button"
        title="在新視窗開啟"
        class="hover:text-primary-400"
      >
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
        視窗
      </button>
    </nav>

    <button @click="$emit('click')" type="button" class="block w-full">
      <img
        @error="isError = true"
        v-if="imgUrl"
        :src="imgUrl"
        :alt="`監視器畫面: ${label}`"
        :class="ratio"
        class="w-full bg-black object-contain"
        width="300"
        height="200"
      />
      <video
        v-else-if="img"
        :class="ratio"
        :title="`監視器畫面: ${label}`"
        preload="auto"
        loop
        muted
        autoplay
        :poster="isError ? '' : '@/CUSTOMER/assets/loading.svg'"
        class="w-full bg-black object-contain"
      >
        <source
          :src="videoUrl"
          @error="isError = true"
          width="300"
          height="200"
          type="video/webm"
        />
      </video>

      <el-popover
        :disabled="isError === false"
        :title="`${label} 監視器延遲`"
        :content="`監控影像連線延遲，請確認網路連線或聯絡系統管理員。 \n 監視器位址: \n ${img}`"
        width="300"
      >
        <template #reference>
          <strong
            class="absolute bottom-0 left-0 right-0 text-ellipsis p-2 text-center text-lg text-white"
            style="text-shadow: 0px 1px 3px black"
          >
            <i v-if="isError" class="fas fa-triangle-exclamation fa-fw text-el-warning"></i>
            {{ label }}
          </strong>
        </template>
      </el-popover>
    </button>
  </figure>
</template>

<script lang="ts" setup>
// defineProps(['img', 'label']);
import getCameraAuth from '@/CUSTOMER/Service/getCameraAuth';
import { ref, watch } from 'vue';

interface Prop {
  img: string;
  label: string;
  ratio?: string;
}
const props = withDefaults(defineProps<Prop>(), { ratio: 'aspect-video' });

/** 監視器連結，會有兩種情形
 * 1. 照舊的 VideoStream
 * 2. 需要與後端交互的 ip + getNonce */
const videoUrl = ref('');
const imgUrl = ref('');
const isError = ref(false);

const handleNewWindow = (url: string) => {
  window.open(url, '_blank', 'width=1000,height=564');
};

const getVideoUrl = async (url: string) => {
  /** 通常的情形 */
  if (/VideoStream/.test(url) || /data:/.test(url)) {
    imgUrl.value = url;
    return;
  }
  /** 前後端交互產生auth連結的情形 */
  try {
    const authKey = await getCameraAuth(url);
    videoUrl.value = url + '?lo&auth=' + authKey;
  } catch (error) {
    isError.value = true;
  }
};

watch(
  () => props.img,
  async (str) => {
    isError.value = false;
    if (str) await getVideoUrl(str);
  },
  { immediate: true }
);
</script>
