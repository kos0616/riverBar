import generateToken from './generateToken';

/** 檢查token的生命週期 如果過期就生一組新的 */
export default () => {
  /** token */
  const auth = localStorage.getItem('x-authorisation');
  /** token 效期 */
  const token = localStorage.getItem('token');

  /** token 與效期檢查 */
  if (!auth || !token || Number(token) < Date.now()) saveToken();

  delay();
  return auth;
};

function saveToken() {
  localStorage.setItem('x-authorisation', generateToken(60));
}

/** token 效期 30分鐘 並且會在設定的時間後更新token 效期 並且會在設定的時間後更新token */
function delay() {
  const newTime = Date.now() + 30 * 60 * 1000;
  localStorage.setItem('token', `${newTime}`);
}
