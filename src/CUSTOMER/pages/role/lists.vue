<template>
  <main>
    <div v-if="$screenWidth.value > 767" class="info-section grid gap-5 lg:grid-cols-2">
      <div v-for="(role, i) in tableData" :key="`role_${i}`">
        <div v-loading="loading" class="info-section bg-white">
          <div class="grid gap-4">
            <div class="flex items-center justify-between gap-4">
              <h3 class="text-lg">
                {{ role.DisplayNmae }}
                ({{ role.Name }})
              </h3>
              <div v-if="selected?.Name === role.Name" class="flex gap-1">
                <el-button @click="selected = undefined">返回</el-button>
                <el-button v-if="$WRUD('w')" @click="$bus.emit('save')" type="primary">
                  儲存
                </el-button>
              </div>
              <el-button v-else @click="selected = role">檢視</el-button>
            </div>
            <info v-if="selected?.Name === role.Name" :id="selected?.Name" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid gap-5 pb-32">
      <el-select
        v-model="selected"
        value-key="Name"
        class="rounded-full bg-white px-2"
        placeholder="選擇職位"
        style="
          --el-fill-color-blank: transparent;
          --el-border-color: transparent;
          --el-border-color-hover: transparent;
          --el-color-primary: transparent;
          box-shadow: 0px 4px 20px 0px rgba(28, 98, 138, 0.15);
        "
      >
        <el-option
          v-for="(item, i) in tableData"
          :key="`item_${i}`"
          :value="item"
          :label="`${item.DisplayNmae} (${item.Name})`"
        ></el-option>
      </el-select>

      <div class="info-section bg-white">
        <info v-if="selected?.Name" :id="selected?.Name" />
      </div>

      <div
        v-if="$WRUD('w')"
        class="fixed bottom-0 left-0 right-0 flex gap-1 bg-white p-5 shadow sm:static sm:bg-transparent sm:shadow-none"
      >
        <el-button @click="$bus.emit('save')" type="primary" class="w-full"> 儲存變更 </el-button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Lists, { type response, type item } from './Service/Lists';
import info from './info.vue';

const selected = ref<item>();

const tableData = ref<response>([]);

const loading = ref(false);

const getLists = async () => {
  try {
    loading.value = true;
    const res = await Lists();
    tableData.value = res;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getLists();
});
</script>
