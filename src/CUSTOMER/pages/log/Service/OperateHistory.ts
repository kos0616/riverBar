import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import day from 'dayjs';

const API = '/api/UserOperateHistory/GetUserOperateHistoryList';

export type response = { histories: item[]; Pagination: Pagination };

export type Pagination = {
  /** 10 */
  PageLimit: number;
  // 254
  TotalNumber: number;
  // 26
  TotalPages: number;
};

export type item = {
  /** admin */
  UserName: string;
  // 系統管理員
  DisplayNmae: string;
  /** 'S01P03'; */
  LocationCode: string;
  /** '三級警戒水位警報ON/OFF設定成功'; */
  ActionDisplay: string;
  /** 'True'; */
  TagAction: string;
  /** '172.25.0.4'; */
  IPAddress: string;
  /** '2024-06-07T08:02:02.8985472'; */
  Time: string;
  /** 南北幹線 */
  LocationName: string;
};

export type request = {
  PageLimit?: number;
  PageNumber?: number;
  query?: string;
};

export default async (
  req?: request
): Promise<{ Pagination: Pagination; histories: ReturnType<typeof formater>[] }> => {
  try {
    // const suffix = query ? `?query=${query}` : '';
    const querys = Object.entries({ PageLimit: 20, ...(req || {}) }).map(
      ([key, value]) => `${key}=${value}`
    );
    const suffix = Array.isArray(querys) && querys.length > 0 ? `?${querys.join('&')}` : '';

    return await $http.get(API + suffix).then((res) => {
      const data = res.data as response;
      return {
        Pagination: data.Pagination,
        histories: data.histories.map(formater)
      };
    });
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};

export function formater(item: item) {
  const { Time, TagAction } = item;
  const Updated = Time ? day(Time) : undefined;
  const Time_f = Updated ? Updated.format('YYYY-MM-DD HH:mm:ss') : undefined;

  const TagAction_f = showAction(TagAction);

  return { ...item, Time_f, TagAction_f };

  function showAction(value: string) {
    if ((value || '').toLowerCase() === 'true') return '開啟';
    if ((value || '').toLowerCase() === 'false') return '關閉';
    return value;
  }
}
