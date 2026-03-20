<template>
  <div
    class="login-background flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-5"
    v-loading="loadingStatus"
  >
    <div
      class="mb-4 w-full max-w-[600px] rounded-2xl bg-white/70 p-5 md:p-10"
      style="box-shadow: 0px 4px 60px 0px #1c628a26"
    >
      <div class="text-center text-primary mb-6">
        <i class="fa-solid fa-bridge-water fa-3x"></i>
      </div>
      <h2 class="mb-10 text-center text-2xl font-bold text-white md:text-4xl">
        <span
          class="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
        >
          水文監控系統
        </span>
      </h2>
      <div class="grid gap-4">
        <button
          @click="onLogin"
          class="focus:shadow-outline w-full rounded-full bg-gradient-to-r from-primary-500 to-primary-500 px-4 py-3 font-bold text-white hover:from-primary-700 hover:to-primary-700 focus:outline-none"
          type="button"
        >
          進入系統
        </button>
      </div>
    </div>
    <div class="fixed bottom-6 right-0 px-2 opacity-50">v{{ APP_VERSION }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import loginAPI from './Service/login';
import Logout from '@/CUSTOMER/Service/identity/Logout';
import me from './Service/me';
import { clearAuth } from '@/CUSTOMER/lib/auth';

export default defineComponent({
  name: 'DEFAULT',
  setup() {
    const data = reactive({
      loginForm: {
        Email: 'demo@portfolio.local',
        Password: 'demo'
      },
      loadingStatus: false
    });
    const router = useRouter();
    const refData = toRefs(data);

    const onLogin = async () => {
      await handleLogin();
    };

    const goToHome = () => {
      const from = sessionStorage.getItem('fromPath') || '/histroy';
      router.push(from);
      sessionStorage.removeItem('fromPath');
      // TODO: 預設入口
      // try {
      //   const str = localStorage.getItem('getUserInfo') as string;
      //   const firstPermission = JSON.parse(str).Permissions[0] as { SubjectId: string };
      //   router.push(firstPermission.SubjectId);
      // } catch (error) {
      //   router.push('/iws');
      // }
    };

    const handleLogin = async () => {
      data.loadingStatus = true;

      try {
        await loginAPI(data.loginForm);
        await me();
        goToHome();
      } finally {
        data.loadingStatus = false;
      }
    };

    const APP_VERSION = import.meta.env.VITE_APP_VERSION;

    onMounted(() => {
      clearAuth();
      Logout();
    });
    return {
      onLogin,
      ...refData,
      APP_VERSION
    };
  }
});
</script>

<style lang="scss" scoped>
.login-background {
  background-image: url('./register_bg.svg');
}
</style>
