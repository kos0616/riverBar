import { defineStore } from 'pinia';
import getIP from '../lib/getIP';

interface State {
  /** 用戶的IP位址 */
  IP?: string;
}

/** 用戶的IP位址 */
export const useIPStore = defineStore('IP', {
  state: (): State => ({
    IP: undefined
  }),
  actions: {
    async getIP() {
      const IP = await getIP();
      this.IP = IP;
      return IP;
    }
  }
});
