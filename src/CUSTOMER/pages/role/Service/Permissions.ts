import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/auth/permissions';

export type response = Permission[];

export type Permission = {
  Code: string; //'iws-r';
  SubjectId: string; //'iws';
  SubjectName: string; //'IWS圖控';
  ActionId: string; //'r';
  ActionName: string; //'讀取';
};

export default async (): Promise<response> => {
  try {
    return await $http.get(API).then((res) => res.data);
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
