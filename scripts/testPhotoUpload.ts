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

async function testPhotoUpload() {
  console.log("🧪 測試照片上傳功能...\n");

  try {
    // 測試 1: 檢查 photos bucket 是否可訪問
    console.log("📋 測試 1: 檢查 photos bucket 訪問權限");
    const { data: files, error: listError } = await supabase.storage
      .from("photos")
      .list();

    if (listError) {
      console.log(`❌ 無法訪問 photos bucket: ${listError.message}`);
      return;
    }

    console.log(`✅ photos bucket 可訪問，目前有 ${files.length} 個檔案`);

    // 測試 2: 創建一個測試圖片檔案
    console.log("\n📋 測試 2: 創建測試圖片");
    const testImageData = new Blob(["test image data"], { type: "image/jpeg" });
    const testFile = new File([testImageData], "test-image.jpg", {
      type: "image/jpeg",
    });

    // 測試 3: 嘗試上傳測試圖片
    console.log("📋 測試 3: 上傳測試圖片");
    const fileName = `test/${Date.now()}.jpg`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, testFile);

    if (uploadError) {
      console.log(`❌ 上傳失敗: ${uploadError.message}`);
      console.log(`📋 錯誤詳情: ${JSON.stringify(uploadError, null, 2)}`);
    } else {
      console.log(`✅ 上傳成功: ${uploadData.path}`);

      // 測試 4: 獲取公開 URL
      console.log("\n📋 測試 4: 獲取公開 URL");
      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(fileName);

      console.log(`✅ 公開 URL: ${publicUrl}`);

      // 測試 5: 刪除測試檔案
      console.log("\n📋 測試 5: 清理測試檔案");
      const { error: deleteError } = await supabase.storage
        .from("photos")
        .remove([fileName]);

      if (deleteError) {
        console.log(`⚠️ 刪除測試檔案失敗: ${deleteError.message}`);
      } else {
        console.log("✅ 測試檔案已清理");
      }
    }

    console.log("\n🎉 照片上傳功能測試完成！");
    console.log("💡 如果上傳成功，表示照片管理系統可以正常使用");
  } catch (error) {
    console.error("❌ 測試失敗:", error);
  }
}

// 執行測試
testPhotoUpload();
