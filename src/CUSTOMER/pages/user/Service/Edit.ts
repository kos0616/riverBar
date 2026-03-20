import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox } from 'element-plus';

const API = (id: string) => `/api/auth/accounts/${id}`;

export type typeRequest = {
  ChiName: string;
  Email: string;
  SiteCode: string;
  Lockout: boolean;
  Roles: string[];
};

export default async (req: typeRequest & { UserName: string }) => {
  try {
    const { UserName, ...reqs } = req;
    const formatedReq = {
      ...reqs,
      SiteCode: req.SiteCode ? req.SiteCode : null
    };
    const { data } = await $http.put(API(UserName), formatedReq);

    return data;
  } catch (error: any) {
    const status = error.typeResponse?.status;
    if (status === 400) {
      ElMessageBox.alert('輸入資料有誤(400)');
    } else {
      handleError(error);
    }

    throw error;
  }
};
