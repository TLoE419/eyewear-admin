# 部署到 Cloudflare Pages 指南

## 步驟 1: 創建 GitHub 倉庫

1. 前往 [GitHub 創建新倉庫](https://github.com/new)
2. 倉庫名稱：`eyewear-admin`
3. 設為公開倉庫
4. **不要**初始化 README、.gitignore 或 license
5. 點擊 "Create repository"

## 步驟 2: 連接本地倉庫到 GitHub

```bash
# 添加遠程倉庫（請替換 YOUR_USERNAME 為您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/eyewear-admin.git

# 推送代碼到 GitHub
git branch -M main
git push -u origin main
```

## 步驟 3: 部署到 Cloudflare Pages

1. 前往 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 點擊 "Create a project"
3. 選擇 "Connect to Git"
4. 選擇您的 GitHub 倉庫 `eyewear-admin`
5. 配置構建設置：
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (留空)

## 步驟 4: 設置環境變數

在 Cloudflare Pages 控制台中設置以下環境變數：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 步驟 5: 部署

1. 點擊 "Save and Deploy"
2. Cloudflare 會自動構建和部署您的應用
3. 部署完成後，您會獲得一個 `*.pages.dev` 的 URL

## 注意事項

- 確保 `cloudflare-pages.toml` 文件已正確配置
- 構建命令會使用 `npm run build` 生成靜態文件到 `out` 目錄
- 所有 API 路由會作為 Cloudflare Functions 運行
- 照片上傳功能需要 Supabase 存儲配置

## 故障排除

如果部署失敗，請檢查：

1. 構建日誌中的錯誤信息
2. 環境變數是否正確設置
3. Supabase 連接是否正常
4. 所有依賴是否正確安裝
