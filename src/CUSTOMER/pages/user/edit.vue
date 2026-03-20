<template>
  <el-dialog :model-value="modelValue" @close="$emit('close')" width="500" title="編輯帳號">
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
        {{ formInline.UserName }}
      </el-form-item>
      <el-form-item label="名稱">
        <el-input v-model="formInline.ChiName" required placeholder="名稱" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input
          v-model="formInline.Email"
          required
          type="email"
          autocomplete="email"
          placeholder="Email"
        />
      </el-form-item>
      <el-form-item label="密碼" prop="NewPassword">
        <el-input
          v-model="formInline.NewPassword"
          placeholder="新密碼"
          show-password
          type="password"
          minlength="6"
          autocomplete="new-password"
        >
          <template #append>
            <el-button
              @click="handleResetPassword"
              :disabled="!formInline.NewPassword"
              title="重設密碼"
            >
              <span v-if="$screenWidth.value > 640">
                <i class="fa-solid fa-lock fa-fw"></i>
                重設密碼
              </span>
              <span v-else>重設</span>
            </el-button>
          </template>
        </el-input>
        <small>若無變更密碼需求，則不需填寫密碼。</small>
      </el-form-item>

      <el-form-item label="角色">
        <el-select placeholder="角色" multiple v-model="formInline.Roles" class="w-full">
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
          placeholder="全部"
          v-model="formInline.SiteCode"
          class="w-full"
          :clearable="!siteRequre"
          :required="siteRequre"
        >
          <el-option :value="''" label="全部"></el-option>
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
      <el-form-item label="禁止名單">
        <el-switch
          @click="switchLockout"
          :model-value="formInline.Lockout"
          active-text="已封鎖"
          inactive-text="未封鎖"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <footer class="mt-5 text-center">
        <el-button type="primary" native-type="submit" round> 儲存 </el-button>
      </footer>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import Info, { type response } from './Service/Info';
import RolesLists, {
  type response as typeRolesResponse
} from '@/CUSTOMER/pages/role/Service/Lists';
import ChangePassword from './Service/ChangePassword';
import stationRights from '../../static/stationRights.json';
import Edit from './Service/Edit';
import chkSiteRequre from './lib/chkSiteRequire';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['success', 'close']);

const pattern = {
  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/,
  message: '密碼最少6個字元且至少包含一位 英文大小寫、數字與特殊符號',
  trigger: 'blur'
};

const rules = {
  NewPassword: [pattern]
};

const stations = ref<string[]>([]);

interface Prop {
  modelValue: boolean;
  id?: string;
}
const props = defineProps<Prop>();

type typeForm = response & { NewPassword?: string };

const siteRequre = computed(() => {
  return chkSiteRequre(formInline.value.Roles);
});

const formInline = ref<typeForm>({} as typeForm);

const tableData = ref<typeRolesResponse>([]);

const loading = ref(false);

const switchLockout = () => {
  formInline.value.Lockout = !formInline.value.Lockout;
};

const onSubmit = async () => {
  if (siteRequre.value && !formInline.value.SiteCode) {
    ElMessage.warning('請注意，站長與職員需要選擇所屬的工作站。');
    return;
  }
  try {
    const { ChiName, Email, SiteCode, UserName, Roles, Lockout } = formInline.value;
    loading.value = true;

    await Promise.all([
      Edit({ ChiName, Email, SiteCode, UserName, Lockout, Roles })
    ]);
    ElMessage.success('編輯成功');
    await getInfo();
    emit('success');
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  const { NewPassword, UserName } = formInline.value;
  try {
    if (!NewPassword) return;
    loading.value = true;
    await ChangePassword({ UserName, NewPassword });
    emit('close');
  } finally {
    loading.value = false;
  }
};

const getInfo = async () => {
  if (!props.id) return;
  const res = await Info(props.id);
  const StationRights = res.StationRights || [];
  formInline.value = {
    ...res,
    StationRights: StationRights.map((o) => o.StationId)
  } as any;
  stations.value = StationRights.map((o) => o.StationId);
};

const getRolesLists = async () => {
  const res = await RolesLists();
  tableData.value = res;
};

onMounted(async () => {
  try {
    loading.value = true;
    await getInfo();
    await getRolesLists();
  } finally {
    loading.value = false;
  }
});
</script>
