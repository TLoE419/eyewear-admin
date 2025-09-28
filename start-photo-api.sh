#!/bin/bash

# 照片 API 服務器啟動腳本

echo "🚀 啟動照片 API 服務器..."

# 檢查是否存在 photo-api-package.json
if [ ! -f "photo-api-package.json" ]; then
    echo "❌ 找不到 photo-api-package.json"
    exit 1
fi

# 安裝依賴
echo "📦 安裝依賴..."
npm install --prefix . --package-lock-only --package-lock=photo-api-package-lock.json

# 如果沒有 node_modules，則安裝
if [ ! -d "node_modules" ]; then
    echo "📦 安裝 Express 和相關依賴..."
    npm install express cors @supabase/supabase-js
fi

# 啟動服務器
echo "🚀 啟動照片 API 服務器在端口 3002..."
node photo-api-server.js
