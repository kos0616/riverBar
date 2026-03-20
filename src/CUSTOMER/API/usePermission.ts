import { ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';

type actionId = typePermission['ActionId'];

/** 取得當前頁面的可用權限 */
export default () => {
  const route = useRoute();
  const userInfoStore = useUserInfoStore();
  const permissions = userInfoStore.userInfo.Permissions || [];

  const { url } = route.meta;

  const getWRUD = (URL: string): actionId[] =>
    permissions.filter((o) => URL === o.SubjectId).map((o) => o.ActionId);

  const WRUD = ref<actionId[]>(getWRUD(url));

  onBeforeRouteUpdate((to, from) => {
    const toUrl = to.meta.url;
    const fromUrl = from.meta.url;
    if (toUrl !== fromUrl) WRUD.value = getWRUD(to.meta.url);
  });

  return { getWRUD, WRUD };
};
