<template>
  <div class="w-48 border-b-[3px] border-gray-500" style="height: 350px; container-type: size">
    <!-- 設備 -->
    <div class="relative flex h-full flex-col">
      <motor
        :status="motorStatus"
        class="absolute left-[2px] top-[1px] z-[1] w-3/5 -translate-y-full"
      />
      <!-- <div
        class="absolute top-[1px] -translate-y-full -right-0 w-full text-right"
        style="container-type: inline-size"
      >
        <strong class="text-[7cqw] px-1">牆高 +270</strong>
      </div> -->
      <!-- 水位 -->
      <div
        class="bg-water absolute bottom-0 left-[10px] right-[10px] border-t-2 border-sky-200"
        style="width: calc(100% - 20px); container-type: inline-size"
        :style="{ height: `calc(${currentWaterLevelHeight} - 2px)` }"
      ></div>
      <!-- 閘門 -->
      <div
        class="bg-gate absolute left-1/2 -translate-x-1/2"
        style="width: calc(100% - 20px)"
        :style="{ '--height': currentGateHeight, '--bottom': gateDeg }"
      ></div>
      <!-- 門高 -->
      <!-- <strong
        class="absolute left-[10px] text-white rounded px-1 drop-shadow"
        :style="{ bottom: `calc(${gateDeg} + ${currentGateHeight} - 21px)` }"
      >
        {{ gateHeight }}㎝
      </strong> -->
      <!-- 門牌 -->
      <strong
        class="absolute left-1/2 -translate-x-1/2 text-nowrap rounded border-2 border-zinc-700 bg-zinc-600 px-4 text-white shadow-sm"
        :style="{ bottom: `calc(${gateDeg} + ${currentGateHeight} - 70px)` }"
      >
        <template v-if="gateName">{{ gateName }}</template>
        <template v-else> {{ index }} 號門 </template>
      </strong>
      <!-- 燈光 -->
      <light
        class="absolute left-1/2 w-[40px] -translate-x-1/2 drop-shadow-sm"
        :status="gateStatus"
        :style="{ bottom: `calc(${gateDeg} + ${currentGateHeight} - 40px)` }"
      ></light>
      <!-- 上半部區塊 -->
      <div class="relative z-[1]">
        <div
          class="flex aspect-[4/1] items-center justify-center bg-[#b3b3b3]"
          style="container-type: size"
        >
          <strong v-if="statusName" class="my-status text-[13cqw]">
            {{ statusName }}
          </strong>
        </div>
        <div class="h-1.5 w-full bg-[#cccccc]"></div>
        <div class="h-1 w-full bg-[#999999]"></div>

        <!-- 箭頭 -->
        <img
          v-if="gateStatus === 'working' && ['opening', 'closing'].includes(direction || '')"
          :class="{ 'rotate-180': direction === 'closing' }"
          src="../assets/arrow.svg"
          alt="direction"
          class="absolute bottom-0 left-1/2 z-[2] w-8 -translate-x-1/2 translate-y-full"
        />
      </div>

      <!-- 左右圍牆 -->
      <div class="flex-1 border-x-[10px] border-[#b3b3b3]"></div>

      <!-- 開度 -->
      <div
        class="absolute -bottom-1.5 w-full -translate-y-full text-center"
        style="container-type: size"
      >
        <span class="rounded border-2 border-gray-400 bg-white px-2 text-[9cqw] shadow">
          開度
          <b class="text-red-600">{{ deg ?? '-' }}㎝</b>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * 水門
 * 底部因為和量筒對齊，所以有 3px
 * 高度 ** 不包含馬達 ** 因此滿水位 300cm 不會淹到馬達
 * 接受開度、狀態名稱、目前水位、馬達狀態
 */
import { computed } from 'vue';
import motor from '../assets/motorGate.vue';
import light from './light.vue';

const props = defineProps<{
  /** 開度 */
  deg?: number | string;
  /** 狀態名稱 */
  statusName?: '全關' | '全開' | string;
  /** 目前水位 */
  waterLevel?: number;
  /** 馬達狀態 */
  motorStatus?: 'error' | 'working' | 'online' | 'offline';
  /** 閘門狀態 */
  gateStatus?: 'error' | 'working' | 'online' | 'offline';
  direction?: 'opening' | 'closing';
  /** 滿水位 */
  maxium: number;
  /** 閘門高度 */
  gateHeight?: number | null;
  /** 閘門編號 */
  index?: string;
  /** 水門拆分時似乎有流域問題，因此用 gateName 取代 index */
  gateName?: string;
}>();
/**
 *
 * @param v 高度比例值
 * @param heightFix 水門全開的高度修正值
 */
