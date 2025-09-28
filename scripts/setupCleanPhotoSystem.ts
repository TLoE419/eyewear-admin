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

// 簡潔的照片配置
const photoConfig = {
  hero: {
    name: "Hero 輪播照片",
    maxCount: 5,
    files: ["hero-1.jpg", "hero-2.jpg"],
  },
  image_slider: {
    name: "Image Slider 輪播照片",
    maxCount: 10,
    files: [
      "Ray.Ban/RayBan_1.jpg",
      "LINDBERG/Lindberg_1.jpg",
      "GUCCI/GUCCI_1.jpg",
    ],
  },
  brand_logo: {
    name: "Brand Logo 品牌 Logo",
    maxCount: 20,
    files: [
      "Logo/rayban.jpg",
      "Logo/lindberg.jpg",
      "Logo/gucci.jpg",
      "Logo/9999.jpg",
      "Logo/bvlgari.jpg",
      "Logo/montblanc.jpg",
    ],
  },
  store_photo: {
    name: "Store Photo 分店照片",
    maxCount: 10,
    files: ["Store_1.jpg", "Store_2.jpg", "Store_3.jpg", "Store_4.jpg"],
  },
  news_carousel: {
    name: "News Carousel 跑馬燈照片",
    maxCount: 15,
    files: ["999.9/999.9_1.jpg", "BVLGARI/BVLGARI_1.jpg"],
  },
};

async function setupCleanPhotoSystem() {
  console.log("🔄 建立簡潔的照片管理系統...\n");

  try {
    // 檢查 eyewear-web 專案路徑
    if (!fs.existsSync(EYEWEAR_WEB_PATH)) {
      console.log(`❌ 找不到 eyewear-web 專案路徑: ${EYEWEAR_WEB_PATH}`);
      return;
    }

    console.log(`📁 找到 eyewear-web 專案: ${EYEWEAR_WEB_PATH}`);

    // 清理現有照片
    console.log("🗑️ 清理現有照片...");
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteError) {
      console.log(`⚠️ 清理失敗: ${deleteError.message}`);
    } else {
      console.log("✅ 現有照片已清理");
    }

    let totalUploaded = 0;
    let totalErrors = 0;

    // 為每個類別上傳照片
    for (const [category, config] of Object.entries(photoConfig)) {
      console.log(`\n📸 處理 ${config.name}...`);

      let categoryUploaded = 0;
      let categoryErrors = 0;

      for (let i = 0; i < config.files.length; i++) {
        const fileName = config.files[i];
        const sourceFilePath = path.join(EYEWEAR_WEB_PATH, fileName);

        try {
          // 檢查檔案是否存在
          if (!fs.existsSync(sourceFilePath)) {
            console.log(`   ⚠️ 檔案不存在: ${fileName}`);
            categoryErrors++;
            continue;
          }

          console.log(`   🔧 上傳: ${fileName}`);

          // 讀取檔案
          const fileBuffer = fs.readFileSync(sourceFilePath);
          const fileExt = path.extname(fileName).toLowerCase();
          const uploadFileName = `${category}/${Date.now()}-${path.basename(
            fileName
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
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("photos")
              .upload(uploadFileName, fileBuffer, {
                contentType: contentType,
              });

          if (uploadError) {
            console.log(`   ❌ 上傳失敗: ${uploadError.message}`);
            categoryErrors++;
            continue;
          }

          // 獲取公開 URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("photos").getPublicUrl(uploadFileName);

          // 建立照片記錄
          const photoData = {
            image_url: publicUrl,
            category: category,
            title: `${config.name} ${i + 1}`,
            display_order: i + 1,
            is_active: true,
          };

          const { data: insertData, error: insertError } = await supabase
            .from("photos")
            .insert(photoData)
            .select()
            .single();

          if (insertError) {
            console.log(`   ❌ 建立記錄失敗: ${insertError.message}`);
            categoryErrors++;
          } else {
            console.log(`   ✅ 成功 (ID: ${insertData.id})`);
            categoryUploaded++;
          }

          // 避免請求過於頻繁
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err) {
          console.log(`   ❌ 處理失敗: ${err}`);
          categoryErrors++;
        }
      }

      console.log(
        `   📊 ${config.name}: ${categoryUploaded} 成功, ${categoryErrors} 失敗`
      );
      totalUploaded += categoryUploaded;
      totalErrors += categoryErrors;
    }

    console.log(`\n📊 總計: ${totalUploaded} 成功, ${totalErrors} 失敗`);

    // 顯示最終結果
    console.log("\n🔍 最終照片列表:");
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
      const categoryName =
        photoConfig[category as keyof typeof photoConfig]?.name || category;
      console.log(`\n📸 ${categoryName} (${categoryPhotos.length} 張):`);
      categoryPhotos.forEach((photo, index) => {
        console.log(`   ${index + 1}. ${photo.title}`);
        console.log(`      URL: ${photo.image_url}`);
      });
    });

    console.log("\n✅ 簡潔照片管理系統建立完成！");
    console.log("現在您可以透過後台管理系統來管理這5種類型的照片。");
  } catch (error) {
    console.error("❌ 建立失敗:", error);
  }
}

// 執行建立
setupCleanPhotoSystem();




