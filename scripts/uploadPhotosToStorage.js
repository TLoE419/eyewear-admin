import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// 載入環境變數
import { config } from "dotenv";
config({ path: ".env.local" });

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("請設定 Supabase 環境變數");
  console.error(
    "需要的變數: NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY (或 NEXT_PUBLIC_SUPABASE_ANON_KEY)"
  );
  process.exit(1);
}

console.log("Supabase URL:", supabaseUrl);
console.log("使用 Key:", supabaseKey.substring(0, 20) + "...");

const supabase = createClient(supabaseUrl, supabaseKey);

// 照片分類配置
const photoCategories = {
  "Hero 輪播照片": {
    category: "hero",
    files: ["hero-1.jpg", "hero-2.jpg"],
  },
  "Image Slider 輪播照片": {
    category: "image_slider",
    files: ["Slider_1.jpg", "Slider_2.jpg", "Slider_3.jpg", "Slider_4.jpg"],
  },
  "Brand Logo 品牌 Logo": {
    category: "brand_logo",
    files: [
      "rayban.jpg",
      "lindberg.jpg",
      "9999.jpg",
      "bvlgari.jpg",
      "gucci.jpg",
      "montblanc.jpg",
      "AgnesB.jpg",
      "Brooklyn.jpg",
      "Chloe.jpg",
      "Coach.jpg",
      "DonniEYE.jpg",
      "Frank Custom.jpg",
      "Giorgio Armani.jpg",
      "P+US.jpg",
      "projekt_produkt.jpg",
      "Salvatore Ferragamo.jpg",
      "Silhouette.jpg",
      "classico.jpg",
      "talor_with_respect.jpg",
      "YSL.png",
    ],
  },
  "Store Photo 分店照片": {
    category: "store_photo",
    files: ["Store_1.jpg", "Store_2.jpg"],
  },
  "News Carousel 跑馬燈照片": {
    category: "news_carousel",
    files: [
      "BVLGARI_1.jpg",
      "GUCCI_1.jpg",
      "MONTBLANC_1.jpg",
      "RayBan_1.jpg",
      "Lindberg_1.jpg",
      "999.9_1.jpg",
      "BVLGARI_2.jpg",
      "GUCCI_2.jpg",
      "MONTBLANC_2.jpg",
    ],
  },
};

// 檔案路徑映射
const filePaths = {
  "hero-1.jpg": "/hero-1.jpg",
  "hero-2.jpg": "/hero-2.jpg",
  "Slider_1.jpg": "/Slider_1.jpg",
  "Slider_2.jpg": "/Slider_2.jpg",
  "Slider_3.jpg": "/Slider_3.jpg",
  "Slider_4.jpg": "/Slider_4.jpg",
  "Store_1.jpg": "/Store_1.jpg",
  "Store_2.jpg": "/Store_2.jpg",
  "rayban.jpg": "/Logo/rayban.jpg",
  "lindberg.jpg": "/Logo/lindberg.jpg",
  "9999.jpg": "/Logo/9999.jpg",
  "bvlgari.jpg": "/Logo/bvlgari.jpg",
  "gucci.jpg": "/Logo/gucci.jpg",
  "montblanc.jpg": "/Logo/montblanc.jpg",
  "AgnesB.jpg": "/Logo/AgnesB.jpg",
  "Brooklyn.jpg": "/Logo/Brooklyn.jpg",
  "Chloe.jpg": "/Logo/Chloe.jpg",
  "Coach.jpg": "/Logo/Coach.jpg",
  "DonniEYE.jpg": "/Logo/DonniEYE.jpg",
  "Frank Custom.jpg": "/Logo/Frank Custom.jpg",
  "Giorgio Armani.jpg": "/Logo/Giorgio Armani.jpg",
  "P+US.jpg": "/Logo/P+US.jpg",
  "projekt_produkt.jpg": "/Logo/projekt_produkt.jpg",
  "Salvatore Ferragamo.jpg": "/Logo/Salvatore Ferragamo.jpg",
  "Silhouette.jpg": "/Logo/Silhouette.jpg",
  "classico.jpg": "/Logo/classico.jpg",
  "talor_with_respect.jpg": "/Logo/talor_with_respect.jpg",
  "YSL.png": "/Logo/YSL.png",
  "BVLGARI_1.jpg": "/BVLGARI/BVLGARI_1.jpg",
  "GUCCI_1.jpg": "/GUCCI/GUCCI_1.jpg",
  "MONTBLANC_1.jpg": "/MONTBLANC/MONTBLANC_1.jpg",
  "RayBan_1.jpg": "/Ray.Ban/RayBan_1.jpg",
  "Lindberg_1.jpg": "/LINDBERG/Lindberg_1.jpg",
  "999.9_1.jpg": "/999.9/999.9_1.jpg",
  "BVLGARI_2.jpg": "/BVLGARI/BVLGARI_2.jpg",
  "GUCCI_2.jpg": "/GUCCI/GUCCI_2.jpg",
  "MONTBLANC_2.jpg": "/MONTBLANC/MONTBLANC_2.jpg",
};

