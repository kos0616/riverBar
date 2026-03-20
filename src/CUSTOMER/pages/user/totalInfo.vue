<template>
  <div v-if="$screenWidth.value > 991" class="flex flex-col gap-2 lg:flex-row lg:gap-6">
    <div class="info-section overflow-clip xl:min-w-44">
      <strong class="text-nowrap">
        活躍使用者 <small>(一週)</small>
        <button type="button" title="查看紀錄" class="ml-1 hidden cursor-help text-sm xl:inline">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <div class="text-right">
        <strong class="text-el-primary xl:text-2xl">
          {{ modelValue?.WeeklyActiveAccounts ?? '-' }}
        </strong>
      </div>
      <span class="fa-stack absolute -bottom-[12%] -left-[6%] opacity-20 xl:text-[175%]">
        <i class="fa-solid fa-circle fa-stack-2x text-el-primary"></i>
        <i class="fa-solid fa-users fa-stack-1x fa-inverse"></i>
      </span>
    </div>

    <div class="info-section overflow-clip xl:min-w-44">
      <strong class="text-nowrap">
        有效帳號
        <button type="button" title="查看紀錄" class="ml-1 hidden cursor-help text-sm xl:inline">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <div class="text-right">
        <strong class="text-el-success xl:text-2xl">
          {{ modelValue?.NonLockedOutAccounts ?? '-' }}
        </strong>
      </div>
      <span class="fa-stack absolute -bottom-[12%] -left-[6%] opacity-20 xl:text-[175%]">
        <i class="fa-solid fa-circle fa-stack-2x text-el-success"></i>
        <i class="fa-solid fa-check fa-stack-1x fa-inverse"></i>
      </span>
    </div>

    <div class="info-section overflow-clip xl:min-w-44">
      <strong class="text-nowrap">
        禁止名單
        <button type="button" title="查看紀錄" class="ml-1 hidden cursor-help text-sm xl:inline">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <div class="text-right">
        <strong class="text-el-danger xl:text-2xl">
          {{ modelValue?.LockoutAccounts ?? '-' }}
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
        活躍使用者 <small>(一週)</small>
        <button type="button" title="查看紀錄" class="ml-1 cursor-help text-sm">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <strong class="ml-auto text-el-primary">
        {{ modelValue?.WeeklyActiveAccounts ?? '-' }}
      </strong>
      <span
        class="fa-stack absolute -left-0 top-1/2 -translate-x-[30%] -translate-y-1/2 opacity-20 xl:text-[150%]"
      >
        <i class="fa-solid fa-circle fa-stack-2x text-el-primary"></i>
        <i class="fa-solid fa-users fa-stack-1x fa-inverse"></i>
      </span>
    </div>

    <div class="relative flex border-b-2 border-dashed p-3">
      <strong class="text-nowrap">
        有效帳號
        <button type="button" title="查看紀錄" class="ml-1 cursor-help text-sm">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <strong class="ml-auto text-el-success">
        {{ modelValue?.NonLockedOutAccounts ?? '-' }}
      </strong>
      <span
        class="fa-stack absolute -left-0 top-1/2 -translate-x-[30%] -translate-y-1/2 opacity-20 xl:text-[150%]"
      >
        <i class="fa-solid fa-circle fa-stack-2x text-el-success"></i>
        <i class="fa-solid fa-check fa-stack-1x fa-inverse"></i>
      </span>
    </div>

    <div class="relative flex p-3">
      <strong class="text-nowrap">
        禁止名單
        <button type="button" title="查看紀錄" class="ml-1 cursor-help text-sm">
          <i class="fas fa-info-circle"></i>
        </button>
      </strong>
      <strong class="ml-auto text-el-danger">
        {{ modelValue?.LockoutAccounts ?? '-' }}
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
  modelValue?: {
    WeeklyActiveAccounts: number;
    NonLockedOutAccounts: number;
    LockoutAccounts: number;
  };
}
defineProps<Prop>();
</script>
