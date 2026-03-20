import { type App } from 'vue';
import mitt, { type Emitter } from 'mitt';
import type { Events as ProtoEvents } from '@/CORE/plugins/bus';
/**
 * bus merging from CORE/plugins/bus
 * 因為 declare module '@vue/runtime-core' 目前無法合併 interface
 * 僅能先將 CORE/plugins/bus 的 declare module 複製到此檔案
 */
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $bus: Emitter<Events>;
  }
}

export type Events = ProtoEvents & {
  /** signalR updated tag: "S03.S03P02.251" value: 113.7 updateTime: 前端產生之 YYYY-MM-DD HH:mm:ss */
  updateSignalR: {
    tag: string;
    /** S03 */
    SiteCode: string;
    /** S03P02 */
    LocationCode: string;
    /** 點位 251 */
    Tag: string;
    value: number | string;
    upDateTime: string;
    status: boolean;
  };
  UpdateOnlineUsers: {
    onlineUserCount: number;
    connectionCount: number;
  };
  /** IWS 內部 重新取得資料 */
  refreshIws: undefined;
  /** 觸發儲存 */
  save: undefined;
};

export const emitter: Emitter<Events> = mitt<Events>();

/** 自訂插件，全域bus $bus */
export default {
  install: (app: App<Element>) => {
    app.config.globalProperties.$bus = emitter;
  }
};
