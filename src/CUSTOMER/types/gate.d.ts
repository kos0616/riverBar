type typeGate = {
  Name: string;
  // '658aac6b063ae42c6537d870'
  _id: string;
  // 'S01'
  SiteCode: string;
  // 'S01P01'
  LocationCode: string;
  Cameras: typeCamera[];
  Sections: typeSection[];
  Gate: typeGateItem;
};

type typeCamera = {
  // 'Cam54'
  Code: string;
  //'東柵埤橡皮壩'
  Name: string;
  // 'https://vbs.zerosum.com.tw:8080/VideoStream/54'
  Url: string;
};

type typeSection = {
  // 投光燈 Light = 1,
  // 水位警報 WaterAlarm = 2,
  // 上方藍色Sensor訊息 Sensor = 3,
  // 上方紅色設定警示訊息 AlarmSetting = 4,
  // 左下黃色警告訊息 Warning = 5,
  // 左下綠色狀態訊息 Status = 6,
  // 上方水藍色水門編號設定 WaterGate = 7,
  // 下方橡皮壩水門倒伏堰區域 GateStatus = 8,
  SectionType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  PLCs: typePLC[];
};

type typePLC = {
  // "燈ON"
  Name: string;
  TagType: number;
  //"413"
  Tag: string;
  Value: string | boolean | number;
  Status: boolean;
  UpdateTime: null | string;
};

type typeGateItem = {
  // 1橡皮壩 2水門 3倒伏偃 4拆分式水門
  GateType: 1 | 2 | 3 | 4;
  MapSection: {
    PLCs: typePLC[];
  };
  DamSections: typeDamSections[];
};

type typeDamSections = {
  DamSectionType: number;
  Name?: string;
  PLCs: typePLC[];
};
