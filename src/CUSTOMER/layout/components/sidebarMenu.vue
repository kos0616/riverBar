<template>
  <ul>
    <li v-for="(link, i) in modelValue" :key="`menu${i}`">
      <router-link :to="`/${link.route}`" class="menu-btn">
        <img :src="link.icon" :alt="`${link.name} icon`" />
        {{ link.name }}
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import generateRoutes from '@/CUSTOMER/lib/generateRoutes';

type typeLinks = ReturnType<typeof generateRoutes>;

interface Prop {
  modelValue: typeLinks;
}
withDefaults(defineProps<Prop>(), { modelValue: () => [] });
</script>

<style lang="scss" scoped src="./menu.scss"></style>
