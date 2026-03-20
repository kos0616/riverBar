<template>
  <svg
    width="1136"
    height="468"
    viewBox="0 0 1136 468"
    fill="none"
    version="1.1"
    id="svg5"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
  >
    <g
      id="waterLevelNex"
      stroke-width="4"
      paint-order="stroke"
      transform="matrix(0.9,0,0,0.9,680,100)"
    >
      <g
        :style="{ transform: `translateY(${showWaterLevel(waterLevels.waterLevel, 365)}px)` }"
        fill="#29ABE2"
      >
        <path
          style="transform: translateX(96px)"
          d="M27.03 0H0V17.15H27.03L41.88 8.58002L27.03 0Z"
        />
      </g>

      <g
        v-show="typeof waterLevels.dryWaterLevel === 'number' && waterLevels.dryWaterLevel > 0"
        :style="{
          transform: `translateY(${showWaterLevel(waterLevels.dryWaterLevel, 365)}px)`
        }"
        fill="#FFC000"
      >
        <text stroke="#fff" x="140" y="15" font-size="36">
          枯水水位({{ waterLevels.dryWaterLevel }})
        </text>
        <path
          style="transform: translateX(96px)"
          d="M27.03 0H0V17.15H27.03L41.88 8.58002L27.03 0Z"
        />
      </g>

      <g
        v-show="
          typeof waterLevels.alertWaterLevel_1 === 'number' && waterLevels.alertWaterLevel_1 > 0
        "
        :style="{
          transform: `translateY(${showWaterLevel(waterLevels.alertWaterLevel_1, 365)}px)`
        }"
        fill="#C1272D"
      >
        <text stroke="#fff" x="140" y="15" font-size="36">
          一級警戒({{ waterLevels.alertWaterLevel_1 }})
        </text>
        <path
          style="transform: translateX(96px)"
          d="M27.03 0H0V17.15H27.03L41.88 8.58002L27.03 0Z"
        />
      </g>

      <g
        v-show="
          typeof waterLevels.alertWaterLevel_2 === 'number' && waterLevels.alertWaterLevel_2 > 0
        "
        :style="{
          transform: `translateY(${showWaterLevel(waterLevels.alertWaterLevel_2, 365)}px)`
        }"
        fill="#FF7043"
      >
        <text stroke="#fff" x="140" y="15" font-size="36">
          二級警戒({{ waterLevels.alertWaterLevel_2 }})
        </text>
        <path
          style="transform: translateX(96px)"
          d="M27.03 0H0V17.15H27.03L41.88 8.58002L27.03 0Z"
        />
      </g>
      <g
        v-show="
          typeof waterLevels.alertWaterLevel_3 === 'number' && waterLevels.alertWaterLevel_3 > 0
        "
        :style="{
          transform: `translateY(${showWaterLevel(waterLevels.alertWaterLevel_3, 365)}px)`
        }"
        fill="#8E24AA"
      >
        <text stroke="#fff" x="140" y="15" font-size="36">
          三級警戒({{ waterLevels.alertWaterLevel_3 }})
        </text>
        <path
          style="transform: translateX(96px)"
          d="M27.03 0H0V17.15H27.03L41.88 8.58002L27.03 0Z"
        />
      </g>

      <rect x="42" y="0" width="53" height="375" fill="#29ABE2"></rect>
      <rect
        x="42"
        y="0"
        width="53"
        :height="showWaterLevel(waterLevels.waterLevel, 375)"
        fill="#CCCCCC"
      ></rect>
      <g>
        <path
          d="M42.1545 105.834L77.8745 105.834L77.8745 101.744L42.1545 101.744L42.1545 105.834Z"
          fill="black"
        />
        <path
          d="M42.1545 71.9229L77.8745 71.9229L77.8745 67.8329L42.1545 67.8329L42.1545 71.9229Z"
          fill="#C1272D"
        />
        <path
          d="M42.1545 38.0015L77.8745 38.0015L77.8745 33.9114L42.1545 33.9114L42.1545 38.0015Z"
          fill="#C1272D"
        />
        <path
          d="M42.1511 4.08984L95.3511 4.08984L95.3511 -0.000152588L42.1511 -0.000152588L42.1511 4.08984Z"
          fill="#C1272D"
        />
        <path
          d="M42.1545 139.746L77.8745 139.746L77.8745 135.656L42.1545 135.656L42.1545 139.746Z"
          fill="black"
        />
        <path
          d="M42.1545 173.667L77.8745 173.667L77.8745 169.578L42.1545 169.578L42.1545 173.667Z"
          fill="black"
        />
        <path
          d="M42.1545 207.579L77.8745 207.579L77.8745 203.489L42.1545 203.489L42.1545 207.579Z"
          fill="black"
        />
        <path
          d="M42.1545 241.5L77.8745 241.5L77.8745 237.411L42.1545 237.411L42.1545 241.5Z"
          fill="black"
        />
        <path
          d="M42.1545 275.412L77.8745 275.412L77.8745 271.322L42.1545 271.322L42.1545 275.412Z"
          fill="black"
        />
        <path
          d="M42.1545 309.324L77.8745 309.324L77.8745 305.234L42.1545 305.234L42.1545 309.324Z"
          fill="black"
        />
        <path
          d="M42.1545 343.245L77.8745 343.245L77.8745 339.155L42.1545 339.155L42.1545 343.245Z"
          fill="black"
        />
      </g>
    </g>

    <g :fill="waterLevelColor" transform="matrix(0.8,0,0,0.8,90,50)">
      <text
        xml:space="preserve"
        stroke-width="5"
        stroke="#fff"
        paint-order="stroke"
        style="font-size: 60px; text-anchor: middle"
        y="10"
      >
        {{ waterLevel_f }}
      </text>
      <path
        transform="matrix(0.6,0,0,0.6,-60,20)"
        d="M200 0C200 26.5216 189.464 51.957 170.711 70.7107C151.957 89.4643 126.522 100 100 100C73.4784 100 48.043 89.4643 29.2893 70.7107C10.5357 51.957 4.00466e-06 26.5217 0 1.52588e-05L100 0H200Z"
      />
      <text
        xml:space="preserve"
        stroke-width="0"
        style="font-size: 40px; text-anchor: middle; fill: black"
        y="58"
      >
        ({{ 80 }})
      </text>
    </g>

    <text
      xml:space="preserve"
      style="font-size: 24px; text-anchor: middle; fill: #000000"
      id="text1"
    >
      <tspan x="650" y="80">+300</tspan>
      <tspan x="465" y="385">+0</tspan>
      <tspan x="670" y="420">-30</tspan>
    </text>

    <g id="current-water-level" :style="`transform: translateY(-${getWaterLine(waterLevel_f)}px)`">
      <text
        xml:space="preserve"
        style="fill: #06b6d4; font-size: 16px; font-weight: bold; stroke-width: 3"
        stroke="#ffffff"
        paint-order="stroke"
      >
        <tspan x="650" y="390">
          即時水位
          {{ waterLevel_f }} ㎝
        </tspan>
      </text>
      <line
        x1="0"
        x2="1136"
        y1="400"
        y2="400"
        id="redline"
        stroke-width="4"
        stroke-dasharray="12, 12"
        stroke="#06b6d4"
      />
    </g>

    <g id="gate-open-arrow-motor" transform="matrix(1.5, 0, 0, 1.5, 200, -570)">
      <rect
        x="203.75999"
        y="399.07999"
        transform="rotate(180,218.09,414.82375)"
        width="28.66"
        height="31.48"
        style="fill: #b3b3b3"
      />
      <rect x="203.75999" y="413.63" width="28.66" height="2.3900001" style="fill: #666666" />
      <rect x="203.75999" y="409.26001" width="28.66" height="2.3900001" style="fill: #666666" />
      <rect x="203.75999" y="404.89001" width="28.66" height="2.3900001" style="fill: #666666" />
      <rect x="203.75999" y="400.51001" width="28.66" height="2.3900001" style="fill: #666666" />
      <rect x="203.75999" y="418" width="28.66" height="2.3900001" style="fill: #666666" />
      <rect x="203.75999" y="422.38" width="28.66" height="2.3900001" style="fill: #666666" />
      <rect x="203.75999" y="426.75" width="28.66" height="2.3900001" style="fill: #666666" />
      <path
        d="m 191.2,397.81 h 12.56 v 34.04 H 191.2 c -3.47,0 -6.28,-2.81 -6.28,-6.28 V 404.1 c 0,-3.48 2.81,-6.29 6.28,-6.29 z"
        style="fill: url(#SVGID_28_)"
      />
      <rect
        x="203.75999"
        y="399.07999"
        transform="rotate(180,205.2638,414.82365)"
        width="3"
        height="31.48"
        style="fill: #808080; opacity: 0.5"
      />
      <polygon
        points="232.42,397.81 237.07,397.81 237.07,431.84 232.42,431.84 "
        style="fill: url(#SVGID_29_)"
      />
      <polygon
        points="237.07,398.88 241.72,398.88 241.72,430.76 237.07,430.76 "
        style="fill: url(#SVGID_30_)"
      />
      <polygon
        points="241.72,401.01 246.37,406.53 246.37,423.11 241.72,428.64 "
        style="fill: url(#SVGID_31_)"
      />
      <rect
        x="237.07001"
        y="398.88"
        transform="rotate(180,237.96415,414.82375)"
        width="1.79"
        height="31.879999"
        style="fill: #333333; opacity: 0.5"
      />
      <polygon
        points="243.21,426.87 241.72,428.64 241.72,401.01 243.21,402.78 "
        style="fill: #333333; opacity: 0.5"
      />
      <polygon
        points="227.24,436.58 208.94,436.58 208.94,430.63 227.24,430.63 "
        style="fill: url(#SVGID_32_)"
      />
      <polygon
        points="233.56,439.13 202.62,439.13 202.62,436.58 233.56,436.58 "
        style="fill: url(#SVGID_33_)"
      />
      <circle cx="222.63" cy="433.60001" r="1.3099999" style="fill: #333333" />
      <circle cx="213.55" cy="433.60001" r="1.3099999" style="fill: #333333" />
      <circle
        :class="[
          damStatus.isMotorError ? 'dynamic-color-error' : '',
          damStatus.isDowning || damStatus.isUping ? 'dynamic-color-working' : '',
          damStatus.isMotorOnline ? 'fill-online' : 'fill-offline'
        ]"
        cx="195.25999"
        cy="414.82001"
        r="7.4499998"
      />

      <path
        d="m 195.26,407.37 c -4.12,0 -7.45,3.34 -7.45,7.45 0,4.11 3.34,7.45 7.45,7.45 4.12,0 7.45,-3.34 7.45,-7.45 0,-4.11 -3.34,-7.45 -7.45,-7.45 z m 0,13.86 c -3.54,0 -6.41,-2.87 -6.41,-6.41 0,-3.54 2.87,-6.41 6.41,-6.41 3.54,0 6.41,2.87 6.41,6.41 0,3.54 -2.87,6.41 -6.41,6.41 z"
        style="opacity: 0.5; fill: url(#SVGID_34_)"
      />

      <rect
        x="250.85001"
        y="411.53"
        width="12.72"
        height="6.5900002"
        style="fill: url(#SVGID_35_)"
      />

      <path
        d="m 246.33,419.95 v 0 -10.25 0 c 2.49,0 4.51,2.02 4.51,4.51 v 1.22 c 0.01,2.5 -2.02,4.52 -4.51,4.52 z"
        style="fill: url(#SVGID_36_)"
      />
      <polygon
        points="263.58,418.17 263.58,411.55 269.31,414.86 "
        style="fill: url(#SVGID_69_)"
      ></polygon>
      <rect
        x="267.87"
        y="411.54999"
        width="4.8499999"
        height="6.6300001"
        style="fill: url(#SVGID_70_)"
      ></rect>
      <rect
        x="266.98001"
        y="421.82001"
        width="6.6300001"
        height="18"
        style="fill: url(#SVGID_71_)"
      ></rect>
      <polygon
        points="273.61,421.82 266.98,421.82 270.3,416.09 "
        style="fill: url(#SVGID_72_)"
      ></polygon>
      <rect x="160" y="439" width="134" height="50" style="fill: #ccc"></rect>
      <rect x="160" y="439" width="134" height="10" style="fill: blue"></rect>
    </g>
    <g id="arrow-1" transform="matrix(0.4,0,0,0.4,390,80)">
      <polygon
        points="150.3,804.5 150.3,909 642.66,909 642.66,850.35 280.11,850.35 280.11,804.5 "
        id="arrow-1-1"
        style="fill: #999999"
        transform="matrix(1,0,0,1,-19,-16)"
      />

      <path
        d="m 562.26,819.84 v 0 c 10.7,0.41 19.56,-8.29 19.29,-19 -2.93,-117.72 -72.46,-220.06 -173.41,-269.05 -9.62,-4.67 -21.19,-0.16 -25.23,9.74 l -0.88,2.16 c -3.63,8.9 0.12,19.12 8.67,23.5 87.21,44.72 147.72,133.14 153.75,235.31 0.55,9.5 8.31,16.97 17.81,17.34 z"
        id="path2"
        style="opacity: 0.5; fill: url(#SVGID_1_)"
      />

      <g
        id="g7"
        style="transform-box: fill-box; transform-origin: 30px 30px"
        :style="`transform: rotate(-${damStatus.gateArrowDegree}deg)`"
      >
        <circle cx="280.10999" cy="804.5" r="30.66" id="circle2" style="fill: #333333" />
        <path
          d="M 544.31,790.89 280.1,790.88 c -7.52,0 -13.61,6.1 -13.61,13.61 0,7.52 6.1,13.61 13.61,13.61 l 293.43,0.01 v -13.59 z"
          id="path3"
          style="fill: #51ff00"
        />
      </g>
    </g>
    <g id="gate-open-degree">
      <rect
        x="200"
        y="400"
        rx="8"
        ry="8"
        width="200"
        height="40"
        stroke="#777"
        stroke-width="3"
        fill="#fff"
      />
      <text
        xml:space="preserve"
        style="
          font-size: 24px;
          text-anchor: middle;
          fill: #000000;
          fill-opacity: 1;
          stroke-width: 5;
          stroke-linecap: round;
        "
        x="300"
        y="430"
      >
        開度
        <tspan style="fill: red; font-weight: bold">{{ damStatus.gateOpenDegree }}</tspan>
        度
      </text>
    </g>
    <g stroke-width="3" stroke-dasharray="10, 8" stroke="#999">
      <line x1="443" x2="443" y1="165" y2="390" />
      <line x1="638" x2="638" y1="165" y2="410" />
    </g>
    <text
      xml:space="preserve"
      style="
        font-size: 42px;
        text-anchor: middle;
        fill: #000000;
        fill-opacity: 1;
        stroke-width: 5;
        stroke-linecap: round;
      "
      x="540"
      y="145"
      id="text1"
    >
      <tspan id="tspan1">{{ showDamStatus }}</tspan>
    </text>
    <defs id="defs1">
      <linearGradient
        id="SVGID_28_"
        gradientUnits="userSpaceOnUse"
        x1="194.33971"
        y1="397.80539"
        x2="194.33971"
        y2="431.8421"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop247" />

        <stop offset="1" style="stop-color: #666666" id="stop248" />
      </linearGradient>
      <linearGradient
        id="SVGID_29_"
        gradientUnits="userSpaceOnUse"
        x1="225.0719"
        y1="405.15179"
        x2="244.416"
        y2="424.49579"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop249" />

        <stop offset="1" style="stop-color: #666666" id="stop250" />
      </linearGradient>
      <linearGradient
        id="SVGID_30_"
        gradientUnits="userSpaceOnUse"
        x1="230.2627"
        y1="405.6911"
        x2="248.52789"
        y2="423.95639"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop251" />

        <stop offset="1" style="stop-color: #666666" id="stop252" />
      </linearGradient>
      <linearGradient
        id="SVGID_31_"
        gradientUnits="userSpaceOnUse"
        x1="234.812"
        y1="407.9147"
        x2="248.6301"
        y2="421.73279"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop253" />

        <stop offset="1" style="stop-color: #666666" id="stop254" />
      </linearGradient>
      <linearGradient
        id="SVGID_32_"
        gradientUnits="userSpaceOnUse"
        x1="208.9366"
        y1="433.6033"
        x2="227.24319"
        y2="433.6033"
      >
        <stop offset="0" style="stop-color: #999999" id="stop257" />

        <stop offset="1" style="stop-color: #333333" id="stop258" />
      </linearGradient>
      <linearGradient
        id="SVGID_33_"
        gradientUnits="userSpaceOnUse"
        x1="218.0899"
        y1="436.57599"
        x2="218.0899"
        y2="439.133"
      >
        <stop offset="0" style="stop-color: #666666" id="stop259" />

        <stop offset="1" style="stop-color: #333333" id="stop260" />
      </linearGradient>
      <linearGradient
        id="SVGID_34_"
        gradientUnits="userSpaceOnUse"
        x1="187.8027"
        y1="414.82379"
        x2="202.71049"
        y2="414.82379"
      >
        <stop offset="0" style="stop-color: #666666" id="stop263" />

        <stop offset="1" style="stop-color: #333333" id="stop264" />
      </linearGradient>
      <linearGradient
        id="SVGID_35_"
        gradientUnits="userSpaceOnUse"
        x1="257.2027"
        y1="411.5293"
        x2="257.2027"
        y2="418.11829"
      >
        <stop offset="0" style="stop-color: #ffffff" id="stop265" />

        <stop offset="1" style="stop-color: #000000" id="stop266" />
      </linearGradient>
      <linearGradient
        id="SVGID_36_"
        gradientUnits="userSpaceOnUse"
        x1="248.58791"
        y1="409.69711"
        x2="248.58791"
        y2="419.95041"
      >
        <stop offset="0" style="stop-color: #666666" id="stop267" />

        <stop offset="1" style="stop-color: #333333" id="stop268" />
      </linearGradient>
      <linearGradient
        id="SVGID_69_"
        gradientUnits="userSpaceOnUse"
        x1="4085.1233"
        y1="4230.668"
        x2="4085.1233"
        y2="4236.4058"
        gradientTransform="matrix(0,-1,-1,0,4499.9824,4499.9824)"
      >
        <stop offset="0" style="stop-color: #999999" id="stop660" />

        <stop offset="1" style="stop-color: #333333" id="stop661" />
      </linearGradient>
      <linearGradient
        id="SVGID_70_"
        gradientUnits="userSpaceOnUse"
        x1="270.297"
        y1="411.5462"
        x2="270.297"
        y2="418.17169"
      >
        <stop offset="0" style="stop-color: #ffffff" id="stop662" />

        <stop offset="1" style="stop-color: #000000" id="stop663" />
      </linearGradient>
      <linearGradient
        id="SVGID_71_"
        gradientUnits="userSpaceOnUse"
        x1="273.6098"
        y1="466.03281"
        x2="266.98419"
        y2="466.03281"
      >
        <stop offset="0" style="stop-color: #ffffff" id="stop664" />

        <stop offset="1" style="stop-color: #000000" id="stop665" />
      </linearGradient>
      <linearGradient
        id="SVGID_72_"
        gradientUnits="userSpaceOnUse"
        x1="6379.7422"
        y1="319.31009"
        x2="6379.7422"
        y2="325.04791"
        gradientTransform="matrix(-1,0,0,1,6650.0391,96.7759)"
      >
        <stop offset="0" style="stop-color: #999999" id="stop666" />

        <stop offset="1" style="stop-color: #333333" id="stop667" />
      </linearGradient>
      <linearGradient
        id="SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1="370.1134"
        y1="552.25702"
        x2="604.18927"
        y2="786.33282"
      >
        <stop offset="0" style="stop-color: #999999" id="stop1-2" />
        <stop offset="1" style="stop-color: #333333" id="stop2-3" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
