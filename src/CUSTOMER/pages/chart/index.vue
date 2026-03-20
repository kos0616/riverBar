<template>
  <main class="pb-10">
    <search :tableData="tableData" @updateValue="handleUpdate" class="mb-3"></search>
    <div v-if="loading === false" class="info-section">
      <div class="text-center">
        <template v-for="(item, index) in hoverData" :key="index">
          <el-tag v-if="item.dataValue" type="info" class="mr-2">
            {{ item.datasetLabel }}: {{ Number(item.dataValue).toFixed(2) }}
          </el-tag>
        </template>
      </div>
      <Line :options="chartOptions" :data="chartData" @click="onClick" ref="chartRef" />
    </div>
    <div
      v-else
      class="info-section flex min-h-[200px] flex-col items-center gap-2 py-10 text-primary"
    >
      <i class="fa-solid fa-chart-line fa-4x fa-fade"></i>
      <strong class="block text-2xl">讀取中</strong>
    </div>
  </main>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Line, type ChartComponentRef } from 'vue-chartjs';
import search from './search.vue';
import check from './check.svg';
import uncheck from './uncheck.svg';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import Info, { type item } from '@/CUSTOMER/Service/WaterLevelGaugeHistory';
import formater, { type data } from './lib/chartformater';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import day from 'dayjs';

const route = useRoute();

const loading = ref(false);
const tableData = ref<item[]>([]);

const hoverData = ref<{}>({});

const handleUpdate = (value: any) => {
  const { id } = route.query;
  getInfo({ id, ...value });
};

const gateType = route.query.Type as string;

const getInfo = async (query: any) => {
  try {
    loading.value = true;
    const arr = await Info(query);
    let arrData = [];
    // 判斷間格設定是否為一小時
    if (query.step === 'hour') {
      arrData = getHourlyData(arr);
    } else {
      arrData = arr;
    }
    tableData.value = arrData.map((item) => {
      item.Time = day(item.Time).format('YYYY-MM-DD HH:mm:ss');
      item.WaterLevel = item.WaterLevel ? (item.WaterLevel.toFixed(2) as any) : 0;
      return item;
    });
    chartData.value = formater(arrData, gateType);
  } finally {
    loading.value = false;
  }
};

const chartData = ref<data>({
  labels: [],
  datasets: []
});

const getHourlyData = (data: item[]) => {
  const hourlyData: item[] = [];
  const hourSet = new Set();

  data.forEach((item: any) => {
    const date = new Date(item.Time);
    const hourKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}`;

    if (!hourSet.has(hourKey)) {
      hourSet.add(hourKey);
      hourlyData.push(item);
    }
  });

  return hourlyData;
};
onMounted(async () => {
  const { id } = route.query;
  const today = day().format('YYYY-MM-DD');
  const tomorrow = day().add(1, 'day').format('YYYY-MM-DD');
  await getInfo({ id, start: today, end: tomorrow });
});

onBeforeRouteUpdate(async (to, from) => {
  if (to.path === from.path && to.query.id !== from.query.id) {
    const { id } = to.query;
    const today = day().format('YYYY-MM-DD');
    const tomorrow = day().add(1, 'day').format('YYYY-MM-DD');
    await getInfo({ id, start: today, end: tomorrow });
  }
});

// 建立一個插件 垂直線
const verticalLinePlugin = {
  id: 'verticalLine',
  afterDraw: (chart: ChartJS<'line'>) => {
    const { ctx, chartArea, tooltip } = chart;
    if (!tooltip) return;
    if (tooltip.getActiveElements().length) {
      const activePoint = tooltip.getActiveElements()[0];
      const x = activePoint.element.x;
      const topY = chartArea.top;
      const bottomY = chartArea.bottom;

      // 當前畫布
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; // 自己改顏色
      ctx.stroke();

      // 恢復
      ctx.restore();
    }
  }
};

// 註冊他
ChartJS.register(verticalLinePlugin);

let checkboxYes = new Image(14, 14);
checkboxYes.src = check;

let checkboxNo = new Image(14, 14);
checkboxNo.src = uncheck;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartRef = ref<ChartComponentRef | null>(null);

const onClick = () => {
  if (!chartRef.value) return;
  const {
    value: { chart }
  } = chartRef;
  if (!chart) return;
};

const chartOptions: any = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: {
    mode: 'nearest', // 在資料點顯示而不是顯示全部
    intersect: false
  },
  plugins: {
    tooltip: {
      position: 'nearest'
    },
    legend: {
      labels: {
        font: {
          size: 16
        },
        usePointStyle: true,
        generateLabels: (chart: any) => {
          const labels = chart.data.datasets.map(
            (data: { label: string; borderColor: string }, i: number) => ({
              text: data.label,
              datasetIndex: i,
              fontColor: data.borderColor,
              hidden: chart.getDatasetMeta(i).hidden
            })
          );
          for (var key in labels) {
            labels[key].pointStyle = labels[key].hidden ? checkboxNo : checkboxYes;
          }
          return labels;
        }
      }
    }
  },

  onHover: (event: any, chartElement: any) => {
    if (chartElement.length) {
      const index = chartElement[0].index; // 取得滑鼠指向的資料點的 index
      const dataAtIndex = chartData.value.datasets.map((dataset, datasetIndex) => {
        return {
          datasetLabel: dataset.label,
          dataValue: dataset.data[index],
          datasetIndex
        };
      });
      hoverData.value = dataAtIndex;

      // const label = chartData.value.labels[index];

      // console.log(`Hovered Label: ${label}`);
      // dataAtIndex.forEach((data) => {
      //   console.log(`Dataset: ${data.datasetLabel}, Data Value: ${data.dataValue}`);
      // });

      // 在這裡可以做其他處理，例如顯示自定義 tooltip 或更新其他 UI 元素
    }
  },
  // stacked: false,
  // plugins: {
  //   title: {
  //     display: true,
  //     text: 'Chart.js Line Chart - Multi Axis'
  //   }
  // },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: '㎝'
      },
      ticks: {
        callback: (value: string) => `${value} ㎝`
      },
      min: 0 // 設置 Y 軸的最小值為 0
    }
  }
};
/** 趨勢圖的 y1 會根據query變化 */
const handleDamType = () => {
  if (gateType === '1') {
    chartOptions.scales.y1 = {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: '㎏/㎠'
      },
      ticks: {
        callback: (value: string) => `${value} ㎏/㎠`
      },
      // grid line settings
      grid: {
        drawOnChartArea: false // only want the grid lines for one axis to show up
      },
      min: 0 // 設置 Y 軸的最小值為 0
    };
  } else if (['2', '3'].includes(gateType)) {
    chartOptions.scales.y1 = {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: '㎝'
      },
      ticks: {
        callback: (value: string) => `${value} ㎝`
      },
      // grid line settings
      grid: {
        drawOnChartArea: false // only want the grid lines for one axis to show up
      },
      min: 0 // 設置 Y 軸的最小值為 0
    };
  }
};
handleDamType();
</script>
