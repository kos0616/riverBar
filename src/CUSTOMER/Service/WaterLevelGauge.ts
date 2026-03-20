import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import day from 'dayjs';

const API = '/api/WaterLevelGauge';

export type response = item[];

export type item = ReturnType<typeof formater>;

export type raw_item = {
  // 'S02.S02P04.251-1';
  Tag: string;
  // 'S01.S01P01-2.251'
  Id: string;
  // 'S02';
  SiteCode: string;
  // '公館工作站_穿龍圳北幹線'
  Name: string;
  // S02P04
  LocationCode: string;
  /** 流速 */
  FlowRate: null | number;
  /** 水位 */
  WaterLevel: null | number;

  LowWaterLevel: null | number;
  FirstAlertWaterLevel: null | number;
  SecondAlertWaterLevel: null | number;
  ThirdAlertWaterLevel: null | number;

  IsLowWaterAlertEnabled: null;
  IsFirstAlertEnabled: null;
  IsSecondAlertEnabled: null;
  IsThirdAlertEnabled: null;

  Section: null | typeSection;
  RiverSystem: string;

  /** 最後同步時間 "2024-05-27T18:45:31.578" */
  LastUpdatedTime: string | null;

  /** 是否有圖控系統 */
  HasLocationSetting: boolean;

  GateType: number;
  Status: 'Good' | null | string;
};

export default async (): Promise<ReturnType<typeof formater>[]> => {
  try {
    const data = await $http.get(API).then((res) => res.data);
    return data.map(formater);
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};

export function formater(item: raw_item) {
  /** 將 "大埔工作站_大浦圳幹線2" 拆分成  大埔工作站 與 大浦圳幹線2 */
  const Site = (/(.*?)_/.exec(item.Name) || [])[1];
  const Location = (/_(.*)/.exec(item.Name) || [])[1];

  const LastUpdatedTime = item.LastUpdatedTime;

  const Updated = LastUpdatedTime ? day(LastUpdatedTime) : undefined;

  // const MyStatus = Minutes !== undefined;
  const IsDanger = waterLevelStatus(item) !== true || item.Status !== 'Good';

  const LastUpdated = Updated ? Updated.format('YYYY-MM-DD HH:mm:ss') : undefined;
  return { ...item, Site, Location, LastUpdated, IsDanger };

  /**
   * 水位狀態判斷
   * edit from customColorMethod
   */
  function waterLevelStatus(cur?: raw_item) {
    const n = Number(cur?.WaterLevel || 0);

    if (
      typeof cur?.LowWaterLevel === 'number' &&
      cur.LowWaterLevel !== 0 &&
      n < cur?.LowWaterLevel
    ) {
      return false;
    }
    if (
      typeof cur?.ThirdAlertWaterLevel === 'number' &&
      cur?.ThirdAlertWaterLevel !== 0 &&
      n > cur?.ThirdAlertWaterLevel
    )
      // #8E24AA - 紫色
      return false;
    if (
      typeof cur?.SecondAlertWaterLevel === 'number' &&
      cur?.SecondAlertWaterLevel !== 0 &&
      n > cur?.SecondAlertWaterLevel
    )
      // #FF7043 - 淺橘紅色
      return false;
    if (
      typeof cur?.FirstAlertWaterLevel === 'number' &&
      cur?.FirstAlertWaterLevel !== 0 &&
      n > cur?.FirstAlertWaterLevel
    )
      // #DE3B40FF - 紅色;
      return false;
    // #3498db - 藍色
    return true;
  }
}
