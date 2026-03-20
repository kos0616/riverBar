import { type item } from '@/CUSTOMER/Service/WaterLevelGaugeHistory';

type TypeDatasets = {
  label: string;
  backgroundColor?: string;
  borderColor: string;
  data: Array<number | null>;
  yAxisID?: string;
  fill?: boolean;
  pointRadius: number;
};

export type data = {
  labels: string[];
  datasets: TypeDatasets[];
};

export default (data: item[], type: string): data => {
  const datasets: TypeDatasets[] = [
    {
      label: '一級警戒水位',
      pointRadius: 0, // 設置為 0 隱藏資料點
      borderColor: '#DE3B40FF',
      data: (data || []).map((item) => item.FirstAlertWaterLevel)
    },
    {
      label: '二級警戒水位',
      pointRadius: 0, // 設置為 0 隱藏資料點
      borderColor: '#FF7043',
      data: (data || []).map((item) => item.SecondAlertWaterLevel)
    },
    {
      label: '三級警戒水位',
      pointRadius: 0, // 設置為 0 隱藏資料點
      borderColor: '#8E24AA',
      data: (data || []).map((item) => item.ThirdAlertWaterLevel)
    },
    {
      label: '即時水位',
      pointRadius: 0, // 設置為 0 隱藏資料點
      backgroundColor: '#3498db55',
      borderColor: '#3498db',
      data: (data || []).map((item) => item.WaterLevel),
      yAxisID: 'y',
      fill: true
    }
  ];

  if (type === '1') {
    datasets.push({
      label: '橡皮壩壓力',
      pointRadius: 0, // 設置為 0 隱藏資料點
      backgroundColor: 'white',
      borderColor: '#424242',
      data: (data || []).map((item) => item.RubberDamPressure) as any,
      yAxisID: 'y1'
    });
  } else if (['2', '3'].includes(type)) {
    const gateOpenings = ['GateOpening1', 'GateOpening2', 'GateOpening3'] as const;
    const colors = ['#003300', '#009933', '#00cc00'];

    gateOpenings.forEach((key, index) => {
      const gateOpeningData = (data || []).map((item) => item[key]);
      if (gateOpeningData.filter((o) => o !== null).length > 0) {
        datasets.push({
          label: `開度(${index + 1}號門)`,
          pointRadius: 0, // 設置為 0 隱藏資料點
          backgroundColor: 'white',
          borderColor: colors[index],
          data: gateOpeningData,
          yAxisID: 'y1'
        });
      }
    });
  } else {
    datasets.push({
      label: '流量',
      pointRadius: 0, // 設置為 0 隱藏資料點
      backgroundColor: 'white',
      borderColor: '#424242',
      data: (data || []).map((item) => item.FlowRate) as any,
      yAxisID: 'y1'
    });
  }

  return {
    labels: (data || []).map((item) => item.Time_f),
    datasets
  };
};
// const sample = {
//   labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
//   datasets: [
//     {
//       label: '一級警戒水位',
//       borderColor: '#DE3B40FF',
//       data: [300, 300, 300, 300, 300, 300, 300]
//     },
//     {
//       label: '二級警戒水位',
//       borderColor: '#FF7043',
//       data: [190, 190, 190, 190, 190, 190, 190]
//     },
//     {
//       label: '三級警戒水位',
//       borderColor: '#8E24AA',
//       data: [160, 160, 160, 160, 160, 160, 160]
//     },
//     {
//       label: '枯水水位',
//       backgroundColor: 'white',
//       borderColor: '#f39c12',
//       data: [80, 80, 80, 80, 80, 80, 80],
//       yAxisID: 'y'
//     },
//     {
//       label: '排砂門開度',
//       backgroundColor: 'white',
//       borderColor: 'dust',
//       data: [0, 2, 10, 5, 8, 3, 7],
//       yAxisID: 'y'
//     },
//     {
//       label: '進水門開度',
//       backgroundColor: 'white',
//       borderColor: '#95a5a6',
//       data: [120, 120, 120, 120, 120, 120, 120],
//       yAxisID: 'y'
//     },
//     {
//       label: '當月平均橡皮壩壓力(右)',
//       backgroundColor: 'white',
//       borderColor: '#424242',
//       data: [0.1, 0.2, 0.09, 0.1, 0.08, 0.05, 0.03],
//       yAxisID: 'y1'
//     },
//     {
//       label: '即時水位',
//       backgroundColor: '#3498db55',
//       borderColor: '#3498db',
//       data: [40, 39, 10, 40, 39, 80, 40],
//       yAxisID: 'y',
//       fill: true
//     }
//   ]
// };
