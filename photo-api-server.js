// 照片 API 服務器 - 為 eyewear-web 提供照片 API
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 3002;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase 配置缺失");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 獲取所有照片
app.get("/api/photos", async (req, res) => {
  try {
    console.log("📸 獲取所有照片...");

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("❌ 獲取照片失敗:", error);
      return res.status(500).json({ error: "Failed to fetch photos" });
    }

    console.log(`✅ 成功獲取 ${photos.length} 張照片`);
    res.json(photos);
  } catch (error) {
    console.error("❌ API 錯誤:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 根據類別獲取照片
app.get("/api/photos/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`📸 獲取 ${category} 類別照片...`);

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error(`❌ 獲取 ${category} 照片失敗:`, error);
      return res
        .status(500)
        .json({ error: `Failed to fetch photos for category: ${category}` });
    }

    console.log(`✅ 成功獲取 ${category} 類別 ${photos.length} 張照片`);
    res.json(photos);
  } catch (error) {
    console.error("❌ API 錯誤:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 上傳照片
app.post("/api/photos/upload", async (req, res) => {
  try {
    console.log("📤 上傳照片...");

    // 這裡可以實現照片上傳邏輯
    // 目前只是返回成功響應
    res.json({ message: "Photo upload endpoint - not implemented yet" });
  } catch (error) {
    console.error("❌ 上傳錯誤:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// 更新照片
app.put("/api/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log(`📝 更新照片 ${id}...`);

    const { data: photo, error } = await supabase
      .from("photos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`❌ 更新照片 ${id} 失敗:`, error);
      return res.status(500).json({ error: "Failed to update photo" });
    }

    console.log(`✅ 成功更新照片 ${id}`);
    res.json(photo);
  } catch (error) {
    console.error("❌ 更新錯誤:", error);
    res.status(500).json({ error: "Update failed" });
  }
});

// 刪除照片
app.delete("/api/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ 刪除照片 ${id}...`);

    const { error } = await supabase.from("photos").delete().eq("id", id);

    if (error) {
      console.error(`❌ 刪除照片 ${id} 失敗:`, error);
      return res.status(500).json({ error: "Failed to delete photo" });
    }

    console.log(`✅ 成功刪除照片 ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ 刪除錯誤:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

// 健康檢查
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`🚀 照片 API 服務器運行在 http://localhost:${PORT}`);
  console.log(`📡 健康檢查: http://localhost:${PORT}/health`);
  console.log(`📸 照片 API: http://localhost:${PORT}/api/photos`);
});
