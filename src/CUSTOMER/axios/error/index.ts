import { ElMessageBox, ElMessage } from 'element-plus';
import { clearAuth } from '@/CUSTOMER/lib/auth';
import Logout from '@/CUSTOMER/Service/identity/Logout';
import { AxiosError } from 'axios';

const ERROR_MESSAGES: Record<number, string> = {
  400: '發生錯誤，參數有誤，請再次確認參數。',
  401: '您的權限不足，請聯絡系統管理員。',
  403: '您沒有訪問的權限，請聯絡系統管理員。',
  404: '伺服器找不到請求的資源，請再次確認搜尋參數，或聯絡系統管理員。',
  500: '伺服器發生錯誤，請重新登入或聯絡系統管理員。'
};

/**
 * 顯示伺服器錯誤 ex: CORS, 404, 500
 * 後端錯誤與這裡無關 ex: 10015 20001  */
/**
 *
 * @param error 顯示的錯誤
 * @param st 錯誤狀態 'exiled' 用戶已遭流放，不需再顯示其他報錯
 * @returns
 */
export default async function errorAlerter(error: any, st?: 'exiled') {
  /** JS 底層錯誤 */
  if (isJsError(error)) return showWarning('發生系統錯誤: ' + error);

  /** 這裏不報錯是因為用戶已經處於被流放狀態，再多的報錯只會遮蔽畫面 */
  if (isExiled()) return;

  /** 指定的文字型態錯誤訊息 */
  if (typeof error === 'string') return showAlert(error);

  /** timeout */
  if (isTimeoutError(error)) return showWarning('連線逾時，請重新登入');

  /** 可能是 CORS 問題 */
  if (isCorsError(error)) return handleCorsError(error.message);

  /** 以 status 尋找錯誤訊息 */
  const status = error.response?.status;
  /** refresh 和 一般 API 401, 403 在驅離時會將狀態改為 exiled */
  if (st === 'exiled' || status === 403 || status === 401) markExiled();

  /** 500 錯誤 可選擇重新整理或登出 */
  if (isHttpError_500(status)) return handleServerError(status);

  /** 一般處置 但 401 和 403 除外 */
  if (isHttpError_other(status)) return showAlert(showMsg(status));

  /** 未知錯誤 與 401 403 的趕人處置 */
  return handleUnknownError(status, error);
}

function isJsError(error: any): boolean {
  return error instanceof Error && !(error instanceof AxiosError);
}

function isExiled(): boolean {
  return localStorage.getItem('exiled') !== null;
}

function markExiled() {
  localStorage.setItem('exiled', 'y');
}

function isHttpError_500(status: number): boolean {
  return status === 500;
}

function isHttpError_other(status: number): boolean {
  return typeof status === 'number' && status !== 403 && status !== 401;
}

function isTimeoutError(error: any): boolean {
  return error.code === 'ECONNABORTED' && error.message.includes('timeout');
}

function isCorsError(error: any): boolean {
  return error.message === 'Network Error' && !error.response;
}

function showWarning(message: string) {
  return ElMessage.error({
    message,
    duration: 0
  });
}

function showAlert(message: string) {
  return ElMessageBox({
    type: 'error',
    title: 'Error',
    message,
    closeOnClickModal: true,
    showClose: true,
    center: true
  });
}

async function handleServerError(status: number) {
  const message = showMsg(status);
  return ElMessageBox.confirm(message, '發生連線問題', {
    type: 'error',
    closeOnClickModal: false,
    showClose: false,
    center: true,
    confirmButtonText: '返回首頁',
    cancelButtonText: '重新整理'
  })
    .then(async () => {
      Logout();
      clearAuth();
      location.replace('/');
    })
    .catch(() => location.reload());
}

async function handleCorsError(message: string) {
  const msg = `${message} (CORS)`;
  return ElMessageBox.confirm(msg, '發生連線問題', {
    type: 'error',
    closeOnClickModal: false,
    showClose: false,
    center: true,
    confirmButtonText: '返回首頁',
    cancelButtonText: '重新整理'
  })
    .then(async () => {
      Logout();
      clearAuth();
      location.replace('/');
    })
    .catch(() => location.reload());
}

async function handleUnknownError(status: number, error: any) {
  return showAlert(showMsg(status, error)).finally(async () => {
    clearAuth();
    location.replace('/');
    Logout();
  });
}

function showMsg(status: number, error?: any): string {
  if (!status && error instanceof AxiosError)
    return '發生了未知的網路錯誤，請聯絡系統管理員或重新登入';

  const msg = ERROR_MESSAGES[status];
  return msg ? `${msg}(HTTP ${status})` : `發生錯誤，錯誤碼: HTTP ${status}`;
}
