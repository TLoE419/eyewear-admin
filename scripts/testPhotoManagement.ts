import dotenv from "dotenv";

// 載入環境變數
dotenv.config();

import { PhotoApi } from "../src/lib/photoApi";
import { CreatePhotoData, PhotoCategory } from "../src/types/photo";

async function testPhotoManagement() {
  console.log("🧪 開始測試照片管理功能...\n");

  try {
    // 測試 1: 獲取照片列表
    console.log("📋 測試 1: 獲取照片列表");
    const photos = await PhotoApi.getPhotos({ page: 1, perPage: 10 });
    console.log(`✅ 成功獲取 ${photos.data.length} 張照片`);
    console.log(`📊 總計: ${photos.total} 張照片\n`);

    // 測試 2: 根據類別獲取照片
    console.log("📋 測試 2: 根據類別獲取照片");
    const heroPhotos = await PhotoApi.getPhotosByCategory("hero");
    console.log(`✅ 成功獲取 ${heroPhotos.length} 張 Hero 照片\n`);

    // 測試 3: 獲取類別統計
    console.log("📋 測試 3: 獲取類別統計");
    const categoryCounts = await PhotoApi.getCategoryCounts();
    console.log("✅ 類別統計:");
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} 張`);
    });
    console.log("");

    // 測試 4: 創建測試照片（如果沒有照片的話）
    if (photos.data.length === 0) {
      console.log("📋 測試 4: 創建測試照片");
      const testPhotoData: CreatePhotoData = {
        image_url:
          "https://via.placeholder.com/1920x1080/1976d2/ffffff?text=Test+Hero+Photo",
        category: "hero",
        title: "測試 Hero 照片",
        subtitle: "這是一張測試照片",
        display_order: 1,
        is_active: true,
      };

      const newPhoto = await PhotoApi.createPhoto(testPhotoData);
      console.log(`✅ 成功創建測試照片: ${newPhoto.id}`);
      console.log(`   標題: ${newPhoto.title}`);
      console.log(`   類別: ${newPhoto.category}\n`);
    } else {
      console.log("📋 測試 4: 跳過創建測試照片（已有照片）\n");
    }

    // 測試 5: 更新照片
    if (photos.data.length > 0) {
      console.log("📋 測試 5: 更新照片");
      const firstPhoto = photos.data[0];
      const updatedPhoto = await PhotoApi.updatePhoto(firstPhoto.id, {
        title: `${firstPhoto.title} (已更新)`,
        display_order: firstPhoto.display_order + 1,
      });
      console.log(`✅ 成功更新照片: ${updatedPhoto.id}`);
      console.log(`   新標題: ${updatedPhoto.title}`);
      console.log(`   新順序: ${updatedPhoto.display_order}\n`);
    } else {
      console.log("📋 測試 5: 跳過更新照片（沒有照片）\n");
    }

    // 測試 6: 獲取單張照片
    if (photos.data.length > 0) {
      console.log("📋 測試 6: 獲取單張照片");
      const firstPhoto = photos.data[0];
      const photo = await PhotoApi.getPhoto(firstPhoto.id);
      console.log(`✅ 成功獲取照片: ${photo.id}`);
      console.log(`   標題: ${photo.title}`);
      console.log(`   類別: ${photo.category}`);
      console.log(`   啟用狀態: ${photo.is_active}\n`);
    } else {
      console.log("📋 測試 6: 跳過獲取單張照片（沒有照片）\n");
    }

    console.log("🎉 所有測試完成！照片管理功能正常運作。");
  } catch (error) {
    console.error("❌ 測試失敗:", error);

    if (error instanceof Error) {
      if (error.message.includes('relation "photos" does not exist')) {
        console.log("\n💡 提示: 請先執行以下命令建立 photos 表:");
        console.log("   npm run create-photos-table");
      } else if (error.message.includes("Supabase configuration is missing")) {
        console.log("\n💡 提示: 請檢查環境變數設定:");
        console.log("   NEXT_PUBLIC_SUPABASE_URL");
        console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY");
      }
    }
  }
}

// 執行測試
testPhotoManagement();