const data = inject($gate);

/** 顯示水位，這邊要注意的是，高度是由上往下成長，因此這邊會用反向的方式取得值 */
function showWaterLevel(n: number, HEIGHT = 375) {
  /** 畫面上圖片的高度 */
  /** 水位的最高值 */
  const MAXIUM = 260;
  /** 當兩個水位值都為0 需要回傳 0 以迴避 NAN */
  const result = parseFloat(((n / MAXIUM) * HEIGHT).toFixed());

  if (result < 10) return HEIGHT;
  else if (result > HEIGHT) return 0;
  return HEIGHT - result;
}

const waterLevelColor = computed(() => {
  const { waterLevel, dryWaterLevel, alertWaterLevel_1 } = waterLevels.value;
  const dry = dryWaterLevel > waterLevel;
  const alert = waterLevel > alertWaterLevel_1;
  if (dry) return '#FFC000';
  if (alert) return '#F00';
  return '#81CAE0';
});

const waterLevels = computed(() => {
  const level = Math.floor(waterLevel.value);
  const dryWaterLevel = Math.floor(getValue('619') || getValue('319') || 0);
  const alertWaterLevel_1 = Math.floor(getValue('606') || getValue('306') || 0);
  const alertWaterLevel_2 = Math.floor(getValue('607') || getValue('307') || 0);
  const alertWaterLevel_3 = Math.floor(getValue('608') || getValue('308') || 0);

  return {
    waterLevel: level,
    dryWaterLevel,
    alertWaterLevel_1,
    alertWaterLevel_2,
    alertWaterLevel_3
  };

  function getValue(tag: string) {
    try {
      return data?.value?.Gate?.MapSection.PLCs.find((o) => o.Tag === tag)?.Value as number;
    } catch (error) {
      return undefined;
    }
  }
});

