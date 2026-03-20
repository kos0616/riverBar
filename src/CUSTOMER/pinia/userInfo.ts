import { defineStore } from 'pinia';
import sites from '@/CUSTOMER/static/stationRights.json';

export type userInfo = {
  Permissions: typePermission[];
  StationRights: StationRight[];
  Roles: string[];
  /** 'tester' */
  UserName: string;
  Email: string;
  /**  '測試人員' */
  ChiName: string;
  SiteCode: string | null;
  IsLineNotify: boolean;
  IsLineLinked: boolean;
};
type StationRight = {
  StationId: string;
  Level: number;
};

type typePermission = {
  ActionId: 'r' | 'w' | 'u' | 'd';
  // '讀取'
  ActionName: string;
  // 'iws-r';
  Code: string;
  // 'iws'
  SubjectId: string;
  //'IWS圖控'
  SubjectName: string;
};

function getUserInfo(): userInfo {
  try {
    const str = localStorage.getItem('getUserInfo') || '{}';
    return JSON.parse(str);
  } catch (error) {
    return {} as userInfo;
  }
}

export const useUserInfoStore = defineStore({
  id: 'userInfo',
  state: () => ({
    userInfo: getUserInfo() as userInfo
  }),
  actions: {
    // actions_breadcrumb(status: []) {
    //   this.update = new Date().getTime();
    //   this.breadcrumb = status;
    // }
    updateUserInfo(info: userInfo) {
      this.userInfo = info;
      localStorage.setItem('getUserInfo', JSON.stringify(info));
    }
  },
  getters: {
    SiteName: (state) => getSiteName(state.userInfo.SiteCode || '')
  }
});

/** 取得使用者工作站的名稱 */
export const getSiteName = (SiteCode: string) => {
  for (const site of sites) {
    const stationData = site.Stations.find((item) => item.Station === SiteCode);
    if (stationData) return stationData.Name;
  }
  return '';
};
