<template>
  <el-dialog
    v-model="dialog"
    title="異常通知"
    :width="isUltraWarning ? 400 : 280"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <h2 v-if="isUltraWarning" class="mb-5 text-lg">
      <p>
        <b>{{ name }}</b> 現地端 圖控異常
      </p>
      <p>可能原因為：</p>
    </h2>

    <ul class="mb-3 text-xl">
      <li v-for="(alert, i) in warnings" :key="`alert_${i}`" class="flex items-center gap-1">
        <i class="bg-customer-red inline-block h-4 w-4 rounded-full border border-gray-400"></i>
        {{ alert.Name }}
      </li>
    </ul>

    <div v-if="isUltraWarning" class="mt-5">
      <p class="text-xl">請聯繫維護廠商</p>
      <div class="mt-10 text-center">
        <el-button @click="handleUltraWarningClose" class="w-1/2 max-w-[150px]" title="確認">
          <i class="fas fa-times fa-fw"></i>
          確認
        </el-button>
      </div>
    </div>

    <div v-else class="text-center">
      <el-button @click="dialog = false" class="w-1/2 max-w-[150px]" title="確認">
        <i class="fas fa-times fa-fw"></i>
        確認
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import { watch } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const data = inject($gate);

const router = useRouter();

const handleUltraWarningClose = () => {
  dialog.value = false;
  router.replace({ query: { onerror: 'true' } });
};

/** 大型異常 167:停電 168:網路斷線 */
const isUltraWarning = computed(() => {
  return warnings.value.some((o) => ['167', '168'].includes(o.Tag));
});

const name = computed(() => data?.value?.Name);

const warnings = computed(() => {
  try {
    const arr = (data?.value?.Sections || []).find((s) => s.SectionType === 5)?.PLCs;
    return (arr || [])
      .filter((o) => {
        /** 防盜系統警示條件 */
        if (o.Tag === '179') return o.Value !== true;
        /** 網路斷線使用 Status 作為判斷基準 */
        if (o.Tag === '168') return o.Status !== true;
        return o.Value === true;
      })
      .map((o) => {
        return { ...o, Name: o.Tag === '179' ? '防盜警報解除' : o.Name };
      });
  } catch (error) {
    return [];
  }
});

const dialog = ref(false);

/** 僅初始化一次 */
const inited = ref(true);

watch(warnings, (arr) => {
  if (inited.value && arr.length > 0) {
    dialog.value = true;
    inited.value = false;
  }
});
</script>
