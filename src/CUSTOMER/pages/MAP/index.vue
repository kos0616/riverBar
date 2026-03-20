<template>
  <div class="relative flex flex-col">
    <div
      v-if="mapNotice"
      class="absolute right-3 top-3 z-[401] max-w-sm rounded-xl bg-amber-50/95 px-4 py-3 text-sm text-amber-900 shadow"
    >
      {{ mapNotice }}
    </div>
    <nav
      v-loading="isLoading"
      element-loading-background="rgba(100, 100, 100, 0.5)"
      v-if="sidebarMenu.length > 0"
      class="info-section absolute bottom-8 left-3 z-[401] bg-white"
    >
      <ul
        class="flex max-h-48 max-w-36 flex-col gap-1 overflow-y-scroll sm:max-w-none portrait:sm:max-h-96 landscape:md:max-h-96"
      >
        <li
          v-for="group in sidebarMenu"
          :key="group.Name"
          v-show="group.Location.length > 0"
          class="mb-2"
        >
          <strong class="text-lg font-semibold">{{ group.Name }}</strong>
          <ul class="my-2 border-l border-[#cde1de]">
            <li v-for="(item, index) in group.Location" :key="index">
              <button
                @click="handleOpenInfoWindow(item)"
                @mouseover="item.LatLng && myMap?.panTo(item.LatLng)"
                :title="item.Name"
                class="block w-full px-2 py-[2px] text-left hover:text-primary"
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
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import locationsData from '@/CUSTOMER/static/locations.json';
import GetAllLocation, { type item, type response } from '@/CUSTOMER/Service/GetAllLocation';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';
import workStations from '@/CUSTOMER/static/workStations.json';
import day from 'dayjs';
import { emitter } from '@/CUSTOMER/plugins/bus';

// 將 `google` 類型定義導入 TypeScript 範疇

const userInfoStore = useUserInfoStore();
const SiteCode = computed(() => userInfoStore.userInfo?.SiteCode);

const router = useRouter();
const isLoading = ref(false);
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const mapNotice = ref('');

type typeLocation = {
  Name: string;
  Id: string;
  LatLng: google.maps.LatLngLiteral | null;
  map: google.maps.Marker | null;
  itemData: item;
};
type typeSidebar = {
  Name: string;
  Location: typeLocation[];
}[];

const myMap = ref<google.maps.Map | null>(null);
const infoWindow = ref<google.maps.InfoWindow | null>(null);
// 在 setup 函數的頂部添加這些變量
const kmlLayers = ref<google.maps.KmlLayer[]>([]);
const currentLayers = ref<Set<google.maps.KmlLayer>>(new Set());

const googleMarkers: any = [];

