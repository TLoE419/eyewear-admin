const { createClient } = require("@supabase/supabase-js");

// Supabase 配置
const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseDeployment() {
  console.log("🔍 開始診斷部署問題...\n");

  try {
    // 1. 檢查 Supabase 連接
    console.log("1️⃣ 檢查 Supabase 連接...");
    const { data: testData, error: testError } = await supabase
      .from("photos")
      .select("count")
      .limit(1);

    if (testError) {
      console.log("❌ Supabase 連接失敗:", testError.message);
    } else {
      console.log("✅ Supabase 連接正常");
    }

    // 2. 檢查 products 表是否存在
    console.log("\n2️⃣ 檢查 products 表...");
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .limit(1);

    if (productsError) {
      console.log("❌ products 表不存在或無法訪問:", productsError.message);
      console.log("💡 建議：在 Supabase SQL Editor 中執行以下 SQL:");
      console.log(`
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  image_url TEXT,
  photo_id TEXT REFERENCES photos(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
    } else {
      console.log("✅ products 表存在，包含", products.length, "條記錄");
    }

    // 3. 檢查 photos 表
    console.log("\n3️⃣ 檢查 photos 表...");
    const { data: photos, error: photosError } = await supabase
      .from("photos")
      .select("*")
      .limit(5);

    if (photosError) {
      console.log("❌ photos 表錯誤:", photosError.message);
    } else {
      console.log("✅ photos 表正常，包含", photos.length, "條記錄");
      if (photos.length > 0) {
        console.log("📸 照片範例:", photos[0].title);
      }
    }

    // 4. 檢查 Storage bucket
    console.log("\n4️⃣ 檢查 Storage bucket...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log("❌ Storage 錯誤:", bucketsError.message);
    } else {
      const photosBucket = buckets.find((bucket) => bucket.name === "photos");
      if (photosBucket) {
        console.log("✅ photos bucket 存在");

        // 檢查 bucket 中的文件
        const { data: files, error: filesError } = await supabase.storage
          .from("photos")
          .list("", { limit: 5 });

        if (filesError) {
          console.log("❌ 無法列出文件:", filesError.message);
        } else {
          console.log("📁 bucket 中包含", files.length, "個文件/資料夾");
        }
      } else {
        console.log("❌ photos bucket 不存在");
      }
    }

    // 5. 檢查環境變數配置
    console.log("\n5️⃣ 檢查環境變數配置...");
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL || "未設置"
    );
    console.log(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "已設置" : "未設置"
    );

    console.log("\n🎯 診斷完成！");
    console.log("\n📋 可能的解決方案:");
    console.log(
      "1. 確保在 Vercel 環境變數中設置了 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
    console.log("2. 在 Supabase 中創建 products 表（如果不存在）");
    console.log("3. 檢查 Supabase RLS (Row Level Security) 政策");
    console.log("4. 確保 photos bucket 存在且有正確的權限");
  } catch (error) {
    console.error("❌ 診斷過程中發生錯誤:", error);
  }
}

// 執行診斷
diagnoseDeployment().catch(console.error);
