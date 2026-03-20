import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox } from 'element-plus';

const API = '/line/unlink';

export default async (): Promise<void> => {
  try {
    await ElMessageBox.confirm(`確定要解除 Line 帳號的關聯嗎？`, {
      type: 'info',
      center: true,
      showClose: false,
      confirmButtonClass: 'el-button--danger'
    });
    await $http.post(API);
  } catch (error: any) {
    if ((error as string) === 'cancel') {
      throw error;
    } else {
      handleError(error);
      throw error;
    }
  }
};
