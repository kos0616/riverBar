import $http from '@/CUSTOMER/axios';
import handleError from '@/CUSTOMER/axios/error';
import day from 'dayjs';

const API = ({ id, start, end }: request) =>
  `/api/WaterLevelGauge/${id}/history?start=${start}&end=${end}`;

export type request = {
  /** S01.S01P02.251 */
  id: string;
  /** 2024-06-01T00:00 */
  start: string;
  end: string;
};

export type response = item[];

export type item = ReturnType<typeof formater>;

export type raw_item = {
  /** 'S01.S01P02.251'; */
  Id: string;
  /** '2024-06-08T14:52:34.643115'; */
  Time: string;
  WaterLevel: number;
  FirstAlertWaterLevel: number | null;
  SecondAlertWaterLevel: number | null;
  ThirdAlertWaterLevel: number | null;
  LowWaterLevel: number | null;
  GateOpening1: number | null;
  GateOpening2: number | null;
  GateOpening3: number | null;
  RubberDamPressure: number | null;
  FlowRate: number | null;
};

export default async (req: request): Promise<response> => {
  try {
    const data = await $http.get(API(req)).then((res) => res.data);
    return data.map(formater);
  } catch (error: any) {
    handleError(error);
    throw error;
  }
};

function formater(item: raw_item) {
  const { Time } = item;
  const Time_f = day(Time).format('YYYY-MM-DD HH:mm:ss');

  return { ...item, Time_f };
}
