<template>
  <div v-loading="loading" class="mx-auto max-w-xs py-5">
    <div v-if="isError" class="rounded border-4 border-el-danger p-5">
      <h2 class="text-2xl text-el-danger">
        <i class="fa-solid fa-triangle-exclamation fa-fw"></i>
        錯誤: 無法顯示資料
      </h2>
    </div>
    <ol v-else class="flex flex-col gap-3 text-2xl">
      <li v-for="(name, url) in data" :key="name" class="">
        <router-link
          :to="`/gate/${url}`"
          :title="`前往 ${name}`"
          class="block rounded border-4 border-gray-400 bg-slate-200 px-5 py-3 transition-transform hover:scale-95 hover:bg-el-primary hover:text-white"
        >
          {{ name }}
        </router-link>
      </li>
    </ol>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Info, { type response } from './Service/Info';
import { onMounted } from 'vue';

const loading = ref(true);

const props = defineProps(['id']);

const data = ref<response>({});

const isError = ref(false);

const getInfo = async (id: string) => {
  try {
    loading.value = true;
    data.value = await Info(id);
  } catch (e) {
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getInfo(props.id);
});
</script>
