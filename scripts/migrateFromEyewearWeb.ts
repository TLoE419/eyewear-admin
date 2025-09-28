import dotenv from "dotenv";
import fs from "fs";
import path from "path";

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

// eyewear-web 專案路徑
const EYEWEAR_WEB_PATH = "/Users/tloe/Documents/eyewear-web/public";

// 照片映射配置
const photoMapping = [
  // Hero 輪播照片
  {
    sourcePath: "hero-1.jpg",
    category: "hero" as const,
    title: "Hero 輪播照片 1",
    display_order: 1,
  },
  {
    sourcePath: "hero-2.jpg",
    category: "hero" as const,
    title: "Hero 輪播照片 2",
    display_order: 2,
  },

  // Brand Logo 品牌 Logo
  {
    sourcePath: "Logo/rayban.jpg",
    category: "brand_logo" as const,
    brand_name: "Ray-Ban",
    display_order: 1,
  },
  {
    sourcePath: "Logo/lindberg.jpg",
    category: "brand_logo" as const,
    brand_name: "LINDBERG",
    display_order: 2,
  },
  {
    sourcePath: "Logo/gucci.jpg",
    category: "brand_logo" as const,
    brand_name: "GUCCI",
    display_order: 3,
  },
  {
    sourcePath: "Logo/9999.jpg",
    category: "brand_logo" as const,
    brand_name: "999.9",
    display_order: 4,
  },
  {
    sourcePath: "Logo/bvlgari.jpg",
    category: "brand_logo" as const,
    brand_name: "BVLGARI",
    display_order: 5,
  },
  {
    sourcePath: "Logo/montblanc.jpg",
    category: "brand_logo" as const,
    brand_name: "MONTBLANC",
    display_order: 6,
  },

  // Store Photo 分店照片
  {
    sourcePath: "Store_1.jpg",
    category: "store_photo" as const,
    title: "台北信義店",
    store_name: "台北信義店",
    display_order: 1,
  },
  {
    sourcePath: "Store_2.jpg",
    category: "store_photo" as const,
    title: "台北東區店",
    store_name: "台北東區店",
    display_order: 2,
  },
  {
    sourcePath: "Store_3.jpg",
    category: "store_photo" as const,
    title: "台北西門店",
    store_name: "台北西門店",
    display_order: 3,
  },
  {
    sourcePath: "Store_4.jpg",
    category: "store_photo" as const,
    title: "台北天母店",
    store_name: "台北天母店",
    display_order: 4,
  },

  // Image Slider 輪播照片 (使用產品照片)
  {
    sourcePath: "Ray.Ban/RayBan_1.jpg",
    category: "image_slider" as const,
    title: "Ray-Ban 經典款",
    subtitle: "時尚百搭，經典不敗",
    display_order: 1,
  },
  {
    sourcePath: "LINDBERG/Lindberg_1.jpg",
    category: "image_slider" as const,
    title: "LINDBERG 輕量設計",
    subtitle: "極致輕量，舒適配戴",
    display_order: 2,
  },
  {
    sourcePath: "GUCCI/GUCCI_1.jpg",
    category: "image_slider" as const,
    title: "GUCCI 時尚系列",
    subtitle: "奢華時尚，引領潮流",
    display_order: 3,
  },

  // News Carousel 跑馬燈照片
  {
    sourcePath: "999.9/999.9_1.jpg",
    category: "news_carousel" as const,
    title: "999.9 新品上市",
    brand_name: "999.9",
    display_order: 1,
  },
  {
    sourcePath: "BVLGARI/BVLGARI_1.jpg",
    category: "news_carousel" as const,
    title: "BVLGARI 限時優惠",
    brand_name: "BVLGARI",
    display_order: 2,
  },
];

