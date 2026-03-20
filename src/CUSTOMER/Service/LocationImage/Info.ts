import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessage } from 'element-plus';

const API = '/api/Location/GetLocationImage';

/* 上傳現地端圖檔 */
export default async ({ id, file }: { id: string; file: string }): Promise<Blob | void> => {
  const path = `${API}?fileName=${file}&locationCode=${id}`;

  if (!id) {
    ElMessage.error('沒有現地端代碼，請聯絡系統管理員');
    return;
  }

  try {
    const res = await $http.get(path, { responseType: 'blob' }).then((res) => {
      return res.data as Blob;
    });
    return res;
  } catch (error: any) {
    /** 用戶還沒上傳圖片，督促用戶進行圖片初始化作業 */
    if (error.response.status === 404) {
      ElMessage.error('錯誤:圖片不存在，可能是圖檔失效或圖檔格式錯誤。請嘗試重新上傳圖片');
      return;
    }

    handleError(error);
    throw error;
  }
};
