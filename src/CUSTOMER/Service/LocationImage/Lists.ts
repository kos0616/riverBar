import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/Location/GetLocationImageNameList';

export type response = item[];

export type item = string;

/** 取得現地端圖檔列表 */
export default async (id: string): Promise<response> => {
  try {
    return await $http.get(`${API}?locationCode=${id}`).then((res) => res.data);
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
