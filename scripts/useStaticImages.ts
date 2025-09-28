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

// 使用靜態的圖片 URL (這些是可靠的圖片服務)
const staticImageUrls = {
  hero: [
    "https://via.placeholder.com/1920x1080/4A90E2/FFFFFF?text=Hero+1",
    "https://via.placeholder.com/1920x1080/7ED321/FFFFFF?text=Hero+2",
    "https://via.placeholder.com/1920x1080/F5A623/FFFFFF?text=Hero+3",
  ],
  image_slider: [
    "https://via.placeholder.com/1920x1080/BD10E0/FFFFFF?text=Slider+1",
    "https://via.placeholder.com/1920x1080/50E3C2/FFFFFF?text=Slider+2",
  ],
  brand_logo: [
    "https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Ray-Ban",
    "https://via.placeholder.com/400x400/7ED321/FFFFFF?text=LINDBERG",
    "https://via.placeholder.com/400x400/F5A623/FFFFFF?text=GUCCI",
    "https://via.placeholder.com/400x400/BD10E0/FFFFFF?text=999.9",
    "https://via.placeholder.com/400x400/50E3C2/FFFFFF?text=BVLGARI",
    "https://via.placeholder.com/400x400/D0021B/FFFFFF?text=MONTBLANC",
  ],
  store_photo: [
    "https://via.placeholder.com/1200x800/4A90E2/FFFFFF?text=台北信義店",
    "https://via.placeholder.com/1200x800/7ED321/FFFFFF?text=台北東區店",
  ],
  news_carousel: [
    "https://via.placeholder.com/800x800/F5A623/FFFFFF?text=新品上市",
    "https://via.placeholder.com/800x800/BD10E0/FFFFFF?text=限時優惠",
  ],
};

async function useStaticImages() {
  console.log("🔄 使用靜態圖片 URL...\n");

  try {
    // 獲取所有照片
    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .order("category, display_order");

    if (error) {
      console.log(`❌ 無法獲取照片: ${error.message}`);
      return;
    }

    console.log(`📦 找到 ${photos.length} 張照片，開始更新為靜態圖片...`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const photo of photos) {
      try {
        // 根據類別選擇新的 URL
        const categoryUrls =
          staticImageUrls[photo.category as keyof typeof staticImageUrls];
        if (!categoryUrls || categoryUrls.length === 0) {
          console.log(`   ⚠️ 沒有可用的 ${photo.category} 類別 URL`);
          continue;
        }

        // 根據顯示順序選擇 URL
        const urlIndex = (photo.display_order - 1) % categoryUrls.length;
        const newUrl = categoryUrls[urlIndex];

        console.log(`   🔧 ${photo.title || photo.brand_name}: 更新為靜態圖片`);

        // 更新資料庫
        const { error: updateError } = await supabase
          .from("photos")
          .update({ image_url: newUrl })
          .eq("id", photo.id);

        if (updateError) {
          console.log(`   ❌ 更新失敗: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ 更新成功`);
          updatedCount++;
        }

        // 避免請求過於頻繁
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (err) {
        console.log(`   ❌ 處理失敗: ${err}`);
        errorCount++;
      }
    }

    console.log(`\n📊 更新結果: ${updatedCount} 成功, ${errorCount} 失敗`);

    // 顯示最終的照片列表
    console.log("\n📋 最終照片列表:");
    const { data: finalPhotos, error: finalError } = await supabase
      .from("photos")
      .select("*")
      .order("category, display_order");

    if (finalError) {
      console.log(`❌ 無法獲取最終照片: ${finalError.message}`);
      return;
    }

    const categoryGroups: Record<string, any[]> = {};
    finalPhotos.forEach((photo) => {
      if (!categoryGroups[photo.category]) {
        categoryGroups[photo.category] = [];
      }
      categoryGroups[photo.category].push(photo);
    });

    Object.entries(categoryGroups).forEach(([category, categoryPhotos]) => {
      console.log(`\n📸 ${category} (${categoryPhotos.length} 張):`);
      categoryPhotos.forEach((photo, index) => {
        console.log(
          `   ${index + 1}. ${photo.title || photo.brand_name || "未命名"}`
        );
        console.log(`      URL: ${photo.image_url}`);
      });
    });

    console.log("\n✅ 靜態圖片 URL 設定完成！");
    console.log(
      "現在所有照片都使用可靠的靜態圖片 URL，應該可以在後台正常顯示。"
    );
  } catch (error) {
    console.error("❌ 更新失敗:", error);
  }
}

// 執行更新
useStaticImages();

