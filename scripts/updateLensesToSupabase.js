import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// 載入環境變數
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 創建 Supabase 客戶端
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase 環境變數未設置");
  }

  return createClient(supabaseUrl, supabaseKey);
};

async function updateLensesToSupabase() {
  try {
    console.log("開始更新鏡片數據到 Supabase...");

    // 讀取本地鏡片數據
    const lensesPath = path.join(__dirname, "..", "src", "data", "lenses.json");
    const lensesData = JSON.parse(fs.readFileSync(lensesPath, "utf8"));

    console.log(`讀取到 ${lensesData.length} 個鏡片數據`);

    // 創建 Supabase 客戶端
    const supabase = createSupabaseClient();

    // 清空現有的鏡片數據
    console.log("清空現有的鏡片數據...");
    const { error: deleteError } = await supabase
      .from("lenses")
      .delete()
      .neq("id", ""); // 刪除所有記錄

    if (deleteError) {
      console.error("清空數據失敗:", deleteError);
      throw deleteError;
    }

    console.log("成功清空現有數據");

    // 插入新的鏡片數據
    console.log("插入新的鏡片數據...");

    // 嘗試插入新格式的數據
    let { data, error: insertError } = await supabase
      .from("lenses")
      .insert(lensesData)
      .select();

    // 如果失敗，嘗試使用舊格式（只有 description）
    if (insertError && insertError.message.includes("longDescription")) {
      console.log("檢測到舊的數據庫結構，轉換為舊格式...");

      const oldFormatData = lensesData.map((lens) => ({
        id: lens.id,
        name: lens.name,
        brand: lens.brand,
        image: lens.image,
        description: lens.longDescription, // 使用長描述作為主要描述
      }));

      const { data: oldData, error: oldError } = await supabase
        .from("lenses")
        .insert(oldFormatData)
        .select();

      if (oldError) {
        console.error("插入舊格式數據失敗:", oldError);
        throw oldError;
      }

      data = oldData;
      insertError = null;
    }

    if (insertError) {
      console.error("插入數據失敗:", insertError);
      throw insertError;
    }

    console.log("成功插入鏡片數據:");
    data?.forEach((lens, index) => {
      console.log(`${index + 1}. ${lens.name} (${lens.brand})`);
    });

    console.log("\n✅ 鏡片數據更新完成！");
    console.log(`總共更新了 ${data?.length || 0} 個鏡片`);
  } catch (error) {
    console.error("❌ 更新失敗:", error);
    process.exit(1);
  }
}

// 執行更新
updateLensesToSupabase();
