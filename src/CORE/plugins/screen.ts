import { ref, type App, type Ref } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $screenWidth: Ref<number>;
    $screenHeight: Ref<number>;
  }
}

/** 自訂插件，螢幕範圍監聽
 * $screenWidth $screenHeight
 */
export default {
  install: (app: App<Element>) => {
    const width = ref(0);
    const height = ref(0);

    app.config.globalProperties.$screenWidth = width;
    app.config.globalProperties.$screenHeight = height;

    window.addEventListener('resize', handleResize);
    handleResize();

    function handleResize() {
      width.value = window.innerWidth || document.documentElement.clientWidth;
      height.value = window.innerHeight || document.documentElement.clientHeight;
    }
  }
};
