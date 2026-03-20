import { type App } from 'vue';
import { useRoute } from 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $WRUD: typeof getWRUD;
  }
}

/** 自訂插件，權限 */
export default {
  install: (app: App<Element>) => {
    app.config.globalProperties.$WRUD = getWRUD;
  }
};

type Permission = {
  ActionId: 'r' | 'w' | 'u' | 'd';
  // '讀取';
  ActionName: string;
  //  'alert-r'
  Code: string;
  Sort: number;
  // 'alert'
  SubjectId: string;
  // '警示管理'
  SubjectName: string;
};

/**
 * 權限判斷
 * @param action 權限類型
 * @param node 其他權限參考位址，保留空則參考當前路由
 * @returns 是否有權限
 */
export function getWRUD(action: 'r' | 'w' | 'u' | 'd', node?: string) {
  const route = useRoute();
  if (!route) {
    console.error('getWRUD: route is undefined');
    return false;
  }
  const url = node || route.meta.url; // router 權限參考 node

  const Permissions: Permission[] = localStorage.getItem('getUserInfo')
    ? JSON.parse(localStorage.getItem('getUserInfo') as string).Permissions
    : [];
  return Permissions.some((item) => item.ActionId === action && item.SubjectId === url);
}
