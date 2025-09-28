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

async function addTextFields() {
  try {
    console.log("🔄 開始添加文字欄位到 photos 表...");

    // 檢查表是否存在
    const { data: tableCheck, error: tableError } = await supabase
      .from("photos")
      .select("id")
      .limit(1);

    if (tableError && tableError.code === "PGRST116") {
      console.log("❌ photos 表不存在，請先建立表");
      return;
    } else if (tableError) {
      console.log("❌ 檢查表時發生錯誤:", tableError);
      return;
    }

    console.log("✅ photos 表已存在");

    // 添加文字欄1和文字欄2欄位，並刪除舊欄位
    console.log("📝 請在 Supabase Dashboard 的 SQL 編輯器中執行以下 SQL:");
    console.log(`
-- 步驟1: 添加新的文字欄位
ALTER TABLE photos ADD COLUMN IF NOT EXISTS "文字欄1" TEXT;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS "文字欄2" TEXT;

-- 步驟2: 將現有資料遷移到新欄位
UPDATE photos SET "文字欄1" = brand_name WHERE brand_name IS NOT NULL;
UPDATE photos SET "文字欄2" = store_name WHERE store_name IS NOT NULL;

-- 步驟3: 刪除舊的欄位
ALTER TABLE photos DROP COLUMN IF EXISTS brand_name;
ALTER TABLE photos DROP COLUMN IF EXISTS store_name;

-- 步驟4: 顯示更新結果
SELECT 
  id,
  title,
  "文字欄1",
  "文字欄2",
  category,
  display_order,
  is_active
FROM photos 
LIMIT 5;
    `);

    console.log("\n📋 遷移說明:");
    console.log("1. 添加了 '文字欄1' 和 '文字欄2' 欄位");
    console.log("2. 將現有的 brand_name 資料複製到 文字欄1");
    console.log("3. 將現有的 store_name 資料複製到 文字欄2");
    console.log("4. 徹底刪除 brand_name 和 store_name 欄位");
    console.log("5. 後台管理系統將使用新的文字欄位");

    console.log(
      "\n✅ 遷移 SQL 已準備完成，請在 Supabase Dashboard 中執行上述 SQL"
    );
  } catch (error) {
    console.error("❌ 執行失敗:", error);
  }
}

// 執行腳本
addTextFields();
