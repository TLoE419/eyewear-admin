import { createClient } from "@supabase/supabase-js";
import {
  Photo,
  CreatePhotoData,
  PhotoListParams,
  PhotoListResponse,
  PhotoCategory,
} from "@/types/photo";

// 獲取 Supabase 配置
const getSupabaseConfig = () => {
  if (typeof window !== "undefined") {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
};

const { url: supabaseUrl, key: supabaseKey } = getSupabaseConfig();

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase configuration is missing");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class PhotoApi {
  // 獲取所有照片
  static async getPhotos(
    params: PhotoListParams = {}
  ): Promise<PhotoListResponse> {
    try {
      const {
        category,
        search,
        page = 1,
        perPage = 10,
        sortBy = "display_order",
        sortOrder = "asc",
      } = params;

      let query = supabase.from("photos").select("*", { count: "exact" });

      // 應用過濾器
      if (category) {
        query = query.eq("category", category);
      }

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,subtitle.ilike.%${search}%,brand_name.ilike.%${search}%,store_name.ilike.%${search}%`
        );
      }

      // 應用排序
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // 應用分頁
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const total = count || 0;
      const totalPages = Math.ceil(total / perPage);

      return {
        data: data || [],
        total,
        page,
        perPage,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching photos:", error);
      throw error;
    }
  }

  // 根據類別獲取照片
  static async getPhotosByCategory(category: PhotoCategory): Promise<Photo[]> {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("category", category)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching photos by category:", error);
      throw error;
    }
  }

  // 獲取單張照片
  static async getPhoto(id: string): Promise<Photo> {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching photo:", error);
      throw error;
    }
  }

  // 創建照片
  static async createPhoto(photoData: CreatePhotoData): Promise<Photo> {
    try {
      const { data, error } = await supabase
        .from("photos")
        .insert([photoData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating photo:", error);
      throw error;
    }
  }

  // 更新照片
  static async updatePhoto(
    id: string,
    photoData: Partial<CreatePhotoData>
  ): Promise<Photo> {
    try {
      const { data, error } = await supabase
        .from("photos")
        .update(photoData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating photo:", error);
      throw error;
    }
  }

  // 刪除照片
  static async deletePhoto(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("photos").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting photo:", error);
      throw error;
    }
  }

  // 批量刪除照片
  static async deletePhotos(ids: string[]): Promise<void> {
    try {
      const { error } = await supabase.from("photos").delete().in("id", ids);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting photos:", error);
      throw error;
    }
  }

  // 更新照片顯示順序
  static async updatePhotoOrder(
    updates: { id: string; display_order: number }[]
  ): Promise<void> {
    try {
      const promises = updates.map(({ id, display_order }) =>
        supabase.from("photos").update({ display_order }).eq("id", id)
      );

      const results = await Promise.all(promises);

      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} photos`);
      }
    } catch (error) {
      console.error("Error updating photo order:", error);
      throw error;
    }
  }

  // 上傳圖片到 Supabase Storage
  static async uploadImage(
    file: File,
    category: PhotoCategory
  ): Promise<string> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${category}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("photos")
        .upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  // 從 Supabase Storage 刪除圖片
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // 從 URL 中提取檔案路徑
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const category = urlParts[urlParts.length - 2];
      const filePath = `${category}/${fileName}`;

      const { error } = await supabase.storage
        .from("photos")
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  // 獲取各類別照片數量
  static async getCategoryCounts(): Promise<Record<PhotoCategory, number>> {
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("category")
        .eq("is_active", true);

      if (error) throw error;

      const counts = data.reduce((acc, photo) => {
        acc[photo.category as PhotoCategory] =
          (acc[photo.category as PhotoCategory] || 0) + 1;
        return acc;
      }, {} as Record<PhotoCategory, number>);

      return counts;
    } catch (error) {
      console.error("Error getting category counts:", error);
      throw error;
    }
  }
}
