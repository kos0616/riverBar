import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessage } from 'element-plus';

const API = '/api/identity/change-password';

export type response = any;

export type request = {
  OldPassword: string;
  NewPassword: string;
};

/** 密碼變更 */
export default async (req: request): Promise<response> => {
  try {
    await $http.post(API, req);
    ElMessage.success('密碼變更成功');
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 400) {
      ElMessage.warning('密碼變更失敗，請再次確認密碼是否正確');
    } else {
      handleError(error);
    }
    throw error;
  }
};
