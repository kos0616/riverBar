import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox, ElMessage } from 'element-plus';

const API = '/api/auth/accounts';

export type typeRequest = {
  UserName: string;
  ChiName: string;
  Email: string;
  Password: string;
  Roles: string[];
  SiteCode: string;
};

type typeResponse = {
  UserName: string;
  ChiName: string;
  Email: string;
  Roles: null | string[];
  SiteCode: string | null;
};

export default async (myForm: typeRequest) => {
  try {
    const { data } = await $http.post(API, myForm);
    ElMessage.success('新增成功');
    return data as typeResponse;
  } catch (error: any) {
    if (error.response.status === 400) {
      const { Message, Details } = error.response.data;
      const msg = Details.join(',');
      ElMessageBox.alert(msg, `${Message}(400)`);
    } else {
      handleError(error);
    }

    throw error;
  }
};