const showHeight = (v: number, heightFix?: number) => {
  return (v / props.maxium) * 100 - (heightFix || 0) + '%';
};

const currentWaterLevelHeight = computed(() => showHeight(props.waterLevel ?? 0));
/** 顯示開度 */
const gateDeg = computed(() => {
  const MAXIUM = props.maxium - (props.gateHeight ?? 120);
  let n = Number(props.deg || 0);
  /** 有些水門全開時，高度已超越顯示太多，僅能任其顯示 */
  if (props.statusName === '全開') return showHeight(MAXIUM > n ? MAXIUM : n, 16);
  if (props.statusName === '全關') n = 0;
  return showHeight(n ?? 0);
});

const currentGateHeight = computed(() => showHeight(props.gateHeight ?? 120));
</script>

<style src="../assets/style.css"></style>

<style lang="scss" scoped>
/** 棒子 */
.bg-gate {
  &::before,
  &::after {
    content: '';
    bottom: calc(100% + 12px);
    @apply absolute left-1/2 block -translate-x-1/2 bg-[#62696a];
  }
  &::before {
    @apply h-[280px] w-3;
  }
  &::after {
    @apply h-[6px] w-6 rounded-t-sm border-y border-b-[#535859] border-t-[#80898a];
  }
}

.bg-gate {
  @apply border-x-2 border-b-4 border-t-[12px] border-[#6E7778] border-b-[#62696a] bg-[#9DA8AE];
  height: var(--height);
  bottom: var(--bottom);
  --grid-line-color: #6e7778;

  background-image: linear-gradient(
      0deg,
      transparent,
      transparent calc(25% - 3px),
      var(--grid-line-color) 0,
      var(--grid-line-color) calc(25% + 3px),
      transparent 0
    ),
    linear-gradient(
      0deg,
      transparent,
      transparent calc(25% - 5px),
      #62696aff 0,
      #62696aff calc(25% + 3px),
      transparent 0
    ),
    linear-gradient(
      90deg,
      transparent,
      transparent calc(25% - 2px),
      var(--grid-line-color) 0,
      var(--grid-line-color) calc(25% + 2px),
      transparent 0
    ),
    linear-gradient(
      0deg,
      transparent,
      transparent calc(25% - 3px),
      #bfcad055 0,
      #bfcad055 calc(25% + 5px),
      transparent 0
    ),
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAwsAAAMLCAMAAAA2ePuIAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAALrUExURXd3d15yfWB0gF1yfGN3g2R5hGmAi2yDjmyEkGuEkGyDkWh+i2mBjWZ8h2R6hV50fl1zf1xyfV91f2R6hmqBjWR5hWR4g2+FkGp/imqDj2Z/iXCIlmiCj2Z9i2Z+imF4hF92gldsd1hueFluelxxfV91gWd9iWJ4hGF2gmh/imN4hXCJkm2GkGN5h192gVxyflhveF1zfV93g1txfGV9iGd+imN4g2R4hGB1gGF3gmR5g2mBi2qAjGh/i2N8iGF1gFxue2R5hmB1glhsd1hteFpwe2R6h1tueV9zfl5zfWF2gWV7hWqAi2R7hWJ6hV91gGF4g1hveVhuelVsd1Jpc1RrdFJocmh8h2B2gVlueVxwe2J4g1lue1lvelhueVRqdFFncVBmcVJoc1hwe2V5hWJ2gWJ2g11xemF1gmV7hmF4hWF3g1xyf1dtd190gVtyfFlwelRrdVNpc1pvel52glxxfmF0gGh7h15zfGR8iGB5hFdueFRodF5zf110f2J5g2Z9iVxyfGB2gml/iml+iWeAi2yEj2F3hFx0f11zfl50f193gWJ3g2l/i2l9inGHkW+EkWh9imB3gmB3gWB3g1txfVpwemV8h151gF52f1xzfWd8iGd/imZ6hl90f1pxfGZ7h11yflZrd1xzf2h+imuCj2N7hmN6g1xzfmV4g11yfWB4g1x0flZueFhve2R5iF90gF52gWN5hGuAj3GHk2N6hGN4hGR7h150gFxweltwe1Roc1VsdV93gmR8h2Z+iVx0gF51f19zf2J3gVtzfVlve2mAjVtyfmJ4gm2FkVlveVdseFpve11zgFpxe2J3hGZ7hldteFdvelxxe2uCjldtdV1xe1VrdmB4gVVsdmh+iWZ5hWh9iWF2g191gl90fmd9imyCjmN5hWJ3gmB2gGt+iHWMl151gVxye2l+il1zfGV5hmN5g2V6h2J5hWZ6hG+Ej2h+iGZ6hWB1gXKIknSIlWF3gWd/if///8VoJUwAAAD4dFJOU4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKGsOVIgAAAAFiS0dE+DtjZ2YAAAAHdElNRQfoBhwGCSk0sXFfAAAPBklEQVR42u3dZ/uQZRnAYRNSCwlByrQhpvnHLNA0k5YjKUUFIi1GZjnKkZIj0gaIoibOnDhyQEPFirDhKmxPbThK26WmNjWrtx1Hn+D3wlc95+8D3MdxP8913m+v9daT9L+e0Vq/Nao1uvXM1gatDVsbtZ7VenZrTGvj2NjWc1rjWpu0xrcmtDZtTSyxwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAwiAsxMOe23pea7PW81ubt7ZovaD1wtaLWi9ubRmb1Nqq9ZLW1q1tWi9tbdtKryALLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgssDMLCSCtamNyKp23Xellr+9bLW3HT8itaU1pTYzu0dmy9shVXgO/UijfdufWqEgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCywMwkIcy11ar27t2prWek3rta3XtV7fmth6Q2u32O6t+Bv2aO3ZemNrr9b01ptKLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssDAIC29u7d3apzWjtW9rv9b+rbGtma1ZrbjfeXYsDtJbWnNab20d0Dqw9bbWuBILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgssDMLC21txLOe25rXmt8a3JrcWtOJN4/7hd7TiabWDWu9sHdx6V+vdrUNah5ZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhgYRAWDmsd3npPKw75e1tHtI5sHdU6uvW+1jGtY2MLW+9vxW3RW7WOax3fOqF1YokFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWBmHhA61FrbhDef/WB1uTWlH9Sa1o4eTWSOtDsTi9H259pPXRVtwWPaq1uLWkxAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAguDsDCzdUpraevUViRzWmtZ6/TWGa1NW2e2PhY762ltfGt5a0HroNbZrfSCsMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLAwIAvntM5tndc6v3VBa7/Wx1sXti5qXdy6pHVp7LJWfJJWtA5tXd66orVJ68oSCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLAzCwlWtMa1PtBa1RrcWt65uXdO6tnVda4fWMbFIa05rZWtVK05vXCo90vpkiQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRYGYeFTrU+3PtO6vnVka1prp9YNrRtbq1s3tUbFPtv6XOvzrTWt+MB9obW2tUGJBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFgZh4ebWF1tfan25taL1ldYtrVtbt7Vub53QuiMWJ2RWa1wr3mFe66utk1pfK7HAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMDCICxc0FrXmt26szW+9fXWN1qntr7Z+lbr2624LXr1d1rLW99tLWxNb61qfa/1/RILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgssDMLClNYPWj9s/ai1TSsuFp7RWtI6u3VXK65Qjk/N7LtbUeDK1oTWj1vx5fpJ67ISCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLAzCwvzWT1s/a93TihZOa93bWtu6r3V/66xWlHVX3Hj981Zcsx1b04q7pxe1flFigQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBhUFYeKAVL/pgK97gsNYvW79qTW5FMstav279Jja1NbE1txVHJA557LetkRILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgssDMLC71q/b/2hFXf8/rH1UOu21tjWw61HWn9qLY6NaU1vPdpa2nqs9XhrWuvPJRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlgYhIV1rThvf2mt31rROrr111a0cFXrb62/t/4Re6K1Y2tGa0krTlJc3Bz/fQLDAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACCyywwAILLLDAAgsssMACC4Ow8GTryqe1Ua1LW8tb/2xFzmtbcdPyU61/xeIXmdyKFq5vLWyNtP7d+k+JBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggQUWWGCBBRZYYIEFFlhggYX/Pwv/BddPpaqTSiTMAAAAAElFTkSuQmCC');
  background-size:
    calc(25% - 0.5px) calc(25% - 1px),
    calc(25% - 0.5px) calc(25% - 1px),
    calc(25% - 0.5px) calc(25% - 1px),
    calc(25% - 0.5px) calc(25% - 1px),
    40%;
  /** 網格寬度為 1/4 取 1/4 = 1/16 再加上 2px 的邊寬 */
  // background-position: calc(6.25% + 2px) center;
  background-position: calc(-6.25% - 1.5px) calc(6.25% + 3px);
}
</style>
