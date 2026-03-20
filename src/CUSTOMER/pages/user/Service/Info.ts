import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox } from 'element-plus';
const API = '/api/auth/accounts';

export type response = {
  Permissions: Permission[];
  StationRights: StationRight[];
  Roles: [];
  /** 'tester' */
  UserName: string;
  Email: string;
  /**  '測試人員' */
  ChiName: string;
  SiteCode: string;
  Lockout: boolean;
  IsLineNotify: boolean;
  isLineLinked: boolean;
};
type StationRight = {
  StationId: string;
  Level: number;
};
export type Permission = {
  Code: string; //'iws-r';
  SubjectId: string; //'iws';
  SubjectName: string; //'IWS圖控';
  ActionId: string; //'r';
  ActionName: string; //'讀取';
};

export default async (name: string): Promise<response> => {
  const path = `${API}/${name}`;
  try {
    return await $http.get(path).then((res) => res.data);
  } catch (error: any) {
    const status = error.response?.status;
    if (status === 404) {
      ElMessageBox.alert(`找不到該帳號`);
    } else {
      handleError(error);
    }

    throw error;
  }
};
