import $http from '@/CUSTOMER/axios';
import { ElMessage } from 'element-plus';
import handleError from '@/CUSTOMER/axios/error';

const PATH = '/api/Location/UploadLocationImage';

type req = {
  /** 現地端代碼 */
  code?: string;
  /** 上傳的檔案，可接受 png jpg jpeg 以及 **pdf** */
  file: File;
};

/* 上傳現地端圖檔 */
export default async (req: req) => {
  const { code, file } = req;

  // 创建 FormData 对象
  const formData = new FormData();

  const fileName = removeExtension(file.name);

  formData.append('file', file);

  const API = `${PATH}?locationCode=${code}&fileName=${fileName}`;
  if (!code) return ElMessage.error('沒有現地端代碼，請聯絡系統管理員');

  try {
    await $http.post(API, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};

function removeExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}
