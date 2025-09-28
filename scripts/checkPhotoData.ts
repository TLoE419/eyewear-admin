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

async function checkPhotoData() {
  console.log("🔍 檢查照片資料庫內容...\n");

  try {
    // 獲取所有照片
    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(`❌ 無法獲取照片: ${error.message}`);
      return;
    }

    console.log(`📦 資料庫中總共有 ${photos.length} 張照片:`);
    console.log("");

    // 按類別分組顯示
    const categoryGroups: Record<string, any[]> = {};
    photos.forEach((photo) => {
      if (!categoryGroups[photo.category]) {
        categoryGroups[photo.category] = [];
      }
      categoryGroups[photo.category].push(photo);
    });

    Object.entries(categoryGroups).forEach(([category, categoryPhotos]) => {
      console.log(`📸 ${category} (${categoryPhotos.length} 張):`);
      categoryPhotos.forEach((photo, index) => {
        console.log(
          `   ${index + 1}. ${photo.title || photo.brand_name || "未命名"}`
        );
        console.log(`      ID: ${photo.id}`);
        console.log(`      圖片 URL: ${photo.image_url}`);
        console.log(`      顯示順序: ${photo.display_order}`);
        console.log(`      狀態: ${photo.is_active ? "啟用" : "停用"}`);
        console.log(
          `      建立時間: ${new Date(photo.created_at).toLocaleString(
            "zh-TW"
          )}`
        );
        console.log("");
      });
    });

    // 檢查圖片 URL 是否可訪問
    console.log("🔍 檢查圖片 URL 可訪問性:");
    for (const photo of photos.slice(0, 3)) {
      // 只檢查前 3 張
      try {
        const response = await fetch(photo.image_url, { method: "HEAD" });
        if (response.ok) {
          console.log(`   ✅ ${photo.title || photo.brand_name}: 可訪問`);
        } else {
          console.log(
            `   ❌ ${photo.title || photo.brand_name}: HTTP ${response.status}`
          );
        }
      } catch (err) {
        console.log(
          `   ❌ ${photo.title || photo.brand_name}: 無法訪問 - ${err}`
        );
      }
    }
  } catch (error) {
    console.error("❌ 檢查失敗:", error);
  }
}

// 執行檢查
checkPhotoData();

