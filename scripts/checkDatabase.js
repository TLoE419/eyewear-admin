#!/usr/bin/env node

// 檢查資料庫狀態腳本

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// 載入環境變數
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 請設定 Supabase 環境變數");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("🔍 檢查資料庫狀態...\n");

  try {
    // 檢查所有照片的欄位
    console.log("📋 檢查所有照片的欄位結構:");
    const { data: allPhotos, error: allError } = await supabase
      .from("photos")
      .select("*")
      .limit(1);

    if (allError) {
      console.error("❌ 獲取照片失敗:", allError);
      return;
    }

    if (allPhotos.length > 0) {
      const photo = allPhotos[0];
      console.log("✅ 照片欄位:");
      Object.keys(photo).forEach((key) => {
        console.log(`   - ${key}: ${typeof photo[key]}`);
      });
    }

    // 檢查 image_slider 類別的照片
    console.log("\n📸 檢查 image_slider 類別的照片:");
    const { data: sliderPhotos, error: sliderError } = await supabase
      .from("photos")
      .select("id, title, subtitle, 文字欄1, 文字欄2, display_order")
      .eq("category", "image_slider")
      .order("display_order");

    if (sliderError) {
      console.error("❌ 獲取 slider 照片失敗:", sliderError);
      return;
    }

    if (sliderPhotos.length === 0) {
      console.log("📝 沒有找到 image_slider 類別的照片");
      return;
    }

    console.log(`✅ 找到 ${sliderPhotos.length} 張 slider 照片:`);
    console.table(
      sliderPhotos.map((photo) => ({
        順序: photo.display_order,
        標題: photo.title,
        副標題: photo.subtitle,
        文字欄1: photo.文字欄1 || "空",
        文字欄2: photo.文字欄2 || "空",
      }))
    );

    // 檢查是否有空白的文字欄位
    const emptyFields = sliderPhotos.filter(
      (photo) => !photo.文字欄1 || !photo.文字欄2
    );

    if (emptyFields.length > 0) {
      console.log(`\n⚠️  發現 ${emptyFields.length} 張照片有空白文字欄位:`);
      emptyFields.forEach((photo) => {
        console.log(
          `   - 照片 ${photo.display_order}: 文字欄1="${
            photo.文字欄1 || "空"
          }", 文字欄2="${photo.文字欄2 || "空"}"`
        );
      });
    } else {
      console.log("\n✅ 所有 slider 照片都有完整的文字內容");
    }
  } catch (error) {
    console.error("❌ 檢查失敗:", error);
  }
}

// 執行檢查
checkDatabase();
