import router from '../../router';
import { ElMessageBox } from 'element-plus';
import i18n from '@/CORE/i18n';
import { useAuthStore } from '@/CORE/stores/auth';

// TODO state account logout

/**
 * 權限不足時，將用戶登出
 * NOTE: 會寫在客製層，是因為 未定的 router 設定還在 customer
 */
export default () => {
  ElMessageBox({
    type: 'error',
    title: 'Error',
    message: i18n.global.t('Util.10015')
  });
  const authState = useAuthStore();
  authState.logout();
  router.push('/login');
};
