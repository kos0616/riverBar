import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox, ElMessage } from 'element-plus';

const API = '/api/WaterPumpSchedules/BatchDelete';

type request = {
  locationCode: string;
  start: string;
  end: string;
};

export type response = any;

export default async (req: request): Promise<response> => {
  try {
    await ElMessageBox.confirm(`確定要清除 ${req.start} 至 ${req.end} 的排程嗎？`, {
      type: 'info',
      center: true,
      showClose: false,
      confirmButtonClass: 'el-button--danger'
    });

    const res = await $http.delete(
      `${API}?locationCode=${req.locationCode}&start=${req.start}&end=${req.end}`
    );

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
