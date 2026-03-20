export default [
  {
    name: '地圖',
    route: 'map',
    icon: new URL('@/CUSTOMER/assets/icons/map-active.svg', import.meta.url).href
  },
  {
    name: '水情展示',
    route: 'histroy',
    icon: new URL('@/CUSTOMER/assets/icons/record-active.svg', import.meta.url).href
  },
  {
    name: '圖控',
    route: 'iws',
    icon: new URL('@/CUSTOMER/assets/icons/monitor-active.svg', import.meta.url).href
  },
  {
    name: '汛期監測',
    route: 'flood',
    icon: new URL('@/CUSTOMER/assets/icons/flood-active.svg', import.meta.url).href
  },
  {
    name: '警示管理',
    route: 'alert',
    icon: new URL('@/CUSTOMER/assets/icons/bell-active.svg', import.meta.url).href
  },
] as {
  name: string;
  route: string;
  icon: string;
  /** 需求的角色，若擁有角色則可以無視 permission 取用節點 */
  roles?: string[];
  /** 固定的節點（暫）無論如何都會顯示的連結 */
  fixed?: boolean;
}[];
