#!/bin/bash

echo "🚀 開始部署到 Vercel..."

# 檢查是否已安裝 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安裝 Vercel CLI..."
    npm install -g vercel
fi

# 檢查是否已登入
if ! vercel whoami &> /dev/null; then
    echo "🔐 請先登入 Vercel..."
    vercel login
fi

# 構建專案
echo "🔨 構建專案..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 構建失敗"
    exit 1
fi

# 部署到 Vercel
echo "🚀 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "💡 請確保在 Vercel 控制台中設置了環境變數："
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
