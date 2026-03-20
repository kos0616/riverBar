<template>
  <el-dialog
    :model-value="modelValue"
    @close="$emit('close')"
    :append-to-body="true"
    width="500"
    title="操作記錄"
  >
    <el-form :model="data" label-position="left" label-width="120" class="my-form">
      <el-form-item label="帳號(姓名)"> {{ data?.UserName }}</el-form-item>
      <el-form-item label="操作時間"> {{ data?.Time_f }}</el-form-item>
      <el-form-item label="站點">
        {{ data?.LocationName }}
      </el-form-item>
      <el-form-item label="操作內容"> {{ data?.ActionDisplay }}</el-form-item>
      <el-form-item label="設定值"> {{ data?.TagAction_f }}</el-form-item>
      <el-form-item label="IP"> {{ data?.IPAddress }}</el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { formater } from '../Service/OperateHistory';

type item = ReturnType<typeof formater>;

interface Prop {
  modelValue: boolean;
  data?: item;
}
defineProps<Prop>();
</script>
