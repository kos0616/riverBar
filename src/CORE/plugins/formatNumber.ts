import { type App } from 'vue';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatNumber: typeof formatNumber;
  }
}

/** 自訂插件，數字格式化 $formatNumber */
export default {
  install: (app: App<Element>) => {
    app.config.globalProperties.$formatNumber = formatNumber;
  }
};

function formatNumber(n?: string | number, precision?: number, separator?: string) {
  let parts;
  // 判斷是否為數字
  if (!isNaN(parseFloat(n as string)) && isFinite(n as number)) {
    // 把類似 .5, 5. 之類的數據轉化成0.5, 5, 為數據精度處理做準, 至於為什麼
    // 不在判斷中直接寫 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因為parseFloat有一個奇怪的精度問題, 比如 parseFloat(12312312.1234567119)
    // 的值變成了 12312312.123456713
    let num: string | number = Number(n);
    // 處理小數點位數
    // 20220731  precision_f處理小數點如果最多只呈現兩位 num_f如果是小數直接採用最後兩位
    const precision_f = precision && precision > 2 ? 2 : precision;
    const num_f = typeof num === 'number' && num % 1 == 0 ? num : num.toFixed(2);
    num = (typeof precision_f !== 'undefined' ? num.toFixed(precision_f) : num_f).toString();
    // 分離數字的小數部分和整數部分
    parts = num.split('.');
    // 整數部分加[separator]分隔, 借用一個著名的正則表達式
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator || ','}`);

    return parts.join('.');
  }
  return '0';
}

//   function formatNumber(num: any, precision?: number, separator?: any) {
//   let parts;
//   // 判斷是否為數字
//   // eslint-disable-next-line no-restricted-globals
//   if (!isNaN(parseFloat(num)) && isFinite(num)) {
//     // 把類似 .5, 5. 之類的數據轉化成0.5, 5, 為數據精度處理做準, 至於為什麼
//     // 不在判斷中直接寫 if (!isNaN(num = parseFloat(num)) && isFinite(num))
//     // 是因為parseFloat有一個奇怪的精度問題, 比如 parseFloat(12312312.1234567119)
//     // 的值變成了 12312312.123456713
//     // eslint-disable-next-line no-param-reassign
//     num = Number(num);
//     // 處理小數點位數
//     // eslint-disable-next-line no-param-reassign
//     num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
//     // 分離數字的小數部分和整數部分
//     parts = num.split('.');
//     // 整數部分加[separator]分隔, 借用一個著名的正則表達式
//     parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator || ','}`);

//     return parts.join('.');
//   }
//   return 0;
// }
// export default formatNumber;
