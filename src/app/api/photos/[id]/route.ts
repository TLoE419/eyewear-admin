import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set");
  }

  return createClient(supabaseUrl, supabaseKey);
}

// PUT /api/photos/[id] - 更新照片
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseClient();
    const { id } = await params;
    const updates = await request.json();

    const { data: photo, error } = await supabase
      .from("photos")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating photo:", error);
      return NextResponse.json(
        { error: "Failed to update photo" },
        { status: 500 }
      );
    }

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/photos/[id] - 刪除照片
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseClient();
    const { id } = await params;

    // 先獲取照片資訊以刪除檔案
    const { data: photo, error: fetchError } = await supabase
      .from("photos")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching photo:", fetchError);
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // 從資料庫刪除照片記錄
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting photo from database:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete photo" },
        { status: 500 }
      );
    }

    // 從 Storage 刪除檔案
    if (photo?.image_url) {
      const filePath = photo.image_url.split("/").pop();
      if (filePath) {
        await supabase.storage.from("photos").remove([`photos/${filePath}`]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
