import { createClient } from "@supabase/supabase-js";
import { DataProvider } from "react-admin";

// 動態獲取 Supabase 配置（支援客戶端和服務端）
const getSupabaseConfig = () => {
  // 在客戶端環境中
  if (typeof window !== "undefined") {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  // 在服務端環境中，需要手動載入環境變數
  if (typeof process !== "undefined" && process.env) {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  return { url: undefined, key: undefined };
};

// Supabase 配置
const { url: supabaseUrl, key: supabaseKey } = getSupabaseConfig();

// 檢查是否為有效的 URL 和 Key
const isValidUrl =
  supabaseUrl &&
  supabaseUrl.trim() !== "" &&
  supabaseUrl.startsWith("https://");
const isValidKey =
  supabaseKey && supabaseKey.trim() !== "" && supabaseKey.length > 10;

console.log("Supabase 配置檢查:");
console.log("URL:", supabaseUrl ? "已設置" : "未設置");
console.log("KEY:", supabaseKey ? "已設置" : "未設置");
console.log("isValidUrl:", isValidUrl);
console.log("isValidKey:", isValidKey);

// 安全地創建 Supabase 客戶端
let supabase = null;
if (isValidUrl && isValidKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase 客戶端創建成功");
  } catch (error) {
    console.warn("Failed to create Supabase client:", error);
    supabase = null;
  }
} else {
  console.log("❌ Supabase 配置無效，跳過客戶端創建");
}

// 檢查 Supabase 客戶端是否已初始化
const checkSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      "Supabase client not initialized. Please check your environment variables."
    );
  }
  return supabase;
};

export const supabaseDataProvider: DataProvider = {
  getList: async (resource, params) => {
    const client = checkSupabaseClient();

    try {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field = "id", order = "ASC" } = params.sort || {};

      // 構建查詢
      let query = client.from(resource).select("*");

      // 應用過濾器
      if (params.filter) {
        Object.keys(params.filter).forEach((key) => {
          if (params.filter[key]) {
            query = query.ilike(key, `%${params.filter[key]}%`);
          }
        });
      }

      // 應用排序
      query = query.order(field, { ascending: order === "ASC" });

      // 應用分頁
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
      };
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    const client = checkSupabaseClient();
    try {
      const { data, error } = await client
        .from(resource)
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { data: data as any };
    } catch (error) {
      console.error("Error fetching one:", error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    const client = checkSupabaseClient();
    try {
      const { data, error } = await client
        .from(resource)
        .select("*")
        .in("id", params.ids);

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { data: data as any };
    } catch (error) {
      console.error("Error fetching many:", error);
      throw error;
    }
  },

  getManyReference: async (resource, params) => {
    const client = checkSupabaseClient();
    try {
      const { data, error } = await client
        .from(resource)
        .select("*")
        .eq(params.target, params.id);

      if (error) throw error;
      return { data: data || [], total: data?.length || 0 };
    } catch (error) {
      console.error("Error fetching many reference:", error);
      throw error;
    }
  },

  create: async (resource, params) => {
    const client = checkSupabaseClient();
    try {
      const { data, error } = await client
        .from(resource)
        .insert([params.data])
        .select()
        .single();

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { data: data as any };
    } catch (error) {
      console.error("Error creating:", error);
      throw error;
    }
  },

  update: async (resource, params) => {
    const client = checkSupabaseClient();
    try {
      const { data, error } = await client
        .from(resource)
        .update(params.data)
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { data: data as any };
    } catch (error) {
      console.error("Error updating:", error);
      throw error;
    }
  },

  updateMany: async (resource, params) => {
    const client = checkSupabaseClient();
    try {
      const results = await Promise.all(
        params.ids.map((id) =>
          client
            .from(resource)
            .update(params.data)
            .eq("id", id)
            .select()
            .single()
        )
      );

      const data = results
        .filter((result) => !result.error)
        .map((result) => result.data);

      return { data };
    } catch (error) {
      console.error("Error updating many:", error);
      throw error;
    }
  },

  delete: async (resource, params) => {
    const client = checkSupabaseClient();
    try {
      const { error } = await client
        .from(resource)
        .delete()
        .eq("id", params.id);

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { data: { id: params.id } as any };
    } catch (error) {
      console.error("Error deleting:", error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    const client = checkSupabaseClient();
    try {
      const { error } = await client
        .from(resource)
        .delete()
        .in("id", params.ids);

      if (error) throw error;
      return { data: params.ids };
    } catch (error) {
      console.error("Error deleting many:", error);
      throw error;
    }
  },
};
