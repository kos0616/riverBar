import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox, ElMessage } from 'element-plus';
import { type item } from './Lists';

const API = '/api/WaterPumpSchedules';

export type response = any;

export default async (schedule: item): Promise<response> => {
  try {
    await ElMessageBox.confirm(
      `確定要刪除抽水機 ${schedule.WaterPumpName} ${schedule.DateTime} 的排程嗎？`,
      {
        type: 'info',
        center: true,
        showClose: false,
        confirmButtonClass: 'el-button--danger'
      }
    );

    const res = await $http.delete(`${API}/${schedule.Id}`);

    /** code 200 but error */
    if (res.data.Success !== true && res.data.Message) throw res.data.Message;

    ElMessage.success(`刪除成功`);
    return res;
  } catch (error: any) {
    if ((error as string) === 'cancel') {
      return;
    }
    handleError(error);
    throw error;
  }
};
