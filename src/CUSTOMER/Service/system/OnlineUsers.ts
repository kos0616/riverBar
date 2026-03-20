import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/system/online-users';

export type response_raw = Record<string, string>;

export type response = {
  ConnectionCount: number;
  OnlineUserCount: number;
};

export default async (): Promise<response> => {
  try {
    const res = await $http.get(API);
    return res.data;
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
