import 'vue-router';

/**
 * 定義 meta 屬性
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 節點名稱 規則為 NODE_* */
    title: string;
    /** 權限參考位址 */
    url: string;
    /** 麵包屑參考 */
    breadcrumb: { label: string; href: string }[];
    /** 工具列 */
    toolbar?: (
      | 'create'
      | 'edit'
      | 'delete'
      | 'save'
      | 'search'
      | 'advSearch'
      | 'export'
      | 'paginator'
    )[];
    // 添加其他您需要的属性
  }
}
