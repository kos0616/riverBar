import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessage } from 'element-plus';

const API = '200';
// const API = 'https://httpstat.us';

/** test */
export default async () => {
  try {
    // await $http.get(API);
    await $http.get(API, { baseURL: '/test' });
    ElMessage.success('success');
  } catch (error: any) {
    const status = error.response?.status;
    console.log(status);
    console.log(error);

    handleError(error);
    throw error;
  }
};
