import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = (name: string) => `/api/auth/roles/${name}/permissions`;

export type response = any;

export type request = {
  name: string;
  codes: string[];
};

export default async ({ name, codes }: request): Promise<response> => {
  try {
    return await $http.delete(API(name), { data: codes }).then((res) => res.data);
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
