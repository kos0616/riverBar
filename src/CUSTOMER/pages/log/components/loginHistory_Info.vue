<template>
  <el-dialog
    :model-value="modelValue"
    @close="$emit('close')"
    :append-to-body="true"
    title="系統歷程"
    width="500"
  >
    <el-form :model="data" label-width="120" label-position="left" class="my-form">
      <el-form-item label="帳號(姓名)">
        {{ data?.UserName }}
      </el-form-item>
      <el-form-item label="登入時間">
        {{ data?.LoginTime_f }}
      </el-form-item>
      <el-form-item label="IP">
        {{ data?.IpAddress }}
      </el-form-item>
      <el-form-item label="系統"> {{ data?.OS }} </el-form-item>
      <el-form-item label="裝置">
        {{ data?.Device }}
      </el-form-item>
      <el-form-item label="瀏覽器">
        {{ data?.Browser }}
      </el-form-item>
      <el-form-item label="使用者代理">
        {{ data?.UserAgent }}
      </el-form-item>

      <el-form-item label="登入狀態">
        <el-tag v-if="data?.Succeeded" type="success">
          <i class="fas fa-fw fa-check"></i>
          成功
        </el-tag>
        <el-tag v-else-if="data?.Succeeded === false" type="danger">
          <i class="fas fa-fw fa-times"></i>
          失敗
        </el-tag>
        <el-tag v-else-if="data?.Succeeded !== undefined" type="info">
          <i class="fas fa-fw fa-triangle-exclamation"></i>
          錯誤
        </el-tag>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import Lists from '../Service/LoginHistory';

type response = Awaited<ReturnType<typeof Lists>>;
type item = response[number];

interface Prop {
  modelValue: boolean;
  data?: item;
}
defineProps<Prop>();
</script>
