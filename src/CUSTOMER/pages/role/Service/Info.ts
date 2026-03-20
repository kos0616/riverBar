import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox } from 'element-plus';
const API = '/api/auth/roles';

export type response = {
  Permissions: Permission[];
  /** 'tester' */
  Name: string;
  /**  '測試人員' */
  DisplayNmae: string;
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
      ElMessageBox.alert(`指定的的角色: ${name} 不存在(${status})`);
    } else {
      handleError(error);
    }

    throw error;
  }
};
