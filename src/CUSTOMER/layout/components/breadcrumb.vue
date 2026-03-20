<template>
  <el-breadcrumb>
    <el-breadcrumb-item v-for="(bread, i) in breadcrumbStore.breadcrumbs" :key="`bread${i}`">
      <el-dropdown v-if="hasOptions" trigger="click">
        <span>{{ bread.label }}<i class="fa-fw fa-solid fa-caret-down"></i></span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(sub, ii) in getOptions(bread, i)"
              @click="$router.push(sub.href as string)"
              :disabled="!sub.href"
              :key="`bread_${i}_${ii}`"
            >
              {{ sub.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <router-link v-else-if="bread.href" :to="bread.href">
        {{ bread.label }}
      </router-link>
      <span v-else>{{ bread.label }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { computed } from 'vue';
import { useBreadcrumbStore } from '../../pinia/breadcrumbs';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

// 麵包屑
type bread = { label: string; href?: string };

type typeOptions = Array<bread & { children?: bread[] }> | undefined;

const breadcrumbStore = useBreadcrumbStore();

// const breadcrumbs: bread[] = [{ label: '苗栗站' }, { label: '橡皮壩' }];

const options = ref<typeOptions>([
  // {
  //   label: '苗栗站',
  //   href: '/gate01',
  //   children: [
  //     { label: '橡皮壩', href: '/gate01' },
  //     { label: '水門', href: '/gate02' },
  //     { label: '倒伏堰', href: '/gate03' }
  //   ]
  // },
  // { label: '其他站', href: '' }
]);

const hasOptions = computed(() => Array.isArray(options.value) && options.value.length > 0);

const getOptions = (bread: bread, i: number) => {
  if (i === 0) return options.value;
  if (i === 1) {
    const v = options.value?.find((o) =>
      o.children?.find((c) => c.label === bread.label)
    )?.children;
    return v;
  }
};

const initBread = (bread: bread[], title: string) => {
  if (Array.isArray(bread) && bread.length) {
    breadcrumbStore.breadcrumbs = bread;
  } else if (title) {
    breadcrumbStore.breadcrumbs = [{ label: title }];
  } else {
    breadcrumbStore.breadcrumbs = [];
  }
};

const route = useRoute();

onMounted(() => {
  const { breadcrumb, title } = route.meta;
  initBread(breadcrumb, title);
});
onBeforeRouteUpdate((to) => {
  /** 連結變化時 清空 bread */
  const { breadcrumb, title } = to.meta;
  initBread(breadcrumb, title);
});
onUnmounted(() => {
  breadcrumbStore.breadcrumbs = [];
});
</script>
