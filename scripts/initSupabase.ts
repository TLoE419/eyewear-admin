import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// 載入環境變數
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 請設置 Supabase 環境變數");
  console.error("在 .env.local 檔案中添加：");
  console.error("NEXT_PUBLIC_SUPABASE_URL=your_supabase_url");
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initSupabase() {
  try {
    console.log("🚀 開始初始化 Supabase...");

    // 檢查連接
    const { data, error } = await supabase
      .from("products")
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Supabase 連接失敗:", error.message);
      return;
    }

    console.log("✅ Supabase 連接成功！");
    console.log("📊 資料庫狀態正常");
  } catch (error) {
    console.error("❌ 初始化失敗:", error);
  }
}

initSupabase();
