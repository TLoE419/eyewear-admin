import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// 載入環境變數
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ 缺少 Supabase 配置");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createPhotosTable() {
  try {
    console.log("🔄 開始建立 photos 表...");

    // 建立 photos 表 - 使用 SQL 編輯器或直接 SQL
    console.log("📝 請在 Supabase Dashboard 的 SQL 編輯器中執行以下 SQL:");
    console.log(`
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hero', 'image_slider', 'news_carousel', 'brand_logo', 'store_photo')),
  title TEXT,
  subtitle TEXT,
  brand_name TEXT,
  store_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);

    // 檢查表是否已存在
    const { data: tableCheck, error: tableError } = await supabase
      .from("photos")
      .select("id")
      .limit(1);

    if (tableError && tableError.code === "PGRST116") {
      console.log("❌ photos 表不存在，請先執行上述 SQL 建立表");
      return;
    } else if (tableError) {
      console.log("❌ 檢查表時發生錯誤:", tableError);
      return;
    }

    console.log("✅ photos 表已存在");

    // 建立索引
    console.log("🔄 建立索引...");
    console.log("📝 請在 Supabase Dashboard 的 SQL 編輯器中執行以下索引 SQL:");
    console.log(`
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_display_order ON photos(display_order);
CREATE INDEX IF NOT EXISTS idx_photos_is_active ON photos(is_active);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at);
    `);

    // 建立更新時間的觸發器
    console.log("🔄 建立更新時間觸發器...");
    console.log(
      "📝 請在 Supabase Dashboard 的 SQL 編輯器中執行以下觸發器 SQL:"
    );
    console.log(`
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_photos_updated_at ON photos;
CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
    `);

    // 建立 Storage bucket
    console.log("🔄 建立 Storage bucket...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.warn("⚠️ 獲取 buckets 失敗:", bucketsError);
    } else {
      const photosBucket = buckets?.find((bucket) => bucket.name === "photos");

      if (!photosBucket) {
        const { error: createBucketError } =
          await supabase.storage.createBucket("photos", {
            public: true,
            allowedMimeTypes: [
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/svg+xml",
            ],
            fileSizeLimit: 10485760, // 10MB
          });

        if (createBucketError) {
          console.warn("⚠️ 建立 photos bucket 失敗:", createBucketError);
        } else {
          console.log("✅ photos bucket 建立成功");
        }
      } else {
        console.log("✅ photos bucket 已存在");
      }
    }

    console.log("🎉 photos 表設定完成！");

    // 顯示表結構
    console.log("\n📋 photos 表結構:");
    console.log("- id: UUID (主鍵)");
    console.log("- image_url: TEXT (圖片 URL)");
    console.log(
      "- category: TEXT (類別: hero, image_slider, news_carousel, brand_logo, store_photo)"
    );
    console.log("- title: TEXT (標題)");
    console.log("- subtitle: TEXT (副標題)");
    console.log("- brand_name: TEXT (品牌名稱)");
    console.log("- store_name: TEXT (分店名稱)");
    console.log("- display_order: INTEGER (顯示順序)");
    console.log("- is_active: BOOLEAN (是否啟用)");
    console.log("- created_at: TIMESTAMP (建立時間)");
    console.log("- updated_at: TIMESTAMP (更新時間)");
  } catch (error) {
    console.error("❌ 執行失敗:", error);
  }
}

// 執行腳本
createPhotosTable();
