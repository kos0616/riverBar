// type auth = {
//   /** "Bearer" */
//   tokenType: string;
//   accessToken: string;
//   /** 3600 */
//   expiresIn: number;
//   refreshToken: string;
// };

/** 儲存 Authorization */
// export function saveAuth(res: auth) {
//   // 儲存Authorization
//   localStorage.setItem('Authorization', res.accessToken);
//   localStorage.setItem('refreshToken', res.refreshToken);
//   const expire = Math.floor(Date.now() / 1000 + res.expiresIn);
//   localStorage.setItem('expire', expire.toString());
// }
/**
 * 清除 Authorization 並且登出用戶
 * 但仍保留儲存的帳號
 */
export function clearAuth() {
  // localStorage.removeItem('Authorization');
  // localStorage.removeItem('refreshToken');
  // localStorage.removeItem('expire');
  localStorage.removeItem('getUserInfo');
  localStorage.removeItem('exiled');

  // if (path) location.replace(path);
}