/** 繪製初始地圖 */
const initmap = async () => {
  const loader = new Loader({
    apiKey: googleMapsApiKey,
    version: 'weekly'
  });

  try {
    await loader.importLibrary('maps').then(({ Map, KmlLayer }) => {
      const dom = document.getElementById('map') as HTMLElement;
      const opt = {
        center: { lat: 24.561561, lng: 120.819156 },
        zoom: 12,
        // 將所有的 POI（Point of Interest）標籤和商業、景點、政府、醫療、公園、宗教場所、學校和運動場等類型的地標設置為不可見
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.attraction',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.government',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.park',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.place_of_worship',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.school',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.sports_complex',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };
      myMap.value = new Map(dom, opt);

      const date = new Date().getTime();
      const layers = [
        'https://hsuchinchia.github.io/kmz/Canal-kml_subset_1.kml?t=1' + date,
        'https://hsuchinchia.github.io/kmz/Canal-kml_subset_2.kml?t=2' + date,
        'https://hsuchinchia.github.io/kmz/Canal-kml_subset_3.kml?t=3' + date,
        'https://hsuchinchia.github.io/kmz/Canal-kml_subset_4.kml?t=4' + date
      ];

      kmlLayers.value = layers.map(
        (url) =>
          new KmlLayer({
            url,
            map: null,
            preserveViewport: true
          })
      );

      const setupKmlListeners = (layer: any) => {
        google.maps.event.clearInstanceListeners(layer);

        layer.addListener('status_changed', () => {
          if (layer.getStatus() === google.maps.KmlLayerStatus.OK) {
            fetch(layer.getUrl())
              .then((response) => response.text())
              .then((kmlText) => {
                const parser = new DOMParser();
                const kmlDoc = parser.parseFromString(kmlText, 'application/xml');
                const placemarks = kmlDoc.getElementsByTagName('Placemark');
                for (let i = 0; i < placemarks.length; i++) {
                  const placemark = placemarks[i] as any;
                  const name = placemark.getElementsByTagName('name')[0].textContent;
                  const coordinates = placemark
                    .getElementsByTagName('coordinates')[0]
                    .textContent.trim()
                    .split(',');

                  const latLng = new google.maps.LatLng(
                    parseFloat(coordinates[1]),
                    parseFloat(coordinates[0])
                  );

                  const labelDiv = document.createElement('div');
                  labelDiv.id = 'customLabel';
                  labelDiv.style.position = 'absolute';
                  labelDiv.style.display = 'none';
                  labelDiv.style.padding = '2px';
                  labelDiv.style.fontSize = '14px';
                  labelDiv.innerHTML = name;

                  const overlay = new google.maps.OverlayView() as any;
                  overlay.onAdd = function () {
                    const layer = document.createElement('div');
                    layer.appendChild(labelDiv);
                    this.getPanes().overlayLayer.appendChild(layer);
                    this.layer = layer;
                  };

                  overlay.draw = function () {
                    const projection = this.getProjection();
                    const position = projection.fromLatLngToDivPixel(latLng);
                    if (position) {
                      labelDiv.style.left = position.x + 'px';
                      labelDiv.style.top = position.y + 'px';
                    }
                  };

                  overlay.onRemove = function () {
                    this.layer.parentNode.removeChild(this.layer);
                    this.layer = null;
                  };

                  overlay.setMap(myMap.value);
                }
              })
              .catch(() => {});
          }
        });
      };

      const checkZoomLevel = () => {
        const zoomLevel = myMap.value?.getZoom();
        if (zoomLevel !== undefined && zoomLevel >= 15) {
          kmlLayers.value.forEach((layer) => {
            if (!currentLayers.value.has(layer)) {
              layer.setMap(myMap.value!);
              setupKmlListeners(layer);
              currentLayers.value.add(layer);
            }
          });
        } else {
          kmlLayers.value.forEach((layer) => {
            layer.setMap(null);
            currentLayers.value.delete(layer);
          });
        }

        const allElements = document.querySelectorAll('#customLabel');
        allElements.forEach((element: any) => {
          element.style.display = zoomLevel !== undefined && zoomLevel >= 17 ? 'block' : 'none';
        });
      };

      checkZoomLevel();
      myMap.value.addListener('zoom_changed', () => {
        checkZoomLevel();
      });
    });
  } catch (error) {
    mapNotice.value = 'Google Maps 載入失敗。';
  }

  await getGetAllLocation();
};

/** 這邊使用 let ，因為在 ref 狀態下，google 的 map 屬性會消失，造成無法清除地圖的情況 */
let tableData: typeLocation[] = [];
// 初始化資料
let InitTableData: response = [];

/** 畫面左側的選單 */
const sidebarMenu = ref<typeSidebar>([]);

/** 取得站點資訊，格式化的同時，將其繪製在地圖上 */
const getGetAllLocation = async () => {
  /** clear map */
  tableData.forEach((item) => item.map?.setMap(null));

  try {
    isLoading.value = true;
    InitTableData = await GetAllLocation();

    tableData = InitTableData.map(generateMarker).filter((o) => o !== undefined) as typeLocation[];
    sidebarMenu.value = generateMenu();
  } finally {
    isLoading.value = false;
  }
};

// 通用函數，用於查找 Tag 值
const findTagValue = (plcsArray: any[], baseTag: string) => {
  const primaryTag = plcsArray.find((tag) => tag.Tag === baseTag);
  const alternateTag = plcsArray.find((tag) => tag.Tag === `${baseTag}-1`);
  return primaryTag?.Value || alternateTag?.Value || undefined;
};

