import axios, { type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { md5 } from 'js-md5';

const username = import.meta.env.VITE_CAMERA_AUTH_USER;
const password = import.meta.env.VITE_CAMERA_AUTH_PASSWORD;

type typeResponse = {
  error: '0';
  errorId: 'ok';
  errorString: '';
  reply: {
    nonce: '62545ad9e93f0';
    realm: 'VMS';
  };
};

/**
 * 取得監視器伺服器給予的驗證鏈結
 */
export default async (path: string): Promise<string> => {
  try {
    if (!username || !password) {
      throw new Error('camera-auth-not-configured');
    }

    const url = path.match(/https?:\/\/[^/]+/gi) || path.match(/http?:\/\/[^/]+/gi);
    const serverAddress = url ? url[0] : '';
    const res = await axios
      .get(serverAddress + '/api/getNonce')
      .then(({ data: response }: AxiosResponse<typeResponse>) => {
        const realm = response.reply.realm;
        const nonce = response.reply.nonce;
        const digest = md5(username + ':' + realm + ':' + password);
        const partial_ha2 = md5('GET' + ':');
        const simplified_ha2 = md5(digest + ':' + nonce + ':' + partial_ha2);
        const authKey = btoa(username + ':' + nonce + ':' + simplified_ha2);
        return authKey;
      });
    return res;
  } catch (e) {
    ElMessage.error('監視器展示來源未啟用或連線失敗');
    throw e;
  }
};
