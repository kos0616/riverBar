import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { ElMessage } from 'element-plus';
// import { saveAuth } from '@/CUSTOMER/lib/auth';

type typeLogin = {
  Email?: string;
  Password?: string;
};

// type response = {
//   /** "Bearer" */
//   tokenType: string;
//   accessToken: string;
//   /** 3600 */
//   expiresIn: number;
//   refreshToken: string;
// };

export default async (myForm: typeLogin) => {
  try {
    await $http.post('/api/identity/login?useCookies=true', myForm);
    // if (login.status === 200) {
    // const res = login.data as response;
    // 儲存Authorization
    // saveAuth(res);
    // }
  } catch (error: any) {
    ElMessage.warning('登入失敗，請稍後再試');
    handleError(error);
    throw error;
  }
};
