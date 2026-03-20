<template>
  <div>
    <aside class="flex justify-end gap-3">
      <div>
        線上人數： <strong class="text-primary">{{ onlineUserData?.OnlineUserCount }}</strong> 人
      </div>
      |
      <div>
        使用者： <strong class="text-primary">{{ username }}</strong>
      </div>

      <template v-if="$slots.default">
        |
        <slot></slot>
      </template>
    </aside>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { computed } from 'vue';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';
import OnlineUser from '@/CUSTOMER/Service/system/OnlineUsers';

defineEmits(['sidebarChanged']);

const onlineUserData = ref<Awaited<ReturnType<typeof OnlineUser>> | null>(null);

const getOnlineUser = async () => {
  const res = await OnlineUser();
  onlineUserData.value = res;
};

const userInfoStore = useUserInfoStore();
const username = computed(() => userInfoStore.userInfo.UserName);

onMounted(async () => {
  await getOnlineUser();
});
</script>
