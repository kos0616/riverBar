<template>
  <section
    class="gate-decoraction relative w-14 border-b-[3px] border-gray-500"
    style="height: 350px; container-type: size"
  >
    <!-- 上半部區塊 -->
    <div class="relative">
      <div class="aspect-[1.17/1]"></div>
      <div class="gate-door h-1.5 w-3 bg-[#cccccc]"></div>
      <div class="gate-door h-1 w-2 bg-[#999999]"></div>
    </div>
  </section>
</template>

<!--
  水門的裝飾:
  用於在水門的左右兩側裝飾
  因為在水門的左右直接套用裝飾會讓裝飾的寬度超出水門的寬度
  所以需要在水門的左右各套用一個裝飾
  需要專用的 tag: section 與 class: gate-decoraction
-->

<style lang="scss" scoped>
.gate-decoraction {
  &::before {
    content: '';
    border-bottom: 100cqh solid #b3b3b3;
    @apply absolute bottom-0 block h-0 w-0;
  }

  &:last-of-type::before {
    border-right: 100cqw solid transparent;
    @apply right-0;
  }

  &:first-of-type::before {
    border-left: 100cqw solid transparent;
    @apply left-0;
  }

  // 上半部區塊
  &:first-of-type .gate-door {
    @apply ml-auto;
  }
}
</style>
