<template>
  <main>
    <div class="info-section mx-auto max-w-3xl">
      <ul>
        <li class="py-2">
          教育訓練文件：
          <br />
          <a
            href="/api/files/112農田水利苗栗遠端監控-教育訓練簡報ver2.2_fix.pdf"
            title="教育訓練文件下載連結(開新分頁)"
            target="_blank"
            class="text-primary hover:underline"
          >
            <i class="fas fa-link fa-fw"></i>
            下載連結(開新分頁)
          </a>
        </li>
        <li class="py-2">
          水文監控系統：
          <ol class="list-inside list-decimal pl-4">
            <li>
              <a
                href="https://youtu.be/4AJwFhkTtNQ"
                title="水文監控系統 教育訓練影片一(開新分頁)"
                target="_blank"
                class="text-primary hover:underline"
              >
                <i class="fas fa-link fa-fw"></i>
                教育訓練影片(一)(開新分頁)
              </a>
            </li>
            <li>
              <a
                href="https://youtu.be/djJiJ0VQc38"
                title="水文監控系統 教育訓練影片二(開新分頁)"
                target="_blank"
                class="text-primary hover:underline"
              >
                <i class="fas fa-link fa-fw"></i>
                教育訓練影片(二)(開新分頁)
              </a>
            </li>
            <li>
              <a
                href="https://youtu.be/noS2CXOsWzI"
                title="水文監控系統 教育訓練影片三(開新分頁)"
                target="_blank"
                class="text-primary hover:underline"
              >
                <i class="fas fa-link fa-fw"></i>
                教育訓練影片(三)(開新分頁)
              </a>
            </li>
          </ol>
        </li>
        <li class="py-2">
          發現圖控無法操作或水情展示上的監測點連線顯示失敗，可依以下方式進行檢查：
          <ol class="list-inside list-decimal pl-4">
            <li class="py-2">
              確認水情展示「連線狀態」為
              <span class="text-el-danger">失敗</span>
              ，且最後同步時間距離當下時間已經有超過30分鐘。
              <img src="./SOP_image/SOP01.webp" alt="同步失敗錯誤檢測照" class="mb-4" />
            </li>
            <li class="py-2">
              確認圖控功能是否可操作現場設施，若無法操作則判斷為與現場端PLC連線可能中斷。
            </li>
            <li class="py-2">
              確認CCTV監控畫面是否No Signal 無訊號，若無畫面則需要確認現場網路狀況。
              <img src="./SOP_image/SOP02.webp" alt="CCTV監控錯誤檢測照片" class="mb-4" />
            </li>
            <li class="py-2">
              確認現場端網路是否正常（小烏龜/防火牆設備/資訊設備）
              <img src="./SOP_image/SOP04.webp" alt="網路設備錯誤檢測照片" class="mb-4" />
              <span class="text-el-danger">
                備註：重啟後，PWR不亮、STATUS燈不亮，需要聯繫無間科技協助處理。
              </span>

              <img src="./SOP_image/SOP05.webp" alt="網路設備錯誤檢測照片2" class="mb-4" />
              <span class="text-el-danger">
                備註：重啟後，ALM依舊亮紅燈，需要聯繫中華電信協助處理。
              </span>
            </li>

            <li class="py-2">需請無間科技協助確認PLC訊號是否正常</li>
            <li class="py-2">確認網路費用是否有繳納</li>
          </ol>
        </li>
      </ul>
    </div>
  </main>
</template>
