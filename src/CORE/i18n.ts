import { createI18n } from 'vue-i18n';

export default createI18n({
  legacy: false, // you must set `false`, to use Composition API
  messages: {
    en: { test: 'test(en)', Util: { 10015: '權限不足' } },
    zh_TW: { test: '測試(繁中)', Util: { 10015: '權限不足' } },
    zh_CN: { test: '測試(簡中)', Util: { 10015: '權限不足' } }
  }
});