const findIconUrl = (obj: item) => {
  // 找出水位計 Tag251
  const waterLevelTagValue = findTagValue(obj.WaterPlcs, '251');
  // 找出枯水水位 (LowWaterLevel) 和各級水位警戒值
  const LowWaterLevel = findTagValue(obj.Section2?.PLCs || [], '619');
  const ThirdAlertWaterLevel = findTagValue(obj.Section2?.PLCs || [], '608');
  const SecondAlertWaterLevel = findTagValue(obj.Section2?.PLCs || [], '607');
  const FirstAlertWaterLevel = findTagValue(obj.Section2?.PLCs || [], '606');

  if (LowWaterLevel !== 0 && waterLevelTagValue < LowWaterLevel) {
    return 'http://maps.google.com/mapfiles/ms/icons/yellow.png'; // 黃色
  }
  if (ThirdAlertWaterLevel !== 0 && waterLevelTagValue > ThirdAlertWaterLevel) {
    return 'http://maps.google.com/mapfiles/ms/icons/purple.png'; // 紫色
  }
  if (SecondAlertWaterLevel !== 0 && waterLevelTagValue > SecondAlertWaterLevel) {
    return 'http://maps.google.com/mapfiles/ms/icons/orange.png'; // 橙色
  }
  if (FirstAlertWaterLevel !== 0 && waterLevelTagValue > FirstAlertWaterLevel) {
    return 'http://maps.google.com/mapfiles/ms/icons/red.png'; // 紅色
  }

  return 'https://maps.google.com/mapfiles/ms/icons/blue.png'; // 藍色

  // if (waterLevelTagValue === undefined || waterLevelTagValue === null || waterLevelTagValue === 0) {
  //   iconUrl = 'https://maps.google.com/mapfiles/ms/icons/green.png'; // 綠色
  // } else if (waterLevelTagValue >= FirstAlertWaterLevel) {
  //   iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red.png'; // 紅色
  // } else if (waterLevelTagValue >= SecondAlertWaterLevel) {
  //   iconUrl = 'http://maps.google.com/mapfiles/ms/icons/orange.png'; // 橙色
  // } else if (waterLevelTagValue >= ThirdAlertWaterLevel) {
  //   iconUrl = 'http://maps.google.com/mapfiles/ms/icons/purple.png'; // 紫色
  // } else if (waterLevelTagValue >= LowWaterLevel && waterLevelTagValue <= ThirdAlertWaterLevel) {
  //   iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue.png'; // 藍色
  // } else if (waterLevelTagValue < LowWaterLevel) {
  //   iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow.png'; // 黃色
  // } else {
  //   iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green.png'; // 黃色
  // }
  // return iconUrl;
};

function generateMarker(obj: item): typeLocation | undefined {
  const Id = obj.LocationCode;
  const Name = obj.Name;
  const MapData = locationsData.find((o) => o.LocationCode === obj.LocationCode);

  if (!MapData) return undefined;

  const markerLocation = {
    lat: MapData.setView[0],
    lng: MapData.setView[1]
  } as google.maps.LatLngLiteral;
  try {
    let mapItem: google.maps.Marker | null = null;
    if (myMap.value) {
      const iconUrl = findIconUrl(obj);
      mapItem = new google.maps.Marker({
        position: markerLocation,
        map: myMap.value,
        label: {
          text: Name[0]
        },
        title: Name,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(50, 50),
          labelOrigin: new google.maps.Point(25, 15)
        }
      });
      googleMarkers.push(mapItem);

      mapItem.addListener('click', () => {
        handleOpenInfoWindow({
          Name: Name,
          Id,
          LatLng: markerLocation,
          map: mapItem,
          itemData: obj
        });
      });
    }
    return { Name, Id, LatLng: markerLocation, map: mapItem, itemData: obj };
  } catch (error) {
    // 如果地圖標記創建失敗，仍然返回基本的位置信息，但 map 屬性為 null
  }
}

function generateMenu() {
  return workStations.map((obj) => formater(obj.Name, obj.id, tableData));

  function formater(Name: string, SiteCode: string, res: typeLocation[]) {
    const data = res.filter(({ Id }) => Id.includes(SiteCode));
    return { Name, Location: data || [] };
  }
}
// 更新資料
const updateTableSignalR = (event: {
  formaterTag: string[];
  value: number | string;
  upDateTime: string;
}) => {
  const LocationCode = event.formaterTag[1];
  const Tag = event.formaterTag[2];
  const itemData = InitTableData.find((item) => item.LocationCode === LocationCode);

  if (!itemData) return;
  const waterLevelTag = itemData.WaterPlcs.find((tag) => tag.Tag === Tag);
  if (!waterLevelTag) return;
  waterLevelTag.Value = Number(event.value);
  waterLevelTag.UpdateTime = event.upDateTime;

  // 更新圖標顏色
  const iconUrl = findIconUrl(itemData);
  // 找到對應的標籤
  const marker = googleMarkers.find((item: { title: string }) => item.title === itemData.Name);
  if (!marker) return;
  marker.icon.url = iconUrl;
};

