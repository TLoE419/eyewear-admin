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

async function createPhotosBucket() {
  console.log("🔄 建立 photos Storage bucket...\n");

  try {
    // 檢查是否已存在
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ 獲取 buckets 失敗:", bucketsError.message);
      return;
    }

    const photosBucket = buckets?.find((bucket) => bucket.name === "photos");

    if (photosBucket) {
      console.log("✅ photos bucket 已存在");
      console.log("📋 Bucket 資訊:");
      console.log(`   - 名稱: ${photosBucket.name}`);
      console.log(`   - 公開: ${photosBucket.public}`);
      console.log(
        `   - 檔案大小限制: ${
          photosBucket.file_size_limit
            ? `${photosBucket.file_size_limit / 1024 / 1024}MB`
            : "無限制"
        }`
      );
      console.log(
        `   - 允許的 MIME 類型: ${
          photosBucket.allowed_mime_types?.join(", ") || "無限制"
        }`
      );
    } else {
      console.log("📝 請在 Supabase Dashboard 中手動建立 photos bucket:");
      console.log(`
1. 前往 Supabase Dashboard → Storage
2. 點擊 "New bucket"
3. 設定如下：
   - 名稱: photos
   - 公開: 是
   - 檔案大小限制: 10MB
   - 允許的 MIME 類型: image/jpeg, image/png, image/webp, image/svg+xml
4. 點擊 "Create bucket"
      `);
    }
  } catch (error) {
    console.error("❌ 執行失敗:", error);
  }
}

// 執行腳本
createPhotosBucket();
