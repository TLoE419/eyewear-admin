const { createClient } = require("@supabase/supabase-js");

// Supabase 配置
const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductsBucket() {
  console.log("🪣 檢查 products bucket...\n");

  try {
    // 1. 檢查現有的 buckets
    console.log("1️⃣ 檢查現有的 buckets...");
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log("❌ 無法獲取 buckets:", bucketsError.message);
      return;
    }

    console.log("📋 現有的 buckets:");
    if (buckets && buckets.length > 0) {
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? "public" : "private"})`);
      });
    } else {
      console.log("  (沒有找到任何 buckets)");
    }

    // 2. 檢查 products bucket
    const productsBucket = buckets?.find(bucket => bucket.name === "products");
    if (productsBucket) {
      console.log("\n✅ products bucket 已存在");
      console.log("📋 Bucket 資訊:", {
        name: productsBucket.name,
        public: productsBucket.public,
        file_size_limit: productsBucket.file_size_limit,
        allowed_mime_types: productsBucket.allowed_mime_types
      });
    } else {
      console.log("\n❌ products bucket 不存在");
      console.log("💡 需要手動創建 products bucket:");
      console.log("1. 登入 Supabase Dashboard");
      console.log("2. 前往 Storage > Buckets");
      console.log("3. 點擊 'New bucket'");
      console.log("4. 設置 bucket 名稱: products");
      console.log("5. 設置為 Public bucket");
      console.log("6. 設置文件大小限制: 50MB");
      console.log("7. 允許的 MIME 類型: image/jpeg, image/png, image/webp, image/svg+xml");
    }

    // 3. 檢查 products 表
    console.log("\n3️⃣ 檢查 products 表...");
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .limit(5);
    
    if (productsError) {
      console.log("❌ 無法查詢 products 表:", productsError.message);
    } else {
      console.log("✅ products 表可訪問");
      console.log("📦 找到", products.length, "個產品");
      if (products.length > 0) {
        console.log("📋 最新產品:", {
          id: products[0].id,
          name: products[0].name,
          brand: products[0].brand,
          image_url: products[0].image_url
        });
      }
    }

  } catch (error) {
    console.log("💥 檢查過程中發生錯誤:", error.message);
    console.log("📋 錯誤詳情:", error);
  }
}

// 執行檢查
checkProductsBucket().then(() => {
  console.log("\n🎯 檢查完成！");
  process.exit(0);
}).catch((error) => {
  console.log("\n💥 檢查失敗:", error);
  process.exit(1);
});
