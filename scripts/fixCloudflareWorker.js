// 修復 Cloudflare Worker 的腳本
const fs = require('fs');
const path = require('path');

console.log("🔧 修復 Cloudflare Worker 配置...\n");

// 讀取當前的 Cloudflare Worker 文件
const workerPath = path.join(__dirname, '..', 'cloudflare-worker.js');
const workerContent = fs.readFileSync(workerPath, 'utf8');

console.log("📋 當前 Cloudflare Worker 配置:");
console.log("SUPABASE_URL:", workerContent.includes('YOUR_SUPABASE_URL') ? '❌ 未設置' : '✅ 已設置');
console.log("SUPABASE_KEY:", workerContent.includes('YOUR_SUPABASE_KEY') ? '❌ 未設置' : '✅ 已設置');

// 正確的 Supabase 配置
const correctSupabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const correctSupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

// 更新 Cloudflare Worker 文件
const updatedWorkerContent = workerContent
  .replace('YOUR_SUPABASE_URL', correctSupabaseUrl)
  .replace('YOUR_SUPABASE_KEY', correctSupabaseKey);

fs.writeFileSync(workerPath, updatedWorkerContent);

console.log("\n✅ Cloudflare Worker 配置已更新！");
console.log("📋 更新內容:");
console.log("- SUPABASE_URL:", correctSupabaseUrl);
console.log("- SUPABASE_KEY:", correctSupabaseKey.substring(0, 20) + "...");

console.log("\n📝 下一步:");
console.log("1. 重新部署 Cloudflare Worker");
console.log("2. 在 Supabase 中創建 'photos' bucket");
console.log("3. 測試上傳功能");

console.log("\n🎯 修復完成！");
