import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-static";
import { PhotoCategory } from "@/lib/photoManagement";

export async function generateStaticParams() {
  return Object.values(PhotoCategory).map((category) => ({
    category: category,
  }));
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/photos/category/[category] - 根據類別獲取照片
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;

    // 驗證類別是否有效
    if (!Object.values(PhotoCategory).includes(category as PhotoCategory)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const { data: photos, error } = await supabase
      .from("photos")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching photos by category:", error);
      return NextResponse.json(
        { error: "Failed to fetch photos" },
        { status: 500 }
      );
    }

    // 設置緩存控制標頭，確保資料即時更新
    const response = NextResponse.json(photos);

    // 禁用緩存，確保即時獲取最新資料
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
