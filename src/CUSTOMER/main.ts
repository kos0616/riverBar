import './assets/tailwind.scss';
import './assets/element.scss';
import './assets/style.scss';
import './assets/icomoon.css';

import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import createMeta from '@/CORE/lib/createMeta';
import useScreen from '@/CORE/plugins/screen';
import formatNumber from '@/CORE/plugins/formatNumber';
import isMobile from '@/CORE/plugins/isMobile';
import day from '@/CORE/plugins/day';
import wrud from '@/CORE/plugins/wrud';
import router from './router';
import App from './App.vue';
import i18n from '@/CORE/i18n';
import useBus from '@/CUSTOMER/plugins/bus';
import tw from 'element-plus/es/locale/lang/zh-tw.mjs';
import myTable from '@/CORE/components/table/table.vue';
import myTableColumn from '@/CORE/components/table/table-column.vue';

const app = createApp(App);

app
  .use(createPinia())
  .use(router)
  .use(useScreen)
  .use(useBus)
  .use(i18n)
  .use(formatNumber)
  .use(isMobile)
  .use(day)
  .use(wrud)
  .use(ElementPlus, {
    locale: tw
  });

app.component('my-table', myTable);
app.component('my-table-column', myTableColumn);

app.mount('#app');

// XXX 不確定是否加入
// 加入的優點: 客戶使用時報錯可以配合UI即時回傳錯誤
// 加入的缺點: 可忽略的錯誤也會被回傳 ex: prompt cancel
// Global error handler
// app.config.errorHandler = (err, instance, info) => {
//   // Handle the error globally
//   console.log('Global error:', err)
//   console.log('Vue instance:', instance)
//   console.log('Error info:', info)
//   // Add code for UI notifications, reporting or other error handling logic
// }

/** 在html加入建立日期 */
document.documentElement.dataset.updated = BUILD_TIME;
createMeta('last-modified', BUILD_TIME);
