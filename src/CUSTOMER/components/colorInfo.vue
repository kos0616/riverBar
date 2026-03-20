<template>
  <el-popover>
    <table class="w-full table-auto border-collapse bg-white">
      <caption class="text-lg">
        水位警示說明
      </caption>

      <tbody>
        <tr
          v-for="(config, i) in configs"
          :key="`config_${i}`"
          class="border-b even:bg-gray-50 hover:bg-slate-50"
        >
          <td class="py-1 text-center">
            <i class="fas fa-circle" :style="`color: ${config.color}`"></i>
          </td>
          <td class="py-1">{{ config.name }}</td>
        </tr>
      </tbody>
    </table>
    <template v-slot:reference>
      <el-button>
        <i class="fas fa-circle-question fa-fw"></i>
        說明
      </el-button>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
const configs = [
  {
    color: '#DE3B40FF',
    name: '一級警戒'
  },
  {
    color: '#FF7043',
    name: '二級警戒'
  },
  {
    color: '#8E24AA',
    name: '三級警戒'
  },
  {
    color: '#3498db',
    name: '正常水位'
  },
  {
    color: '#f39c12',
    name: '枯水警戒'
  }
];
</script>
