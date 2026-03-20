import $http from '@/CUSTOMER/axios';
import { ElMessage } from 'element-plus';
import handleError from '@/CUSTOMER/axios/error';

const PATH = '/api/WaterPumpSchedules';

type req = {
  id: number;
  DateTime: string;
};

type response = {
  Success: boolean;
  Message: string;
  Data: null;
};

/** 更新抽水機排程 */
export default async (req: req): Promise<response> => {
  const { id, DateTime } = req;
  const API = `${PATH}/${id}`;
  if (!id) throw 'id';

  try {
    const res = await $http.put(API, { DateTime });

    /** code 200 but error */
    if (res.data.Success !== true && res.data.Message) throw res.data.Message;

    ElMessage.success(`編輯成功`);
    return res.data;
  } catch (error: any) {
    if ((error as string) === 'id') {
      ElMessage.error('沒有抽水機排程代碼，請聯絡系統管理員');
    } else {
      handleError(error);
    }
    throw error;
  }
};
