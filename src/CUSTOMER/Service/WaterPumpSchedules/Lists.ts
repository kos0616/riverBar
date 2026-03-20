import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/WaterPumpSchedules';

export type item = {
  Id: number;
  // 'S01P01';
  LocationCode: string;
  // '抽水機A';
  WaterPumpName: string;
  // '2024-01-01T00:00:00';
  DateTime: string;
  Action: 'Start' | 'Stop';
  Status: 'Pending' | 'InProgress' | 'Completed';
  Result: 'Success' | 'Failed' | null;
};

export type response = {
  Success: boolean;
  Message: string;
  Data: item[];
};

export default async (): Promise<response['Data']> => {
  try {
    const res = await $http.get(API);
    /** code 200 but error */
    if (res.data.Success !== true && res.data.Message) throw res.data.Message;

    return res.data?.Data;
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
