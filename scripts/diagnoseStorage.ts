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

async function diagnoseStorage() {
  console.log("🔍 診斷 Storage 問題...\n");

  try {
    // 檢查 Supabase 連線
    console.log("📋 1. Supabase 連線資訊");
    console.log(`   URL: ${supabaseUrl}`);
    console.log(
      `   Key 類型: ${
        supabaseKey?.includes("anon") ? "ANON_KEY" : "SERVICE_ROLE_KEY"
      }`
    );
    console.log(`   Key 前綴: ${supabaseKey?.substring(0, 20)}...`);

    // 測試基本的 Storage 操作
    console.log("\n📋 2. 測試 Storage 基本操作");

    // 嘗試列出 buckets
    console.log("   🔄 嘗試列出 buckets...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log(`   ❌ 列出 buckets 失敗: ${bucketsError.message}`);
      console.log(
        `   📋 錯誤代碼: ${(bucketsError as any).statusCode || "N/A"}`
      );
      console.log(`   📋 錯誤詳情: ${JSON.stringify(bucketsError, null, 2)}`);
    } else {
      console.log(`   ✅ 成功列出 buckets: ${buckets.length} 個`);
      buckets.forEach((bucket, index) => {
        console.log(
          `      ${index + 1}. ${bucket.name} (公開: ${bucket.public})`
        );
      });
    }

    // 嘗試直接訪問 photos bucket
    console.log("\n📋 3. 測試直接訪問 photos bucket");
    const { data: photosFiles, error: photosError } = await supabase.storage
      .from("photos")
      .list();

    if (photosError) {
      console.log(`   ❌ 訪問 photos bucket 失敗: ${photosError.message}`);
      console.log(
        `   📋 錯誤代碼: ${(photosError as any).statusCode || "N/A"}`
      );
    } else {
      console.log(
        `   ✅ photos bucket 存在，包含 ${photosFiles.length} 個檔案`
      );
    }

    // 檢查 RLS 政策
    console.log("\n📋 4. 檢查 Storage 相關權限");
    console.log("   💡 如果無法列出 buckets，可能是以下原因:");
    console.log("      1. ANON_KEY 權限不足");
    console.log("      2. RLS 政策限制");
    console.log("      3. Storage 功能未啟用");
    console.log("      4. 需要 SERVICE_ROLE_KEY 來管理 Storage");

    // 提供解決方案
    console.log("\n📋 5. 解決方案");
    console.log("   🔧 方法 1: 使用 SERVICE_ROLE_KEY");
    console.log("      - 在 Supabase Dashboard → Settings → API");
    console.log("      - 複製 service_role key");
    console.log(
      "      - 在 .env.local 中添加: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    );

    console.log("\n   🔧 方法 2: 檢查 RLS 政策");
    console.log("      - 在 Supabase Dashboard → Storage → Policies");
    console.log("      - 確保有適當的 RLS 政策");

    console.log("\n   🔧 方法 3: 手動驗證 bucket 存在");
    console.log("      - 在 Supabase Dashboard → Storage");
    console.log("      - 確認 photos bucket 已建立");
  } catch (error) {
    console.error("❌ 診斷失敗:", error);
  }
}

// 執行診斷
diagnoseStorage();
