<template>
  <div class="flex h-screen w-full items-center justify-center bg-gray-200 px-16 md:px-0">
    <div
      class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-8 shadow-2xl md:px-8 lg:px-24"
    >
      <p class="text-6xl font-bold tracking-wider text-gray-300 md:text-7xl lg:text-9xl">404</p>
      <p class="mt-4 text-2xl font-bold tracking-wider text-gray-500 md:text-3xl lg:text-5xl">
        頁面不存在
      </p>
      <p class="mt-4 border-b-2 pb-4 text-center text-gray-500">
        您好，您目前瀏覽的頁面不存在，請點擊按鈕返回首頁
      </p>
      <a
        class="mt-6 flex items-center space-x-2 rounded bg-primary-400 px-4 py-2 text-gray-100 transition duration-150 hover:bg-primary-700"
        title="返回首頁"
        href="/"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span>返回首頁</span>
      </a>
    </div>
  </div>
</template>