async function clearExistingPhotos() {
  console.log("🗑️  清除現有照片資料...");

  try {
    // 刪除資料庫中的所有照片記錄
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // 刪除所有記錄

    if (deleteError) {
      console.error("刪除照片記錄失敗:", deleteError);
      return false;
    }

    // 刪除 storage 中的所有照片
    const { data: files, error: listError } = await supabase.storage
      .from("photos")
      .list();

    if (listError) {
      console.error("列出檔案失敗:", listError);
      return false;
    }

    if (files && files.length > 0) {
      const fileNames = files.map((file) => file.name);
      const { error: removeError } = await supabase.storage
        .from("photos")
        .remove(fileNames);

      if (removeError) {
        console.error("刪除檔案失敗:", removeError);
        return false;
      }
    }

    console.log("✅ 現有照片已清除");
    return true;
  } catch (error) {
    console.error("清除照片時發生錯誤:", error);
    return false;
  }
}

async function uploadPhoto(filePath, fileName, category, displayOrder) {
  try {
    // 修改路徑指向 eyewear-web 的 public 目錄
    const fullPath = path.join(
      process.cwd(),
      "../eyewear-web/public",
      filePath.substring(1)
    );

    // 檢查檔案是否存在
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  檔案不存在: ${fullPath}`);
      return null;
    }

    // 讀取檔案
    const fileBuffer = fs.readFileSync(fullPath);
    const fileExt = path.extname(fileName);
    const uploadFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}${fileExt}`;
    const storagePath = `photos/${uploadFileName}`;

    // 修正 MIME 類型
    let contentType = `image/${fileExt.substring(1)}`;
    if (contentType === "image/jpg") {
      contentType = "image/jpeg";
    }

    // 上傳到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(storagePath, fileBuffer, {
        contentType: contentType,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error(`上傳檔案失敗 ${fileName}:`, uploadError);
      return null;
    }

    // 獲取公開 URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(storagePath);

    // 儲存到資料庫
    const photoData = {
      image_url: publicUrl,
      category: category,
      title: path.parse(fileName).name, // 使用檔案名稱（不含副檔名）
      display_order: displayOrder,
      is_active: true,
    };

    const { data: photo, error: dbError } = await supabase
      .from("photos")
      .insert([photoData])
      .select()
      .single();

    if (dbError) {
      console.error(`儲存照片資料失敗 ${fileName}:`, dbError);
      // 刪除已上傳的檔案
      await supabase.storage.from("photos").remove([storagePath]);
      return null;
    }

    console.log(`✅ 上傳成功: ${fileName} -> ${category}`);
    return photo;
  } catch (error) {
    console.error(`處理檔案時發生錯誤 ${fileName}:`, error);
    return null;
  }
}

async function uploadPhotosByCategory() {
  console.log("🚀 開始上傳照片...");

  for (const [categoryName, config] of Object.entries(photoCategories)) {
    console.log(`\n📁 處理分類: ${categoryName}`);

    for (let i = 0; i < config.files.length; i++) {
      const fileName = config.files[i];
      const filePath = filePaths[fileName];

      if (!filePath) {
        console.warn(`⚠️  找不到檔案路徑: ${fileName}`);
        continue;
      }

      await uploadPhoto(filePath, fileName, config.category, i + 1);

      // 避免過快上傳
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log("\n🎉 照片上傳完成！");
}

async function main() {
  console.log("📸 照片上傳工具啟動");

  // 清除現有照片
  const cleared = await clearExistingPhotos();
  if (!cleared) {
    console.error("❌ 清除現有照片失敗，停止執行");
    return;
  }

  // 上傳新照片
  await uploadPhotosByCategory();

  // 顯示統計
  const { data: photos, error } = await supabase
    .from("photos")
    .select("category")
    .eq("is_active", true);

  if (!error && photos) {
    const stats = photos.reduce((acc, photo) => {
      acc[photo.category] = (acc[photo.category] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📊 上傳統計:");
    Object.entries(stats).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} 張照片`);
    });
  }
}

main().catch(console.error);
