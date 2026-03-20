import Axios from '@/CORE/axios/index';
import type { AxiosResponse } from 'axios';
import { ElMessageBox } from 'element-plus';
import { useCounterAxios } from '@/CUSTOMER/pinia/axios';
const piniaAxios = useCounterAxios();

/** 客制層request額外調整 */
// raw_axios.interceptors.request.use((config) => {});

type backendResponseError = { ErrorMsg: string; Status: boolean };

Axios.interceptors.request.use((config) => {
  if (config.method === 'post') piniaAxios.actions_request(config.data);
  return config;
});

Axios.interceptors.response.use((response: AxiosResponse<backendResponseError>) => {
  /** 後端的其他報錯 */
  const res = response.data;
  if (res.Status === false && typeof res.ErrorMsg === 'string') {
    ElMessageBox({
      type: 'error',
      title: '發生錯誤',
      message: res.ErrorMsg
    });
    throw response;
  }

  return response;
});

export default Axios;
