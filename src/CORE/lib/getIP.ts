/**
 * 以 Promise.any 取得最快回傳的IP資料
 * 之前用 .race 跑第一的如果翻車會全員坐牢
 */
export default async () => {
  /** 這三隻API都是回傳text 因此可以用 text() 方法，若未來有包含到回傳其他格式的API(ex: json())，則需要重新修改 */
  const APIs = ['https://get.geojs.io/v1/ip', 'https://api.ipify.org', 'https://ipinfo.io/ip'];
  const promises = APIs.map((api) => fetch(api).then((response) => response.text()));

  try {
    const result = await Promise.any(promises);
    return result;
  } catch (error) {
    // 在這裡處理錯誤
    console.log('Error:', error);
    throw error; // 可以根據需求選擇是否向外傳遞錯誤
  }
};

// function handleGetIP() {
//   getIP()
//     .then((res) => {
//       const app = document.querySelector('#app');
//       app.innerText = 'Quick 1 is: ' + res.url;
//       return res.text();
//     })
//     .then((IP) => {
//       const app = document.querySelector('#IP');
//       app.innerText = IP;
//     });
// }
