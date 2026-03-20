/** 選用指定的角色身份時，工作站會變成必填項目 */
// 「站長」stationManager「工作站職員(一般職員) staff
export default (char: string[]) => {
  return char.some((str) => str === 'staff' || str === 'stationManager');
};
