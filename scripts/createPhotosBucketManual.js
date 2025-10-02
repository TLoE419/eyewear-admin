const { createClient } = require("@supabase/supabase-js");

// Supabase 配置
const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createPhotosBucket() {
  console.log("🪣 嘗試創建 photos bucket...\n");

  try {
    // 1. 檢查現有的 buckets
    console.log("1️⃣ 檢查現有的 buckets...");
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log("❌ 無法獲取 buckets:", bucketsError.message);
      return;
    }

    console.log("📋 現有的 buckets:");
    if (buckets && buckets.length > 0) {
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? "public" : "private"})`);
      });
    } else {
      console.log("  (沒有找到任何 buckets)");
    }

    // 2. 檢查 photos bucket 是否已存在
    const photosBucket = buckets?.find(bucket => bucket.name === "photos");
    if (photosBucket) {
      console.log("\n✅ photos bucket 已存在");
      console.log("📋 Bucket 資訊:", {
        name: photosBucket.name,
        public: photosBucket.public,
        file_size_limit: photosBucket.file_size_limit,
        allowed_mime_types: photosBucket.allowed_mime_types
      });
      return;
    }

    // 3. 嘗試創建 photos bucket
    console.log("\n2️⃣ 嘗試創建 photos bucket...");
    const { data: newBucket, error: createError } = await supabase.storage.createBucket("photos", {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/webp",
        "image/svg+xml"
      ]
    });

    if (createError) {
      console.log("❌ 創建 bucket 失敗:", createError.message);
      console.log("📋 錯誤詳情:", createError);
      
      if (createError.message.includes("row-level security policy")) {
        console.log("\n💡 解決方案:");
        console.log("1. 登入 Supabase Dashboard");
        console.log("2. 前往 Storage > Buckets");
        console.log("3. 點擊 'New bucket'");
        console.log("4. 設置 bucket 名稱: photos");
        console.log("5. 設置為 Public bucket");
        console.log("6. 設置文件大小限制: 50MB");
        console.log("7. 允許的 MIME 類型: image/jpeg, image/png, image/webp, image/svg+xml");
      }
    } else {
      console.log("✅ photos bucket 創建成功！");
      console.log("📋 新 bucket 資訊:", newBucket);
    }

  } catch (error) {
    console.log("💥 創建過程中發生錯誤:", error.message);
    console.log("📋 錯誤詳情:", error);
  }
}

// 執行創建
createPhotosBucket().then(() => {
  console.log("\n🎯 創建完成！");
  process.exit(0);
}).catch((error) => {
  console.log("\n💥 創建失敗:", error);
  process.exit(1);
});
