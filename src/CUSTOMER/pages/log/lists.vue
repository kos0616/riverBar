<template>
  <main>
    <div class="mx-auto w-full">
      <div class="mb-5 flex flex-col items-center gap-8 md:flex-row xl:gap-7">
        <totalInfo :onlineUserCount="onlineUserData?.OnlineUserCount" :error-operation-count="5" />
        <form
          v-if="activeGroup === 0"
          @submit.prevent="advSearch"
          @reset.prevent="resetForm"
          class="info-section flex w-full items-center rounded-full bg-white px-2 py-1 md:py-0"
        >
          <label class="w-full cursor-pointer md:px-4">
            <span class="hidden px-3 md:block">關鍵字</span>
            <el-input
              @clear="resetForm"
              v-model="query"
              placeholder="查詢名稱/帳號..."
              clearable
              style="
                --el-input-bg-color: transparent;
                --el-input-border-color: transparent;
                --el-input-focus-border-color: transparent;
                --el-input-hover-border-color: transparent;
              "
            >
            </el-input>
          </label>
          <div>
            <el-button type="primary" native-type="submit" title="查詢" circle>
              <i class="fas fa-fw fa-search"></i>
            </el-button>
          </div>
        </form>
      </div>

      <nav class="my-nav flex gap-2">
        <label
          v-for="(group, i) in groups"
          :key="`${group.Name}`"
          :class="{ active: activeGroup === i }"
          class="my-label block whitespace-nowrap"
          role="button"
        >
          <input v-model="activeGroup" :value="i" type="radio" class="hidden" />
          {{ group.Name }}
        </label>
      </nav>
      <div class="md:info-section" :class="{ '!rounded-tl-none': activeGroup === 0 }">
        <operateHistory v-if="activeGroup === 0" />
        <loginHistory v-else-if="activeGroup === 1" />
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import operateHistory from './components/operateHistory_Lists.vue';
import loginHistory from './components/loginHistory_Lists.vue';
import groups from './group.json';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import OnlineUser from '@/CUSTOMER/Service/system/OnlineUsers';
import totalInfo from './components/totalInfo.vue';
import { emitter } from '@/CUSTOMER/plugins/bus';

const route = useRoute();
const router = useRouter();

const activeGroup = ref(0);

const query = ref('');

const advSearch = () => {
  router.push({ query: { query: query.value, PageNumber: 1 } });
};

const resetForm = () => {
  query.value = '';
  const { path } = route;
  router.push(path);
};

const onlineUserData = ref<Awaited<ReturnType<typeof OnlineUser>> | null>(null);

const getOnlineUser = async () => {
  const res = await OnlineUser();
  onlineUserData.value = res;
};

onMounted(async () => {
  const search = route.query.query as string;
  query.value = search;
  await getOnlineUser();

  emitter.on('UpdateOnlineUsers', async ({ connectionCount, onlineUserCount }) => {
    onlineUserData.value = { OnlineUserCount: onlineUserCount, ConnectionCount: connectionCount };
  });
});

onBeforeRouteUpdate(async (to) => {
  const search = to.query.query as string;
  query.value = search;
});

onUnmounted(() => {
  emitter.off('UpdateOnlineUsers');
});
</script>
