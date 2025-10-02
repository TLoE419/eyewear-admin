const { createClient } = require("@supabase/supabase-js");

// Supabase 配置
const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupProductDatabase() {
  console.log("🚀 開始設置產品資料庫...");

  try {
    // 1. 創建 products 表
    console.log("📋 創建 products 表...");

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        image_url TEXT,
        photo_id TEXT REFERENCES photos(id),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 注意：這裡我們需要手動在 Supabase SQL Editor 中執行 SQL
    console.log("⚠️ 請在 Supabase SQL Editor 中執行以下 SQL:");
    console.log("=".repeat(50));
    console.log(createTableSQL);
    console.log("=".repeat(50));

    // 2. 獲取現有的產品照片
    console.log("\n📸 獲取產品照片...");
    const { data: productPhotos, error: photosError } = await supabase
      .from("photos")
      .select("*")
      .eq("category", "product_photo")
      .order("display_order");

    if (photosError) {
      console.error("❌ 獲取照片失敗:", photosError);
      return;
    }

    console.log(`找到 ${productPhotos.length} 張產品照片`);

    // 3. 準備產品數據
    const products = [
      {
        id: "1",
        name: "Ray-Ban 經典款",
        brand: "Ray-Ban",
        description: "經典 Ray-Ban 太陽眼鏡，時尚百搭。",
      },
      {
        id: "2",
        name: "LINDBERG 輕量鏡框",
        brand: "LINDBERG",
        description: "極致輕量設計，舒適配戴。",
      },
      {
        id: "3",
        name: "999.9 高彈性鏡框",
        brand: "9999",
        description: "高彈性材質，耐用不易變形。",
      },
      {
        id: "4",
        name: "GUCCI 時尚鏡框 1",
        brand: "GUCCI",
        description: "奢華時尚設計，展現個人品味。",
      },
      {
        id: "5",
        name: "GUCCI 時尚鏡框 2",
        brand: "GUCCI",
        description: "優雅設計，經典不敗。",
      },
      {
        id: "6",
        name: "GUCCI 時尚鏡框 3",
        brand: "GUCCI",
        description: "現代時尚，引領潮流。",
      },
      {
        id: "7",
        name: "GUCCI 時尚鏡框 4",
        brand: "GUCCI",
        description: "精緻工藝，品質保證。",
      },
      {
        id: "8",
        name: "GUCCI 時尚鏡框 5",
        brand: "GUCCI",
        description: "獨特設計，彰顯個性。",
      },
      {
        id: "9",
        name: "GUCCI 時尚鏡框 6",
        brand: "GUCCI",
        description: "經典款式，永不過時。",
      },
      {
        id: "10",
        name: "GUCCI 時尚鏡框 7",
        brand: "GUCCI",
        description: "時尚前衛，引領風潮。",
      },
      {
        id: "11",
        name: "BVLGARI 精品鏡框 1",
        brand: "BVLGARI",
        description: "義大利精品工藝，優雅設計。",
      },
      {
        id: "12",
        name: "BVLGARI 精品鏡框 2",
        brand: "BVLGARI",
        description: "奢華體驗，尊貴享受。",
      },
      {
        id: "13",
        name: "BVLGARI 精品鏡框 3",
        brand: "BVLGARI",
        description: "精緻工藝，完美細節。",
      },
      {
        id: "14",
        name: "BVLGARI 精品鏡框 4",
        brand: "BVLGARI",
        description: "經典設計，永恆魅力。",
      },
      {
        id: "15",
        name: "BVLGARI 精品鏡框 5",
        brand: "BVLGARI",
        description: "優雅氣質，非凡品味。",
      },
      {
        id: "16",
        name: "BVLGARI 精品鏡框 6",
        brand: "BVLGARI",
        description: "時尚設計，引領潮流。",
      },
      {
        id: "17",
        name: "BVLGARI 精品鏡框 7",
        brand: "BVLGARI",
        description: "精緻美學，藝術氣息。",
      },
      {
        id: "18",
        name: "BVLGARI 精品鏡框 8",
        brand: "BVLGARI",
        description: "現代設計，前衛創新。",
      },
      {
        id: "19",
        name: "BVLGARI 精品鏡框 9",
        brand: "BVLGARI",
        description: "經典款式，永不過時。",
      },
      {
        id: "20",
        name: "BVLGARI 精品鏡框 10",
        brand: "BVLGARI",
        description: "優雅設計，彰顯品味。",
      },
      {
        id: "21",
        name: "BVLGARI 精品鏡框 11",
        brand: "BVLGARI",
        description: "精緻工藝，品質保證。",
      },
      {
        id: "22",
        name: "MONTBLANC 商務鏡框 1",
        brand: "MONTBLANC",
        description: "商務精英首選，專業形象。",
      },
      {
        id: "23",
        name: "MONTBLANC 商務鏡框 2",
        brand: "MONTBLANC",
        description: "經典商務風格，穩重可靠。",
      },
      {
        id: "24",
        name: "MONTBLANC 商務鏡框 3",
        brand: "MONTBLANC",
        description: "現代商務設計，時尚專業。",
      },
    ];

    // 4. 插入產品數據
    console.log("\n💾 插入產品數據...");

    for (const product of products) {
      const photo = productPhotos.find(
        (p) => p.display_order === parseInt(product.id)
      );

      const productData = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        description: product.description,
        image_url: photo?.image_url || null,
        photo_id: photo?.id || null,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase
        .from("products")
        .upsert(productData, {
          onConflict: "id",
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error(`❌ 更新產品 ${product.name} 失敗:`, upsertError);
      } else {
        console.log(
          `✅ 更新產品: ${product.name} ${
            photo ? `(照片: ${photo.id})` : "(無照片)"
          }`
        );
      }
    }

    console.log("\n🎉 產品資料庫設置完成！");
  } catch (error) {
    console.error("❌ 設置資料庫時發生錯誤:", error);
  }
}

// 執行設置
setupProductDatabase().catch(console.error);
