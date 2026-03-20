// import refresh from '../Service/refresh';
import me from '@/CUSTOMER/pages/login/Service/me';
import { onMounted } from 'vue';
import { startConnection } from '@/CUSTOMER/SignalR';

/** 刷新 Token 與驗證身份 */
export default () => {
  // const timer = ref<NodeJS.Timeout>();

  // const handleRefresh = async () => {
  //   try {
  //     timer.value = setTimeout(async () => {
  //       await refresh();
  //       await handleRefresh();
  //     }, 600000);
  //   } catch (e) {
  //     clearTimeout(timer.value);
  //   }
  // };

  /** 檢查是否為流放者狀態，避免在被流放時，因為重整而逃過一劫 */
  const checkExiled = () => {
    if (localStorage.getItem('exiled')) {
      location.replace('/login');
      throw new Error('exiled');
    }
  };

  onMounted(async () => {
    checkExiled();
    await Promise.all([me(), startConnection()]);
    // await Promise.all([refresh(), me()]);
    // await handleRefresh();
  });

  // onUnmounted(() => {
  //   clearTimeout(timer.value);
  // });
};
