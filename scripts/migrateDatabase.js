#!/usr/bin/env node

// 資料庫遷移腳本 - 重命名欄位
// 將 brand_name 改為 文字欄1，store_name 改為 文字欄2

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

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

async function backupTable() {
  console.log("📋 正在備份 photos 表格...");

  const { data, error } = await supabase.from("photos").select("*");

  if (error) {
    console.error("❌ 備份失敗:", error);
    throw error;
  }

  // 將備份資料寫入檔案
  const fs = await import("fs");
  const backupData = {
    timestamp: new Date().toISOString(),
    table: "photos",
    data: data,
  };

  fs.writeFileSync(
    `./backup_photos_${Date.now()}.json`,
    JSON.stringify(backupData, null, 2)
  );

  console.log(`✅ 備份完成，共 ${data.length} 筆記錄`);
  console.log(`📁 備份檔案: backup_photos_${Date.now()}.json`);

  return data;
}

async function migrateTable() {
  console.log("🔄 開始資料庫遷移...");

  try {
    // 步驟 1: 備份資料
    const originalData = await backupTable();

    // 步驟 2: 添加新欄位
    console.log("➕ 添加新欄位 文字欄1 和 文字欄2...");

    // 注意：Supabase 不支援直接重命名欄位，需要先添加新欄位
    const { error: alterError } = await supabase.rpc("add_new_columns");

    if (alterError) {
      console.log("⚠️  無法自動添加欄位，請手動執行以下 SQL:");
      console.log(`
        ALTER TABLE photos 
        ADD COLUMN IF NOT EXISTS "文字欄1" TEXT,
        ADD COLUMN IF NOT EXISTS "文字欄2" TEXT;
      `);

      // 手動添加欄位的替代方案
      console.log("🔄 嘗試手動添加欄位...");
      // 這裡我們會跳過自動添加，讓用戶手動執行
      console.log(
        "請在 Supabase Dashboard 中執行上述 SQL，然後按 Enter 繼續..."
      );

      // 等待用戶輸入
      const readline = await import("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      await new Promise((resolve) => {
        rl.question("按 Enter 繼續...", () => {
          rl.close();
          resolve();
        });
      });
    }

    // 步驟 3: 複製資料到新欄位
    console.log("📋 複製資料到新欄位...");

    for (const record of originalData) {
      const updates = {};

      // 複製 brand_name 到 文字欄1
      if (record.brand_name !== null) {
        updates["文字欄1"] = record.brand_name;
      }

      // 複製 store_name 到 文字欄2
      if (record.store_name !== null) {
        updates["文字欄2"] = record.store_name;
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from("photos")
          .update(updates)
          .eq("id", record.id);

        if (updateError) {
          console.error(`❌ 更新記錄 ${record.id} 失敗:`, updateError);
        }
      }
    }

    console.log("✅ 資料複製完成");

    // 步驟 4: 驗證遷移結果
    console.log("🔍 驗證遷移結果...");

    const { data: migratedData, error: verifyError } = await supabase
      .from("photos")
      .select('id, brand_name, store_name, "文字欄1", "文字欄2"')
      .limit(5);

    if (verifyError) {
      console.error("❌ 驗證失敗:", verifyError);
    } else {
      console.log("✅ 遷移驗證成功！");
      console.log("📊 前 5 筆記錄:");
      console.table(migratedData);
    }

    // 步驟 5: 顯示後續步驟
    console.log(`
🎉 資料庫遷移完成！

📋 後續步驟:
1. 更新程式碼中的欄位引用
2. 測試應用程式功能
3. 確認無誤後，可以刪除舊欄位：
   ALTER TABLE photos DROP COLUMN brand_name;
   ALTER TABLE photos DROP COLUMN store_name;

⚠️  注意：請先確認新欄位工作正常後再刪除舊欄位！
    `);
  } catch (error) {
    console.error("❌ 遷移失敗:", error);
    process.exit(1);
  }
}

// 執行遷移
migrateTable();
