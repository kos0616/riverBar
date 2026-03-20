<template>
  <el-dialog
    :model-value="modelValue"
    @close="$emit('close')"
    width="500"
    :destroy-on-close="true"
    title="新增帳號"
  >
    <el-form
      v-loading="loading"
      @submit.prevent="onSubmit"
      :model="formInline"
      label-position="left"
      label-width="120"
      id="myForm"
      class="my-form"
      :rules="rules"
    >
      <el-form-item label="帳號">
        <el-input
          required
          v-model="formInline.UserName"
          placeholder="帳號"
          autocomplete="username"
          name="username"
        />
      </el-form-item>
      <el-form-item label="名稱">
        <el-input
          required
          v-model="formInline.ChiName"
          placeholder="名稱"
          autocomplete="name"
          name="name"
        />
      </el-form-item>
      <el-form-item label="Email">
        <el-input
          required
          v-model="formInline.Email"
          placeholder="Email"
          type="email"
          name="email "
        />
      </el-form-item>
      <el-form-item label="密碼" prop="Password">
        <el-input
          required
          type="password"
          v-model="formInline.Password"
          placeholder="密碼"
          show-password
          minlength="6"
          autocomplete="new-password"
        />
        <small class="pt-1 text-el-danger" style="line-height: 1.2">
          *密碼最少6個字元且至少包含一位 英文大小寫、數字與特殊符號
        </small>
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

      <el-form-item label="工作站">
        <el-select
          placeholder="工作站"
          v-model="formInline.SiteCode"
          class="w-full"
          :clearable="!siteRequre"
          :required="siteRequre"
        >
          <el-option-group
            v-for="group in stationRights"
            :key="group.Location"
            :label="group.Location"
          >
            <el-option
              v-for="(item, index) in group.Stations"
              :key="'item' + index"
              :value="item.Station"
              :label="item.Name"
          /></el-option-group>
        </el-select>
      </el-form-item>
      <footer class="mt-5 text-center">
        <el-button type="primary" native-type="submit" round> 確認新增 </el-button>
      </footer>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, computed } from 'vue';
import RolesLists, { type response } from '@/CUSTOMER/pages/role/Service/Lists';
import stationRights from '../../static/stationRights.json';
import Create from './Service/Create';
import chkSiteRequre from './lib/chkSiteRequire';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['success', 'close']);

const pattern = {
  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/,
  message: '密碼格式有誤',
  trigger: 'blur'
};

const rules = {
  Password: [pattern]
};

interface Prop {
  modelValue: boolean;
}
defineProps<Prop>();

const tableData = ref<response>([]);

const siteRequre = computed(() => {
  return chkSiteRequre(formInline.Roles);
});

const formInline = reactive<Parameters<typeof Create>[0]>({
  UserName: '',
  ChiName: '',
  Email: '',
  Password: '',
  Roles: [],
  SiteCode: ''
});

const loading = ref(false);
const onSubmit = async () => {
  if (siteRequre.value && !formInline.SiteCode) {
    ElMessage.warning('請注意，站長與職員需要選擇所屬的工作站。');
    return;
  }
  try {
    loading.value = true;
    const res = await Create(formInline);
    emit('close');
    emit('success', res);
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
