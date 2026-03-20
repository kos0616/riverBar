import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessage } from 'element-plus';
import { type response } from './Lists';

const API = '/api/WaterPumpSchedules';

type item = {
  // 'S01P01';
  LocationCode: string;
  // '2024-01-01T00:00:00';
  DateTime: string;
  // '抽水機A';
  WaterPumpName: string;
  Action: 'Start' | 'Stop';
};

export type request = item[];

/** 新增抽水機排程 */
export default async (req: request): Promise<response> => {
  try {
    const res = await $http.post(API, req);

    /** code 200 but error */
    if (res.data.Success !== true && res.data.Message) throw res.data.Message;

    ElMessage.success(`排程新增成功`);
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.Message;

    handleError(msg || error);

    throw error;
  }
};
