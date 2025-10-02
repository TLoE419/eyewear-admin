const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Supabase 配置
const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testImageUpload() {
  console.log("🧪 測試圖片上傳功能...\n");

  try {
    // 1. 檢查 Supabase 連接
    console.log("1️⃣ 檢查 Supabase 連接...");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.log("❌ Supabase 連接失敗:", authError.message);
    } else {
      console.log("✅ Supabase 連接成功");
    }

    // 2. 檢查 photos bucket
    console.log("\n2️⃣ 檢查 photos bucket...");
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log("❌ 無法獲取 buckets:", bucketsError.message);
      return;
    }

    const photosBucket = buckets.find(bucket => bucket.name === "photos");
    if (!photosBucket) {
      console.log("❌ photos bucket 不存在");
      return;
    }

    console.log("✅ photos bucket 存在");
    console.log("📋 Bucket 資訊:", {
      name: photosBucket.name,
      public: photosBucket.public,
      file_size_limit: photosBucket.file_size_limit,
      allowed_mime_types: photosBucket.allowed_mime_types
    });

    // 3. 測試上傳一個小圖片
    console.log("\n3️⃣ 測試圖片上傳...");
    
    // 創建一個簡單的測試圖片 (1x1 PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // bit depth, color type, etc.
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, // compressed data
      0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x00, // more data
      0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, // IEND chunk
      0x60, 0x82
    ]);

    const fileName = `test-${Date.now()}.png`;
    const filePath = `photos/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, testImageBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      console.log("❌ 圖片上傳失敗:", uploadError.message);
      console.log("📋 錯誤詳情:", uploadError);
    } else {
      console.log("✅ 圖片上傳成功");
      console.log("📋 上傳結果:", uploadData);

      // 獲取公開 URL
      const { data: { publicUrl } } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);
      
      console.log("🔗 公開 URL:", publicUrl);

      // 清理測試文件
      await supabase.storage.from("photos").remove([filePath]);
      console.log("🧹 測試文件已清理");
    }

    // 4. 檢查 photos 表
    console.log("\n4️⃣ 檢查 photos 表...");
    const { data: photos, error: photosError } = await supabase
      .from("photos")
      .select("*")
      .limit(5);

    if (photosError) {
      console.log("❌ 無法查詢 photos 表:", photosError.message);
    } else {
      console.log("✅ photos 表可訪問");
      console.log(`📋 找到 ${photos.length} 張照片`);
      if (photos.length > 0) {
        console.log("📸 最新照片:", {
          id: photos[0].id,
          title: photos[0].title,
          category: photos[0].category,
          image_url: photos[0].image_url
        });
      }
    }

  } catch (error) {
    console.log("❌ 測試過程中發生錯誤:", error.message);
    console.log("📋 錯誤詳情:", error);
  }
}

// 執行測試
testImageUpload().then(() => {
  console.log("\n🎯 測試完成！");
  process.exit(0);
}).catch((error) => {
  console.log("\n💥 測試失敗:", error);
  process.exit(1);
});
