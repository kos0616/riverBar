<template>
  <div>
    <button @click="dialogChangePassword = true" class="menu-btn">
      <img
        src="@/CUSTOMER/assets/icons/password-active.svg"
        alt="password icon"
        width="24"
        height="24"
      />
      變更密碼
    </button>
    <button @click="logout" class="menu-btn">
      <img
        src="@/CUSTOMER/assets/icons/logout-active.svg"
        alt="logout icon"
        width="24"
        height="24"
      />
      登出
    </button>
    <changePassword
      :model-value="dialogChangePassword"
      @close="dialogChangePassword = false"
    ></changePassword>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { clearAuth } from '@/CUSTOMER/lib/auth';
import changePassword from './changePassword.vue';
import Logout from '@/CUSTOMER/Service/identity/Logout';
import { useRouter } from 'vue-router';

const router = useRouter();

const dialogChangePassword = ref(false);

const logout = async () => {
  clearAuth();
  router.push('/');
  Logout();
};
</script>

<style lang="scss" scoped src="./menu.scss"></style>
