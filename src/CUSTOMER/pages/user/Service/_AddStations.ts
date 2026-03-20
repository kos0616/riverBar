import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox } from 'element-plus';

const API = (id: string) => `/api/auth/accounts/${id}/stations`;

export type typeRequest = {
  UserName: string;
  StationId: string;
};

export default async (req: typeRequest) => {
  try {
    const { StationId, UserName } = req;
    const { data } = await $http.post(API(UserName), { StationId, Level: 0 });
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
