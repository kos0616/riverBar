// import $http from '@/CUSTOMER/axios';
// import handleError from '@/CUSTOMER/axios/error';
// import { saveAuth, clearAuth } from '@/CUSTOMER/lib/auth';
// const API = '/api/identity/refresh';

// type typeRequest = {
//   RefreshToken: string;
// };

// type typeResponse = {
//   /** "Bearer" */
//   tokenType: string;
//   accessToken: string;
//   /** 3600 */
//   expiresIn: number;
//   refreshToken: string;
// };

// export default async () => {
//   const RefreshToken = localStorage.getItem('refreshToken');
//   const isExpired = Math.floor(Date.now() / 1000) >= Number(localStorage.getItem('expire') || '0');

//   try {
//     /** 過期 */
//     if (isExpired) throw 'expire';
//     /** 連token都沒有，報錯送出去 */
//     if (!RefreshToken) throw 'noToken';

//     const getter = await $http.post(API, { RefreshToken } as typeRequest);
//     const res = getter.data as typeResponse;
//     saveAuth(res);
//   } catch (error: any) {
//     /** 保存來訪路徑 */
//     sessionStorage.setItem('fromPath', location.pathname);

//     const status = error.response?.status;
//     let msg;
//     if (status === 401 || (typeof error === 'string' && error === 'noToken')) {
//       msg = '驗證無效，請重新登入';
//     } else if (typeof error === 'string' && error === 'expire') {
//       msg = '驗證過期，請重新登入';
//     } else {
//       msg = error;
//     }

//     handleError(msg, 'exiled').then(() => clearAuth('/login'));

//     throw error;
//   }
// };
