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

async function checkSupabaseSetup() {
  console.log("🔍 檢查 Supabase 設定...\n");

  try {
    // 檢查 Supabase 連線
    console.log("📋 1. 檢查 Supabase 連線");
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Key: ${supabaseKey?.substring(0, 20)}...`);

    // 檢查 photos 表
    console.log("\n📋 2. 檢查 photos 表");
    const { data: tableData, error: tableError } = await supabase
      .from("photos")
      .select("id, category, title")
      .limit(5);

    if (tableError) {
      console.log(`   ❌ 表檢查失敗: ${tableError.message}`);
    } else {
      console.log(`   ✅ photos 表正常，共有 ${tableData.length} 張照片`);
      tableData.forEach((photo, index) => {
        console.log(`      ${index + 1}. ${photo.title} (${photo.category})`);
      });
    }

    // 檢查 Storage buckets
    console.log("\n📋 3. 檢查 Storage buckets");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log(`   ❌ 無法獲取 buckets: ${bucketsError.message}`);
    } else {
      console.log(`   📦 找到 ${buckets.length} 個 buckets:`);
      buckets.forEach((bucket, index) => {
        console.log(
          `      ${index + 1}. ${bucket.name} (公開: ${bucket.public})`
        );
      });

      const photosBucket = buckets.find((bucket) => bucket.name === "photos");
      if (photosBucket) {
        console.log("   ✅ photos bucket 存在");
        console.log(`      - 公開: ${photosBucket.public}`);
        console.log(
          `      - 檔案大小限制: ${
            photosBucket.file_size_limit
              ? `${photosBucket.file_size_limit / 1024 / 1024}MB`
              : "無限制"
          }`
        );
        console.log(
          `      - 允許的 MIME 類型: ${
            photosBucket.allowed_mime_types?.join(", ") || "無限制"
          }`
        );
      } else {
        console.log("   ❌ photos bucket 不存在");
        console.log(
          "   💡 請在 Supabase Dashboard → Storage 中建立 photos bucket"
        );
      }
    }

    // 檢查 RLS 政策
    console.log("\n📋 4. 檢查 RLS 政策");
    const { data: policies, error: policiesError } = await supabase
      .from("pg_policies")
      .select("tablename, policyname, permissive, roles, cmd, qual")
      .eq("tablename", "photos");

    if (policiesError) {
      console.log(`   ⚠️ 無法檢查 RLS 政策: ${policiesError.message}`);
    } else {
      if (policies.length === 0) {
        console.log("   ⚠️ photos 表沒有 RLS 政策，可能需要設定");
      } else {
        console.log(`   📋 找到 ${policies.length} 個 RLS 政策:`);
        policies.forEach((policy, index) => {
          console.log(
            `      ${index + 1}. ${policy.policyname} (${policy.cmd})`
          );
        });
      }
    }

    console.log("\n🎯 總結:");
    if (tableData && tableData.length > 0) {
      console.log("   ✅ photos 表正常運作");
    } else {
      console.log("   ❌ photos 表有問題");
    }

    if (buckets && buckets.find((b) => b.name === "photos")) {
      console.log("   ✅ photos bucket 已建立");
    } else {
      console.log("   ❌ 需要建立 photos bucket");
    }
  } catch (error) {
    console.error("❌ 檢查失敗:", error);
  }
}

// 執行檢查
checkSupabaseSetup();
