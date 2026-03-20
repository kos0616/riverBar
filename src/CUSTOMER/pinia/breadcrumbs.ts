import { defineStore } from 'pinia';

type bread = { label: string; href?: string };

export const useBreadcrumbStore = defineStore({
  id: 'breadcrumb',
  state: () => ({
    breadcrumbs: [] as bread[]
  })
  // actions: {
  //   actions_breadcrumb(status: []) {
  //     this.update = new Date().getTime();
  //     this.breadcrumb = status;
  //   }
  // }
});
