<template>
  <div
    class="cust_border relative flex items-baseline gap-1 rounded-md bg-white px-2 py-1 pl-5 shadow sm:block md:flex 2xl:min-w-60"
  >
    <span class="grow whitespace-nowrap">{{ title }}</span>
    <div>
      <span class="pr-1 text-right font-extrabold">
        {{ value ?? '-' }}
      </span>
      <span class="w-12">{{ unit }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
type typeValue = string | number | boolean | undefined;

interface Props {
  title: string;
  value: typeValue;
  unit: string | '㎏/㎠' | '㎝';
}

defineProps<Props>();
</script>

<style lang="scss">
.cust_border::before {
  @apply absolute bottom-0 left-0 top-0 block h-full w-2 rounded-l-md bg-[var(--bg-color)] content-[''];
}
</style>
