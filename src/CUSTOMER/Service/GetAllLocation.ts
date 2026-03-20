import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';

const API = '/api/Location/GetAllLocation';

export type item = {
  /** 'S01P01' */
  LocationCode: string;
  /** '東柵埤取入口排水門' */
  Name: string;
  Section2: {
    PLCs: typePLC[];
    SectionType: 2;
  };
  Section3Plcs: null;
  WaterPlcs: typePLC[];
  Sort: number;
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
