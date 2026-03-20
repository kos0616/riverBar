<template>
  <label class="relative inline-flex cursor-pointer items-center fill-current">
    <input
      v-model="theme"
      type="checkbox"
      class="peer sr-only"
      :true-value="'light'"
      :false-value="'dark'"
    />
    <!-- <div
      class="peer-focus:ring-gary-300 peer me-2 h-6 w-11 rounded-full bg-gray-500 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-gray-200/25"
    ></div> -->
    <i v-if="theme === 'light'" class="fa-solid fa-sun"></i>
    <i v-else class="fa-solid fa-moon"></i>
    <span class="ml-1 font-medium capitalize">
      {{ theme }}
    </span>
  </label>
</template>

<script lang="ts" setup>
import useSwitchDarkmode from '../../API/useSwitchDarkmode';
const { theme } = useSwitchDarkmode();
</script>
