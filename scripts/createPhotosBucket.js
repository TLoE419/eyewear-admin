const { createClient } = require("@supabase/supabase-js");

// Supabase 配置
const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createPhotosBucket() {
  console.log("🪣 開始創建 photos bucket...\n");

  try {
    // 1. 檢查現有的 buckets
    console.log("1️⃣ 檢查現有的 buckets...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log("❌ 無法獲取 buckets:", bucketsError.message);
      return;
    }

    console.log("📋 現有的 buckets:");
    buckets.forEach((bucket) => {
      console.log(
        `  - ${bucket.name} (${bucket.public ? "public" : "private"})`
      );
    });

    // 2. 檢查 photos bucket 是否已存在
    const photosBucket = buckets.find((bucket) => bucket.name === "photos");
    if (photosBucket) {
      console.log("\n✅ photos bucket 已存在");
      return;
    }

    // 3. 創建 photos bucket
    console.log("\n2️⃣ 創建 photos bucket...");
    const { data: newBucket, error: createError } =
      await supabase.storage.createBucket("photos", {
        public: true,
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/svg+xml",
        ],
        fileSizeLimit: 5242880, // 5MB
      });

    if (createError) {
      console.log("❌ 創建 bucket 失敗:", createError.message);
      console.log(
        "\n💡 請手動在 Supabase Storage 中創建 'photos' bucket，並設置為 public"
      );
      return;
    }

    console.log("✅ photos bucket 創建成功！");
    console.log("📋 Bucket 配置:");
    console.log("  - 名稱: photos");
    console.log("  - 公開: true");
    console.log(
      "  - 允許的 MIME 類型: image/jpeg, image/png, image/webp, image/svg+xml"
    );
    console.log("  - 文件大小限制: 5MB");

    // 4. 測試上傳
    console.log("\n3️⃣ 測試 bucket 功能...");
    const testFile = new Blob(["test"], { type: "text/plain" });
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload("test.txt", testFile);

    if (uploadError) {
      console.log("⚠️ 測試上傳失敗:", uploadError.message);
    } else {
      console.log("✅ 測試上傳成功");

      // 清理測試文件
      await supabase.storage.from("photos").remove(["test.txt"]);
      console.log("🧹 測試文件已清理");
    }

    console.log("\n🎉 photos bucket 設置完成！");
  } catch (error) {
    console.error("❌ 創建 bucket 時發生錯誤:", error);
  }
}

// 執行創建
createPhotosBucket().catch(console.error);
