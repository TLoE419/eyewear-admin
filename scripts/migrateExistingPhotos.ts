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

// 照片遷移配置
interface PhotoMigrationConfig {
  sourcePath: string;
  category:
    | "hero"
    | "image_slider"
    | "news_carousel"
    | "brand_logo"
    | "store_photo";
  title?: string;
  subtitle?: string;
  brand_name?: string;
  store_name?: string;
  display_order: number;
}

// 預設的照片遷移配置
const photoMigrationConfigs: PhotoMigrationConfig[] = [
  // Hero 輪播照片
  {
    sourcePath: "/hero/hero-1.jpg",
    category: "hero",
    title: "Hero 輪播照片 1",
    display_order: 1,
  },
  {
    sourcePath: "/hero/hero-2.jpg",
    category: "hero",
    title: "Hero 輪播照片 2",
    display_order: 2,
  },
  {
    sourcePath: "/hero/hero-3.jpg",
    category: "hero",
    title: "Hero 輪播照片 3",
    display_order: 3,
  },

  // Image Slider 輪播照片
  {
    sourcePath: "/slider/slider-1.jpg",
    category: "image_slider",
    title: "時尚眼鏡展示",
    subtitle: "精選款式推薦",
    display_order: 1,
  },
  {
    sourcePath: "/slider/slider-2.jpg",
    category: "image_slider",
    title: "專業配鏡服務",
    subtitle: "專業驗光師服務",
    display_order: 2,
  },

  // Brand Logo 品牌 Logo
  {
    sourcePath: "/brands/ray-ban-logo.png",
    category: "brand_logo",
    brand_name: "Ray-Ban",
    display_order: 1,
  },
  {
    sourcePath: "/brands/lindberg-logo.png",
    category: "brand_logo",
    brand_name: "LINDBERG",
    display_order: 2,
  },
  {
    sourcePath: "/brands/gucci-logo.png",
    category: "brand_logo",
    brand_name: "GUCCI",
    display_order: 3,
  },
  {
    sourcePath: "/brands/9999-logo.png",
    category: "brand_logo",
    brand_name: "999.9",
    display_order: 4,
  },

  // Store Photo 分店照片
  {
    sourcePath: "/stores/store-1.jpg",
    category: "store_photo",
    title: "台北信義店",
    store_name: "台北信義店",
    display_order: 1,
  },
  {
    sourcePath: "/stores/store-2.jpg",
    category: "store_photo",
    title: "台北東區店",
    store_name: "台北東區店",
    display_order: 2,
  },
];