const handleOpenInfoWindow = (item: typeLocation) => {
  if (!item.map || !myMap.value) {
    router.push(`/iws/${item.Id}`);
    return;
  }
  if (!infoWindow.value) {
    infoWindow.value = new google.maps.InfoWindow();
  }

  const generateBtn = (name: string, id: string, itemData: item) => {
    const div = document.createElement('div');
    const waterLevelTag = itemData.WaterPlcs.find((tag) => tag.Tag === '251');

    // 創建一個主容器來包含表格
    const waterLevelMainContainer = document.createElement('div');
    div.appendChild(waterLevelMainContainer);

    // 創建一個表格來包含所有水位資訊
    const table = document.createElement('table');
    table.className = 'tableContainer table-auto border-collapse mb-2'; // 使用 Tailwind CSS 的表格樣式
    waterLevelMainContainer.appendChild(table);

    // 迴圈遍歷水位計標籤
    ['251', '251-1', '251-2'].forEach((tag) => {
      // 查找對應的水位標籤
      const waterLevelTag = itemData.WaterPlcs.find((item) => item.Tag === tag);

      // 只有在找到水位標籤時才顯示
      if (waterLevelTag) {
        // 創建一個表格行來包含每個水位標題和水位
        const tr = document.createElement('tr');
        table.appendChild(tr);

        // 水位標題
        const titleTd = document.createElement('td');
        titleTd.className = 'text-lg p-2 border border-slate-300	'; // 使用 Tailwind CSS 的間距和邊框樣式
        titleTd.innerHTML = `${waterLevelTag.Name}`;
        tr.appendChild(titleTd);

        // 水位值
        const valueTd = document.createElement('td');
        valueTd.className = 'text-2xl p-2 border border-slate-300	'; // 使用 Tailwind CSS 的間距和邊框樣式
        const waterLevelTagValue = waterLevelTag.Value || '-';
        valueTd.innerHTML = `${waterLevelTagValue} <small>㎝</small>`;
        tr.appendChild(valueTd);
      }
    });

    // 創建一個表格行來包含時間標題和時間
    const timeTr = document.createElement('tr');
    table.appendChild(timeTr);

    // 時間標題
    const timeTitleTd = document.createElement('td');
    timeTitleTd.className = 'text-lg p-2 border border-slate-300	'; // 使用 Tailwind CSS 的間距和邊框樣式
    timeTitleTd.innerHTML = '更新時間';
    timeTr.appendChild(timeTitleTd);

    // 時間值
    const timeValueTd = document.createElement('td');
    timeValueTd.className = 'text-2xl p-2 border border-slate-300	'; // 使用 Tailwind CSS 的間距和邊框樣式
    const UpdateTime = waterLevelTag?.UpdateTime || '-';
    if (UpdateTime !== '-') {
      timeValueTd.innerHTML = `${day(UpdateTime).format('YYYY-MM-DD HH:mm:ss')}`;
    } else {
      timeValueTd.innerHTML = '-';
    }
    timeTr.appendChild(timeValueTd);

    // // 創建一個主容器來包含所有水位資訊
    // const waterLevelMainContainer = document.createElement('div');
    // waterLevelMainContainer.className = 'flex flex-col'; // 使用 Tailwind CSS 的垂直排列和間距樣式
    // div.appendChild(waterLevelMainContainer);

    // // 迴圈遍歷水位計標籤
    // ['251', '251-1', '251-2'].forEach((tag) => {
    //   // 查找對應的水位標籤
    //   const waterLevelTag = itemData.WaterPlcs.find((item) => item.Tag === tag);

    //   // 只有在找到水位標籤時才顯示
    //   if (waterLevelTag) {
    //     // 創建一個容器來包含每個水位標題和水位
    //     const waterLevelContainer = document.createElement('div');
    //     waterLevelContainer.className = 'flex items-center space-x-2 '; // 使用 Tailwind CSS 的 flex 和 margin-x 樣式
    //     waterLevelMainContainer.appendChild(waterLevelContainer);

    //     // 水位標題
    //     const waterLevelStrongDiv = document.createElement('div');
    //     waterLevelStrongDiv.className = 'text-lg';
    //     waterLevelStrongDiv.innerHTML = `${waterLevelTag.Name}`;
    //     waterLevelContainer.appendChild(waterLevelStrongDiv);

    //     // 水位值
    //     const waterLevelTagValue = waterLevelTag.Value || '-';

    //     // 創建水位顯示元素
    //     const waterLevelStrong = document.createElement('strong');
    //     if (waterLevelTagValue !== '-') {
    //       waterLevelStrong.className = 'text-2xl';
    //       waterLevelStrong.innerHTML = `${waterLevelTagValue} <small>㎝</small>`;
    //     } else {
    //       waterLevelStrong.innerHTML = '-';
    //     }
    //     waterLevelContainer.appendChild(waterLevelStrong);
    //   }
    // });
    // // 創建一個容器來包含時間標題和時間
    // const timeContainer = document.createElement('div');
    // timeContainer.className = 'flex items-center space-x-2'; // 使用 Tailwind CSS 的 flex 和 margin-x 樣式
    // div.appendChild(timeContainer);

    // // 時間標題
    // const updataTimeDiv = document.createElement('div');
    // updataTimeDiv.className = 'text-lg';
    // updataTimeDiv.innerHTML = '更新時間';
    // timeContainer.appendChild(updataTimeDiv);

    // // 時間
    // const UpdateTimeStrong = document.createElement('strong');
    // const UpdateTime = waterLevelTag?.UpdateTime || undefined;
    // if (UpdateTime) {
    //   UpdateTimeStrong.className = 'text-2xl';
    //   UpdateTimeStrong.innerHTML = `${day(UpdateTime).format('YYYY-MM-DD HH:mm:ss')}`;
    // } else {
    //   UpdateTimeStrong.innerHTML = '-';
    // }
    // timeContainer.appendChild(UpdateTimeStrong);

    // // 創建一個容器來包含流速標題和流速數值
    // const flowRateContainer = document.createElement('div');
    // flowRateContainer.className = 'flex items-center space-x-2'; // 使用 Tailwind CSS 的 flex 和 margin-x 樣式
    // div.appendChild(flowRateContainer);

    // // 流速標題
    // const flowRateDiv = document.createElement('div');
    // flowRateDiv.className = 'text-lg';
    // flowRateDiv.innerHTML = '流速數值m3/s';
    // flowRateContainer.appendChild(flowRateDiv);

    // // 流速數值
    // const flowRateStrong = document.createElement('strong');
    // // 找出流速tag
    // const flowRatelTag = itemData.WaterPlcs.find((tag) => tag.Tag === '270');
    // const flowRatelTagValue = flowRatelTag?.Value
    //   ? (flowRatelTag?.Value as number).toFixed(2)
    //   : undefined;

    // if (flowRatelTagValue) {
    //   flowRateStrong.className = 'text-2xl';
    //   flowRateStrong.style.display = 'block';
    //   flowRateStrong.innerHTML = `${flowRatelTagValue}`;
    // } else {
    //   flowRateStrong.innerHTML = '-';
    // }
    // flowRateContainer.appendChild(flowRateStrong);

    // 前往圖控按鈕
    const button = document.createElement('button');
    button.innerHTML = `前往圖控`;
    button.title = name;
    button.className =
      'block text-primary-500 font-bold hover:bg-primary-400 hover:text-white text-center border border-primary-400 rounded px-2 py-1';
    button.onclick = function () {
      router.push(`/iws/${id}`);
    };
    if (!SiteCode.value || id.includes(SiteCode.value)) div.appendChild(button);

    return div;
  };

  function generateTitle(name: string) {
    const div = document.createElement('div');
    div.innerHTML = `<h2 style="font-weight:600; font-size:20px">${name}</h2>`;
    return div;
  }

  infoWindow.value.setOptions({
    headerContent: generateTitle(item.Name),
    content: generateBtn(item.Name, item.Id, item.itemData),
    ariaLabel: item.Name
  });
  infoWindow.value.open(myMap.value, item.map);
};

onMounted(async () => {
  await initmap();

  // await getGetAllLocation();
  emitter.on('updateSignalR', async (event) => {
    const formaterTag = event.tag.split('.');
    updateTableSignalR({ formaterTag, value: event.value, upDateTime: event.upDateTime });
  });
});

onUnmounted(() => {
  emitter.off('updateSignalR');
  // 清理代碼...
  if (myMap.value) {
    myMap.value.unbindAll();
  }
  kmlLayers.value.forEach((layer) => {
    if (layer && typeof google !== 'undefined') {
      google.maps.event.clearInstanceListeners(layer);
    }
  });
});
</script>

<style lang="scss">
.gm-style-iw-chr {
  button > span {
    width: 16px !important;
    height: 16px !important;
    margin: 0 !important;
    float: right !important;
  }
}
.tableContainer {
  tr:nth-child(even) {
    background-color: #f0f6f8; /* 這裡你可以換成你想要的顏色 */
  }
}
</style>
