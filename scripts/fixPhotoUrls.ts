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

// 有效的圖片 URL 列表
const validImageUrls = {
  hero: [
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&h=1080&fit=crop&auto=format",
  ],
  image_slider: [
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&h=1080&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=1920&h=1080&fit=crop&auto=format",
  ],
  brand_logo: [
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=400&h=400&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&auto=format",
  ],
  store_photo: [
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=1200&h=800&fit=crop&auto=format",
  ],
  news_carousel: [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=800&fit=crop&auto=format",
  ],
};

async function fixPhotoUrls() {
  console.log("🔄 修復照片 URL...\n");

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

    console.log(`📦 找到 ${photos.length} 張照片，開始修復 URL...`);

    let fixedCount = 0;
    let errorCount = 0;

    for (const photo of photos) {
      try {
        // 檢查當前 URL 是否可訪問
        const response = await fetch(photo.image_url, { method: "HEAD" });

        if (response.ok) {
          console.log(`   ✅ ${photo.title || photo.brand_name}: URL 正常`);
          continue;
        }

        // URL 無效，需要修復
        console.log(`   🔧 ${photo.title || photo.brand_name}: 修復 URL`);

        // 根據類別選擇新的 URL
        const categoryUrls =
          validImageUrls[photo.category as keyof typeof validImageUrls];
        if (!categoryUrls || categoryUrls.length === 0) {
          console.log(`   ⚠️ 沒有可用的 ${photo.category} 類別 URL`);
          continue;
        }

        // 根據顯示順序選擇 URL
        const urlIndex = (photo.display_order - 1) % categoryUrls.length;
        const newUrl = categoryUrls[urlIndex];

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
          fixedCount++;
        }

        // 避免請求過於頻繁
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (err) {
        console.log(`   ❌ 處理失敗: ${err}`);
        errorCount++;
      }
    }

    console.log(`\n📊 修復結果: ${fixedCount} 成功, ${errorCount} 失敗`);

    // 驗證修復結果
    console.log("\n🔍 驗證修復結果...");
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
      `\n✅ URL 修復完成！${accessibleCount}/${Math.min(
        5,
        updatedPhotos.length
      )} 張照片可訪問`
    );
  } catch (error) {
    console.error("❌ 修復失敗:", error);
  }
}

// 執行修復
fixPhotoUrls();

