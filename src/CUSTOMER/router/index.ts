// import $i18n from './lang'
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
const BASE_TITLE = document.title;
const API_PREFIX = import.meta.env.VITE_APP_API_PREFIX || '';
const API_ORIGIN = import.meta.env.VITE_APP_URL || '';

/** 自動引入路徑 */
const Modules = requireAll(
  import.meta.glob('@/**/router.ts', { eager: true }) as Record<
    string,
    { default: RouteRecordRaw[] }
  >
);

const error404 = {
  path: '/:pathMatch(.*)*',
  component: () => import('../pages/error404.vue'),
  name: 'error404',
  beforeEnter: (to: { path: string }, from: any, next: () => void) => {
    if (to.path === '/LineNotify/register') {
      window.location.href = `${API_ORIGIN}${API_PREFIX}/LineNotify/register`; // 重定向到後端處理
    } else {
      next(); // 繼續正常的 404 錯誤頁面處理
    }
  }
};

const Myrouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...Modules, error404]
});
export default Myrouter;

/** 依據條件讓程式自動引入可使用的模組 */
function requireAll<T>(requireContext: Record<string, { default: T[] }>): T[] {
  return Object.values(requireContext)
    .map((module) => module.default)
    .filter((value) => value !== undefined)
    .reduce((acc, cur) => [...acc, ...cur], [] as T[]);
}

Myrouter.beforeEach((to: any, from: any, next) => {
  /** 修改Title */
  const path: string | undefined = to.meta.title;
  setTitle(path);
  next();
});

// 設定網頁Title
export function setTitle(title: string | undefined) {
  document.title = title ? `${title} - ${BASE_TITLE}` : BASE_TITLE;
}
