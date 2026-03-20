import { type App } from 'vue';
import dayjs from 'dayjs';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $day: typeof day;
  }
}

/** 自訂插件，日期格式化 */
export default {
  install: (app: App<Element>) => {
    app.config.globalProperties.$day = day;
  }
};
/**
 *
 * @param date 日期，可能為 string 或 timestamp
 * @param format 欲使用的格式化 預設為 YYYY-MM-DD HH:mm:ss
 * @returns The formatted date string.
 */
function day(date?: string | number, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';

  if (/\d{13}/.test(date.toString())) {
    const n = date as number;
    return dayjs.unix(n / 1000).format(format);
  } else if (/\d{10}/.test(date.toString())) {
    const n = date as number;
    return dayjs.unix(n).format(format);
  }
  return dayjs(date).format(format);
}
