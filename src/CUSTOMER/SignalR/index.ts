import * as signalR from '@microsoft/signalr';
import { ElNotification, ElMessageBox } from 'element-plus';
import { emitter } from '@/CUSTOMER/plugins/bus';
import day from 'dayjs';

export const BASE_URL = import.meta.env.VITE_APP_URL;
const API_PREFIX = import.meta.env.VITE_APP_API_PREFIX || '';
const DISABLE_SIGNALR = import.meta.env.VITE_APP_DISABLE_SIGNALR === 'true';

const API = `${API_PREFIX}/signalr/updatePlc`;

let retryCount = 0;
const maxRetries = 5;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(API, {
    withCredentials: true
    // accessTokenFactory: () => {
    //   return localStorage.getItem('Authorization')?.toString() || '';
    // }
  })
  /** sample setting, maybe remove this later */
  .configureLogging(signalR.LogLevel.Information)
  .build();

/** (tag: string, value: string) */
connection.on('ReceivePlc', (tag: string, value: string, status: 'Bad' | 'Good') => {
  const upDateTime = day().format('YYYY-MM-DD HH:mm:ss');
  const arr = tag.split('.');
  const SiteCode = arr[0];
  const LocationCode = arr[1];
  const Tag = arr[2];

  /** 請注意 tag !== Tag
   * tag: "S03.S03P02.251"
   * Tag: 251
   */
  const data = {
    tag,
    value,
    upDateTime,
    SiteCode,
    LocationCode,
    Tag,
    status: status === 'Good' ? true : false
  };

  emitter.emit('updateSignalR', data);
});

// 接收線上人數更新訊息
connection.on(
  'UpdateOnlineUsers',
  (onlineUsers: { onlineUserCount: number; connectionCount: number }) => {
    emitter.emit('UpdateOnlineUsers', onlineUsers);
  }
);

/**
 * 啟用 signalR 連線
 * 若要測試即時更新，請至 https://sluicegate.vdr.tw/api/index.html
 * swagger: /api/Webhook/TestSignlr 測試即時更新功能
 */
export async function startConnection() {
  if (DISABLE_SIGNALR) return;
  /** only start linking when connection.state is disconnected */
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      retryCount = 0; // 重置重試計數
    } catch (err) {
      await handleConnectionError();
    }
  }
}

type TypeLocation = {
  success: boolean;
  // 0:NotOccupied, 1:AlreadyOccupiedBySelf, 2:AlreadyOccupiedByOther
  reason: 0 | 1 | 2;
  /** "Location 'S01P01' is already occupied by 'Qq12345'." */
  message: string;
  occupiedBy?: { userName: string; chiName: string };
};

/**
 * 佔用/釋放現地端頻道
 * https://sluicegate.vdr.tw/signalr-test.html
 *  */
export async function setLocation(locationId: string, action: 'EnterLocation' | 'LeaveLocation') {
  if (DISABLE_SIGNALR) {
    return { success: true, reason: 0, message: '' };
  }
  const state = connection.state;

  if (state === signalR.HubConnectionState.Connecting) {
    setTimeout(async () => {
      await setLocation(locationId, action);
    }, 5000);
    return;
  }

  if (state === signalR.HubConnectionState.Disconnected) {
    await handleConnectionError();
    return;
  }

  if (state === signalR.HubConnectionState.Connected) {
    return await connection
      .invoke(action, locationId)
      .then((response: TypeLocation) => {
        /** 被他人佔頻 */
        if (response.success === false && response.reason === 2) {
          const user = response.occupiedBy?.userName + '(' + response.occupiedBy?.chiName + ')';
          ElMessageBox({
            message: `圖控頻道已被 ${user} 佔用`,
            title: '警告'
          });
        } else if (response.success === false && typeof response.reason !== 'number') {
          /** 其他原因的失敗，非自身佔用，也非解除鎖定 */
          throw new Error(response.message);
        }
      })
      .catch((err) => {
        ElNotification.error({
          message: `圖控頻道初始化失敗，請嘗試重新整理頁面，或聯絡系統管理人員\n (${locationId}, ${action}) \n ${err.toString()}`,
          duration: 0
        });
        throw err;
      });
  }
}

connection.onreconnected(() => {
  ElNotification.success({
    title: '同步成功',
    message: '即時同步伺服器已重新連線'
  });
  retryCount = 0;
});

connection.onclose(async () => {
  await handleConnectionError();
});

connection.on('error', async () => {
  await handleConnectionError();
});

async function handleConnectionError() {
  if (DISABLE_SIGNALR) return;
  if (retryCount === 0) {
    ElNotification.info({
      title: '等待中',
      message: '即時同步緩衝中，正在嘗試重新連線'
    });
  }
  if (retryCount < maxRetries) {
    retryCount++;
    setTimeout(async () => {
      await startConnection();
    }, 10000); // 等待10秒後重新連線
  } else {
    ElNotification.error({
      title: '同步器離線',
      message: '連線延時，即時同步功能已暫停，請嘗試重新登入或聯絡系統管理員',
      duration: 0
    });
  }
}
