// 簡單的上傳測試，不依賴外部模組
async function testUpload() {
  console.log("🧪 測試 Cloudflare Worker 上傳功能...\n");

  try {
    // 創建一個簡單的測試圖片 (1x1 PNG)
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // bit depth, color type, etc.
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, // compressed data
      0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x00, // more data
      0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, // IEND chunk
      0x60, 0x82
    ]);
    
    const fileName = `test-product-${Date.now()}.png`;
    
    // 創建 FormData
    const formData = new FormData();
    formData.append('file', new Blob([pngData], { type: 'image/png' }), fileName);
    formData.append('category', 'product_photo');
    formData.append('title', '測試產品圖片');
    formData.append('subtitle', '測試副標題');
    formData.append('display_order', '0');
    formData.append('is_active', 'true');

    console.log("📤 開始上傳測試圖片...");
    console.log("📋 上傳參數:", {
      fileName,
      category: 'product_photo',
      title: '測試產品圖片',
      size: pngData.length + ' bytes'
    });

    // 發送上傳請求
    const response = await fetch('https://eyewear-photo-api.tloemizuchizu.workers.dev/api/photos', {
      method: 'POST',
      body: formData
    });

    console.log("📊 響應狀態:", response.status, response.statusText);
    console.log("📋 響應標頭:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("📄 響應內容:", responseText);

    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log("✅ 上傳成功！");
      console.log("📸 上傳結果:", {
        id: result.id,
        image_url: result.image_url,
        category: result.category,
        title: result.title
      });
    } else {
      console.log("❌ 上傳失敗！");
      console.log("📋 錯誤詳情:", responseText);
    }

  } catch (error) {
    console.log("💥 測試過程中發生錯誤:", error.message);
    console.log("📋 錯誤詳情:", error);
  }
}

// 執行測試
testUpload().then(() => {
  console.log("\n🎯 測試完成！");
}).catch((error) => {
  console.log("\n💥 測試失敗:", error);
});
