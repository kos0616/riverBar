import { type App } from 'vue';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $isMobile: boolean;
  }
}

/** 偵測裝置 */
export default {
  install: (app: App<Element>) => {
    app.config.globalProperties.$isMobile = isMobile();
  }
};

function isMobile() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  }
  return false;
}
