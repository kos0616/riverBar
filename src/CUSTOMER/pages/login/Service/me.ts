import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';

export default async () => {
  try {
    const userInfoStore = useUserInfoStore();
    const getUserInfo = await $http.get('/api/identity/me');
    if (getUserInfo.status === 200) {
      /** NOTE: sidebar 會取用 getUserInfo */
      localStorage.setItem('getUserInfo', JSON.stringify(getUserInfo.data));
      userInfoStore.userInfo = getUserInfo.data;
    }
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};
