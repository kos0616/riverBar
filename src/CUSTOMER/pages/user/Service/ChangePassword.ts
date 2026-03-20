import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox, ElMessage } from 'element-plus';

const API = (id: string) => `/api/auth/accounts/${id}/password`;

export type typeRequest = {
  UserName: string;
  NewPassword: string;
};

export default async (req: typeRequest) => {
  try {
    const { NewPassword, UserName } = req;
    const { data } = await $http.put(API(UserName), { NewPassword });
    ElMessage.success('密碼變更成功');
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
