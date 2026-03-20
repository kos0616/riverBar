<template>
  <div>
    <button @click="dialogInfo = true" title="圖控工程圖" class="group text-center">
      <img
        src="@/CUSTOMER/assets/machineImg.webp"
        alt="工程圖示意圖"
        class="mx-auto rounded-lg border border-gray-400 bg-white group-hover:border-primary"
      />
      <div class="text-gray-500 group-hover:text-primary">圖控工程圖</div>
    </button>

    <el-dialog v-model="dialogInfo" width="450" :append-to-body="true" title="圖控工程圖">
      <div class="mb-1 text-end">
        <el-button
          :disabled="!$WRUD('w') || tableData.length >= 3"
          @click="isEdit = !isEdit"
          size="small"
          title="上傳檔案"
        >
          <i class="fa-solid fa-file-arrow-up"></i>
        </el-button>
        <el-button v-if="!isEdit" @click="getList" size="small" title="重新整理">
          <i class="fa-solid fa-arrows-rotate"></i>
        </el-button>
      </div>

      <form
        v-loading="isLoading"
        v-if="isEdit"
        @submit.prevent="handleUpload"
        @reset.prevent="handleClear"
        class="flex flex-col gap-2"
      >
        <label>
          <strong class="text-lg">上傳檔案</strong>
          <input
            @change="handleFileUpload"
            type="file"
            required
            accept="image/jpg, image/jpeg, image/png, .pdf"
          />
          <small class="block">*支援格式: 1MB以下的 jpg, png, pdf 檔案</small>
        </label>

        <figure class="text-center">
          <img v-if="filePreviewType === 'img'" :src="filePreview" alt="圖片預覽" class="mx-auto" />
          <object
            v-if="filePreviewType === 'pdf'"
            :data="filePreview"
            type="application/pdf"
            class="w-full"
          >
            <embed :ng-src="filePreview" type="application/pdf" />
          </object>
        </figure>

        <div class="flex justify-between border-t pt-2">
          <el-button native-type="reset"> 取消上傳 </el-button>
          <el-button :disabled="isLocked" type="primary" native-type="submit">
            <i class="fa-fw fa-solid fa-envelope"></i>
            送出
          </el-button>
        </div>
      </form>

      <table v-loading="isLoading" v-else class="w-full table-auto border-collapse bg-white">
        <caption class="caption-bottom">
          <span class="text-red-400">＊</span>
          圖控工程圖最多上傳 3張
        </caption>
        <thead class="bg-[#e3f3f0]">
          <tr>
            <th>檔案名稱</th>
            <th class="w-[82px] text-nowrap">檢視</th>
            <th class="w-[82px] text-nowrap">移除</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(img, i) in tableData"
            :key="`img_${i}`"
            class="transition-colors hover:bg-gray-100"
          >
            <td class="max-w-[220px] truncate" :title="img">{{ img }}</td>
            <td class="px-1 py-2">
              <el-button @click="getInfo(img)" title="於新視窗開啟圖片">
                <i class="fa-solid fa-image fa-fw"></i>
              </el-button>
            </td>
            <td class="px-1 py-2">
              <el-button @click="doDelete(img)" title="刪除圖片" type="danger">
                <i class="fa-solid fa-trash-alt fa-fw"></i>
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import Upload from '@/CUSTOMER/Service/LocationImage/Upload';
import Info from '@/CUSTOMER/Service/LocationImage/Info';
import Lists from '@/CUSTOMER/Service/LocationImage/Lists';
import Delete from '@/CUSTOMER/Service/LocationImage/Delete';
import { ref, getCurrentInstance } from 'vue';
import { watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

const getWRUD = (str: 'w' | 'r' | 'u' | 'd') => {
  if (!getCurrentInstance()) {
    console.error('getCurrentInstance is null');
    return false;
  }
  return getCurrentInstance()!.appContext.config.globalProperties.$WRUD(str);
};

const route = useRoute();

const dialogInfo = ref(false);

const tableData = ref<string[]>([]);

/** 表單送出鎖定 */
const isLocked = ref(true);

const isLoading = ref(false);

const MAX_SIZE_MB = 1; // 最大容量 1MB

const id = route.params.id as string;

/** 是否正在重新上傳檔案 */
const isEdit = ref(false);
/** 預覽用的檔案 */
const filePreview = ref('');
/** 檔案的類型 */
const filePreviewType = ref<'img' | 'pdf' | ''>('');
/** 準備上傳的檔案 */
const fileToUpload = ref<File | undefined>();

/** 檢查檔案容量 */
const handleFileUpload = (event: Event) => {
  if (tableData.value.length >= 3) {
    ElMessage.error('最多只能上傳三張圖片');
    return;
  }
  isLocked.value = true;
  filePreview.value = '';
  filePreviewType.value = '';
  fileToUpload.value = undefined;

  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && file.size > MAX_SIZE_MB * 1024 * 1024) {
    ElMessage.error(`文件超過 ${MAX_SIZE_MB}MB，請重新選擇較小的檔案`);
    return;
  } else if (file) {
    isLocked.value = false;
    fileToUpload.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      filePreview.value = e.target?.result as string;
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type.includes('application');
      filePreviewType.value = isImage ? 'img' : isPdf ? 'pdf' : '';
    };
    reader.readAsDataURL(file);
  }
};

const handleClear = async () => {
  isLocked.value = true;
  isEdit.value = false;
  filePreview.value = '';
  filePreviewType.value = '';
  fileToUpload.value = undefined;
  await getList();
};

const handleUpload = async () => {
  const file = fileToUpload.value;
  if (!file) {
    ElMessage.warning('檔案不存在，請檢查檔案或通知系統管理員');
    return;
  }

  try {
    isLoading.value = true;
    const req = { code: id, file };
    await Upload(req);
    ElMessage.success('上傳成功');
    handleClear();
  } finally {
    isLoading.value = false;
  }
};

const canEdit = getWRUD('w');

const getList = async () => {
  try {
    isLoading.value = true;

    const list = (await Lists(id)) as string[];
    if ((Array.isArray(list) && list.length === 0) || !Array.isArray(list)) throw 404;

    tableData.value = list;
  } catch (e) {
    if (e === 404 && canEdit) {
      ElMessage.warning('目前尚未設定圖控工程圖，請上傳圖片');
      isEdit.value = true;
    }
  } finally {
    isLoading.value = false;
  }
  isLoading.value = false;
};

const getInfo = async (file: string) => {
  isLoading.value = true;
  try {
    const getter = (await Info({ id, file })) as Blob;
    if (getter.type.includes('image')) {
      window.open(URL.createObjectURL(getter));
      return;
    }
    if (getter.type.includes('application')) {
      const blob = new Blob([getter], { type: 'application/pdf' });
      window.open(URL.createObjectURL(blob));
      return;
    }
    ElMessage.error('檔案格式異常: ' + getter.type);
  } finally {
    isLoading.value = false;
  }
};

const doDelete = async (file: string) => {
  isLoading.value = true;
  try {
    await Delete({ id, file });
    await getList();
  } finally {
    isLoading.value = false;
  }
};

watch(dialogInfo, async (v) => {
  if (v === true) await getList();
});
</script>
