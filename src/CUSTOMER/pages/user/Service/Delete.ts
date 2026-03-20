import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox, ElMessage } from 'element-plus';

const API = '/api/auth/accounts';

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

export default async (name: string) => {
  const path = `${API}/${name}`;
  try {
    try {
      await ElMessageBox.confirm(`確定要刪除帳號 ${name} 嗎？`, {
        type: 'info',
        center: true,
        showClose: false,
        confirmButtonClass: 'el-button--danger'
      });

      const res = await $http.delete(path).then((res) => res);
      if (res.status === 204) {
        ElMessage.success(`刪除成功`);
        return res;
      }
    } catch (e) {
      if ((e as string) === 'cancel') {
        return;
      }
      throw e;
    }
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
