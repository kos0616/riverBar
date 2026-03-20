import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessageBox, ElMessage } from 'element-plus';
const API = '/api/Location/DeleteLocationImage';

export type response = any;

export default async ({ id, file }: { id: string; file: string }): Promise<response> => {
  try {
    await ElMessageBox.confirm(`確定要刪除檔案 ${file} 嗎？`, {
      type: 'info',
      center: true,
      showClose: false,
      confirmButtonClass: 'el-button--danger'
    });

    const res = await $http.delete(`${API}?fileName=${file}&locationCode=${id}`);

    if (res.status === 200) {
      ElMessage.success(`刪除成功`);
      return res;
    }
  } catch (error: any) {
    if ((error as string) === 'cancel') {
      return;
    }
    handleError(error);
    throw error;
  }
};