/** 閘門開度百分比 */
const getOpenPersent = (v?: number | string | boolean) => {
  if (!v || typeof v === 'boolean') return 0;
  const MAXIUM = 65;
  const n = Number(v) > MAXIUM ? MAXIUM : Number(v);
  return Number((((n || 0) / MAXIUM) * 80).toFixed());
};
const getDeg = (v?: number | string | boolean) => {
  if (!v || typeof v === 'boolean') return 0;
  const MAXIUM = 65;
  const n = Number(v) >= MAXIUM ? MAXIUM : Number(v);
  return (((n || 0) / MAXIUM) * 65).toFixed(); // redline 267
};

const damStatus = computed(() => {
  const getTag = (tag: string) => {
    try {
      return data?.value?.Gate.DamSections.find((o) => o.DamSectionType === 0)?.PLCs.find(
        (o) => o.Tag === tag
      )?.Value as boolean | number;
    } catch (error) {
      return false;
    }
  };

  const gateOpenDegree = getTag('259') || 0;

  return {
    // 起立中
    isUping: getTag('463'),
    // 倒伏中
    isDowning: getTag('464'),
    // 起立完成
    isUp: getTag('220'),
    // 倒伏完成
    isDown: getTag('219'),
    // 馬達異常+3E故障 || 馬達過載
    isMotorError: getTag('178') || getTag('111'),
    // 機箱操作
    isMotorOnline: getTag('459'),
    gateOpenDegree,
    /** 開度 */
    gateHeight: getOpenPersent(gateOpenDegree),
    gateArrowDegree: getDeg(gateOpenDegree)
  };
});

const waterLevel = computed(() => {
  try {
    return data?.value?.Sections.find((o) => o.SectionType === 3)?.PLCs.find((o) => o.Tag === '251')
      ?.Value as number;
  } catch (error) {
    return 0;
  }
});

/** 調整水位值 */
const getWaterLine = (v?: number | string | boolean) => {
  if (!v || typeof v === 'boolean') return 0;
  const MAXIUM = 151;
  const n = Number(v) >= MAXIUM ? MAXIUM : Number(v);
  return (((n || 0) / MAXIUM) * 150).toFixed(); // redline 267
};

const waterLevel_f = computed(() => {
  const v = waterLevel.value;
  if (!v) return '-';
  return v;
});

const showDamStatus = computed(() => {
  const status = damStatus.value;
  if (status.isUp) return '起立完成';
  if (status.isDown) return '倒伏完成';
  if (status.isUping) return '起立中';
  if (status.isDowning) return '倒伏中';
  return '';
});
</script>
