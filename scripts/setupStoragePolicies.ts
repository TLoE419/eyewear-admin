import dotenv from "dotenv";

// 載入環境變數
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 缺少 Supabase 配置");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStoragePolicies() {
  console.log("🔧 設定 Storage RLS 政策...\n");

  try {
    // 檢查是否可以使用 SQL 功能
    console.log("📋 1. 檢查 SQL 執行權限");

    // 嘗試執行一個簡單的查詢
    const { data: testData, error: testError } = await supabase
      .from("photos")
      .select("id")
      .limit(1);

    if (testError) {
      console.log(`❌ 無法執行查詢: ${testError.message}`);
      return;
    }

    console.log("✅ 基本查詢權限正常");

    // 提供手動設定的 SQL 指令
    console.log("\n📋 2. 需要在 Supabase Dashboard 中執行的 SQL");
    console.log("請在 Supabase Dashboard → SQL Editor 中執行以下 SQL:");

    console.log(`
-- 設定 Storage 的 RLS 政策
-- 允許公開上傳到 photos bucket
CREATE POLICY "Allow public uploads to photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'photos');

-- 允許公開讀取 photos bucket
CREATE POLICY "Allow public reads from photos" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

-- 允許公開更新 photos bucket
CREATE POLICY "Allow public updates to photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'photos');

-- 允許公開刪除 photos bucket
CREATE POLICY "Allow public deletes from photos" ON storage.objects
FOR DELETE USING (bucket_id = 'photos');
    `);

    console.log("\n📋 3. 替代方案 - 使用更寬鬆的政策");
    console.log("如果上述政策不工作，可以嘗試這個更寬鬆的政策:");

    console.log(`
-- 更寬鬆的 Storage 政策
CREATE POLICY "Allow all operations on photos" ON storage.objects
FOR ALL USING (bucket_id = 'photos');
    `);

    console.log("\n📋 4. 檢查現有政策");
    console.log(
      "您也可以在 Supabase Dashboard → Storage → Policies 中檢查現有政策"
    );

    console.log("\n💡 設定完成後，請執行: npm run test-upload");
  } catch (error) {
    console.error("❌ 設定失敗:", error);
  }
}

// 執行設定
setupStoragePolicies();
