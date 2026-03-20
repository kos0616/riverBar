import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/auth/accounts/stats';

export type response = item[];

export type item = {
  /** admin */
  UserName: string;
  // 系統管理員
  DisplayNmae: string;
};

export default async (): Promise<response> => {
  try {
    return await $http.get(API).then((res) => res.data);
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
