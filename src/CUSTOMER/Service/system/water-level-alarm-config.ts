import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/System/water-level-alarm-config';

export type response_raw = Record<string, string>;

export type response = {
  Period: number; // 水位警示通知頻率(分鐘)
  Enable: boolean; // 是否啟用
};

/** 取得警示通知設定 #152 */
export default async (): Promise<response> => {
  try {
    const res = await $http.get(API);
    return res.data;
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
