// Cloudflare Worker 處理 API 路由
import { createClient } from "@supabase/supabase-js";

// 環境變數
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 處理 CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // GET /api/photos - 獲取所有照片
      if (path === "/api/photos" && request.method === "GET") {
        const { data: photos, error } = await supabase
          .from("photos")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          return new Response(
            JSON.stringify({ error: "Failed to fetch photos" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(JSON.stringify(photos), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // POST /api/photos - 上傳新照片
      if (path === "/api/photos" && request.method === "POST") {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // 上傳檔案到 Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, file);

        if (uploadError) {
          return new Response(
            JSON.stringify({ error: "Failed to upload file" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // 獲取公開URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(filePath);

        // 儲存照片資訊到資料庫
        const photoData = {
          image_url: publicUrl,
          category: formData.get("category"),
          title: formData.get("title") || undefined,
          subtitle: formData.get("subtitle") || undefined,
          文字欄1: formData.get("文字欄1") || undefined,
          文字欄2: formData.get("文字欄2") || undefined,
          display_order: parseInt(formData.get("display_order")) || 0,
          is_active: formData.get("is_active") === "true",
        };

        const { data: photo, error: dbError } = await supabase
          .from("photos")
          .insert([photoData])
          .select()
          .single();

        if (dbError) {
          await supabase.storage.from("photos").remove([filePath]);
          return new Response(
            JSON.stringify({ error: "Failed to save photo data" }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        return new Response(JSON.stringify(photo), {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 其他 API 路由...
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
