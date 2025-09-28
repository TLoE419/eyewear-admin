import { config } from "dotenv";
import { clientSupabaseDataProvider } from "../src/lib/clientSupabaseDataProvider";

// 載入環境變數
config({ path: ".env.local" });

async function testDataProvider() {
  try {
    console.log("🧪 測試 Supabase Data Provider...");

    // 測試獲取產品列表
    console.log("\n📦 測試獲取產品列表:");
    const productsResult = await clientSupabaseDataProvider.getList(
      "products",
      {
        pagination: { page: 1, perPage: 5 },
        sort: { field: "id", order: "ASC" },
        filter: {},
      }
    );
    console.log("✅ 產品列表:", productsResult.data.length, "個產品");

    // 測試獲取鏡片列表
    console.log("\n🔍 測試獲取鏡片列表:");
    const lensesResult = await clientSupabaseDataProvider.getList("lenses", {
      pagination: { page: 1, perPage: 5 },
      sort: { field: "id", order: "ASC" },
      filter: {},
    });
    console.log("✅ 鏡片列表:", lensesResult.data.length, "個鏡片");

    console.log("\n🎉 所有測試通過！");
  } catch (error) {
    console.error("❌ 測試失敗:", error);
  }
}

testDataProvider();
