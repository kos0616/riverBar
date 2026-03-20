<template>
  <el-form
    v-if="$screenWidth.value >= 768 && !$isMobile"
    @submit.prevent="advSearch"
    @reset.prevent="resetForm"
    class="my-input-group info-section flex items-center rounded-full bg-white p-0 px-2 transition-colors"
  >
    <fieldset class="my-fieldset w-44 cursor-pointer rounded-full px-4 transition-colors">
      <label for="keyword" class="hidden px-3 md:block">關鍵字</label>
      <el-input
        @clear="advSearch"
        v-model="form.keyword"
        id="keyword"
        placeholder="查詢名稱/帳號..."
        clearable
        style="
          --el-input-bg-color: transparent;
          --el-input-border-color: transparent;
          --el-input-focus-border-color: transparent;
          --el-input-hover-border-color: transparent;
        "
      />
    </fieldset>
    <fieldset class="my-fieldset w-36 cursor-pointer rounded-full px-4 transition-colors">
      <label for="position" class="hidden px-3 md:block">職位</label>
      <el-select
        @clear="advSearch"
        v-model="form.position"
        clearable
        placeholder="選擇職位"
        id="position"
        style="
          --el-fill-color-blank: transparent;
          --el-border-color: transparent;
          --el-border-color-hover: transparent;
          --el-color-primary: transparent;
        "
      >
        <el-option
          v-for="(role, i) in roles"
          :key="`role_${i}`"
          :value="role.Name"
          :label="role.DisplayNmae"
        ></el-option>
      </el-select>
    </fieldset>
    <fieldset class="my-fieldset w-40 cursor-pointer rounded-full px-4 transition-colors">
      <label for="department" class="hidden px-3 md:block">工作站</label>
      <el-select
        @clear="advSearch"
        v-model="form.department"
        clearable
        placeholder="選擇工作站"
        id="department"
        style="
          --el-fill-color-blank: transparent;
          --el-border-color: transparent;
          --el-border-color-hover: transparent;
          --el-color-primary: transparent;
        "
      >
        <el-option
          v-for="(station, i) in stations"
          :key="`station_${i}`"
          :value="station.Station"
          :label="station.Name"
        ></el-option>
      </el-select>
    </fieldset>
    <el-button type="primary" native-type="submit" title="查詢" circle>
      <i class="fas fa-fw fa-search"></i>
    </el-button>
  </el-form>

  <form
    v-else
    @submit.prevent="advSearch"
    @reset.prevent="resetForm"
    class="grid w-full max-w-sm gap-4"
  >
    <label class="info-section block rounded-full bg-white py-2">
      <input
        v-model="form.keyword"
        @search="advSearch"
        type="search"
        placeholder="查詢名稱/帳號"
        class="w-full bg-transparent"
      />
    </label>

    <div class="flex items-center gap-2">
      <div class="info-section flex flex-1 gap-2 rounded-full bg-white py-2">
        <label class="block flex-1">
          <select v-model="form.position" placeholder="選擇職位" class="w-full bg-transparent">
            <option value="">選擇職位</option>
            <option v-for="(role, i) in roles" :key="`role_${i}`" :value="role.Name">
              {{ role.DisplayNmae }}
            </option>
          </select>
        </label>

        <label class="block flex-1">
          <select v-model="form.department" placeholder="選擇工作站" class="w-full bg-transparent">
            <option value="">選擇工作站</option>
            <option v-for="(station, i) in stations" :key="`station_${i}`" :value="station.Station">
              {{ station.Name }}
            </option>
          </select>
        </label>
      </div>

      <el-button type="primary" native-type="submit" title="查詢" circle>
        <i class="fas fa-fw fa-search"></i>
      </el-button>
    </div>
    <hr class="sm:hidden" />
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RolesLists from '@/CUSTOMER/pages/role/Service/Lists';
import stationRights from '@/CUSTOMER/static/stationRights.json';

type typeRoles = Awaited<ReturnType<typeof RolesLists>>;

defineProps({
  roles: {
    type: Array as PropType<typeRoles>,
    default: () => []
  }
});

const router = useRouter();
const route = useRoute();

const stations = stationRights.map((o) => o.Stations).flat();

const form = ref({
  keyword: '',
  position: '',
  department: ''
});

const resetForm = () => {
  form.value.keyword = '';
  form.value.position = '';
  form.value.department = '';
  const { path } = route;
  router.push(path);
};

const advSearch = () => {
  const query = form.value;
  router.push({ query });
};

const init = () => {
  const query = route.query as typeof form.value;
  Object.assign(form.value, query);
};

onMounted(() => {
  init();
});
</script>

<!-- 
  搜尋區塊
  因為RWD問題，有拆分成mobile與PC版本
  -->

<style lang="scss" scoped>
.my-input-group {
  &:has(:focus) {
    @apply border-transparent bg-[#e4e4e4];
    label::after {
      display: none;
    }
  }
  .my-fieldset:has(:focus) {
    @apply bg-white;
  }

  .my-fieldset:not(:last-of-type) {
    @apply relative;
    &::after {
      content: '';
      position: absolute;
      height: 80%;
      width: 1px;
      background-color: #cde1de;
      right: 0;
      top: 10%;
    }
  }
}
</style>
