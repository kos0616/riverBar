import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/LineNotify/generate-temp-token';
export type response_raw = Record<string, string>;

export type response = {
  Token: string;
};

export default async (): Promise<response> => {
  try {
    const res = await $http.post<response>(API);
    return res.data;
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
