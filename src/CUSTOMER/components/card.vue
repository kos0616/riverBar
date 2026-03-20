<template>
  <div class="card">
    <div class="card-header">
      <slot name="header">
        <small class="fa-stack">
          <i class="fa-solid fa-circle fa-inverse fa-stack-2x"></i>
          <i :class="icon" class="fa-stack-1x text-[var(--bg-color)]"></i>
        </small>
        <span class="text-[var(--text-color)]"> {{ title }}</span>
      </slot>
    </div>
    <div v-if="$slots.default" class="card-body">
      <slot></slot>
    </div>
    <slot name="body"></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: String,
  icon: String
});
</script>

<style lang="scss" scoped>
.card {
  @apply flex flex-col rounded-md bg-[var(--bg-color)] p-1 shadow-md 2xl:min-w-52;
  .card-header {
    @apply text-nowrap px-2 py-1 font-bold text-neutral-700;
  }
  .card-body {
    @apply grow rounded-b bg-white px-4 py-1;
  }
}
</style>
