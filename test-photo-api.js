// 測試照片 API 服務器
import fetch from "node-fetch";

const API_BASE_URL = "http://localhost:3002";

async function testPhotoAPI() {
  console.log("🧪 測試照片 API 服務器...\n");

  try {
    // 測試健康檢查
    console.log("1. 測試健康檢查...");
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ 健康檢查:", healthData);
    console.log("");

    // 測試獲取所有照片
    console.log("2. 測試獲取所有照片...");
    const photosResponse = await fetch(`${API_BASE_URL}/api/photos`);
    const photos = await photosResponse.json();
    console.log(`✅ 獲取到 ${photos.length} 張照片`);
    console.log(
      "前3張照片:",
      photos
        .slice(0, 3)
        .map((p) => ({ id: p.id, category: p.category, title: p.title }))
    );
    console.log("");

    // 測試獲取特定類別照片
    console.log("3. 測試獲取 hero 類別照片...");
    const heroResponse = await fetch(
      `${API_BASE_URL}/api/photos/category/hero`
    );
    const heroPhotos = await heroResponse.json();
    console.log(`✅ 獲取到 ${heroPhotos.length} 張 hero 照片`);
    console.log(
      "Hero 照片:",
      heroPhotos.map((p) => ({
        id: p.id,
        title: p.title,
        image_url: p.image_url,
      }))
    );
    console.log("");

    // 測試獲取 image_slider 類別照片
    console.log("4. 測試獲取 image_slider 類別照片...");
    const sliderResponse = await fetch(
      `${API_BASE_URL}/api/photos/category/image_slider`
    );
    const sliderPhotos = await sliderResponse.json();
    console.log(`✅ 獲取到 ${sliderPhotos.length} 張 image_slider 照片`);
    console.log(
      "Slider 照片:",
      sliderPhotos.map((p) => ({
        id: p.id,
        title: p.title,
        文字欄1: p.文字欄1,
        文字欄2: p.文字欄2,
      }))
    );
    console.log("");

    console.log("🎉 所有測試通過！照片 API 服務器正常工作。");
    console.log(
      "📡 eyewear-web 現在可以通過 http://localhost:3002 獲取照片數據。"
    );
  } catch (error) {
    console.error("❌ 測試失敗:", error.message);
  }
}

testPhotoAPI();
