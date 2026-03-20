/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 資料夾名稱 */
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_API_PREFIX: string
  readonly VITE_APP_DISABLE_SIGNALR: string
  readonly VITE_GOOGLE_MAPS_API_KEY?: string
  readonly VITE_CAMERA_AUTH_USER?: string
  readonly VITE_CAMERA_AUTH_PASSWORD?: string
  readonly VITE_APP_VERSION: string
  /** 專案類別 */
  readonly VITE_APP_TYPE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** global常數 */
/** 建立的時間 */
declare const BUILD_TIME: string
