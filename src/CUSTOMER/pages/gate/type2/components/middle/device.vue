<template>
  <svg
    width="1136"
    height="468"
    viewBox="0 0 953 370"
    fill="none"
    version="1.1"
    id="svg65"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
  >
    <g :fill="waterLevelColor" transform="matrix(0.6,0,0,0.6,80,30)">
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
    <text xml:space="preserve" x="620" y="75" style="font-size: 16px; fill: #000000">
      牆高 +270
    </text>
    <text
      v-if="gatesLength >= 1"
      xml:space="preserve"
      style="font-size: 18px; fill: #000000"
      id="text69"
    >
      <tspan
        :class="{ 'dynamic-color-error': g01State.isGateError || g01State.isMotorError }"
        id="tspan65-4-0-4"
        x="280"
        y="20"
        style="font-size: 14px"
      >
        {{ g01State.gateName || '1號水門' }}
      </tspan>
      <tspan id="tspan69" x="270" y="40">
        <template v-if="g01State.isOpened && g01State.isOpened !== g01State.isClosed">
          閘門全開
        </template>
        <template v-else-if="g01State.isClosed && g01State.isOpened !== g01State.isClosed">
          閘門全關
        </template>
      </tspan>
    </text>
    <text
      v-if="gatesLength >= 2"
      xml:space="preserve"
      style="font-size: 18px; fill: #000000"
      id="text69-1"
    >
      <tspan
        :class="{ 'dynamic-color-error': g02State.isGateError || g02State.isMotorError }"
        id="tspan65-4-0-4"
        x="400"
        y="20"
        style="font-size: 14px"
      >
        {{ g02State.gateName || '2號水門' }}
      </tspan>
      <tspan id="tspan69-3" x="390" y="40">
        <template v-if="g02State.isOpened && g02State.isOpened !== g02State.isClosed">
          閘門全開
        </template>
        <template v-else-if="g02State.isClosed && g02State.isOpened !== g02State.isClosed">
          閘門全關
        </template>
      </tspan>
    </text>
    <text
      v-if="gatesLength >= 3"
      xml:space="preserve"
      style="font-size: 18px; fill: #000000"
      id="text69-4"
    >
      <tspan
        :class="{ 'dynamic-color-error': g03State.isGateError || g03State.isMotorError }"
        id="tspan65-4-0-4"
        x="520"
        y="20"
        style="font-size: 14px"
      >
        {{ g03State.gateName || '3號水門' }}
      </tspan>
      <tspan id="tspan69-8" x="510" y="40">
        <template v-if="g03State.isOpened && g03State.isOpened !== g03State.isClosed">
          閘門全開
        </template>
        <template v-else-if="g03State.isClosed && g03State.isOpened !== g03State.isClosed">
          閘門全關
        </template>
      </tspan>
    </text>
    <g id="gates" transform="matrix(0.9, 0, 0, 0.9, -74, -334)">
      <g id="g527" transform="matrix(1,0,0,1,226.27243,-699)">
        <rect
          v-if="gatesLength >= 1"
          x="192.47"
          y="1391.5699"
          width="113.71"
          height="42.220001"
          id="rect525"
          style="fill: #29abe2"
        />

        <rect
          v-if="gatesLength >= 2"
          x="325.14001"
          y="1391.5699"
          width="113.71"
          height="42.220001"
          id="rect526"
          style="fill: #29abe2"
        />

        <rect
          v-if="gatesLength >= 3"
          x="457.81"
          y="1391.5699"
          width="113.71"
          height="42.220001"
          id="rect527"
          style="fill: #29abe2"
        />
      </g>
      <g
        v-if="gatesLength >= 3"
        id="gate_3"
        class="-translate-y-[var(--open)]"
        :style="`--open: ${g03State.gatePercent}px`"
      >
        <g transform="matrix(1,0,0,1,226.27243,-577)">
          <rect
            x="511.97"
            y="981.21997"
            width="5.0799999"
            height="227.17999"
            id="rect516"
            style="fill: #333333"
          />

          <rect
            :class="[
              g03State.isGateError ? 'dynamic-color-error' : '',
              g03State.isOpening || g03State.isClosing ? 'dynamic-color-working' : 'fill-online'
            ]"
            x="457.79999"
            y="1203.77"
            width="113.72"
            height="108.77"
            id="rect517"
          />

          <rect
            x="507.60001"
            y="1202.96"
            width="13.14"
            height="4.6399999"
            id="rect518"
            style="fill: #666666"
          />

          <path
            d="m 464.03,1206.96 v 100.76 H 564.8 v -100.76 z m 48.09,96.62 h -43.94 v -43.94 h 43.94 z m 0,-48.53 h -43.94 v -43.94 h 43.94 z m 48.53,48.53 h -43.94 v -43.94 h 43.94 z m 0,-48.53 h -43.94 v -43.94 h 43.94 z"
            id="path518"
            style="fill: #666666"
          />
        </g>
      </g>
      <g
        v-if="gatesLength >= 2"
        id="gate_2"
        class="-translate-y-[var(--open)]"
        :style="`--open: ${g02State.gatePercent}px`"
      >
        <g transform="matrix(1,0,0,1,226.27243,-577)">
          <rect
            x="379.29999"
            y="981.21997"
            width="5.0799999"
            height="227.17999"
            id="rect519"
            style="fill: #333333"
          />

          <rect
            :class="[
              g02State.isGateError ? 'dynamic-color-error' : '',
              g02State.isOpening || g02State.isClosing ? 'dynamic-color-working' : 'fill-online'
            ]"
            x="325.13"
            y="1203.77"
            width="113.72"
            height="108.77"
            id="rect520"
          />

          <rect
            x="374.92999"
            y="1202.96"
            width="13.14"
            height="4.6399999"
            id="rect521"
            style="fill: #666666"
          />

          <path
            d="m 331.36,1206.96 v 100.76 h 100.76 v -100.76 z m 48.09,96.62 h -43.94 v -43.94 h 43.94 z m 0,-48.53 h -43.94 v -43.94 h 43.94 z m 48.53,48.53 h -43.94 v -43.94 h 43.94 z m 0,-48.53 h -43.94 v -43.94 h 43.94 z"
            id="path521"
            style="fill: #666666"
          />
        </g>
      </g>
      <g
        v-if="gatesLength >= 1"
        id="gate_1"
        class="-translate-y-[var(--open)]"
        :style="`--open: ${g01State.gatePercent}px`"
      >
        <g transform="matrix(1,0,0,1,226.27243,-577)">
          <rect
            x="246.63"
            y="981.21997"
            width="5.0799999"
            height="227.17999"
            id="rect522"
            style="fill: #333333"
          />

          <rect
            :class="[
              g01State.isGateError ? 'dynamic-color-error' : '',
              g01State.isOpening || g01State.isClosing ? 'dynamic-color-working' : 'fill-online'
            ]"
            x="192.47"
            y="1203.77"
            width="113.72"
            height="108.77"
            id="rect523"
          />

          <rect
            x="242.25999"
            y="1202.96"
            width="13.14"
            height="4.6399999"
            id="rect524"
            style="fill: #666666"
          />

          <path
            d="m 198.7,1206.96 v 100.76 h 100.76 v -100.76 z m 48.09,96.62 h -43.94 v -43.94 h 43.94 z m 0,-48.53 h -43.94 v -43.94 h 43.94 z m 48.52,48.53 h -43.94 v -43.94 h 43.94 z m 0,-48.53 h -43.94 v -43.94 h 43.94 z"
            id="path524"
            style="fill: #666666"
          />
        </g>
      </g>
      <g id="g529" transform="matrix(1,0,0,1,226.27243,-698.90259)">
        <g v-if="gatesLength === 1">
          <path
            style="fill: #aaa; transform: matrix(1, 0, 0, 1, 0, 1068)"
            d="m 177.56,95.85 v 0.01 L 149.21,366.31 h 43.25 V 124 c 37.97,0.21 75.93,-0.04 113.9,0 v 242.31 h 43.24 L 321.26,95.86 v -0.01 c -47.9,-0.01 -95.8,0.03 -143.7,0 z"
          />
          <rect
            x="172.08"
            y="1181.89"
            width="155"
            height="5.75"
            id="rect529"
            style="fill: #cccccc"
          />
        </g>
        <g v-else-if="gatesLength === 2">
          <path
            style="fill: #b3b3b3; transform: matrix(1, 0, 0, 1, 612, 1041)"
            d="m -434.3801,121.9435 v 0.01 l -28.35157,270.45095 h 43.25 V 150.09389 c 37.67672,0.16379 75.35315,0.008 113.0293,0.0352 v 242.2402 h 18.93946 V 150.12904 c 207.250746,0 15.9226,-0.0352 114.79687,-0.0352 v 242.31061 h 43.24025 l -28.33985,-270.45119 v -0.01 c -92.18818,0.0231 -184.37628,0.093 -276.56446,0 z"
          />
          <rect
            x="172.08"
            y="1181.89"
            width="287"
            height="5.75"
            id="rect529"
            style="fill: #cccccc"
          />
        </g>
        <g v-else-if="gatesLength === 3">
          <polygon
            points="325.12,1191.55 438.84,1191.55 438.84,1433.79 457.79,1433.79 457.79,1191.55 571.51,1191.55 571.51,1433.86 614.75,1433.86 586.41,1163.41 177.56,1163.41 149.21,1433.86 192.46,1433.86 192.46,1191.55 306.18,1191.55 306.18,1433.79 325.12,1433.79 "
            id="polygon528"
            style="fill: #b3b3b3"
          />
          <polygon
            points="588.8,1187.74 589.22,1191.56 174.75,1191.56 175.17,1187.74 "
            id="polygon529"
            style="fill: #999999"
          />
          <rect
            x="172.08"
            y="1181.89"
            width="419.79999"
            height="5.75"
            id="rect529"
            style="fill: #cccccc"
          />
        </g>
      </g>

      <g v-if="gatesLength >= 3" id="motor_3" transform="matrix(1,0,0,1,226.27243,-698.90259)">
        <g id="g572">
          <g id="g562">
            <rect
              x="451.98001"
              y="1123.6899"
              transform="rotate(180,466.3058,1139.4253)"
              width="28.66"
              height="31.48"
              id="rect530"
              style="fill: #b3b3b3"
            />
            <rect
              x="451.98001"
              y="1138.23"
              width="28.66"
              height="2.3900001"
              id="rect531"
              style="fill: #666666"
            />
            <rect
              x="451.98001"
              y="1133.86"
              width="28.66"
              height="2.3900001"
              id="rect532"
              style="fill: #666666"
            />
            <rect
              x="451.98001"
              y="1129.49"
              width="28.66"
              height="2.3900001"
              id="rect534"
              style="fill: #666666"
            />
            <rect
              x="451.98001"
              y="1125.11"
              width="28.66"
              height="2.3900001"
              id="rect536"
              style="fill: #666666"
            />

            <rect
              x="451.98001"
              y="1142.61"
              width="28.66"
              height="2.3900001"
              id="rect538"
              style="fill: #666666"
            />

            <rect
              x="451.98001"
              y="1146.98"
              width="28.66"
              height="2.3900001"
              id="rect540"
              style="fill: #666666"
            />

            <rect
              x="451.98001"
              y="1151.35"
              width="28.66"
              height="2.3900001"
              id="rect542"
              style="fill: #666666"
            />

            <path
              d="m 439.41,1122.41 h 12.56 v 34.04 h -12.56 c -3.47,0 -6.28,-2.81 -6.28,-6.28 v -21.47 c 0,-3.48 2.82,-6.29 6.28,-6.29 z"
              id="path546"
              style="fill: url(#SVGID_121_)"
            />

            <g id="g547" style="opacity: 0.5">
              <rect
                x="451.98001"
                y="1123.6899"
                transform="rotate(180,453.4796,1139.4253)"
                width="3"
                height="31.48"
                id="rect546"
                style="fill: #808080"
              />
            </g>

            <polygon
              points="485.29,1122.41 485.29,1156.44 480.63,1156.44 480.63,1122.41 "
              id="polygon548"
              style="fill: url(#SVGID_122_)"
            />

            <polygon
              points="489.94,1123.49 489.94,1155.36 485.29,1155.36 485.29,1123.49 "
              id="polygon550"
              style="fill: url(#SVGID_123_)"
            />
            <polygon
              points="494.59,1131.13 494.59,1147.72 489.94,1153.24 489.94,1125.61 "
              id="polygon552"
              style="fill: url(#SVGID_124_)"
            />

            <g id="g553" style="opacity: 0.5">
              <rect
                x="485.29001"
                y="1123.49"
                transform="rotate(180,486.17995,1139.4254)"
                width="1.79"
                height="31.879999"
                id="rect552"
                style="fill: #333333"
              />
            </g>

            <g id="g555" style="opacity: 0.5">
              <polygon
                points="489.94,1153.24 489.94,1125.61 491.43,1127.38 491.43,1151.47 "
                id="polygon553"
                style="fill: #333333"
              />
            </g>

            <g id="g561">
              <polygon
                points="457.15,1161.18 457.15,1155.23 475.46,1155.23 475.46,1161.18 "
                id="polygon556"
                style="fill: url(#SVGID_125_)"
              />

              <polygon
                points="450.83,1163.74 450.83,1161.18 532.14,1161.18 532.14,1163.74 "
                id="polygon558"
                style="fill: url(#SVGID_126_)"
              />

              <circle cx="470.84" cy="1158.2" r="1.3099999" id="circle558" style="fill: #333333" />
              <circle
                cx="461.76999"
                cy="1158.2"
                r="1.3099999"
                id="circle559"
                style="fill: #333333"
              />
            </g>

            <circle
              cx="443.47"
              cy="1139.4301"
              r="7.4499998"
              id="circle561"
              :class="[
                g03State.isMotorError ? 'dynamic-color-error' : '',
                g03State.isOpening || g03State.isClosing
                  ? 'dynamic-color-working-shine'
                  : 'fill-online',
                g03State.isMotorOn ? 'fill-online' : 'fill-online'
              ]"
            />

            <path
              d="m 443.47,1131.97 c -4.12,0 -7.45,3.34 -7.45,7.45 0,4.11 3.34,7.45 7.45,7.45 4.12,0 7.45,-3.34 7.45,-7.45 0,-4.11 -3.33,-7.45 -7.45,-7.45 z m 0,13.86 c -3.54,0 -6.41,-2.87 -6.41,-6.41 0,-3.54 2.87,-6.41 6.41,-6.41 3.54,0 6.41,2.87 6.41,6.41 0,3.54 -2.87,6.41 -6.41,6.41 z"
              id="path562"
              style="opacity: 0.5; fill: url(#SVGID_127_)"
            />
          </g>

          <rect
            x="494.59"
            y="1136.13"
            width="12.72"
            height="6.5900002"
            id="rect564"
            style="fill: url(#SVGID_128_)"
          />

          <path
            d="m 494.55,1144.55 v 0 -10.25 0 c 2.49,0 4.51,2.02 4.51,4.51 v 1.22 c 0,2.5 -2.02,4.52 -4.51,4.52 z"
            id="path566"
            style="fill: url(#SVGID_129_)"
          />

          <rect
            x="502.82001"
            y="1122.41"
            width="23.559999"
            height="35.799999"
            id="rect568"
            style="fill: url(#SVGID_130_)"
          />

          <rect
            x="504.34"
            y="1119.51"
            width="20.52"
            height="2.9000001"
            id="rect570"
            style="fill: url(#SVGID_131_)"
          />

          <rect
            x="504.34"
            y="1158.2"
            width="20.52"
            height="2.97"
            id="rect572"
            style="fill: url(#SVGID_132_)"
          />
        </g>

        <polygon
          points="515.7,1121.82 513.32,1121.82 513.32,1138.74 498.67,1147.2 499.86,1149.26 514.51,1140.8 529.16,1149.26 530.35,1147.2 515.7,1138.74 "
          id="polygon572"
          fill="#000000"
        />

        <path
          d="m 514.51,1120.84 c -10.26,0 -18.58,8.32 -18.58,18.58 0,10.26 8.32,18.58 18.58,18.58 10.26,0 18.58,-8.32 18.58,-18.58 0,-10.26 -8.32,-18.58 -18.58,-18.58 z m 0,34.39 c -8.73,0 -15.8,-7.08 -15.8,-15.8 0,-8.72 7.08,-15.8 15.8,-15.8 8.73,0 15.8,7.08 15.8,15.8 0,8.72 -7.07,15.8 -15.8,15.8 z"
          id="path573"
          fill="#000000"
        />

        <circle cx="514.51001" cy="1139.4301" r="5.4000001" id="circle574" style="fill: #4d4d4d" />

        <g id="g576" style="opacity: 0.5">
          <path
            d="m 517.2,1139.43 c 0,-1.48 -1.2,-2.69 -2.69,-2.69 -1.48,0 -2.69,1.2 -2.69,2.69 0,1.48 1.2,2.69 2.69,2.69 1.48,-0.01 2.69,-1.21 2.69,-2.69 z"
            id="path575"
            style="fill: #666666"
          />
        </g>
      </g>

      <g v-if="gatesLength >= 2" id="motor_2" transform="matrix(1,0,0,1,226.27243,-698.90259)">
        <g id="g621">
          <rect
            x="319.31"
            y="1123.6899"
            transform="rotate(180,333.63475,1139.4253)"
            width="28.66"
            height="31.48"
            id="rect578"
            style="fill: #b3b3b3"
          />

          <rect
            x="319.31"
            y="1138.23"
            width="28.66"
            height="2.3900001"
            id="rect579"
            style="fill: #666666"
          />
          <rect
            x="319.31"
            y="1133.86"
            width="28.66"
            height="2.3900001"
            id="rect581"
            style="fill: #666666"
          />
          <rect
            x="319.31"
            y="1129.49"
            width="28.66"
            height="2.3900001"
            id="rect583"
            style="fill: #666666"
          />
          <rect
            x="319.31"
            y="1125.11"
            width="28.66"
            height="2.3900001"
            id="rect585"
            style="fill: #666666"
          />
          <rect
            x="319.31"
            y="1142.61"
            width="28.66"
            height="2.3900001"
            id="rect587"
            style="fill: #666666"
          />
          <rect
            x="319.31"
            y="1146.98"
            width="28.66"
            height="2.3900001"
            id="rect589"
            style="fill: #666666"
          />
          <rect
            x="319.31"
            y="1151.35"
            width="28.66"
            height="2.3900001"
            id="rect591"
            style="fill: #666666"
          />
          <path
            d="m 306.74,1122.41 h 12.56 v 34.04 h -12.56 c -3.47,0 -6.28,-2.81 -6.28,-6.28 v -21.47 c 0,-3.48 2.81,-6.29 6.28,-6.29 z"
            id="path595"
            style="fill: url(#SVGID_133_)"
          />

          <g id="g596" style="opacity: 0.5">
            <rect
              x="319.31"
              y="1123.6899"
              transform="rotate(180,320.80855,1139.4253)"
              width="3"
              height="31.48"
              id="rect595"
              style="fill: #808080"
            />
          </g>

          <polygon
            points="352.61,1122.41 352.61,1156.44 347.96,1156.44 347.96,1122.41 "
            id="polygon597"
            style="fill: url(#SVGID_134_)"
          />

          <polygon
            points="357.27,1123.49 357.27,1155.36 352.61,1155.36 352.61,1123.49 "
            id="polygon599"
            style="fill: url(#SVGID_135_)"
          />

          <polygon
            points="361.92,1131.13 361.92,1147.72 357.27,1153.24 357.27,1125.61 "
            id="polygon601"
            style="fill: url(#SVGID_136_)"
          />

          <g id="g602" style="opacity: 0.5">
            <rect
              x="352.60999"
              y="1123.49"
              transform="rotate(180,353.5089,1139.4254)"
              width="1.79"
              height="31.879999"
              id="rect601"
              style="fill: #333333"
            />
          </g>

          <g id="g604" style="opacity: 0.5">
            <polygon
              points="357.27,1153.24 357.27,1125.61 358.76,1127.38 358.76,1151.47 "
              id="polygon602"
              style="fill: #333333"
            />
          </g>

          <polygon
            points="324.48,1161.18 324.48,1155.23 342.79,1155.23 342.79,1161.18 "
            id="polygon605"
            style="fill: url(#SVGID_137_)"
          />

          <polygon
            points="318.16,1163.74 318.16,1161.18 399.47,1161.18 399.47,1163.74 "
            id="polygon607"
            style="fill: url(#SVGID_138_)"
          />

          <circle cx="338.17001" cy="1158.2" r="1.3099999" id="circle607" style="fill: #333333" />

          <circle cx="329.10001" cy="1158.2" r="1.3099999" id="circle608" style="fill: #333333" />

          <circle
            cx="310.79999"
            cy="1139.4301"
            r="7.4499998"
            id="circle610"
            :class="[
              g02State.isMotorError ? 'dynamic-color-error' : '',
              g02State.isOpening || g02State.isClosing
                ? 'dynamic-color-working-shine'
                : 'fill-online',
              g02State.isMotorOn ? 'fill-online' : 'fill-online'
            ]"
          />

          <path
            d="m 310.8,1131.97 c -4.12,0 -7.45,3.34 -7.45,7.45 0,4.11 3.34,7.45 7.45,7.45 4.12,0 7.45,-3.34 7.45,-7.45 0,-4.11 -3.33,-7.45 -7.45,-7.45 z m 0,13.86 c -3.54,0 -6.41,-2.87 -6.41,-6.41 0,-3.54 2.87,-6.41 6.41,-6.41 3.54,0 6.41,2.87 6.41,6.41 0,3.54 -2.87,6.41 -6.41,6.41 z"
            id="path611"
            style="opacity: 0.5; fill: url(#SVGID_139_)"
          />

          <rect
            x="361.92001"
            y="1136.13"
            width="12.72"
            height="6.5900002"
            id="rect613"
            style="fill: url(#SVGID_140_)"
          />

          <path
            d="m 361.88,1144.55 v 0 -10.25 0 c 2.49,0 4.51,2.02 4.51,4.51 v 1.22 c 0,2.5 -2.02,4.52 -4.51,4.52 z"
            id="path615"
            style="fill: url(#SVGID_141_)"
          />

          <rect
            x="370.14999"
            y="1122.41"
            width="23.559999"
            height="35.799999"
            id="rect617"
            style="fill: url(#SVGID_142_)"
          />

          <rect
            x="371.67001"
            y="1119.51"
            width="20.52"
            height="2.9000001"
            id="rect619"
            style="fill: url(#SVGID_143_)"
          />

          <rect
            x="371.67001"
            y="1158.2"
            width="20.52"
            height="2.97"
            id="rect621"
            style="fill: url(#SVGID_144_)"
          />
        </g>

        <polygon
          points="383.03,1121.82 380.65,1121.82 380.65,1138.74 366,1147.2 367.19,1149.26 381.84,1140.8 396.49,1149.26 397.68,1147.2 383.03,1138.74 "
          id="polygon621"
          fill="#000000"
        />

        <path
          d="m 381.84,1120.84 c -10.26,0 -18.58,8.32 -18.58,18.58 0,10.26 8.32,18.58 18.58,18.58 10.26,0 18.58,-8.32 18.58,-18.58 0,-10.26 -8.32,-18.58 -18.58,-18.58 z m 0,34.39 c -8.73,0 -15.8,-7.08 -15.8,-15.8 0,-8.72 7.08,-15.8 15.8,-15.8 8.73,0 15.8,7.08 15.8,15.8 0,8.72 -7.07,15.8 -15.8,15.8 z"
          id="path622"
          fill="#000000"
        />

        <circle cx="381.84" cy="1139.4301" r="5.4000001" id="circle623" style="fill: #4d4d4d" />

        <g id="g625" style="opacity: 0.5">
          <path
            d="m 384.53,1139.43 c 0,-1.48 -1.2,-2.69 -2.69,-2.69 -1.48,0 -2.69,1.2 -2.69,2.69 0,1.48 1.2,2.69 2.69,2.69 1.48,-0.01 2.69,-1.21 2.69,-2.69 z"
            id="path624"
            style="fill: #666666"
          />
        </g>
      </g>

      <g v-if="gatesLength >= 1" id="motor_1" transform="matrix(1,0,0,1,226.27243,-698.90259)">
        <g id="g670">
          <g id="g660">
            <rect
              x="186.64"
              y="1123.6899"
              transform="rotate(180,200.9708,1139.4253)"
              width="28.66"
              height="31.48"
              id="rect627"
              style="fill: #b3b3b3"
            />

            <rect
              x="186.64"
              y="1138.23"
              width="28.66"
              height="2.3900001"
              id="rect628"
              style="fill: #666666"
            />

            <rect
              x="186.64"
              y="1133.86"
              width="28.66"
              height="2.3900001"
              id="rect630"
              style="fill: #666666"
            />

            <rect
              x="186.64"
              y="1129.49"
              width="28.66"
              height="2.3900001"
              id="rect632"
              style="fill: #666666"
            />

            <rect
              x="186.64"
              y="1125.11"
              width="28.66"
              height="2.3900001"
              id="rect634"
              style="fill: #666666"
            />

            <rect
              x="186.64"
              y="1142.61"
              width="28.66"
              height="2.3900001"
              id="rect636"
              style="fill: #666666"
            />

            <rect
              x="186.64"
              y="1146.98"
              width="28.66"
              height="2.3900001"
              id="rect638"
              style="fill: #666666"
            />

            <rect
              x="186.64"
              y="1151.35"
              width="28.66"
              height="2.3900001"
              id="rect640"
              style="fill: #666666"
            />

            <path
              d="m 174.08,1122.41 h 12.56 v 34.04 h -12.56 c -3.47,0 -6.28,-2.81 -6.28,-6.28 v -21.47 c 0,-3.48 2.81,-6.29 6.28,-6.29 z"
              id="path644"
              style="fill: url(#SVGID_145_)"
            />

            <g id="g645" style="opacity: 0.5">
              <rect
                x="186.64"
                y="1123.6899"
                transform="rotate(180,188.1446,1139.4253)"
                width="3"
                height="31.48"
                id="rect644"
                style="fill: #808080"
              />
            </g>

            <polygon
              points="219.95,1122.41 219.95,1156.44 215.3,1156.44 215.3,1122.41 "
              id="polygon646"
              style="fill: url(#SVGID_146_)"
            />

            <polygon
              points="224.6,1123.49 224.6,1155.36 219.95,1155.36 219.95,1123.49 "
              id="polygon648"
              style="fill: url(#SVGID_147_)"
            />

            <polygon
              points="229.25,1131.13 229.25,1147.72 224.6,1153.24 224.6,1125.61 "
              id="polygon650"
              style="fill: url(#SVGID_148_)"
            />

            <g id="g651" style="opacity: 0.5">
              <rect
                x="219.95"
                y="1123.49"
                transform="rotate(180,220.8449,1139.4254)"
                width="1.79"
                height="31.879999"
                id="rect650"
                style="fill: #333333"
              />
            </g>

            <g id="g653" style="opacity: 0.5">
              <polygon
                points="224.6,1153.24 224.6,1125.61 226.09,1127.38 226.09,1151.47 "
                id="polygon651"
                style="fill: #333333"
              />
            </g>

            <g id="g659">
              <polygon
                points="191.82,1161.18 191.82,1155.23 210.12,1155.23 210.12,1161.18 "
                id="polygon654"
                style="fill: url(#SVGID_149_)"
              />

              <polygon
                points="185.5,1163.74 185.5,1161.18 266.81,1161.18 266.81,1163.74 "
                id="polygon656"
                style="fill: url(#SVGID_150_)"
              />

              <circle
                cx="205.50999"
                cy="1158.2"
                r="1.3099999"
                id="circle656"
                style="fill: #333333"
              />

              <circle
                cx="196.42999"
                cy="1158.2"
                r="1.3099999"
                id="circle657"
                style="fill: #333333"
              />
            </g>

            <circle
              cx="178.14"
              cy="1139.4301"
              r="7.4499998"
              id="circle659"
              :class="[
                g01State.isMotorError ? 'dynamic-color-error' : '',
                g01State.isOpening || g01State.isClosing
                  ? 'dynamic-color-working-shine'
                  : 'fill-online',
                g01State.isMotorOn ? 'fill-online' : 'fill-online'
              ]"
            />

            <path
              d="m 178.14,1131.97 c -4.12,0 -7.45,3.34 -7.45,7.45 0,4.11 3.34,7.45 7.45,7.45 4.12,0 7.45,-3.34 7.45,-7.45 0,-4.11 -3.34,-7.45 -7.45,-7.45 z m 0,13.86 c -3.54,0 -6.41,-2.87 -6.41,-6.41 0,-3.54 2.87,-6.41 6.41,-6.41 3.54,0 6.41,2.87 6.41,6.41 0,3.54 -2.87,6.41 -6.41,6.41 z"
              id="path660"
              style="opacity: 0.5; fill: url(#SVGID_151_)"
            />
          </g>
          <rect
            x="229.25"
            y="1136.13"
            width="12.72"
            height="6.5900002"
            id="rect662"
            style="fill: url(#SVGID_152_)"
          />

          <path
            d="m 229.21,1144.55 v 0 -10.25 0 c 2.49,0 4.51,2.02 4.51,4.51 v 1.22 c 0.01,2.5 -2.02,4.52 -4.51,4.52 z"
            id="path664"
            style="fill: url(#SVGID_153_)"
          />

          <rect
            x="237.48"
            y="1122.41"
            width="23.559999"
            height="35.799999"
            id="rect666"
            style="fill: url(#SVGID_154_)"
          />

          <rect
            x="239"
            y="1119.51"
            width="20.52"
            height="2.9000001"
            id="rect668"
            style="fill: url(#SVGID_155_)"
          />

          <rect
            x="239"
            y="1158.2"
            width="20.52"
            height="2.97"
            id="rect670"
            style="fill: url(#SVGID_156_)"
          />
        </g>

        <polygon
          points="250.37,1121.82 247.98,1121.82 247.98,1138.74 233.33,1147.2 234.52,1149.26 249.18,1140.8 263.83,1149.26 265.02,1147.2 250.37,1138.74 "
          fill="#000000"
          id="polygon670"
        />

        <path
          d="m 249.17,1120.84 c -10.26,0 -18.58,8.32 -18.58,18.58 0,10.26 8.32,18.58 18.58,18.58 10.26,0 18.58,-8.32 18.58,-18.58 0.01,-10.26 -8.31,-18.58 -18.58,-18.58 z m 0,34.39 c -8.73,0 -15.8,-7.08 -15.8,-15.8 0,-8.72 7.08,-15.8 15.8,-15.8 8.73,0 15.8,7.08 15.8,15.8 0,8.72 -7.07,15.8 -15.8,15.8 z"
          id="path671"
          fill="#000000"
        />

        <circle cx="249.17" cy="1139.4301" r="5.4000001" id="circle672" style="fill: #4d4d4d" />
        <g id="g674" style="opacity: 0.5">
          <path
            d="m 251.86,1139.43 c 0,-1.48 -1.2,-2.69 -2.69,-2.69 -1.49,0 -2.69,1.2 -2.69,2.69 0,1.48 1.2,2.69 2.69,2.69 1.49,0 2.69,-1.21 2.69,-2.69 z"
            id="path673"
            style="fill: #666666"
          />
        </g>
      </g>

      <g id="arrow_1" transform="translate(270,250)">
        <path
          :class="{ anmLine: g01State.isClosing !== g01State.isOpening }"
          :style="getRotate(g01State.isOpening, g01State.isClosing)"
          id="path51"
          class="stroked opacity-0"
          style="color: #000000; fill: #ea232f; stroke-linecap: round; stroke-linejoin: round"
          d="m 205,296.01367 c -0.0768,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 204 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.65,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
        <path
          :class="{ anmLine: g01State.isClosing !== g01State.isOpening }"
          :style="getRotate(g01State.isOpening, g01State.isClosing)"
          id="path51-2"
          class="stroked opacity-0"
          style="
            color: #000000;
            fill: #ea232f;
            stroke-linecap: round;
            stroke-linejoin: round;

            --delay: 1s;
          "
          d="m 205,296.01367 c -0.0768,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 204 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.65,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
        <path
          :class="{ anmLine: g01State.isClosing !== g01State.isOpening }"
          :style="getRotate(g01State.isOpening, g01State.isClosing)"
          id="path51-3"
          class="stroked opacity-0"
          style="
            color: #000000;
            fill: #ea232f;
            stroke-linecap: round;
            stroke-linejoin: round;

            --delay: 2s;
          "
          d="m 205,296.01367 c -0.0768,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 204 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.65,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
      </g>
      <g id="arrow_3" transform="translate(-8,250)">
        <path
          :class="{ anmLine: g03State.isClosing !== g03State.isOpening }"
          :style="getRotate(g03State.isOpening, g03State.isClosing)"
          id="path57"
          class="stroked opacity-0"
          style="color: #000000; fill: #ea232f; stroke-linecap: round; stroke-linejoin: round"
          d="m 749,303.01367 c -0.0767,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 748 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.651,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
        <path
          :class="{ anmLine: g03State.isClosing !== g03State.isOpening }"
          :style="getRotate(g03State.isOpening, g03State.isClosing)"
          id="path57-1"
          class="stroked opacity-0"
          style="
            color: #000000;
            fill: #ea232f;
            stroke-linecap: round;
            stroke-linejoin: round;

            --delay: 1s;
          "
          d="m 749,303.01367 c -0.0767,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 748 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.651,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
        <path
          :class="{ anmLine: g03State.isClosing !== g03State.isOpening }"
          :style="getRotate(g03State.isOpening, g03State.isClosing)"
          id="path57-2"
          class="stroked opacity-0"
          style="
            color: #000000;
            fill: #ea232f;
            stroke-linecap: round;
            stroke-linejoin: round;

            --delay: 2s;
          "
          d="m 749,303.01367 c -0.0767,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 748 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.651,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
      </g>
      <g id="arrow_2" transform="translate(128,250)">
        <path
          :class="{ anmLine: g02State.isClosing !== g02State.isOpening }"
          :style="getRotate(g02State.isOpening, g02State.isClosing)"
          id="path63"
          class="stroked opacity-0"
          style="color: #000000; fill: #ea232f"
          d="m 480,299.01367 c -0.0768,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 479 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.651,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
        <path
          :class="{ anmLine: g02State.isClosing !== g02State.isOpening }"
          :style="getRotate(g02State.isOpening, g02State.isClosing)"
          id="path63-1"
          class="stroked opacity-0"
          style="color: #000000; fill: #ea232f; --delay: 1s"
          d="m 480,299.01367 c -0.0768,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 479 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.651,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
        <path
          :class="{ anmLine: g02State.isClosing !== g02State.isOpening }"
          :style="getRotate(g02State.isOpening, g02State.isClosing)"
          id="path63-2"
          class="stroked opacity-0"
          style="color: #000000; fill: #ea232f; --delay: 2s"
          d="m 480,299.01367 c -0.0768,0 -0.15363,0.034 -0.20312,0.10352 l -8.47657,11.86719 c -0.378,0.52899 3.9e-4,1.26562 0.65039,1.26562 H 479 v 23 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -23 h 7.0293 c 0.651,0 1.02839,-0.73663 0.65039,-1.26562 l -8.47657,-11.86719 c -0.0495,-0.0695 -0.12637,-0.10352 -0.20312,-0.10352 z"
        />
      </g>
    </g>
    <g style="font-size: 16px; fill: #000000; text-anchor: middle">
      <text v-if="gatesLength >= 1" x="354" y="350" xml:space="preserve">
        <tspan>開度 {{ g01State.openDegree }}㎝</tspan>
      </text>
      <text v-if="gatesLength >= 2" x="474" y="350" xml:space="preserve">
        <tspan>開度 {{ g02State.openDegree }}㎝</tspan>
      </text>
      <text v-if="gatesLength >= 3" x="594" y="350" xml:space="preserve">
        <tspan>開度 {{ g03State.openDegree }}㎝</tspan>
      </text>
    </g>
    <g :style="`transform: translateY(-${getWaterLine(waterLevel_f)}px)`">
      <text
        stroke="white"
        stroke-width="3"
        paint-order="stroke"
        xml:space="preserve"
        style="fill: #06b6d4; font-weight: bold"
      >
        <tspan x="0" y="320" style="font-size: 16px">即時水位 {{ waterLevel_f }} ㎝</tspan>
      </text>
      <line
        x1="0"
        x2="953"
        y1="325"
        y2="325"
        id="redline"
        stroke-width="4"
        stroke-dasharray="12, 12"
        stroke="#06b6d4"
      />
    </g>
    <g
      id="waterLevelNex"
      stroke-width="4"
      paint-order="stroke"
      transform="matrix(0.65,0,0,0.65,680,85)"
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
    <defs id="defs65">
      <linearGradient
        id="SVGID_121_"
        gradientUnits="userSpaceOnUse"
        x1="442.5556"
        y1="1122.407"
        x2="442.5556"
        y2="1156.4437"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop545" />

        <stop offset="1" style="stop-color: #666666" id="stop546" />
      </linearGradient>
      <linearGradient
        id="SVGID_122_"
        gradientUnits="userSpaceOnUse"
        x1="473.28781"
        y1="1129.7534"
        x2="492.63181"
        y2="1149.0974"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop547" />

        <stop offset="1" style="stop-color: #666666" id="stop548" />
      </linearGradient>
      <linearGradient
        id="SVGID_123_"
        gradientUnits="userSpaceOnUse"
        x1="478.47849"
        y1="1130.2927"
        x2="496.7438"
        y2="1148.558"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop549" />

        <stop offset="1" style="stop-color: #666666" id="stop550" />
      </linearGradient>
      <linearGradient
        id="SVGID_124_"
        gradientUnits="userSpaceOnUse"
        x1="483.0278"
        y1="1132.5162"
        x2="496.84589"
        y2="1146.3344"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop551" />

        <stop offset="1" style="stop-color: #666666" id="stop552" />
      </linearGradient>
      <linearGradient
        id="SVGID_125_"
        gradientUnits="userSpaceOnUse"
        x1="457.1525"
        y1="1158.2048"
        x2="475.45901"
        y2="1158.2048"
      >
        <stop offset="0" style="stop-color: #999999" id="stop555" />

        <stop offset="1" style="stop-color: #333333" id="stop556" />
      </linearGradient>
      <linearGradient
        id="SVGID_126_"
        gradientUnits="userSpaceOnUse"
        x1="491.48831"
        y1="1161.1794"
        x2="491.48831"
        y2="1163.7365"
      >
        <stop offset="0" style="stop-color: #666666" id="stop557" />

        <stop offset="1" style="stop-color: #333333" id="stop558" />
      </linearGradient>
      <linearGradient
        id="SVGID_127_"
        gradientUnits="userSpaceOnUse"
        x1="436.01859"
        y1="1139.4254"
        x2="450.92639"
        y2="1139.4254"
      >
        <stop offset="0" style="stop-color: #666666" id="stop561" />

        <stop offset="1" style="stop-color: #333333" id="stop562" />
      </linearGradient>
      <linearGradient
        id="SVGID_128_"
        gradientUnits="userSpaceOnUse"
        x1="500.94589"
        y1="1136.1309"
        x2="500.94589"
        y2="1142.7198"
      >
        <stop offset="0" style="stop-color: #ffffff" id="stop563" />

        <stop offset="1" style="stop-color: #000000" id="stop564" />
      </linearGradient>
      <linearGradient
        id="SVGID_129_"
        gradientUnits="userSpaceOnUse"
        x1="496.8038"
        y1="1134.2987"
        x2="496.8038"
        y2="1144.552"
      >
        <stop offset="0" style="stop-color: #666666" id="stop565" />
        <stop offset="1" style="stop-color: #333333" id="stop566" />
      </linearGradient>
      <linearGradient
        id="SVGID_130_"
        gradientUnits="userSpaceOnUse"
        x1="502.8175"
        y1="1140.3059"
        x2="526.37708"
        y2="1140.3059"
      >
        <stop offset="2.744065e-03" style="stop-color: #e6e6e6" id="stop567" />
        <stop offset="1" style="stop-color: #808080" id="stop568" />
      </linearGradient>
      <linearGradient
        id="SVGID_131_"
        gradientUnits="userSpaceOnUse"
        x1="504.33969"
        y1="1120.9567"
        x2="524.85492"
        y2="1120.9567"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop569" />
        <stop offset="1" style="stop-color: #666666" id="stop570" />
      </linearGradient>
      <linearGradient
        id="SVGID_132_"
        gradientUnits="userSpaceOnUse"
        x1="504.33969"
        y1="1159.6921"
        x2="524.85492"
        y2="1159.6921"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop571" />
        <stop offset="1" style="stop-color: #666666" id="stop572" />
      </linearGradient>
      <linearGradient
        id="SVGID_133_"
        gradientUnits="userSpaceOnUse"
        x1="309.88449"
        y1="1122.407"
        x2="309.88449"
        y2="1156.4437"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop594" />
        <stop offset="1" style="stop-color: #666666" id="stop595" />
      </linearGradient>
      <linearGradient
        id="SVGID_134_"
        gradientUnits="userSpaceOnUse"
        x1="340.6167"
        y1="1129.7534"
        x2="359.96078"
        y2="1149.0974"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop596" />
        <stop offset="1" style="stop-color: #666666" id="stop597" />
      </linearGradient>
      <linearGradient
        id="SVGID_135_"
        gradientUnits="userSpaceOnUse"
        x1="345.8075"
        y1="1130.2927"
        x2="364.07269"
        y2="1148.558"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop598" />
        <stop offset="1" style="stop-color: #666666" id="stop599" />
      </linearGradient>
      <linearGradient
        id="SVGID_136_"
        gradientUnits="userSpaceOnUse"
        x1="350.35681"
        y1="1132.5162"
        x2="364.1749"
        y2="1146.3344"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop600" />
        <stop offset="1" style="stop-color: #666666" id="stop601" />
      </linearGradient>
      <linearGradient
        id="SVGID_137_"
        gradientUnits="userSpaceOnUse"
        x1="324.48141"
        y1="1158.2048"
        x2="342.78799"
        y2="1158.2048"
      >
        <stop offset="0" style="stop-color: #999999" id="stop604" />
        <stop offset="1" style="stop-color: #333333" id="stop605" />
      </linearGradient>
      <linearGradient
        id="SVGID_138_"
        gradientUnits="userSpaceOnUse"
        x1="358.81729"
        y1="1161.1794"
        x2="358.81729"
        y2="1163.7365"
      >
        <stop offset="0" style="stop-color: #666666" id="stop606" />
        <stop offset="1" style="stop-color: #333333" id="stop607" />
      </linearGradient>
      <linearGradient
        id="SVGID_139_"
        gradientUnits="userSpaceOnUse"
        x1="303.3475"
        y1="1139.4254"
        x2="318.25531"
        y2="1139.4254"
      >
        <stop offset="0" style="stop-color: #666666" id="stop610" />
        <stop offset="1" style="stop-color: #333333" id="stop611" />
      </linearGradient>
      <linearGradient
        id="SVGID_140_"
        gradientUnits="userSpaceOnUse"
        x1="368.27481"
        y1="1136.1309"
        x2="368.27481"
        y2="1142.7198"
      >
        <stop offset="0" style="stop-color: #ffffff" id="stop612" />
        <stop offset="1" style="stop-color: #000000" id="stop613" />
      </linearGradient>
      <linearGradient
        id="SVGID_141_"
        gradientUnits="userSpaceOnUse"
        x1="364.13269"
        y1="1134.2987"
        x2="364.13269"
        y2="1144.552"
      >
        <stop offset="0" style="stop-color: #666666" id="stop614" />
        <stop offset="1" style="stop-color: #333333" id="stop615" />
      </linearGradient>
      <linearGradient
        id="SVGID_142_"
        gradientUnits="userSpaceOnUse"
        x1="370.14639"
        y1="1140.3059"
        x2="393.70609"
        y2="1140.3059"
      >
        <stop offset="2.744065e-03" style="stop-color: #e6e6e6" id="stop616" />
        <stop offset="1" style="stop-color: #808080" id="stop617" />
      </linearGradient>
      <linearGradient
        id="SVGID_143_"
        gradientUnits="userSpaceOnUse"
        x1="371.66861"
        y1="1120.9567"
        x2="392.18381"
        y2="1120.9567"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop618" />
        <stop offset="1" style="stop-color: #666666" id="stop619" />
      </linearGradient>
      <linearGradient
        id="SVGID_144_"
        gradientUnits="userSpaceOnUse"
        x1="371.66861"
        y1="1159.6921"
        x2="392.18381"
        y2="1159.6921"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop620" />
        <stop offset="1" style="stop-color: #666666" id="stop621" />
      </linearGradient>
      <linearGradient
        id="SVGID_145_"
        gradientUnits="userSpaceOnUse"
        x1="177.2205"
        y1="1122.407"
        x2="177.2205"
        y2="1156.4437"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop643" />
        <stop offset="1" style="stop-color: #666666" id="stop644" />
      </linearGradient>
      <linearGradient
        id="SVGID_146_"
        gradientUnits="userSpaceOnUse"
        x1="207.9527"
        y1="1129.7534"
        x2="227.2968"
        y2="1149.0974"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop645" />
        <stop offset="1" style="stop-color: #666666" id="stop646" />
      </linearGradient>
      <linearGradient
        id="SVGID_147_"
        gradientUnits="userSpaceOnUse"
        x1="213.14349"
        y1="1130.2927"
        x2="231.40871"
        y2="1148.558"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop647" />
        <stop offset="1" style="stop-color: #666666" id="stop648" />
      </linearGradient>
      <linearGradient
        id="SVGID_148_"
        gradientUnits="userSpaceOnUse"
        x1="217.69279"
        y1="1132.5162"
        x2="231.51089"
        y2="1146.3344"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop649" />
        <stop offset="1" style="stop-color: #666666" id="stop650" />
      </linearGradient>
      <linearGradient
        id="SVGID_149_"
        gradientUnits="userSpaceOnUse"
        x1="191.8174"
        y1="1158.2048"
        x2="210.12399"
        y2="1158.2048"
      >
        <stop offset="0" style="stop-color: #999999" id="stop653" />
        <stop offset="1" style="stop-color: #333333" id="stop654" />
      </linearGradient>
      <linearGradient
        id="SVGID_150_"
        gradientUnits="userSpaceOnUse"
        x1="226.15331"
        y1="1161.1794"
        x2="226.15331"
        y2="1163.7365"
      >
        <stop offset="0" style="stop-color: #666666" id="stop655" />
        <stop offset="1" style="stop-color: #333333" id="stop656" />
      </linearGradient>
      <linearGradient
        id="SVGID_151_"
        gradientUnits="userSpaceOnUse"
        x1="170.6835"
        y1="1139.4254"
        x2="185.5914"
        y2="1139.4254"
      >
        <stop offset="0" style="stop-color: #666666" id="stop659" />
        <stop offset="1" style="stop-color: #333333" id="stop660" />
      </linearGradient>
      <linearGradient
        id="SVGID_152_"
        gradientUnits="userSpaceOnUse"
        x1="235.61079"
        y1="1136.1309"
        x2="235.61079"
        y2="1142.7198"
      >
        <stop offset="0" style="stop-color: #ffffff" id="stop661" />
        <stop offset="1" style="stop-color: #000000" id="stop662" />
      </linearGradient>
      <linearGradient
        id="SVGID_153_"
        gradientUnits="userSpaceOnUse"
        x1="231.4687"
        y1="1134.2987"
        x2="231.4687"
        y2="1144.552"
      >
        <stop offset="0" style="stop-color: #666666" id="stop663" />
        <stop offset="1" style="stop-color: #333333" id="stop664" />
      </linearGradient>
      <linearGradient
        id="SVGID_154_"
        gradientUnits="userSpaceOnUse"
        x1="237.48241"
        y1="1140.3059"
        x2="261.04211"
        y2="1140.3059"
      >
        <stop offset="2.744065e-03" style="stop-color: #e6e6e6" id="stop665" />
        <stop offset="1" style="stop-color: #808080" id="stop666" />
      </linearGradient>
      <linearGradient
        id="SVGID_155_"
        gradientUnits="userSpaceOnUse"
        x1="239.00459"
        y1="1120.9567"
        x2="259.51981"
        y2="1120.9567"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop667" />
        <stop offset="1" style="stop-color: #666666" id="stop668" />
      </linearGradient>
      <linearGradient
        id="SVGID_156_"
        gradientUnits="userSpaceOnUse"
        x1="239.00459"
        y1="1159.6921"
        x2="259.51981"
        y2="1159.6921"
      >
        <stop offset="0" style="stop-color: #b3b3b3" id="stop669" />
        <stop offset="1" style="stop-color: #666666" id="stop670" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';

