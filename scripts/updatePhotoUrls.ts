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

// 使用更可靠的圖片 URL
const reliableImageUrls = {
  hero: [
    "https://picsum.photos/1920/1080?random=1",
    "https://picsum.photos/1920/1080?random=2",
    "https://picsum.photos/1920/1080?random=3",
  ],
  image_slider: [
    "https://picsum.photos/1920/1080?random=4",
    "https://picsum.photos/1920/1080?random=5",
  ],
  brand_logo: [
    "https://picsum.photos/400/400?random=6",
    "https://picsum.photos/400/400?random=7",
    "https://picsum.photos/400/400?random=8",
    "https://picsum.photos/400/400?random=9",
    "https://picsum.photos/400/400?random=10",
    "https://picsum.photos/400/400?random=11",
  ],
  store_photo: [
    "https://picsum.photos/1200/800?random=12",
    "https://picsum.photos/1200/800?random=13",
  ],
  news_carousel: [
    "https://picsum.photos/800/800?random=14",
    "https://picsum.photos/800/800?random=15",
  ],
};

async function updatePhotoUrls() {
  console.log("🔄 更新照片 URL 為可靠的圖片服務...\n");

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

    console.log(`📦 找到 ${photos.length} 張照片，開始更新 URL...`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const photo of photos) {
      try {
        // 根據類別選擇新的 URL
        const categoryUrls =
          reliableImageUrls[photo.category as keyof typeof reliableImageUrls];
        if (!categoryUrls || categoryUrls.length === 0) {
          console.log(`   ⚠️ 沒有可用的 ${photo.category} 類別 URL`);
          continue;
        }

        // 根據顯示順序選擇 URL
        const urlIndex = (photo.display_order - 1) % categoryUrls.length;
        const newUrl = categoryUrls[urlIndex];

        console.log(`   🔧 ${photo.title || photo.brand_name}: 更新 URL`);

        // 更新資料庫
        const { error: updateError } = await supabase
          .from("photos")
          .update({ image_url: newUrl })
          .eq("id", photo.id);

        if (updateError) {
          console.log(`   ❌ 更新失敗: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ 更新成功: ${newUrl}`);
          updatedCount++;
        }

        // 避免請求過於頻繁
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (err) {
        console.log(`   ❌ 處理失敗: ${err}`);
        errorCount++;
      }
    }

    console.log(`\n📊 更新結果: ${updatedCount} 成功, ${errorCount} 失敗`);

    // 驗證更新結果
    console.log("\n🔍 驗證更新結果...");
    const { data: updatedPhotos, error: verifyError } = await supabase
      .from("photos")
      .select("*")
      .order("category, display_order");

    if (verifyError) {
      console.log(`❌ 無法驗證: ${verifyError.message}`);
      return;
    }

    let accessibleCount = 0;
    for (const photo of updatedPhotos.slice(0, 5)) {
      // 只檢查前 5 張
      try {
        const response = await fetch(photo.image_url, { method: "HEAD" });
        if (response.ok) {
          console.log(`   ✅ ${photo.title || photo.brand_name}: 可訪問`);
          accessibleCount++;
        } else {
          console.log(
            `   ❌ ${photo.title || photo.brand_name}: HTTP ${response.status}`
          );
        }
      } catch (err) {
        console.log(`   ❌ ${photo.title || photo.brand_name}: 無法訪問`);
      }
    }

    console.log(
      `\n✅ URL 更新完成！${accessibleCount}/${Math.min(
        5,
        updatedPhotos.length
      )} 張照片可訪問`
    );

    // 顯示最終的照片列表
    console.log("\n📋 最終照片列表:");
    const categoryGroups: Record<string, any[]> = {};
    updatedPhotos.forEach((photo) => {
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
  } catch (error) {
    console.error("❌ 更新失敗:", error);
  }
}

// 執行更新
updatePhotoUrls();

