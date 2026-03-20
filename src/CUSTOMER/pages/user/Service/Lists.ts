import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/auth/accounts';

export type response = item[];

export type item = {
  /** root */
  UserName: string;
  // mark
  ChiName: string;
  Roles?: string[];
  SiteCode?: string;
  IsLineNotify: boolean;
};

export default async (): Promise<response> => {
  try {
    return await $http.get(API).then((res) => res.data);
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
