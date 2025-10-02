# 🚨 部署修復指南

## 問題診斷結果

您的應用程式在 Vercel 上遇到客戶端錯誤，主要原因是：

1. **❌ photos bucket 不存在** - Supabase Storage 中缺少 photos bucket
2. **❌ 環境變數未設置** - Vercel 上缺少必要的環境變數

## 🔧 修復步驟

### 步驟 1：在 Supabase 中創建 photos bucket

1. 登入您的 Supabase 控制台
2. 進入 **Storage** 頁面
3. 點擊 **"New bucket"**
4. 設置以下參數：
   - **Name**: `photos`
   - **Public bucket**: ✅ 勾選
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/svg+xml`

### 步驟 2：在 Vercel 中設置環境變數

1. 登入您的 Vercel 控制台
2. 進入您的 `eyewear-admin` 專案
3. 進入 **Settings** → **Environment Variables**
4. 添加以下環境變數：

```
NEXT_PUBLIC_SUPABASE_URL = https://avzngmdgeisolmnomegs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww
```

### 步驟 3：重新部署

1. 在 Vercel 中觸發新的部署
2. 或者推送代碼更改到 GitHub 觸發自動部署

### 步驟 4：本地開發環境設置

創建 `.env.local` 文件（在專案根目錄）：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://avzngmdgeisolmnomegs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww
```

## 🔍 驗證修復

修復完成後，您可以：

1. 檢查 Vercel 部署日誌
2. 訪問您的應用程式 URL
3. 測試產品管理和照片管理功能

## 📋 檢查清單

- [ ] Supabase Storage 中有 `photos` bucket
- [ ] `photos` bucket 設置為 public
- [ ] Vercel 環境變數已設置
- [ ] 應用程式重新部署
- [ ] 本地 `.env.local` 文件已創建

## 🆘 如果問題仍然存在

如果修復後仍有問題，請檢查：

1. **瀏覽器控制台錯誤** - 查看具體的 JavaScript 錯誤
2. **Vercel 部署日誌** - 檢查構建和運行時錯誤
3. **Supabase 日誌** - 檢查 API 調用是否成功

## 📞 支援

如果問題持續存在，請提供：

- 瀏覽器控制台的錯誤訊息
- Vercel 部署日誌
- 具體的錯誤頁面截圖
