<template>
  <div class="py-5 text-center">
    <h2 class="relative pb-2 text-2xl font-bold text-[#3A4651]">{{ $route.meta?.title }}</h2>
  </div>
</template>
<style lang="scss" scoped>
h2::before {
  content: '';
  @apply absolute bottom-0 left-1/2 block h-1 w-9 -translate-x-1/2 rounded bg-primary;
}
</style>
