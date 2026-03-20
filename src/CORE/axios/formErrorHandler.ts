import { ElMessageBox } from 'element-plus';
import { h } from 'vue';

/**
 * 20001 表單驗證錯誤
 * 沒有直接從核心 axios import 的原因是，未來若有修改錯誤顯示方式的需求，可以在 customer/axios/error 進行修改
 */
export default (res: backendResponse<any>) => alerter(res.response);

function alerter(res: string | Record<string, any>) {
  let msg;

  if (typeof res === 'object') {
    const VNode = Object.entries(res).map(([key, value]) => h('div', null, `${key}: ${value}`));
    msg = h('div', VNode);
  } else {
    msg = res;
  }

  ElMessageBox({
    type: 'error',
    title: 'Error',
    message: msg
  });
}
