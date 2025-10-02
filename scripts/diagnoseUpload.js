// 診斷上傳問題
async function diagnoseUpload() {
  console.log("🔍 診斷產品圖片上傳問題...\n");

  try {
    // 1. 測試 Cloudflare Worker 的 GET 請求
    console.log("1️⃣ 測試 Cloudflare Worker GET 請求...");
    const getResponse = await fetch('https://eyewear-photo-api.tloemizuchizu.workers.dev/api/photos');
    console.log("📊 GET 響應狀態:", getResponse.status);
    
    if (getResponse.ok) {
      const photos = await getResponse.json();
      console.log("✅ GET 請求成功，返回", photos.length, "張照片");
      
      // 檢查是否有 product_photo 分類的照片
      const productPhotos = photos.filter(p => p.category === 'product_photo');
      console.log("📸 找到", productPhotos.length, "張產品照片");
      
      if (productPhotos.length > 0) {
        console.log("📋 最新產品照片:", {
          id: productPhotos[0].id,
          title: productPhotos[0].title,
          image_url: productPhotos[0].image_url
        });
      }
    } else {
      console.log("❌ GET 請求失敗");
    }

    // 2. 測試 POST 請求
    console.log("\n2️⃣ 測試 Cloudflare Worker POST 請求...");
    
    // 創建測試圖片
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00, 0x00,
      0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42,
      0x60, 0x82
    ]);
    
    const fileName = `diagnose-test-${Date.now()}.png`;
    const formData = new FormData();
    formData.append('file', new Blob([pngData], { type: 'image/png' }), fileName);
    formData.append('category', 'product_photo');
    formData.append('title', '診斷測試圖片');
    formData.append('subtitle', '診斷測試');
    formData.append('display_order', '0');
    formData.append('is_active', 'true');

    console.log("📤 發送 POST 請求...");
    const postResponse = await fetch('https://eyewear-photo-api.tloemizuchizu.workers.dev/api/photos', {
      method: 'POST',
      body: formData
    });

    console.log("📊 POST 響應狀態:", postResponse.status, postResponse.statusText);
    console.log("📋 POST 響應標頭:", Object.fromEntries(postResponse.headers.entries()));

    const postResponseText = await postResponse.text();
    console.log("📄 POST 響應內容:", postResponseText);

    if (postResponse.ok) {
      try {
        const result = JSON.parse(postResponseText);
        console.log("✅ POST 請求成功！");
        console.log("📸 上傳結果:", {
          id: result.id,
          image_url: result.image_url,
          category: result.category,
          title: result.title
        });
      } catch (parseError) {
        console.log("⚠️ POST 響應不是有效的 JSON:", parseError.message);
        console.log("📄 原始響應:", postResponseText);
      }
    } else {
      console.log("❌ POST 請求失敗！");
      console.log("📋 錯誤詳情:", postResponseText);
    }

    // 3. 檢查 Supabase 直接連接
    console.log("\n3️⃣ 檢查 Supabase 直接連接...");
    const { createClient } = require("@supabase/supabase-js");
    
    const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 檢查 photos 表
    const { data: photos, error: photosError } = await supabase
      .from("photos")
      .select("*")
      .eq("category", "product_photo")
      .limit(5);
    
    if (photosError) {
      console.log("❌ 無法查詢 photos 表:", photosError.message);
    } else {
      console.log("✅ photos 表可訪問");
      console.log("📸 找到", photos.length, "張產品照片");
    }
    
    // 檢查 photos bucket
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log("❌ 無法獲取 buckets:", bucketsError.message);
    } else {
      const photosBucket = buckets.find(bucket => bucket.name === "photos");
      if (photosBucket) {
        console.log("✅ photos bucket 存在");
        console.log("📋 Bucket 資訊:", {
          name: photosBucket.name,
          public: photosBucket.public,
          file_size_limit: photosBucket.file_size_limit
        });
      } else {
        console.log("❌ photos bucket 不存在");
        console.log("📋 可用的 buckets:", buckets.map(b => b.name));
      }
    }

  } catch (error) {
    console.log("💥 診斷過程中發生錯誤:", error.message);
    console.log("📋 錯誤詳情:", error);
  }
}

// 執行診斷
diagnoseUpload().then(() => {
  console.log("\n🎯 診斷完成！");
  process.exit(0);
}).catch((error) => {
  console.log("\n💥 診斷失敗:", error);
  process.exit(1);
});
