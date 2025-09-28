import dotenv from "dotenv";

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

async function testPhotosTable() {
  console.log("🧪 測試 photos 表...\n");

  try {
    // 測試 1: 檢查表是否存在
    console.log("📋 測試 1: 檢查 photos 表是否存在");
    const { data, error } = await supabase.from("photos").select("id").limit(1);

    if (error) {
      if (error.code === "PGRST116") {
        console.log(
          "❌ photos 表不存在，請先在 Supabase Dashboard 中執行 SQL 建立表"
        );
        return;
      } else {
        console.log("❌ 檢查表時發生錯誤:", error.message);
        return;
      }
    }

    console.log("✅ photos 表存在");

    // 測試 2: 插入測試資料
    console.log("\n📋 測試 2: 插入測試照片");
    const testPhoto = {
      image_url:
        "https://via.placeholder.com/1920x1080/1976d2/ffffff?text=Test+Hero+Photo",
      category: "hero",
      title: "測試 Hero 照片",
      subtitle: "這是一張測試照片",
      display_order: 1,
      is_active: true,
    };

    const { data: insertedPhoto, error: insertError } = await supabase
      .from("photos")
      .insert([testPhoto])
      .select()
      .single();

    if (insertError) {
      console.log("❌ 插入測試照片失敗:", insertError.message);
    } else {
      console.log("✅ 成功插入測試照片:", insertedPhoto.id);
    }

    // 測試 3: 查詢照片
    console.log("\n📋 測試 3: 查詢照片");
    const { data: photos, error: selectError } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (selectError) {
      console.log("❌ 查詢照片失敗:", selectError.message);
    } else {
      console.log(`✅ 成功查詢到 ${photos.length} 張照片`);
      photos.forEach((photo, index) => {
        console.log(`   ${index + 1}. ${photo.title} (${photo.category})`);
      });
    }

    // 測試 4: 檢查 Storage bucket
    console.log("\n📋 測試 4: 檢查 Storage bucket");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log("❌ 檢查 Storage buckets 失敗:", bucketsError.message);
    } else {
      const photosBucket = buckets?.find((bucket) => bucket.name === "photos");
      if (photosBucket) {
        console.log("✅ photos Storage bucket 存在");
      } else {
        console.log(
          "⚠️ photos Storage bucket 不存在，請在 Supabase Dashboard 中建立"
        );
      }
    }

    console.log("\n🎉 基本測試完成！");
  } catch (error) {
    console.error("❌ 測試失敗:", error);
  }
}

// 執行測試
testPhotosTable();
