declare type typePermission = {
  ActionId: 'r' | 'w' | 'u' | 'd';
  // '讀取'
  ActionName: string;
  // 'iws-r';
  Code: string;
  // 'iws'
  SubjectId: string;
  //'IWS圖控'
  SubjectName: string;
};
