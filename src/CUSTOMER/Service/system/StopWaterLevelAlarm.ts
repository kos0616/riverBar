import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox, ElMessage } from 'element-plus';

const API = (locationCode: string) => `/api/Location/StopWaterLevelAlarm/${locationCode}`;

type req = string;

export type response = {
  Success: boolean;
  Message: string;
};

/**
 * 暫時停止水位警報通知 #152
 * 備註：會傳 400 的時候會再 Message 中有錯誤訊息，可以直接顯示出來
 * */
export default async (locationCode: req, Name: string) => {
  if (!locationCode) return ElMessage.error('沒有現地端代碼，請聯絡系統管理員');

  try {
    await ElMessageBox.confirm(`確定要暫停 ${Name} 的通知嗎？`, {
      type: 'info',
      center: true,
      showClose: false,
      confirmButtonClass: 'el-button--danger'
    });

    const res = await $http.post(API(locationCode));
    if (res.status === 200 && res.data.Success) {
      ElMessage.success(`已暫停通知`);
      return res;
    } else {
      throw new Error(res.data.Message);
    }
  } catch (error: any) {
    const status = error.response?.status;
    /** Success === false, showing message */
    if (typeof error === 'string' && error === 'cancel') return;
    if (typeof error === 'string') {
      ElMessageBox.alert(error);
      /** status === 400, showing message */
    } else if (status === 400) {
      ElMessageBox.alert(error.response.data.Message);
    } else if (status === 404) {
      ElMessageBox.alert(`找不到現地端`);
    } else {
      handleError(error);
    }

    throw error;
  }
};
