<template>
  <main>
    <div class="mx-auto w-full max-w-sm">
      <el-card v-loading="loading">
        <template #header>
          <div class="flex">
            <el-button class="mr-auto" @click="$router.go(-1)" title="返回" link>
              <i class="fa-solid fa-chevron-left"></i>
              <span class="pl-1">返回</span>
            </el-button>
            <el-button type="primary" @click="onSubmit" round>
              <i class="fa-solid fa-save fa-fw"></i>
              儲存
            </el-button>
          </div>
        </template>
        <el-form
          @submit.prevent="onSubmit"
          :model="formInline"
          :label-position="$screenWidth.value > 640 ? 'left' : 'top'"
          label-width="auto"
        >
          <el-form-item label="使用者名稱">
            <el-input
              required
              v-model="formInline.UserName"
              placeholder="使用者名稱"
              autocomplete="username"
            />
          </el-form-item>
          <el-form-item label="暱稱">
            <el-input
              required
              v-model="formInline.ChiName"
              placeholder="暱稱"
              autocomplete="nickname"
            />
          </el-form-item>
          <el-form-item label="Email">
            <el-input required v-model="formInline.Email" placeholder="Email" type="email" />
          </el-form-item>
          <el-form-item label="密碼">
            <el-input
              required
              type="password"
              v-model="formInline.Password"
              placeholder="密碼"
              show-password
            />
          </el-form-item>
          <el-form-item label="角色">
            <el-select
              placeholder="角色"
              multiple
              v-model="formInline.Roles"
              :clearable="true"
              class="w-full"
            >
              <el-option
                v-for="(item, index) in tableData"
                :key="'item' + index"
                :value="item.Name"
                :label="item.DisplayNmae"
              />
            </el-select>
          </el-form-item>
          <input type="submit" class="hidden" />
        </el-form>
      </el-card>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import RolesLists, { type response } from '@/CUSTOMER/pages/role/Service/Lists';
import Create from './Service/Create';
import { useRouter } from 'vue-router';
const router = useRouter();

const tableData = ref<response>([]);

const formInline = reactive({
  UserName: '',
  ChiName: '',
  Email: '',
  Password: '',
  Roles: []
});

const loading = ref(false);
const onSubmit = async () => {
  try {
    loading.value = true;
    const res = await Create(formInline);
    if (res) {
      router.push(`/account`);
    }
  } finally {
    loading.value = false;
  }
};

const getRolesLists = async () => {
  try {
    loading.value = true;
    const res = await RolesLists();
    tableData.value = res;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  getRolesLists();
});
</script>
