<template>
  <article>
    <h2>開發者模式</h2>
    <label>
      點位
      <input v-model="tag" type="text" />
    </label>
    <label>
      值
      <input v-model="value" type="text" />
    </label>
    <el-button
      @click="
        $bus.emit('updateSignalR', {
          LocationCode: 'S01P03',
          Tag: tag,
          value: value,
          tag: 'S03.S03P02.251',
          SiteCode: 'S01',
          upDateTime: '2021-09-01T00:00:00'
        })
      "
    >
      SignalR TEST
    </el-button>

    <table>
      <tbody>
        <tr v-for="(item, i) in allData" :key="`data${i}`" class="hover:bg-red-100">
          <td class="border px-2">{{ item?.Name }}</td>
          <td class="border px-2">{{ item?.Tag }}</td>
          <td class="border px-2">{{ item?.Value }}</td>
          <td class="border px-2">{{ fromNow(item?.UpdateTime) }}</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { $gate } from '@/CUSTOMER/provide';
import day from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
day.extend(relativeTime);

import _ from 'lodash';

const data = inject($gate);

const value = ref('12.5');
const tag = ref('251');

/** 使用 lodash 從複雜的 tree 找到指定 Value 並且取代其 Value */
const allData = computed(() => {
  if (!data?.value?.LocationCode) return;

  const arr = [...(data.value?.Sections || []), ...(data.value?.Gate.DamSections || [])];
  const flattened = _.flatMapDeep(arr, (value: any) =>
    _.isObject(value) && !_.isArray(value) ? _.values(value) : value
  );

  const flat = flattened;
  const gate = [] || data.value?.Gate.MapSection.PLCs || [];
  return [...gate, ...flat]
    .filter((o) => typeof o === 'object' && o !== null)
    .sort((a, b) => parseInt(a?.Tag || 0) - parseInt(b?.Tag || 0));
});

const fromNow = (time: string) => day(time).fromNow();
</script>
