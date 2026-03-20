import sidebarLinks from '@/CUSTOMER/static/nodes';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';

// type link = {
//   name: string;
//   route: string;
//   icon: string;
//   /** 需求的角色，若擁有角色則可以無視 permission 取用節點 */
//   roles?: string[];
//   /** 固定的節點（暫）無論如何都會顯示的連結 */
//   fixed?: boolean;
// };

type typeLink = { name: string; route: string; icon?: string };

/**
 * 產生用戶的選單連結列表
 * 經過版本更迭，已經將需求角色與固定節點功能隱藏
 */
export default (): typeLink[] => {
  const userInfoStore = useUserInfoStore();
  // const userRoles = userInfoStore.userInfo.Roles || [];
  const permissions = getPermissions(userInfoStore.userInfo);

  /** 固定顯示的連結 */
  const fixed = sidebarLinks.filter((o) => o.fixed);

  /** 需要以角色解鎖的連結 */
  // const roleLinks = sidebarLinks.filter((o) => (o.roles || []).some((r) => userRoles.includes(r)));

  /** 以 Permission 解鎖的連結 */
  const permissionLinks = permissions.map((o) => {
    const find = sidebarLinks.find((obj) => obj.route === o.route);
    return find === undefined ? o : { ...o, name: find.name, icon: find.icon };
  });
  return [...permissionLinks, ...fixed];
  // return [...roleLinks, ...permissionLinks, ...fixed];
};

type userInfo = {
  Permissions: typePermission[];
  Roles: string[];
};

function getPermissions(userInfo: userInfo) {
  return ((userInfo.Permissions || []) as typePermission[])
    .filter((v, i, a) => a.map((a) => a.SubjectId).indexOf(v.SubjectId) === i)
    .map((o) => ({ name: o.SubjectName, route: o.SubjectId }));
}
