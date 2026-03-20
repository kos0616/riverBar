<template>
  <div>
    <div class="mb-2 grid grid-cols-2 pt-1">
      <div v-for="(item, i) in remote" :key="`remote${i}`" class="flex items-center space-x-2 px-1">
        <div class="h-4 w-4 rounded-full border border-gray-400" :class="item.class"></div>
        <p class="mb-0 text-gray-800">
          <span class="cursor-default">{{ item.name }}</span>
        </p>
      </div>
    </div>
    <div v-if="$WRUD('w')" v-loading="loading" class="grid grid-cols-2 gap-2 text-xl text-white">
      <button
        @click="auto_inflatable"
        :class="{ 'fa-fade': isAutoUp }"
        class="rounded-lg border-0 bg-[#E5696D] py-1"
      >
        <i class="fa-solid fa-fw fa-arrows-up-to-line"></i>
        自動充氣
      </button>
      <button
        @click="prostrate"
        :class="{ 'fa-fade': isAutoDown }"
        class="rounded-lg border-0 bg-[#9095A0] py-1"
      >
        <i class="fa-solid fa-fw fa-arrows-down-to-line"></i>
        自動倒伏
      </button>
    </div>
    <devices :model-value="data"></devices>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus';
import { ref } from 'vue';
import { computed, inject } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import { useRoute } from 'vue-router';
import sendControlSwitch from '@/CUSTOMER/Service/sendControlSwitch';
import { emitter } from '@/CUSTOMER/plugins/bus';
import devices from '@/CUSTOMER/pages/gate/components/graphics/dam_rubber/devices/index.vue';
import showAlert from '../../../lib/showAlertCss';

const data = inject($gate);
const route = useRoute();

const isAutoUp = computed(() => getDamSection('453'));

const isAutoDown = computed(() => getDamSection('454'));
const loading = ref(false);

const remote = computed(() => {
  const Site = getDamSection('205');
  const Remote = getDamSection('204');

  return [
    {
      name: '現場操作',
      class: showAlert(Site)
    },
    {
      name: '遠端操作',
      class: showAlert(Remote)
    }
  ];
});

/** 自動充氣 */
const auto_inflatable = async () => {
  const code = route.params.id as string;
  const openTags = '453';
  const allTags = ['453', '454'];

  try {
    // 及時壓力
    const value = data?.value?.Sections.find((d) => d.SectionType === 3)?.PLCs.find(
      (d) => d.Tag === '252'
    )?.Value;
    const v = Number(value);
    let msg = `請確認操作——自動充氣`;
    if (v >= 0.19) msg = `目前警戒壓力為 ${v}，請確認操作——自動充氣`;

    await ElMessageBox.confirm(msg, {
      type: 'info',
      center: true,
      showClose: false
    });
    loading.value = true;
    await sendControlSwitch({ code, openTags, allTags, isRubber: true });
    ElMessage.success('操作成功');
    emitter.emit('refreshIws');
  } catch (e) {
    if ((e as string) === 'cancel') {
      return;
    } else if (typeof e === 'string') {
      ElMessage.warning('操作失敗: ' + e);
    }
  } finally {
    loading.value = false;
  }
};
/** 自動倒伏 */
const prostrate = async () => {
  const code = route.params.id as string;
  const openTags = '454';
  const allTags = ['453', '454'];

  try {
    await ElMessageBox.confirm('請確認操作——自動倒伏', {
      type: 'info',
      center: true,
      showClose: false
    });

    loading.value = true;
    await sendControlSwitch({ code, openTags, allTags, isRubber: true });
    ElMessage.success('操作成功');
    emitter.emit('refreshIws');
  } catch (e) {
    if ((e as string) === 'cancel') {
      return;
    } else if (typeof e === 'string') {
      ElMessage.warning('操作失敗: ' + e);
    }
  } finally {
    loading.value = false;
  }
};

const getDamSection = (tag: string) => {
  try {
    return (data?.value?.Gate.DamSections || [])
      .map((o) => o.PLCs)
      .reduce((a, b) => [...a, ...b], [])
      .find((d) => {
        return d.Tag === tag;
      })?.Value as boolean;
  } catch (error) {
    return false;
  }
};
</script>
