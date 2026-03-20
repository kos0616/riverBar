import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface State {
  /** 是否連線 */
  isConnected: boolean;
  /** 最後連線時間 */
  lastConnectionDate: Date | undefined;
}

const isConnected = window.navigator.onLine;

/** 連線狀態，可以知曉用戶目前連線狀態與最後連線時間 */
export const useNetworkStatusStore = defineStore('networkStatus', {
  state: (): State => ({
    isConnected,
    lastConnectionDate: undefined
  }),
  actions: {
    setConnected(connected: boolean) {
      this.isConnected = connected;
      if (!connected) this.lastConnectionDate = new Date();
    }
  },
  getters: {
    /** 連線狀態 */
    connectionStatus(): 'connected' | 'disconnected' | 'reconnected' {
      if (!this.isConnected) {
        return 'disconnected';
      } else if (
        this.lastConnectionDate !== undefined &&
        new Date().getTime() - this.lastConnectionDate.getTime() < 10000
      ) {
        return 'reconnected';
      }
      return 'connected';
    },
    /** 格式化的最後連線時間 */
    formattedLastConnection(): string {
      if (!this.lastConnectionDate) return '';
      const now = dayjs();
      const lastConnection = dayjs(this.lastConnectionDate);
      const differenceInDays = now.diff(lastConnection, 'day');

      if (differenceInDays < 1) {
        return lastConnection.from(now); // 顯示 fromNow
      } else {
        return lastConnection.format('YYYY-MM-DD'); // 顯示日期
      }
    }
  }
});
