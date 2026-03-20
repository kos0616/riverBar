import { ElMessageBox } from 'element-plus';

/**
 * 顯示伺服器錯誤 ex: CORS, 404, 500
 * 後端錯誤與這裡無關 ex: 10015 20001  */
export default function errorAlerter(error: any) {
  const status = error.response?.status;

  status
    ? alerter(showMsg(error))
    : alerter(
        'A network error occurred. This could be a CORS issue or a dropped internet connection.'
      );

  function alerter(message: string) {
    ElMessageBox({
      type: 'error',
      title: 'Error',
      message,
      center: true
    });
  }

  function showMsg(err: any): string {
    const n = err.response?.status;

    /** 已設定訊息的錯誤碼 */
    const errors: Record<number, string> = {
      403: '您沒有訪問的權限，請聯絡系統管理員',
      404: '伺服器找不到請求的資源，請再次確認搜尋參數，或聯絡系統管理員'
    };
    const msg = errors[n];
    if (msg) return `${msg}(${n})`;

    /** 未設定訊息的錯誤碼，顯示系統的預設錯誤訊息 */
    return err.message;
  }
}
