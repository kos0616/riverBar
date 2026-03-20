<!-- 
  球狀水位計，接收一個 --fill 作為水球的顏色
-->
<template>
  <svg
    class="waves"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 24 100 28"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <path
        id="gentle-wave"
        d="M-160 44c40 0 68-8 108-8s 68 8 108 8 68-8 108-8 68 8 108 8 v100h-432z"
      />
    </defs>
    <g class="parallax">
      <use xlink:href="#gentle-wave" x="48" y="-11.5" class="wave-color" opacity="0.7" />
      <use xlink:href="#gentle-wave" x="48" y="-11" class="wave-color" opacity="0.5" />
      <use xlink:href="#gentle-wave" x="48" y="-10.5" class="wave-color" opacity="0.3" />
      <use xlink:href="#gentle-wave" x="48" y="-9" class="wave-color" />
    </g>
  </svg>
</template>

<style scoped>
.wave-color {
  fill: var(--fill, #00bfff);
}
.waves {
  width: 100%;
}
.parallax > use {
  animation: move-forever 1000s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 8s;
}
.parallax > use:nth-child(2) {
  animation-delay: -2.5s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -3s;
  animation-duration: 12s;
}
.parallax > use:nth-child(4) {
  animation-delay: -4s;
  animation-duration: 14s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-130px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>
