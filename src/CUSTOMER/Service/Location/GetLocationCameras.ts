import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/Location/GetLocationCameras';

export type item = {
  // S01P01
  LocationCode: string;
  Cameras: typeCamera[];
};
export type response = item[];

export default async (): Promise<response> => {
  try {
    return await $http.get(API).then((res) => res.data);
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
