import { defineStore } from 'pinia';

type item = {
  // 'T.P01-1.207'
  id: string;
  r: string;
  s: boolean;
  // 1706076919834
  t: number;
  v: boolean | number;
};

export const useCounterAxios = defineStore({
  id: 'axios',
  state: () => ({
    // 塞一個時間 做監聽時間變化去拿資料
    update: new Date(),
    logLists: [] as item[]
  }),
  actions: {
    actions_axios_update() {
      this.update = new Date();
    },
    actions_request(request: item[]) {
      // const COPY = JSON.parse(JSON.stringify(request));
      // for (let item of COPY) {
      //   (item as unknown as { t: Date }).t = new Date();
      //   this.logLists.unshift(item);
      // }
    }
  },
  getters: {
    getLogLists: (state) => state.logLists
  }
});
