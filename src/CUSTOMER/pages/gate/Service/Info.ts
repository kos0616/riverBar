import $http from '@/CUSTOMER/axios';

const API = `/api/Location/GetTagsByLocation`;

export type response = typeGate;

/** 靜態資料對照表 */

export default async (id: string) => {
  const API_URL = `${API}/${id}`;
  return $http.get(API_URL).then((res) => {
    const data: response = res.data;

    return data;
  });
};
