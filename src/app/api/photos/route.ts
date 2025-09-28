import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Photo } from "@/lib/photoManagement";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/photos - 獲取所有照片
export async function GET() {
  try {
    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching photos:", error);
      return NextResponse.json(
        { error: "Failed to fetch photos" },
        { status: 500 }
      );
    }

    // 設置緩存控制標頭
    const response = NextResponse.json(photos);
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/photos - 上傳新照片
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 上傳檔案到 Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // 獲取公開URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(filePath);

    // 儲存照片資訊到資料庫
    const photoData: Omit<Photo, "id" | "created_at" | "updated_at"> = {
      image_url: publicUrl,
      category: formData.get("category") as Photo["category"],
      title: (formData.get("title") as string) || undefined,
      subtitle: (formData.get("subtitle") as string) || undefined,
      文字欄1: (formData.get("文字欄1") as string) || undefined,
      文字欄2: (formData.get("文字欄2") as string) || undefined,
      display_order: parseInt(formData.get("display_order") as string) || 0,
      is_active: formData.get("is_active") === "true",
    };

    const { data: photo, error: dbError } = await supabase
      .from("photos")
      .insert([photoData])
      .select()
      .single();

    if (dbError) {
      console.error("Error saving photo data:", dbError);
      // 如果資料庫儲存失敗，刪除已上傳的檔案
      await supabase.storage.from("photos").remove([filePath]);
      return NextResponse.json(
        { error: "Failed to save photo data" },
        { status: 500 }
      );
    }

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
