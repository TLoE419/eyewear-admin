#!/usr/bin/env node

// 更新 Slider 照片的文字內容腳本
// 將 slider 的標題和副標題放入 文字欄1 和 文字欄2

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

// Slider 照片的文字內容配置
const sliderTexts = [
  {
    title: "精品眼鏡",
    subtitle: "時尚與品質的完美結合",
  },
  {
    title: "專業服務",
    subtitle: "為您提供最優質的視覺體驗",
  },
  {
    title: "實體店面",
    subtitle: "歡迎蒞臨參觀選購",
  },
  {
    title: "專業驗光",
    subtitle: "精準驗光，舒適配戴",
  },
];

async function updateSliderTexts() {
  console.log("🔄 開始更新 Slider 照片的文字內容...");

  try {
    // 1. 獲取所有 image_slider 類別的照片
    console.log("📋 獲取 image_slider 類別的照片...");

    const { data: sliderPhotos, error: fetchError } = await supabase
      .from("photos")
      .select("*")
      .eq("category", "image_slider")
      .order("display_order");

    if (fetchError) {
      console.error("❌ 獲取照片失敗:", fetchError);
      throw fetchError;
    }

    console.log(`✅ 找到 ${sliderPhotos.length} 張 slider 照片`);

    // 2. 更新每張照片的文字內容
    console.log("📝 更新照片文字內容...");

    for (let i = 0; i < sliderPhotos.length; i++) {
      const photo = sliderPhotos[i];
      const textConfig = sliderTexts[i % sliderTexts.length]; // 循環使用文字配置

      const updates = {
        文字欄1: textConfig.title,
        文字欄2: textConfig.subtitle,
      };

      const { error: updateError } = await supabase
        .from("photos")
        .update(updates)
        .eq("id", photo.id);

      if (updateError) {
        console.error(`❌ 更新照片 ${photo.id} 失敗:`, updateError);
      } else {
        console.log(
          `✅ 更新照片 ${i + 1}: ${textConfig.title} - ${textConfig.subtitle}`
        );
      }
    }

    // 3. 驗證更新結果
    console.log("🔍 驗證更新結果...");

    const { data: updatedPhotos, error: verifyError } = await supabase
      .from("photos")
      .select("id, image_url, 文字欄1, 文字欄2, display_order")
      .eq("category", "image_slider")
      .order("display_order");

    if (verifyError) {
      console.error("❌ 驗證失敗:", verifyError);
    } else {
      console.log("✅ 更新完成！結果如下:");
      console.table(
        updatedPhotos.map((photo) => ({
          id: photo.id,
          display_order: photo.display_order,
          文字欄1: photo.文字欄1,
          文字欄2: photo.文字欄2,
        }))
      );
    }

    console.log(`
🎉 Slider 文字內容更新完成！

📋 更新內容:
- 文字欄1: 標題文字 (精品眼鏡、專業服務、實體店面、專業驗光)
- 文字欄2: 副標題文字 (對應的描述文字)

🔄 現在您可以:
1. 在後台管理系統中編輯這些文字
2. 前端會自動顯示更新後的文字內容
3. 文字會根據照片的 display_order 順序顯示

⚠️  注意：如果照片數量超過 4 張，文字會循環使用預設配置
    `);
  } catch (error) {
    console.error("❌ 更新失敗:", error);
    process.exit(1);
  }
}

// 執行更新
updateSliderTexts();
