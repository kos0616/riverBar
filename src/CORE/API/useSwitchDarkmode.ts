import { onMounted, ref, watch } from 'vue';

export default () => {
  const theme = ref<'dark' | 'light'>('dark');

  const setTheme = (theme: 'dark' | 'light') => {
    document.documentElement.dataset.mode = theme;
    localStorage.theme = theme;
    switchHTMLTheme(theme);
  };

  /** 初始化 theme 不必在 onmounted 執行 */
  const init = () => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    const isDark =
      window.localStorage.theme === 'dark' ||
      (!('theme' in window.localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      setTheme('dark');
      theme.value = 'dark';
    } else {
      theme.value = 'light';
      setTheme('light');
    }
  };

  watch(theme, setTheme);

  onMounted(() => {
    init();
  });

  return { setTheme, theme };
};

/**
 * 切換 html 的 class
 * 主要是 element 的黑暗模式需要 */
function switchHTMLTheme(theme: 'dark' | 'light') {
  const html = document.documentElement;

  if (theme === 'dark' && html.classList.contains('light')) {
    html.classList.replace('light', 'dark');
  } else if (theme === 'light' && html.classList.contains('dark')) {
    html.classList.replace('dark', 'light');
  } else {
    // 如果兩個都不存在，預設添加 'light'
    html.classList.add(theme);
  }
}
