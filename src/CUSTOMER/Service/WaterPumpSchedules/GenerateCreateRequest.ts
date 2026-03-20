import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/WaterPumpSchedules/GenerateCreateRequest';

export type request = {
  LocationCode: string;
  WaterPumpNames: string[];
  // 開始日期 2024-01-01
  DateFrom: string;
  // 結束日期 2024-01-31
  DateTo: string;
  // 每日抽水機啟動時間 08:00:00
  StartTime: string;
  // 每日抽水機停止時間 20:00:00
  StopTime: string;
  // 是否包含工作日 true
  WorkDay: boolean;
  // 是否包含週末 false
  Weekend: boolean;
  //  自訂週幾要有排程(0:星期日, 1:星期一, 2:星期二, 3:星期三, 4:星期四, 5:星期五, 6:星期六)
  CustomDays: number[];
};

type Data = {
  // 'S01P01';
  LocationCode: string;
  // '抽水機A';
  WaterPumpName: string;
  // '2024-01-01T00:00:00';
  DateTime: string;
  Action: 'Start' | 'Stop';
};

export type response = {
  Success: boolean;
  Message: string;
  Data: Data[];
};

/**
 * 此方法根據提供的需求資料，產生對應的抽水機排程請求。
 * 產生出的 Data 可用於 POST /api/WaterPumpSchedules API。
 */
export default async (req: request): Promise<response['Data']> => {
  try {
    const params = new URLSearchParams();

    // 使用 Object.entries 來遍歷 req 對象
    Object.entries(req).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => params.append(key, val.toString()));
      } else {
        params.append(key, value.toString());
      }
    });
    const url = `${API}?${params.toString()}`;
    const res = await $http.get(url);

    /** code 200 but error */
    if (res.data.Success !== true && res.data.Message) throw res.data.Message;

    return res.data.Data;
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
