import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox, ElMessage } from 'element-plus';
import { type item } from './GetLocationAlarmsByLocationCode';

const API = '/api/Location/MarkAlarmChecked';

export type response = {
  Success: boolean;
  // '警報不存在';
  Message: string;
  Data: null;
};

/**
 * 暫時停止水位警報通知 #152
 * 備註：會傳 400 的時候會再 Message 中有錯誤訊息，可以直接顯示出來
 * */
export default async (item: item) => {
  const { LocationCode, Tag, Time } = item;
  const request = { LocationCode, Tag, Time };

  for (const [key, value] of Object.entries(request)) {
    if (value === null || value === '' || value === undefined) {
      throw `${key} 無法為空`;
    }
  }

  try {
    await ElMessageBox.confirm(`確定要暫停 ${item.AlarmMessage} 的警報嗎？`, {
      type: 'info',
      center: true,
      showClose: false,
      confirmButtonClass: 'el-button--danger'
    });

    const res = await $http.post(API, request);
    if (res.status === 200 && res.data.Success) {
      ElMessage.success(`操作成功，已暫停警報`);
      return res;
    } else if (res.data.Success === false && res.data.Message) {
      throw '錯誤: ' + res.data.Message;
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
