import $http from '@/CUSTOMER/axios';

const API = '/api/identity/logout';

export type response = any;

/** 登出 */
export default async (): Promise<response> => {
  try {
    await $http.post(API);
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 401) {
      // do nothing
      // login page 預設會進行登出作業，而其他功能觸發的登出功能若報錯也不需要顯示訊息
      return;
    }
    throw error;
  }
};
