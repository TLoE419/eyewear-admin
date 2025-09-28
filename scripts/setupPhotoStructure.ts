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

async function setupPhotoStructure() {
  console.log("🔄 設定照片資料夾結構和範例照片...\n");

  try {
    const publicDir = path.join(process.cwd(), "public");

    // 1. 建立照片資料夾結構
    console.log("📋 1. 建立照片資料夾結構");
    const photoDirectories = [
      "hero",
      "slider",
      "brands",
      "stores",
      "news",
      "Ray.Ban",
      "LINDBERG",
      "999.9",
      "GUCCI",
      "BVLGARI",
      "MONTBLANC",
    ];

    photoDirectories.forEach((dir) => {
      const dirPath = path.join(publicDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`   ✅ 建立資料夾: ${dir}/`);
      } else {
        console.log(`   📁 資料夾已存在: ${dir}/`);
      }
    });

    // 2. 建立範例照片記錄（不依賴實際檔案）
    console.log("\n📋 2. 建立範例照片記錄");

    const samplePhotos = [
      // Hero 輪播照片
      {
        image_url:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&h=1080&fit=crop",
        category: "hero" as const,
        title: "時尚眼鏡展示",
        display_order: 1,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=1920&h=1080&fit=crop",
        category: "hero" as const,
        title: "專業配鏡服務",
        display_order: 2,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&h=1080&fit=crop",
        category: "hero" as const,
        title: "精選品牌展示",
        display_order: 3,
        is_active: true,
      },

      // Image Slider 輪播照片
      {
        image_url:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&h=1080&fit=crop",
        category: "image_slider" as const,
        title: "Ray-Ban 經典款",
        subtitle: "時尚百搭，經典不敗",
        display_order: 1,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=1920&h=1080&fit=crop",
        category: "image_slider" as const,
        title: "LINDBERG 輕量設計",
        subtitle: "極致輕量，舒適配戴",
        display_order: 2,
        is_active: true,
      },

      // Brand Logo 品牌 Logo
      {
        image_url:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
        category: "brand_logo" as const,
        brand_name: "Ray-Ban",
        display_order: 1,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=400&h=400&fit=crop",
        category: "brand_logo" as const,
        brand_name: "LINDBERG",
        display_order: 2,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
        category: "brand_logo" as const,
        brand_name: "GUCCI",
        display_order: 3,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
        category: "brand_logo" as const,
        brand_name: "999.9",
        display_order: 4,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=400&h=400&fit=crop",
        category: "brand_logo" as const,
        brand_name: "BVLGARI",
        display_order: 5,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
        category: "brand_logo" as const,
        brand_name: "MONTBLANC",
        display_order: 6,
        is_active: true,
      },

      // Store Photo 分店照片
      {
        image_url:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=800&fit=crop",
        category: "store_photo" as const,
        title: "台北信義店",
        store_name: "台北信義店",
        display_order: 1,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1506629905607-0b2b5b5b5b5b?w=1200&h=800&fit=crop",
        category: "store_photo" as const,
        title: "台北東區店",
        store_name: "台北東區店",
        display_order: 2,
        is_active: true,
      },

      // News Carousel 跑馬燈照片
      {
        image_url:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop",
        category: "news_carousel" as const,
        title: "新品上市",
        brand_name: "Ray-Ban",
        display_order: 1,
        is_active: true,
      },
      {
        image_url:
          "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=800&fit=crop",
        category: "news_carousel" as const,
        title: "限時優惠",
        brand_name: "GUCCI",
        display_order: 2,
        is_active: true,
      },
    ];

    // 先清理現有的測試照片
    console.log("   🗑️ 清理現有測試照片...");
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .like("title", "測試%");

    if (deleteError) {
      console.log(`   ⚠️ 清理失敗: ${deleteError.message}`);
    } else {
      console.log("   ✅ 測試照片已清理");
    }

    // 建立範例照片記錄
    console.log("   📸 建立範例照片記錄...");
    let successCount = 0;
    let errorCount = 0;

    for (const photo of samplePhotos) {
      const { data, error } = await supabase
        .from("photos")
        .insert(photo)
        .select()
        .single();

      if (error) {
        console.log(
          `   ❌ ${photo.title || photo.brand_name}: ${error.message}`
        );
        errorCount++;
      } else {
        console.log(
          `   ✅ ${photo.title || photo.brand_name} (${photo.category})`
        );
        successCount++;
      }
    }

    console.log(`\n📊 建立結果: ${successCount} 成功, ${errorCount} 失敗`);

    // 3. 檢查最終結果
    console.log("\n📋 3. 檢查最終結果");
    const { data: finalPhotos, error: finalError } = await supabase
      .from("photos")
      .select("*")
      .order("category, display_order");

    if (finalError) {
      console.log(`❌ 無法獲取照片列表: ${finalError.message}`);
    } else {
      console.log(`📦 資料庫中現有 ${finalPhotos.length} 張照片:`);

      const categoryCounts: Record<string, number> = {};
      finalPhotos.forEach((photo) => {
        categoryCounts[photo.category] =
          (categoryCounts[photo.category] || 0) + 1;
        console.log(
          `   📸 ${photo.title || photo.brand_name || "未命名"} (${
            photo.category
          })`
        );
      });

      console.log("\n📊 各類別照片數量:");
      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} 張`);
      });
    }

    // 4. 建立 README 檔案說明照片結構
    console.log("\n📋 4. 建立照片結構說明檔案");
    const readmeContent = `# 照片資料夾結構說明

## 📁 資料夾結構

\`\`\`
public/
├── hero/           # Hero 輪播照片 (1920x1080)
├── slider/         # Image Slider 輪播照片 (1920x1080)
├── brands/         # 品牌 Logo (400x400)
├── stores/         # 分店照片 (1200x800)
├── news/           # 新聞跑馬燈照片 (800x800)
├── Ray.Ban/        # Ray-Ban 產品照片
├── LINDBERG/       # LINDBERG 產品照片
├── 999.9/          # 999.9 產品照片
├── GUCCI/          # GUCCI 產品照片
├── BVLGARI/        # BVLGARI 產品照片
└── MONTBLANC/      # MONTBLANC 產品照片
\`\`\`

## 📸 照片規格

| 類別 | 建議尺寸 | 用途 | 必填欄位 |
|------|----------|------|----------|
| Hero | 1920x1080 | 首頁主要輪播背景 | 無 |
| Image Slider | 1920x1080 | 首頁圖片輪播區塊 | 標題、副標題 |
| Brand Logo | 400x400 | 品牌系列展示 | 品牌名稱 |
| Store Photo | 1200x800 | 分店展示 | 標題、分店名稱 |
| News Carousel | 800x800 | 首頁新聞跑馬燈 | 標題、品牌名稱 |

## 🚀 使用方式

1. 將照片檔案放入對應的資料夾
2. 前往 http://localhost:3002 進入照片管理系統
3. 在照片管理系統中編輯照片資訊
4. 調整顯示順序和啟用狀態

## 📝 注意事項

- 支援格式: JPG, PNG, WebP, SVG
- 檔案大小限制: 10MB
- 建議使用高品質圖片以獲得最佳顯示效果
`;

    const readmePath = path.join(publicDir, "PHOTO_STRUCTURE.md");
    fs.writeFileSync(readmePath, readmeContent);
    console.log("   ✅ 建立 PHOTO_STRUCTURE.md 說明檔案");

    console.log("\n✅ 照片結構設定完成！");
    console.log("\n📋 下一步:");
    console.log("1. 前往 http://localhost:3002 查看照片管理系統");
    console.log("2. 將真實照片檔案放入對應的資料夾");
    console.log("3. 在照片管理系統中編輯照片資訊");
    console.log("4. 查看 public/PHOTO_STRUCTURE.md 了解詳細結構");
  } catch (error) {
    console.error("❌ 設定失敗:", error);
  }
}

// 執行設定
setupPhotoStructure();

