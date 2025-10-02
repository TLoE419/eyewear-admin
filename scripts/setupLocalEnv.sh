#!/bin/bash

echo "🔧 設置本地開發環境..."

# 創建 .env.local 文件
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://avzngmdgeisolmnomegs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww
EOF

echo "✅ .env.local 文件已創建"

# 檢查文件是否創建成功
if [ -f ".env.local" ]; then
    echo "📋 環境變數內容："
    cat .env.local
    echo ""
    echo "🎉 本地環境設置完成！"
    echo "💡 現在可以運行 'npm run dev' 啟動開發服務器"
else
    echo "❌ 創建 .env.local 文件失敗"
    exit 1
fi
