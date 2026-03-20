/** 改變 html 上的語言標記 */
export default (lang: string) => {
  const html = document.documentElement; // returns the html tag

  const htmlLang = langs[lang];
  if (htmlLang) {
    html.setAttribute('lang', htmlLang);
    return;
  }
  html.setAttribute('lang', lang);
};

/** 系統語系名稱與html lang 的對照表 */
export const langs = {
  zh_CN: 'zh-Hans',
  zh_TW: 'zh-Hant',
  vi: 'VN',
  en: 'en',
  jp: 'ja'
} as Record<string, string>;
