import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// 載入環境變數
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 請設置 Supabase 環境變數");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log("🔍 檢查 Supabase 表格...");

    // 檢查 products 表格
    console.log("\n📦 檢查 products 表格:");
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .limit(1);

    if (productsError) {
      console.error("❌ products 表格錯誤:", productsError.message);
    } else {
      console.log("✅ products 表格存在");
      if (products && products.length > 0) {
        console.log("📊 欄位:", Object.keys(products[0]));
      }
    }

    // 檢查 lenses 表格
    console.log("\n🔍 檢查 lenses 表格:");
    const { data: lenses, error: lensesError } = await supabase
      .from("lenses")
      .select("*")
      .limit(1);

    if (lensesError) {
      console.error("❌ lenses 表格錯誤:", lensesError.message);
    } else {
      console.log("✅ lenses 表格存在");
      if (lenses && lenses.length > 0) {
        console.log("📊 欄位:", Object.keys(lenses[0]));
      }
    }
  } catch (error) {
    console.error("❌ 檢查失敗:", error);
  }
}

checkTables();