const data = inject($gate);

/** 取得可用的水門數量 */
const gatesLength = computed<number>(() => {
  return (data?.value?.Gate.DamSections || []).length;
});

/** 閘門開度百分比 */
const getOpenPersent = (v?: number | string | boolean) => {
  if (!v || typeof v === 'boolean') return 0;
  const MAXIUM = 192;
  const n = Number(v) >= MAXIUM ? MAXIUM : Number(v);
  return (((n || 0) / MAXIUM) * 200).toFixed();
};
/** 調整水位值 */
const getWaterLine = (v?: number | string | boolean) => {
  if (!v || typeof v === 'boolean') return 0;
  const MAXIUM = 265;
  const n = Number(v) >= MAXIUM ? MAXIUM : Number(v);
  return (((n || 0) / MAXIUM) * 240).toFixed();
};

const waterLevel = computed(() => {
  try {
    return data?.value?.Sections.find((o) => o.SectionType === 3)?.PLCs.find((o) => o.Tag === '251')
      ?.Value as number;
  } catch (error) {
    return 0;
  }
});

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

/** 顯示水位，這邊要注意的是，高度是由上往下成長，因此這邊會用反向的方式取得值 */
function showWaterLevel(n: number, HEIGHT = 375) {
  /** 畫面上圖片的高度 */
  /** 水位的最高值 */
  const MAXIUM = 260;
  /** 當兩個水位值都為0 需要回傳 0 以迴避 NAN */
  const result = parseFloat(((n / MAXIUM) * HEIGHT).toFixed()) || 0;

  if (result < 10) return HEIGHT;
  else if (result > HEIGHT) return 0;
  return HEIGHT - result;
}

