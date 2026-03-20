import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import day from 'dayjs';

const API = '/api/auth/accounts/login-history';
/** ?pageIndex=0&pageSize=1 */
export type response = item[];

export type item = {
  /** 'Chrome' */
  Browser: string;
  /** 'Mac' */
  Device: string;
  /** '172.25.0.7' */
  IpAddress: string;
  /** '2024-06-10T10:40:52.2141514' */
  LoginTime: string;
  /** 'Mac OS X' */
  OS: string;
  /** true */
  Succeeded: boolean;
  /** 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' */
  UserAgent: string;
  /** 'Qq12345' */
  UserName: string;
};

export type request = {
  /** 從0開始 */
  pageIndex: number;
  pageSize: number;
};

export default async (nextPage?: number): Promise<ReturnType<typeof formater>[]> => {
  try {
    const params: request = { pageIndex: nextPage || 0, pageSize: 20 };
    return await $http.get(API, { params }).then((res) => res.data.map(formater));
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};

function formater(item: item) {
  const { LoginTime } = item;
  const Updated = LoginTime ? day(LoginTime) : undefined;
  const LoginTime_f = Updated ? Updated.format('YYYY-MM-DD HH:mm:ss') : undefined;

  return { ...item, LoginTime_f };
}
