import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import day from 'dayjs';

const API = '/api/Location/GetLocationAlarmsByLocationCode';

export type response = item[];

export type item = {
  /** '台電停電 ON' */
  AlarmMessage: string;
  /**  'S01P01' */
  LocationCode: string;
  /** '167' */
  Tag: string;
  /** '2024-06-09T04:23:44.901' */
  Time: string;
  CheckTime: null | string;
  CheckUser: null | string;
};

export default async (code: string): Promise<ReturnType<typeof formater>[]> => {
  try {
    const suffix = `?locationCode=${code}`;
    return await $http.get(API + suffix).then((res) => res.data.map(formater));
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};

function formater(item: item) {
  const { Time, CheckTime } = item;
  const Updated = Time ? day(Time) : undefined;
  const Time_f = Updated ? Updated.format('YYYY-MM-DD HH:mm:ss') : undefined;
  const Checked = CheckTime ? day(Time) : undefined;
  const CheckTime_f = Checked ? Checked.format('YYYY-MM-DD HH:mm:ss') : undefined;
  return { ...item, Time_f, CheckTime_f };
}