async function migrateFromEyewearWeb() {
  console.log("🔄 從 eyewear-web 專案遷移真實照片...\n");

  try {
    // 檢查 eyewear-web 專案路徑
    if (!fs.existsSync(EYEWEAR_WEB_PATH)) {
      console.log(`❌ 找不到 eyewear-web 專案路徑: ${EYEWEAR_WEB_PATH}`);
      return;
    }

    console.log(`📁 找到 eyewear-web 專案: ${EYEWEAR_WEB_PATH}`);

    // 先清理現有的照片
    console.log("🗑️ 清理現有照片...");
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // 刪除所有照片

    if (deleteError) {
      console.log(`⚠️ 清理失敗: ${deleteError.message}`);
    } else {
      console.log("✅ 現有照片已清理");
    }

    let uploadedCount = 0;
    let errorCount = 0;

    console.log(`\n📸 開始上傳 ${photoMapping.length} 張照片...`);

    for (const photoConfig of photoMapping) {
      try {
        const sourceFilePath = path.join(
          EYEWEAR_WEB_PATH,
          photoConfig.sourcePath
        );

        // 檢查檔案是否存在
        if (!fs.existsSync(sourceFilePath)) {
          console.log(`   ⚠️ 檔案不存在: ${photoConfig.sourcePath}`);
          errorCount++;
          continue;
        }

        console.log(
          `   🔧 ${photoConfig.title || photoConfig.brand_name}: 上傳 ${
            photoConfig.sourcePath
          }`
        );

        // 讀取檔案
        const fileBuffer = fs.readFileSync(sourceFilePath);
        const fileExt = path.extname(photoConfig.sourcePath).toLowerCase();
        const fileName = `${photoConfig.category}/${Date.now()}-${path.basename(
          photoConfig.sourcePath
        )}`;

        // 修正 MIME 類型
        let contentType = "image/jpeg";
        if (fileExt === ".png") {
          contentType = "image/png";
        } else if (fileExt === ".jpg" || fileExt === ".jpeg") {
          contentType = "image/jpeg";
        } else if (fileExt === ".webp") {
          contentType = "image/webp";
        } else if (fileExt === ".svg") {
          contentType = "image/svg+xml";
        }

        // 上傳到 Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("photos")
          .upload(fileName, fileBuffer, {
            contentType: contentType,
          });

        if (uploadError) {
          console.log(`   ❌ 上傳失敗: ${uploadError.message}`);
          errorCount++;
          continue;
        }

        // 獲取公開 URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(fileName);

        console.log(`   ✅ 上傳成功: ${publicUrl}`);

        // 建立照片記錄
        const photoData = {
          image_url: publicUrl,
          category: photoConfig.category,
          title: photoConfig.title,
          subtitle: photoConfig.subtitle,
          brand_name: photoConfig.brand_name,
          store_name: photoConfig.store_name,
          display_order: photoConfig.display_order,
          is_active: true,
        };

        const { data: insertData, error: insertError } = await supabase
          .from("photos")
          .insert(photoData)
          .select()
          .single();

        if (insertError) {
          console.log(`   ❌ 建立記錄失敗: ${insertError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ 記錄建立成功 (ID: ${insertData.id})`);
          uploadedCount++;
        }

        // 避免請求過於頻繁
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (err) {
        console.log(`   ❌ 處理失敗: ${err}`);
        errorCount++;
      }
    }

    console.log(`\n📊 遷移結果: ${uploadedCount} 成功, ${errorCount} 失敗`);

    // 檢查最終結果
    console.log("\n🔍 檢查最終結果...");
    const { data: finalPhotos, error: finalError } = await supabase
      .from("photos")
      .select("*")
      .order("category, display_order");

    if (finalError) {
      console.log(`❌ 無法獲取最終照片: ${finalError.message}`);
      return;
    }

    console.log(`📦 資料庫中現有 ${finalPhotos.length} 張照片:`);

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

    // 測試幾張照片的可訪問性
    console.log("\n🔍 測試照片可訪問性:");
    for (const photo of finalPhotos.slice(0, 3)) {
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
        console.log(`   ❌ ${photo.title || photo.brand_name}: 無法訪問`);
      }
    }

    console.log("\n✅ 真實照片遷移完成！");
    console.log(
      "現在所有照片都來自 eyewear-web 專案，可以在後台管理系統中查看和管理。"
    );
  } catch (error) {
    console.error("❌ 遷移失敗:", error);
  }
}

// 執行遷移
migrateFromEyewearWeb();
