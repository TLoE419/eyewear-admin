#!/usr/bin/env node

// Slider 文字管理腳本
// 提供增刪改查 slider 文字內容的功能

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import readline from "readline";

// 載入環境變數
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 請設定 Supabase 環境變數");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 工具函數：等待用戶輸入
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// 顯示所有 slider 照片
async function listSliderPhotos() {
  console.log("\n📋 當前 Slider 照片列表:");

  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .eq("category", "image_slider")
    .order("display_order");

  if (error) {
    console.error("❌ 獲取照片失敗:", error);
    return [];
  }

  if (photos.length === 0) {
    console.log("📝 沒有找到 slider 照片");
    return [];
  }

  console.table(
    photos.map((photo, index) => ({
      序號: index + 1,
      ID: photo.id.substring(0, 8) + "...",
      順序: photo.display_order,
      標題: photo.文字欄1 || "未設定",
      副標題: photo.文字欄2 || "未設定",
    }))
  );

  return photos;
}

// 更新單張照片的文字
async function updatePhotoText(photo) {
  console.log(`\n📝 編輯照片 ${photo.display_order}:`);
  console.log(`   當前標題: ${photo.文字欄1 || "未設定"}`);
  console.log(`   當前副標題: ${photo.文字欄2 || "未設定"}`);

  const newTitle = await question("   新標題 (直接按 Enter 保持不變): ");
  const newSubtitle = await question("   新副標題 (直接按 Enter 保持不變): ");

  const updates = {};
  if (newTitle.trim()) updates["文字欄1"] = newTitle.trim();
  if (newSubtitle.trim()) updates["文字欄2"] = newSubtitle.trim();

  if (Object.keys(updates).length === 0) {
    console.log("✅ 沒有變更");
    return;
  }

  const { error } = await supabase
    .from("photos")
    .update(updates)
    .eq("id", photo.id);

  if (error) {
    console.error("❌ 更新失敗:", error);
  } else {
    console.log("✅ 更新成功！");
  }
}

// 批量設定文字
async function batchUpdateTexts() {
  console.log("\n🔄 批量更新文字內容");

  const texts = [
    { title: "精品眼鏡", subtitle: "時尚與品質的完美結合" },
    { title: "專業服務", subtitle: "為您提供最優質的視覺體驗" },
    { title: "實體店面", subtitle: "歡迎蒞臨參觀選購" },
    { title: "專業驗光", subtitle: "精準驗光，舒適配戴" },
  ];

  const { data: photos, error } = await supabase
    .from("photos")
    .select("*")
    .eq("category", "image_slider")
    .order("display_order");

  if (error) {
    console.error("❌ 獲取照片失敗:", error);
    return;
  }

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const textConfig = texts[i % texts.length];

    const { error: updateError } = await supabase
      .from("photos")
      .update({
        文字欄1: textConfig.title,
        文字欄2: textConfig.subtitle,
      })
      .eq("id", photo.id);

    if (updateError) {
      console.error(`❌ 更新照片 ${i + 1} 失敗:`, updateError);
    } else {
      console.log(
        `✅ 照片 ${i + 1}: ${textConfig.title} - ${textConfig.subtitle}`
      );
    }
  }

  console.log("🎉 批量更新完成！");
}

// 主選單
async function showMenu() {
  console.log(`
🎛️  Slider 文字管理系統

請選擇操作:
1. 查看所有 slider 照片
2. 編輯單張照片文字
3. 批量設定文字內容
4. 退出

`);

  const choice = await question("請輸入選項 (1-4): ");

  switch (choice.trim()) {
    case "1":
      await listSliderPhotos();
      break;
    case "2":
      const photos = await listSliderPhotos();
      if (photos.length > 0) {
        const photoIndex = await question(
          `請選擇要編輯的照片 (1-${photos.length}): `
        );
        const index = parseInt(photoIndex) - 1;
        if (index >= 0 && index < photos.length) {
          await updatePhotoText(photos[index]);
        } else {
          console.log("❌ 無效的選擇");
        }
      }
      break;
    case "3":
      await batchUpdateTexts();
      break;
    case "4":
      console.log("👋 再見！");
      rl.close();
      return;
    default:
      console.log("❌ 無效的選擇，請重新輸入");
  }

  // 繼續顯示選單
  setTimeout(() => showMenu(), 1000);
}

// 啟動程式
console.log("🚀 啟動 Slider 文字管理系統...");
showMenu().catch((error) => {
  console.error("❌ 程式執行失敗:", error);
  rl.close();
});
