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

async function checkActualUpload() {
  console.log("🔍 檢查實際檔案上傳情況...\n");

  try {
    // 檢查 photos bucket 中的實際檔案
    console.log("📋 1. 檢查 photos bucket 中的檔案");
    const { data: files, error: listError } = await supabase.storage
      .from("photos")
      .list();

    if (listError) {
      console.log(`❌ 無法列出檔案: ${listError.message}`);
      return;
    }

    console.log(`📦 photos bucket 中實際有 ${files.length} 個檔案:`);
    if (files.length === 0) {
      console.log("   (沒有檔案)");
    } else {
      files.forEach((file, index) => {
        console.log(
          `   ${index + 1}. ${file.name} (${
            file.metadata?.size || "N/A"
          } bytes)`
        );
      });
    }

    // 嘗試上傳一個真實的測試圖片
    console.log("\n📋 2. 上傳真實測試圖片");

    // 創建一個簡單的測試圖片 (1x1 像素的 PNG)
    const testImageData = new Uint8Array([
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a, // PNG 標頭
      0x00,
      0x00,
      0x00,
      0x0d,
      0x49,
      0x48,
      0x44,
      0x52, // IHDR chunk
      0x00,
      0x00,
      0x00,
      0x01,
      0x00,
      0x00,
      0x00,
      0x01, // 1x1 像素
      0x08,
      0x02,
      0x00,
      0x00,
      0x00,
      0x90,
      0x77,
      0x53,
      0xde, // 其他參數
      0x00,
      0x00,
      0x00,
      0x0c,
      0x49,
      0x44,
      0x41,
      0x54, // IDAT chunk
      0x08,
      0x99,
      0x01,
      0x01,
      0x00,
      0x00,
      0x00,
      0xff,
      0xff,
      0x00,
      0x00,
      0x00,
      0x02,
      0x00,
      0x01, // 圖片數據
      0x00,
      0x00,
      0x00,
      0x00,
      0x49,
      0x45,
      0x4e,
      0x44,
      0xae,
      0x42,
      0x60,
      0x82, // IEND chunk
    ]);

    const testFile = new File([testImageData], "test-image.png", {
      type: "image/png",
    });

    const fileName = `test-${Date.now()}.png`;
    console.log(`   上傳檔案: ${fileName}`);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, testFile);

    if (uploadError) {
      console.log(`❌ 上傳失敗: ${uploadError.message}`);
      console.log(`📋 錯誤詳情: ${JSON.stringify(uploadError, null, 2)}`);
    } else {
      console.log(`✅ 上傳成功: ${uploadData.path}`);

      // 獲取公開 URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(fileName);

      console.log(`🔗 公開 URL: ${publicUrl}`);

      // 再次檢查檔案列表
      console.log("\n📋 3. 上傳後檢查檔案列表");
      const { data: filesAfter, error: listErrorAfter } = await supabase.storage
        .from("photos")
        .list();

      if (listErrorAfter) {
        console.log(`❌ 無法列出檔案: ${listErrorAfter.message}`);
      } else {
        console.log(
          `📦 上傳後 photos bucket 中有 ${filesAfter.length} 個檔案:`
        );
        filesAfter.forEach((file, index) => {
          console.log(
            `   ${index + 1}. ${file.name} (${
              file.metadata?.size || "N/A"
            } bytes)`
          );
        });
      }

      // 測試下載檔案
      console.log("\n📋 4. 測試下載檔案");
      const { data: downloadData, error: downloadError } =
        await supabase.storage.from("photos").download(fileName);

      if (downloadError) {
        console.log(`❌ 下載失敗: ${downloadError.message}`);
      } else {
        console.log(`✅ 下載成功，檔案大小: ${downloadData.size} bytes`);
      }

      // 清理測試檔案
      console.log("\n📋 5. 清理測試檔案");
      const { error: deleteError } = await supabase.storage
        .from("photos")
        .remove([fileName]);

      if (deleteError) {
        console.log(`⚠️ 刪除失敗: ${deleteError.message}`);
      } else {
        console.log("✅ 測試檔案已清理");
      }
    }
  } catch (error) {
    console.error("❌ 檢查失敗:", error);
  }
}

// 執行檢查
checkActualUpload();
