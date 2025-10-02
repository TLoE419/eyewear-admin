import { createClient } from "@supabase/supabase-js";

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

export interface Product {
  id: string;
  name: string;
  brand: string;
  image_url?: string;
  photo_id?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductListParams {
  search?: string;
  brand?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  perPage: number;
}

export class ProductApi {
  // 獲取所有產品
  static async getProducts(
    params: ProductListParams = {}
  ): Promise<ProductListResponse> {
    try {
      const {
        search,
        brand,
        page = 1,
        perPage = 10,
        sortBy = "created_at",
        sortOrder = "desc",
      } = params;

      let query = supabase.from("products").select("*", { count: "exact" });

      // 應用過濾器
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      if (brand) {
        query = query.eq("brand", brand);
      }

      // 應用排序
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // 應用分頁
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        perPage,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // 獲取單個產品
  static async getProduct(id: string): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  // 創建產品
  static async createProduct(
    productData: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
  ): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  // 更新產品
  static async updateProduct(
    id: string,
    productData: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
  ): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({ ...productData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // 刪除產品
  static async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  // 獲取所有品牌
  static async getBrands(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("brand")
        .not("brand", "is", null);

      if (error) throw error;

      const brands = [...new Set(data?.map((item) => item.brand) || [])];
      return brands.sort();
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  }
}
