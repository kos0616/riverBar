<template>
  <div class="relative flex flex-col">
    <nav
      class="absolute bottom-6 right-3 z-[401] rounded bg-white/50 p-3 shadow-md backdrop-blur-sm transition-all hover:bg-white/85"
    >
      <ul
        class="flex max-h-48 max-w-36 flex-col gap-1 overflow-y-scroll sm:max-w-none portrait:sm:max-h-96 landscape:md:max-h-96"
      >
        <li
          v-for="group in tableData"
          :key="group.Name"
          v-show="group.Location.length > 0"
          class="mb-2"
        >
          <strong>{{ group.Name }}</strong>
          <ul>
            <li v-for="(item, index) in group.Location" :key="index">
              <button
                @click="handleMachineClick(item as typeLocation)"
                @mouseover="handleMachineHover(item as typeLocation)"
                :title="item.Name"
                class="block w-full rounded px-2 py-[2px] text-left hover:bg-gray-200"
              >
                {{ item.Name }}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <div id="map" class="grow"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import L, { Tooltip, type LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import data from '@/CUSTOMER/static/locations.json';
import Info from '@/CUSTOMER/pages/iws/Service/Info';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';

const userInfoStore = useUserInfoStore();
const SiteCode = computed(() => userInfoStore.userInfo?.SiteCode);

const router = useRouter();

type typeLocation = { Name: string; Id: string; LatLng: LatLngTuple; map: L.Tooltip };
type sidebar = {
  Name: string;
  Location: typeLocation[];
}[];

// 列表項目hover時，地圖物件會閃爍
// 大概

//   苗栗市座標
//   120.819156, 24.561561;
const myMap = ref<L.Map>();

const handleMachineHover = (item: typeLocation) => {
  if (!item.map) return;
  item.map.openPopup();
};

const handleMachineClick = (item: typeLocation) => {
  if (!item.map) return;
  myMap.value?.flyTo(item.LatLng, 14);
  item.map.openPopup();
};

/** 繪製初始地圖 */
const initmap = () => {
  const map = L.map('map').setView([24.591561, 120.819156], 12);
  myMap.value = map;

  // 添加 OpenStreetMap 圖層
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
};

const tableData = ref<sidebar>([]);

const getInfo = async () => {
  const getter = await Info();
  const map = myMap.value as L.Map;

  tableData.value = getter.map((o) => {
    const Location = Object.entries(o.Gates)
      .map((arr) => {
        const Id = arr[0];
        const Name = arr[1];
        const Item = data.find((o) => o.name === Name) as (typeof data)[number];
        if (!Item) return undefined;
        // 指定位置的經緯度座標
        const markerLocation = Item.setView as LatLngTuple;
        /** 加入恆定顯示的 tooltip, 與點擊後產生的互動標籤 */
        const mapItem = L.tooltip({
          /** 標籤上移 */
          // offset: [0, 0],
          /** 標籤的位置 */
          direction: 'top',
          permanent: true,
          opacity: 1,
          /** 啟用交互 */
          interactive: true
          // className: 'text',
        })
          .on('mouseover', (e) => {
            const item = e.target as Tooltip;
            item.bringToFront();
          })
          .setContent(Item.name)
          .setLatLng(markerLocation)
          .bindPopup(generateBtn(Name, Id), { offset: [0, -20] })
          .addTo(map);

        return { Name, Id, LatLng: markerLocation, map: mapItem };
      })
      .filter((o) => o !== undefined) as typeLocation[];

    return { Name: o.Name, Location };
  });

  /** 產生可互動的按鈕 */
  function generateBtn(name: string, id: string) {
    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.innerHTML = `<strong class="block">${name}</strong>`;
    const button = document.createElement('button');
    button.innerHTML = '前往圖控';
    button.className =
      'hover:bg-primary-400 hover:text-white mt-1 text-center border border-primary-400 rounded px-2 py-1';
    button.onclick = function () {
      router.push(`/iws/${id}`);
    };
    if (!SiteCode.value || id.includes(SiteCode.value)) div.appendChild(button);
    return div;
  }
};

onMounted(async () => {
  initmap();
  await getInfo();
  // addMarker();
});

/** timeout for checking status */
// setInterval(() => {
//   item.bindPopup(generateBtn(), { offset: [0, -20] });
// }, 1000);
//  轉換用
//   // 定義TM2坐標系統的投影信息
//   proj4.defs(
//     'EPSG:3826',
//     '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +units=m +no_defs'
//   );
//   // 定義WGS84坐標系統的投影信息
//   proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
//   // TM2座標轉換為經緯度的函數
//   function tm2ToLatLng(tm2X, tm2Y) {
//     // 使用proj4庫進行座標轉換
//     var tm2Coords = proj4('EPSG:3826', 'EPSG:4326', [tm2X, tm2Y]);
//     // tm2Coords[0] 為經度，tm2Coords[1] 為緯度
//     return { longitude: tm2Coords[0], latitude: tm2Coords[1] };
//   }
//   // 例子
//   var tm2X = 233162.59;
//   var tm2Y = 2718493.78;
//   var result = tm2ToLatLng(tm2X, tm2Y);
//   console.log('經度:', result.longitude, '緯度:', result.latitude);
//   await nextTick(); // 延遲至下一次 DOM 更新完成
// 初始化 Leaflet 地圖
// 可以添加彈出式提示
//   marker.bindPopup('這裡是左營區').openPopup();
/** 這是DIV icon 會取代掉原本的 icon */
// const icon = L.divIcon({
//   className: 'w-auto text-center',
//   html: `<div style='background-color:#c30b82;'>${Item.name}</div>`,
//   iconSize: [50, 16],
//   // iconAnchor: [15, 42]
// });
// const marker = L.marker(markerLocation, { icon: icon }).addTo(map);
</script>
