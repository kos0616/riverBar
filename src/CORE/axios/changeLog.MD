# axios 更動

1. 合併 headers
2. BASE_URL 直接使用環境檔 VITE_APP_URL
3. 移除 axios 與 loading 的關聯，以避免 loading 關了又開, 和龍抬頭顯示器和 refresh 需要特別加入白名單的問題
4. 加入伺服器預設 error 的 errorAlerter (數字系列與 CORS)
5. inputFocusout 可以功成身退了, ElmessageBox 內建 auto focus
6. 增加 errorAlerter 對應 CORS與 403 400 等伺服器問題
7. 獨立一塊20001表單驗證錯誤handler
8. 可能 1000系列的問題也會放在20001handler

## TODO

- [x] 後端error的 alerter 與 handler
- [ ] get IP 與 getter 脫鉤，避免 api 回應過慢拖累效能
- [ ] request 內 timestamp 的去留(目前找不到用途)
- [ ] 整合 headers => 測試是否合併過了頭

```
// 紀錄當前時間
const now = new Date().getTime();
const timestamp = Math.floor(now / 1000);
localStorage.setItem('timestamp', String(timestamp));
```
