#!/bin/bash

# 眼鏡管理系統部署腳本
echo "🚀 開始部署眼鏡管理系統到 Cloudflare Pages..."

# 檢查是否已設置遠程倉庫
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ 尚未設置遠程倉庫"
    echo "請先按照 DEPLOYMENT_GUIDE.md 中的步驟創建 GitHub 倉庫並設置遠程連接"
    echo ""
    echo "快速設置命令："
    echo "git remote add origin https://github.com/YOUR_USERNAME/eyewear-admin.git"
    echo "git push -u origin main"
    exit 1
fi

# 確保所有更改已提交
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📝 提交所有更改..."
    git add .
    git commit -m "feat: 準備部署到 Cloudflare Pages"
fi

# 推送到 GitHub
echo "📤 推送到 GitHub..."
git push origin main

echo "✅ 代碼已推送到 GitHub"
echo ""
echo "🌐 現在請前往 Cloudflare Pages 進行部署："
echo "1. 前往 https://pages.cloudflare.com/"
echo "2. 點擊 'Create a project'"
echo "3. 選擇 'Connect to Git'"
echo "4. 選擇您的 eyewear-admin 倉庫"
echo "5. 使用以下設置："
echo "   - Framework preset: Next.js (Static HTML Export)"
echo "   - Build command: npm run build"
echo "   - Build output directory: out"
echo "   - Root directory: / (留空)"
echo ""
echo "📋 記得設置環境變數："
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
