<template>
  <div v-if="$screenWidth.value > 991" class="flex flex-col gap-2 lg:flex-row lg:gap-6">
    <div class="info-section overflow-clip xl:min-w-44">
      <strong class="text-nowrap">
        線上使用者
        <button type="button" title="查看紀錄" class="ml-1 hidden cursor-help text-sm xl:inline">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <div class="text-right">
        <strong class="text-[#0091d2] xl:text-2xl">
          {{ onlineUserCount ?? '-' }}
        </strong>
      </div>
      <span class="fa-stack absolute -bottom-[12%] -left-[6%] opacity-20 xl:text-[175%]">
        <i class="fa-solid fa-circle fa-stack-2x text-[#0091d2]"></i>
        <i class="fa-solid fa-users fa-stack-1x fa-inverse"></i>
      </span>
    </div>

    <div class="info-section overflow-clip xl:min-w-44">
      <strong class="text-nowrap">
        異常操作
        <button type="button" title="查看紀錄" class="ml-1 hidden cursor-help text-sm xl:inline">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <div class="text-right">
        <strong class="text-el-danger xl:text-2xl">
          {{ errorOperationCount ?? '-' }}
        </strong>
      </div>
      <span class="fa-stack absolute -bottom-[12%] -left-[6%] opacity-20 xl:text-[175%]">
        <i class="fa-solid fa-circle fa-stack-2x text-el-danger"></i>
        <i class="fa-solid fa-ban fa-stack-1x fa-inverse"></i>
      </span>
    </div>
  </div>
  <div v-else class="info-section w-full max-w-sm overflow-clip p-0">
    <div class="relative flex border-b-2 border-dashed p-3">
      <strong class="text-nowrap">
        線上使用者
        <button type="button" title="查看紀錄" class="ml-1 cursor-help text-sm">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <strong class="ml-auto text-el-primary">
        {{ onlineUserCount ?? '-' }}
      </strong>
      <span
        class="fa-stack absolute -left-0 top-1/2 -translate-x-[30%] -translate-y-1/2 opacity-20 xl:text-[150%]"
      >
        <i class="fa-solid fa-circle fa-stack-2x text-el-primary"></i>
        <i class="fa-solid fa-users fa-stack-1x fa-inverse"></i>
      </span>
    </div>

    <div class="relative flex p-3">
      <strong class="text-nowrap">
        異常操作
        <button type="button" title="查看紀錄" class="ml-1 cursor-help text-sm">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <strong class="ml-auto text-el-danger">
        {{ errorOperationCount ?? '-' }}
      </strong>
      <span
        class="fa-stack absolute -left-0 top-1/2 -translate-x-[30%] -translate-y-1/2 opacity-20 xl:text-[150%]"
      >
        <i class="fa-solid fa-circle fa-stack-2x text-el-danger"></i>
        <i class="fa-solid fa-ban fa-stack-1x fa-inverse"></i>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Prop {
  onlineUserCount?: number;
  errorOperationCount?: number;
}
defineProps<Prop>();
</script>
