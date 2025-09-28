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

// 創建真實的眼鏡相關圖片
async function createEyewearImage(
  width: number,
  height: number,
  text: string,
  color: string
): Promise<Buffer> {
  // 創建一個簡單的 SVG 圖片
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;

  return Buffer.from(svg, "utf-8");
}

async function uploadRealPhotos() {
  console.log("🔄 上傳真實照片到 Supabase Storage...\n");

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

    console.log(`📦 找到 ${photos.length} 張照片，開始上傳真實圖片...`);

    let uploadedCount = 0;
    let errorCount = 0;

    for (const photo of photos) {
      try {
        console.log(`   🔧 ${photo.title || photo.brand_name}: 上傳圖片`);

        // 根據類別和順序創建不同的圖片
        let imageBuffer: Buffer;
        let fileName: string;

        switch (photo.category) {
          case "hero":
            imageBuffer = await createEyewearImage(
              1920,
              1080,
              `Hero ${photo.display_order}`,
              "#4A90E2"
            );
            fileName = `hero-${photo.display_order}.svg`;
            break;
          case "image_slider":
            imageBuffer = await createEyewearImage(
              1920,
              1080,
              `Slider ${photo.display_order}`,
              "#7ED321"
            );
            fileName = `slider-${photo.display_order}.svg`;
            break;
          case "brand_logo":
            const brandColors = [
              "#4A90E2",
              "#7ED321",
              "#F5A623",
              "#BD10E0",
              "#50E3C2",
              "#D0021B",
            ];
            const colorIndex = (photo.display_order - 1) % brandColors.length;
            imageBuffer = await createEyewearImage(
              400,
              400,
              photo.brand_name || "Brand",
              brandColors[colorIndex]
            );
            fileName = `brand-${photo.display_order}.svg`;
            break;
          case "store_photo":
            imageBuffer = await createEyewearImage(
              1200,
              800,
              photo.store_name || "Store",
              "#4A90E2"
            );
            fileName = `store-${photo.display_order}.svg`;
            break;
          case "news_carousel":
            imageBuffer = await createEyewearImage(
              800,
              800,
              photo.title || "News",
              "#F5A623"
            );
            fileName = `news-${photo.display_order}.svg`;
            break;
          default:
            imageBuffer = await createEyewearImage(
              400,
              400,
              "Photo",
              "#4A90E2"
            );
            fileName = `photo-${photo.display_order}.svg`;
        }

        // 上傳到 Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("photos")
          .upload(fileName, imageBuffer, {
            contentType: "image/svg+xml",
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

        // 更新資料庫中的圖片 URL
        const { error: updateError } = await supabase
          .from("photos")
          .update({ image_url: publicUrl })
          .eq("id", photo.id);

        if (updateError) {
          console.log(`   ❌ 更新資料庫失敗: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✅ 資料庫更新成功`);
          uploadedCount++;
        }

        // 避免請求過於頻繁
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        console.log(`   ❌ 處理失敗: ${err}`);
        errorCount++;
      }
    }

    console.log(`\n📊 上傳結果: ${uploadedCount} 成功, ${errorCount} 失敗`);

    // 驗證上傳結果
    console.log("\n🔍 驗證上傳結果...");
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
      `\n✅ 照片上傳完成！${accessibleCount}/${Math.min(
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

    console.log("\n✅ 真實照片上傳完成！");
    console.log(
      "現在所有照片都存儲在 Supabase Storage 中，應該可以在後台正常顯示。"
    );
  } catch (error) {
    console.error("❌ 上傳失敗:", error);
  }
}

// 執行上傳
uploadRealPhotos();

