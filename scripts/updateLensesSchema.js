import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// 載入環境變數
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// 創建 Supabase 客戶端
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase 環境變數未設置");
  }

  return createClient(supabaseUrl, supabaseKey);
};

async function updateLensesSchema() {
  try {
    console.log("開始更新鏡片數據庫結構...");

    const supabase = createSupabaseClient();

    // 檢查現有的表結構
    console.log("檢查現有的表結構...");
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_name", "lenses");

    if (tablesError) {
      console.error("檢查表結構失敗:", tablesError);
      throw tablesError;
    }

    console.log(
      "現有的欄位:",
      tables?.map((t) => t.column_name)
    );

    // 檢查是否需要添加新欄位
    const existingColumns = tables?.map((t) => t.column_name) || [];

    if (!existingColumns.includes("shortdescription")) {
      console.log("添加 shortDescription 欄位...");
      const { error: addShortError } = await supabase.rpc("exec_sql", {
        sql: 'ALTER TABLE lenses ADD COLUMN IF NOT EXISTS "shortDescription" TEXT;',
      });

      if (addShortError) {
        console.error("添加 shortDescription 失敗:", addShortError);
      } else {
        console.log("成功添加 shortDescription 欄位");
      }
    }

    if (!existingColumns.includes("longdescription")) {
      console.log("添加 longDescription 欄位...");
      const { error: addLongError } = await supabase.rpc("exec_sql", {
        sql: 'ALTER TABLE lenses ADD COLUMN IF NOT EXISTS "longDescription" TEXT;',
      });

      if (addLongError) {
        console.error("添加 longDescription 失敗:", addLongError);
      } else {
        console.log("成功添加 longDescription 欄位");
      }
    }

    // 檢查是否需要移除舊欄位
    if (existingColumns.includes("description")) {
      console.log("移除舊的 description 欄位...");
      const { error: dropError } = await supabase.rpc("exec_sql", {
        sql: "ALTER TABLE lenses DROP COLUMN IF EXISTS description;",
      });

      if (dropError) {
        console.error("移除 description 失敗:", dropError);
      } else {
        console.log("成功移除 description 欄位");
      }
    }

    console.log("\n✅ 數據庫結構更新完成！");
  } catch (error) {
    console.error("❌ 更新失敗:", error);
    process.exit(1);
  }
}

// 執行更新
updateLensesSchema();
