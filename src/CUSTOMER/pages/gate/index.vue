<template>
  <div>
    <warning></warning>
    <error v-if="permissionError">
      權限錯誤
      <template #message>
        <p v-if="SiteName">您目前的權限: {{ SiteName }}</p>
        <p>您沒有此頁瀏覽的權限，請聯絡系統管理員。</p>
      </template>
    </error>
    <div v-else-if="!data && loading === true"></div>
    <type_1 v-else-if="GateType === 1 && data" />
    <type_2 v-else-if="GateType === 2 || (GateType === 4 && data)" />
    <type_3 v-else-if="GateType === 3 && data" />
    <type_5 v-else-if="GateType === 5 && data" />
    <error v-else></error>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, onUnmounted, computed, onMounted } from 'vue';
import type_1 from './type1/index.vue';
import type_2 from './type2/index.vue';
import type_3 from './type3/index.vue';
import type_5 from './type5/index.vue';
import Info, { type response } from './Service/Info';
import error from './components/error.vue';
import { $gate } from '@/CUSTOMER/provide';
import { useBreadcrumbStore } from '@/CUSTOMER/pinia/breadcrumbs';
import { useCounterAxios } from '@/CUSTOMER/pinia/axios';
import stations from '@/CUSTOMER/static/workStations.json';
import warning from './components/errorWarning.vue';
import { useUserInfoStore } from '@/CUSTOMER/pinia/userInfo';
import { emitter } from '@/CUSTOMER/plugins/bus';
import { setLocation } from '@/CUSTOMER/SignalR/index';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import _ from 'lodash';

const breadStore = useBreadcrumbStore();
const counterAxios = useCounterAxios();

const userInfoStore = useUserInfoStore();

/** 使用者被綁定的工作站 */
const SiteCode = computed(() => userInfoStore.userInfo.SiteCode);
const SiteName = computed(() => userInfoStore.SiteName);

const props = defineProps(['id']);

const loading = ref(true);

const GateType = ref<1 | 2 | 3 | 4 | 5 | null>(null);
const data = ref<response>();
provide($gate, data);

const setBread = (gate: typeGate) => {
  const SiteName = stations.find((o) => o.id === gate.SiteCode)?.Name || '';
  breadStore.breadcrumbs = [
    { label: SiteName, href: '/iws' },
    { label: gate.Name, href: `/iws/${gate.LocationCode}` }
  ].filter((o) => o.label);
};

const route = useRoute();

const permissionError = ref(false);

const permissionChk = () => {
  if (SiteCode.value === null || SiteCode.value === '') return true;
  return props.id.includes(SiteCode.value);
};

const getInfo = async () => {
  try {
    if (!props.id || props.id !== route.params.id) return;
    if (!permissionChk()) {
      permissionError.value = true;
      return;
    }
    loading.value = true;
    data.value = await Info(props.id);
    GateType.value = data.value.Gate.GateType;
    setBread(data.value);
    // 更新時間
    counterAxios.actions_axios_update();
  } finally {
    loading.value = false;
  }
};

/** 佔用/斷開現地端連線 */
const handleSetLocation = async (action: 'EnterLocation' | 'LeaveLocation', id?: string) => {
  if (!props.id || props.id !== route.params.id) return;
  const locationID = id || props.id;
  setLocation(locationID, action);
};

/** 使用 lodash 從複雜的 tree 找到指定 Value 並且取代其 Value */
const updateDataSignalR = (event: {
  LocationCode: string;
  Tag: string;
  value: number | string;
}) => {
  const { LocationCode, Tag, value } = event;
  if (data.value?.LocationCode !== LocationCode) return;
  counterAxios.actions_axios_update();
  const arr = [...(data.value?.Sections || []), ...(data.value?.Gate.DamSections || [])];

  const flattened = _.flatMapDeep(arr, (value: any) =>
    _.isObject(value) && !_.isArray(value) ? _.values(value) : value
  ).concat(data.value?.Gate.MapSection.PLCs || []);

  const targetObjects = _.filter(flattened, { Tag });
  targetObjects.forEach((obj) => {
    obj.Value = value;
    obj.UpdateTime = new Date();
  });
  return data;
};

onMounted(async () => {
  await getInfo();
  await handleSetLocation('EnterLocation');
  emitter.on('updateSignalR', async ({ LocationCode, Tag, value }) => {
    if (data.value) updateDataSignalR({ LocationCode, Tag, value });
  });

  emitter.on('refreshIws', async () => {
    await getInfo();
  });
});

onBeforeRouteUpdate(async (to, from) => {
  const oldId = from.params.id as string;
  const newId = to.params.id as string;

  await handleSetLocation('LeaveLocation', oldId);
  await handleSetLocation('EnterLocation', newId);
});

onBeforeRouteLeave(async (to, from) => {
  const id = from.params.id as string;
  await handleSetLocation('LeaveLocation', id);
});
onUnmounted(async () => {
  emitter.off('updateSignalR');
  emitter.off('refreshIws');
});
</script>