async function migrateExistingPhotos() {
  console.log("🔄 開始遷移現有照片到 Supabase...\n");

  try {
    // 檢查 public 目錄結構
    console.log("📋 1. 檢查現有照片目錄結構");
    const publicDir = path.join(process.cwd(), "public");

    if (!fs.existsSync(publicDir)) {
      console.log("❌ public 目錄不存在");
      return;
    }

    // 列出 public 目錄下的所有檔案和資料夾
    const publicContents = fs.readdirSync(publicDir, { withFileTypes: true });
    console.log("📦 public 目錄內容:");
    publicContents.forEach((item) => {
      if (item.isDirectory()) {
        console.log(`   📁 ${item.name}/`);
      } else {
        console.log(`   📄 ${item.name}`);
      }
    });

    // 檢查是否有現有的照片資料夾
    const photoDirectories = publicContents
      .filter((item) => item.isDirectory())
      .map((item) => item.name);

    console.log(`\n📋 2. 找到 ${photoDirectories.length} 個資料夾:`);
    photoDirectories.forEach((dir) => {
      const dirPath = path.join(publicDir, dir);
      const files = fs.readdirSync(dirPath);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|webp|svg)$/i.test(file)
      );
      console.log(`   📁 ${dir}/ (${imageFiles.length} 個圖片檔案)`);
    });

    // 提供手動遷移選項
    console.log("\n📋 3. 照片遷移選項");
    console.log("由於您的照片可能位於不同的位置，我提供以下遷移方式:");
    console.log("\n選項 A: 手動指定照片路徑");
    console.log("選項 B: 使用預設配置建立範例照片");
    console.log("選項 C: 從現有產品照片遷移品牌 Logo");

    // 選項 C: 從現有產品照片遷移品牌 Logo
    console.log("\n🔄 執行選項 C: 從現有產品照片遷移品牌 Logo");

    // 讀取產品資料
    const productsPath = path.join(
      process.cwd(),
      "src",
      "data",
      "products.json"
    );
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
      console.log(`📦 找到 ${productsData.length} 個產品`);

      // 提取品牌資訊
      const brands = [
        ...new Set(productsData.map((product: any) => product.brand)),
      ];
      console.log(`🏷️ 找到品牌: ${brands.join(", ")}`);

      // 為每個品牌建立品牌 Logo 照片記錄
      for (let i = 0; i < brands.length; i++) {
        const brand = brands[i];
        const product = productsData.find((p: any) => p.brand === brand);

        if (product && product.image) {
          console.log(`\n📸 處理品牌: ${brand}`);
          console.log(`   圖片路徑: ${product.image}`);

          // 檢查圖片檔案是否存在
          const imagePath = path.join(publicDir, product.image);
          if (fs.existsSync(imagePath)) {
            console.log(`   ✅ 圖片檔案存在`);

            // 讀取圖片檔案
            const imageBuffer = fs.readFileSync(imagePath);
            const fileName = `${(brand as string)
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "-")}-logo-${Date.now()}.jpg`;

            // 上傳到 Supabase Storage
            console.log(`   📤 上傳到 Supabase Storage: ${fileName}`);
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("photos")
                .upload(fileName, imageBuffer, {
                  contentType: "image/jpeg",
                });

            if (uploadError) {
              console.log(`   ❌ 上傳失敗: ${uploadError.message}`);
              continue;
            }

            // 獲取公開 URL
            const {
              data: { publicUrl },
            } = supabase.storage.from("photos").getPublicUrl(fileName);

            console.log(`   🔗 公開 URL: ${publicUrl}`);

            // 建立照片記錄
            const photoData = {
              image_url: publicUrl,
              category: "brand_logo" as const,
              brand_name: brand,
              display_order: i + 1,
              is_active: true,
            };

            console.log(`   💾 建立照片記錄...`);
            const { data: insertData, error: insertError } = await supabase
              .from("photos")
              .insert(photoData)
              .select()
              .single();

            if (insertError) {
              console.log(`   ❌ 建立照片記錄失敗: ${insertError.message}`);
            } else {
              console.log(
                `   ✅ 成功建立 ${brand} 品牌 Logo 照片 (ID: ${insertData.id})`
              );
            }
          } else {
            console.log(`   ⚠️ 圖片檔案不存在: ${imagePath}`);
          }
        }
      }
    } else {
      console.log("❌ 找不到產品資料檔案");
    }

    // 檢查遷移結果
    console.log("\n📋 4. 檢查遷移結果");
    const { data: photos, error: photosError } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (photosError) {
      console.log(`❌ 無法獲取照片列表: ${photosError.message}`);
    } else {
      console.log(`📦 資料庫中現有 ${photos.length} 張照片:`);
      photos.forEach((photo, index) => {
        console.log(
          `   ${index + 1}. ${photo.title || photo.brand_name || "未命名"} (${
            photo.category
          })`
        );
      });
    }

    console.log("\n✅ 照片遷移完成！");
    console.log("\n📋 下一步:");
    console.log("1. 前往 http://localhost:3002 查看照片管理系統");
    console.log("2. 在照片管理系統中編輯照片資訊");
    console.log("3. 上傳更多照片到不同類別");
  } catch (error) {
    console.error("❌ 遷移失敗:", error);
  }
}

// 執行遷移
migrateExistingPhotos();
