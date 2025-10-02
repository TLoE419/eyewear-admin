const { createClient } = require("@supabase/supabase-js");

// Supabase 配置
const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

const supabase = createClient(supabaseUrl, supabaseKey);

async function detailedSupabaseCheck() {
  console.log("🔍 詳細檢查 Supabase 配置...\n");

  try {
    // 1. 檢查所有 buckets
    console.log("1️⃣ 檢查所有 Storage buckets...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log("❌ 無法獲取 buckets:", bucketsError.message);
      console.log("🔍 錯誤詳情:", bucketsError);
    } else {
      console.log("📋 找到的 buckets:");
      if (buckets && buckets.length > 0) {
        buckets.forEach((bucket) => {
          console.log(
            `  - ${bucket.name} (${bucket.public ? "public" : "private"})`
          );
        });
      } else {
        console.log("  (沒有找到任何 buckets)");
      }
    }

    // 2. 嘗試直接訪問 photos bucket
    console.log("\n2️⃣ 嘗試直接訪問 photos bucket...");
    const { data: photosFiles, error: photosError } = await supabase.storage
      .from("photos")
      .list("", { limit: 10 });

    if (photosError) {
      console.log("❌ 無法訪問 photos bucket:", photosError.message);
      console.log("🔍 錯誤詳情:", photosError);
    } else {
      console.log("✅ photos bucket 可以訪問");
      console.log("📁 photos bucket 中的文件:");
      if (photosFiles && photosFiles.length > 0) {
        photosFiles.forEach((file) => {
          console.log(
            `  - ${file.name} (${file.metadata?.size || "unknown"} bytes)`
          );
        });
      } else {
        console.log("  (沒有文件)");
      }
    }

    // 3. 檢查現有照片的 URL
    console.log("\n3️⃣ 檢查現有照片的 URL...");
    const { data: photos, error: photosTableError } = await supabase
      .from("photos")
      .select("id, title, image_url")
      .limit(5);

    if (photosTableError) {
      console.log("❌ 無法獲取照片數據:", photosTableError.message);
    } else {
      console.log("📸 照片表中的記錄:");
      photos.forEach((photo) => {
        console.log(`  - ${photo.title}: ${photo.image_url}`);
      });
    }

    // 4. 測試圖片 URL 是否可訪問
    console.log("\n4️⃣ 測試圖片 URL 可訪問性...");
    if (photos && photos.length > 0) {
      const testUrl = photos[0].image_url;
      console.log(`🔗 測試 URL: ${testUrl}`);

      try {
        const response = await fetch(testUrl);
        if (response.ok) {
          console.log("✅ 圖片 URL 可以訪問");
        } else {
          console.log(`❌ 圖片 URL 無法訪問 (HTTP ${response.status})`);
        }
      } catch (error) {
        console.log("❌ 圖片 URL 測試失敗:", error.message);
      }
    }

    // 5. 檢查 RLS 政策
    console.log("\n5️⃣ 檢查可能的權限問題...");
    console.log("💡 如果 photos bucket 存在但無法訪問，可能是以下原因:");
    console.log("   - RLS (Row Level Security) 政策限制");
    console.log("   - Bucket 權限設置問題");
    console.log("   - API Key 權限不足");

    console.log("\n🎯 建議的解決方案:");
    console.log(
      "1. 檢查 Supabase Storage 中的 photos bucket 是否設置為 public"
    );
    console.log("2. 檢查 RLS 政策是否允許匿名訪問");
    console.log("3. 確認 API Key 有足夠的權限");
  } catch (error) {
    console.error("❌ 檢查過程中發生錯誤:", error);
  }
}

// 執行檢查
detailedSupabaseCheck().catch(console.error);
