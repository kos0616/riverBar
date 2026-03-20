import { ElMessageBox } from 'element-plus'; // 取得警告標籤
import i18n from '@/CORE/i18n';
// import { COMMON_ERRORS } from '@/CUSTOMER/axios/error';

/**
 * 對應後端系統的共用錯誤
 * 負責將後端的 error code 轉換成警告
 * 不會處理例外型錯誤，若需要對某些 code 放行，則需要在 Service 內調整
 * 沒有直接從核心 axios import 的原因是，未來若有修改錯誤顯示方式的需求，可以在 customer/axios/error 進行修改
 */
export default (data: backendResponse<any>, moduleName: string): void => {
  /** 共用性錯誤，會在 axios 中處理 */
  // if (COMMON_ERRORS.includes(data.code)) return;

  let msg = i18n.global.t('Util.error', { code: data.code }) + ` ${data.response}`;
  const errorMsg = i18n.global.t(`${moduleName}.${data.code}`);

  /** 判斷沒有多語言對應時，回傳普通警示 */
  if (errorMsg !== `${moduleName}.${data.code}`) msg = errorMsg;

  ElMessageBox.alert(msg);
};
