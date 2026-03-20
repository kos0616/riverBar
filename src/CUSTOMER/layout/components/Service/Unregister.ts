import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox } from 'element-plus';

const API = '/LineNotify/unregister';
export type response_raw = Record<string, string>;

export type response = {
  Token: string;
};

export default async (): Promise<response> => {
  try {
    await ElMessageBox.confirm(`確定要解除 LineNotify 的關聯嗎？`, {
      type: 'info',
      center: true,
      showClose: false,
      confirmButtonClass: 'el-button--danger'
    });
    const res = await $http.post<response>(API);
    return res.data;
  } catch (error: any) {
    if ((error as string) === 'cancel') {
      throw error;
    } else {
      handleError(error);
      throw error;
    }
  }
};