const waterLevel_f = computed(() => {
  const v = waterLevel.value;
  if (typeof v !== 'number') return '-';
  return v;
});

const showGate = (gateNumber: number) => {
  const gate = data?.value?.Gate.DamSections.find((o) => o.DamSectionType === gateNumber);
  const gateName = gate?.Name;
  const PLCS = gate?.PLCs;

  return {
    gateName,
    isGateError: get('153') || get('178'),
    isMotorError: get('165'),
    isOpened: get('215'),
    isClosed: get('216'),
    isOpening: get('217'),
    isClosing: get('218'),
    isMotorOn: get('201'),
    openDegree: get('259') || 0,
    gatePercent: getOpenPersent(get('259') || 0)
  };

  function get(tag: string) {
    return (PLCS || []).find((v) => v.Tag === `${tag}-${gateNumber}`)?.Value;
  }
};

const g01State = computed(() => showGate(1));

const g02State = computed(() => showGate(2));

const g03State = computed(() => showGate(3));

type typeValue = string | number | boolean | undefined;
const getRotate = (up: typeValue, down: typeValue) => {
  if (!up && down) return '--rotate: 180deg';
  return '';
};
</script>

<style lang="scss" scoped>
.dynamic-color-error {
  stroke-width: 3;
}

.anmLine {
  opacity: 0;
  stroke-dasharray: 30;
  stroke-dashoffset: 0;
  animation: dash 3s linear infinite;
  animation-delay: var(--delay, 0);
}

.stroked {
  transform-box: fill-box;
  transform-origin: center;
  filter: drop-shadow(2px 0 0 antiquewhite) drop-shadow(-2px 0 0 antiquewhite)
    drop-shadow(0 2px 0 antiquewhite) drop-shadow(0 -2px 0 antiquewhite);
}

@keyframes dash {
  0% {
    opacity: 0;
    transform: rotate(var(--rotate, 0deg)) translateY(200%);
  }
  20% {
    opacity: 1;
    transform: rotate(var(--rotate, 0deg)) translateY(100%);
  }
  80% {
    opacity: 1;
    transform: rotate(var(--rotate, 0deg)) translateY(-100%);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--rotate, 0deg)) translateY(-200%);
  }
}
</style>
