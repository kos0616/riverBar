import EN from 'element-plus/es/locale/lang/en';
import CN from 'element-plus/es/locale/lang/zh-cn';
import TW from 'element-plus/es/locale/lang/zh-tw';
import { ref, onMounted, onUnmounted } from 'vue';
import { useBus } from '@/CORE/plugins/bus';
import changeHtmlLang from '../lib/changeHtmlLang';
import { useI18n } from 'vue-i18n';

/** 系統語系名稱 */
type sysLang = 'zh_TW' | 'zh_CN' | 'en';

/** 語系更換
 * element-plus 使用 el-config-provider :locale="elementLocale" 進行變換
 * i18n 使用 i18n.locale.value 進行變換
 */
export default () => {
  /** element 語系 */
  const elementLocale = ref<Record<string, any>>(EN);
  const bus = useBus();
  const i18n = useI18n();

  const handleLang = (lang: string) => {
    const sysLang = getSysLang(lang);

    setElementLang(sysLang);
    localStorage.setItem('lang', sysLang);
    i18n.locale.value = sysLang;
    changeHtmlLang(sysLang);
  };

  const setElementLang = (lang: sysLang) => {
    switch (lang) {
      case 'zh_TW':
        elementLocale.value = TW;
        break;
      case 'zh_CN':
        elementLocale.value = CN;
        break;
      default:
        elementLocale.value = EN;
    }
  };

  /** 按照順序初始化語系 */
  const initLang = () => {
    const local = localStorage.getItem('lang');
    const html = document.documentElement.lang;
    const sysLang = getSysLang(local || html);
    handleLang(sysLang);
  };

  onMounted(() => {
    initLang();
    bus?.on('changeLang', handleLang);
  });

  onUnmounted(() => {
    bus?.off('changeLang', handleLang);
  });

  return { elementLocale };
};

/** 將取得的語系統一整理為系統語系，html lang有專屬格式，與系統內使用的sys語系名稱不同 */
function getSysLang(lang: string): sysLang {
  if (['ZH-TW', 'ZH_TW', 'ZH-HANT', 'TW'].includes(lang.toLocaleUpperCase())) {
    return 'zh_TW';
  } else if (['ZH-CN', 'ZH_CN', 'ZH-HANS', 'CN'].includes(lang.toLocaleUpperCase())) {
    return 'zh_CN';
  } else return 'en';
}
