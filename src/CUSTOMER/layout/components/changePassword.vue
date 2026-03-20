<template>
  <el-dialog
    :model-value="modelValue"
    @close="$emit('close')"
    width="400"
    title="變更密碼"
    :append-to-body="true"
  >
    <el-form
      v-loading="loading"
      @submit.prevent="handleSubmit"
      :model="form"
      label-width="120"
      label-position="left"
      id="myForm"
      class="my-form"
      :rules="rules"
      ref="REF_form"
    >
      <el-form-item prop="OldPassword" label="舊密碼">
        <el-input
          v-model="form.OldPassword"
          type="password"
          required
          title="請輸入舊密碼"
          placeholder="請輸入舊密碼"
          autocomplete="off"
          show-password
        />
      </el-form-item>
      <el-form-item prop="NewPassword" label="新密碼">
        <el-input
          v-model="form.NewPassword"
          title="請輸入新密碼"
          type="password"
          autocomplete="new-password"
          placeholder="請輸入新密碼"
          required
          minlength="6"
          show-password
        />
      </el-form-item>
      <el-form-item prop="ConfirmPassword" label="新密碼確認">
        <el-input
          v-model="form.ConfirmPassword"
          type="password"
          autocomplete="new-password"
          title="請再次輸入新密碼"
          placeholder="請再次輸入新密碼"
          required
          minlength="6"
          show-password
        />
      </el-form-item>
      <small> *密碼最少6個字元，且至少包含一位 英文大小寫、數字與特殊符號 </small>
      <footer class="mt-5 text-center">
        <el-button type="primary" native-type="submit" round>
          <i class="fa-solid fa-save fa-fw"></i>
          儲存
        </el-button>
      </footer>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import ChangePassword from '@/CUSTOMER/Service/identity/ChangePassword';
import type { FormInstance, FormRules } from 'element-plus';

const REF_form = ref<FormInstance>();

const emit = defineEmits(['success', 'close']);

const loading = ref(false);

interface Prop {
  modelValue: boolean;
}

defineProps<Prop>();

const form = reactive({
  OldPassword: '',
  NewPassword: '',
  ConfirmPassword: ''
});

const handleSubmit = async () => {
  const { OldPassword, NewPassword } = form;
  try {
    loading.value = true;
    await ChangePassword({ OldPassword, NewPassword });
    emit('close');
  } finally {
    loading.value = false;
    form.NewPassword = '';
    form.OldPassword = '';
    form.ConfirmPassword = '';
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('請輸入新密碼'));
  } else if (value === form.OldPassword) {
    callback(new Error('新密碼不得與舊密碼相同'));
  } else {
    callback();
  }
};
const confirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('請再次輸入新密碼'));
  } else if (value !== form.NewPassword) {
    callback(new Error('兩次輸入的新密碼不一致'));
  } else {
    callback();
  }
};

const pattern = {
  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/,
  message: '密碼格式有誤',
  trigger: 'blur'
};
const rules = reactive<FormRules<typeof form>>({
  NewPassword: [{ validator: validatePass, trigger: 'blur' }, pattern],
  ConfirmPassword: [{ validator: confirmPassword, trigger: 'blur' }, pattern]
});
</script>
