import { createClient } from "@supabase/supabase-js";
import { DataProvider } from "react-admin";

// 創建 Supabase 客戶端（僅在客戶端使用）
const createSupabaseClient = () => {
  // 檢查是否在客戶端環境
  if (typeof window === "undefined") {
    throw new Error("Supabase 客戶端只能在客戶端環境中使用");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase 環境變數未設置");
  }

  return createClient(supabaseUrl, supabaseKey);
};

export const clientSupabaseDataProvider: DataProvider = {
  getList: async (resource, params) => {
    const supabase = createSupabaseClient();

    try {
      const { page = 1, perPage = 10 } = params.pagination || {};
      const { field = "id", order = "ASC" } = params.sort || {};

      // 構建查詢
      let query = supabase.from(resource).select("*", { count: "exact" });

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

      // 處理欄位名稱轉換（instock -> inStock）
      const processedData = (data || []).map((item) => {
        if (item.instock !== undefined) {
          item.inStock = item.instock;
          delete item.instock;
        }
        return item;
      });

      return {
        data: processedData,
        total: count || 0,
      };
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    const supabase = createSupabaseClient();
    try {
      const { data, error } = await supabase
        .from(resource)
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      // 處理欄位名稱轉換（instock -> inStock）
      if (data && data.instock !== undefined) {
        data.inStock = data.instock;
        delete data.instock;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { data: data as any };
    } catch (error) {
      console.error("Error fetching one:", error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    const supabase = createSupabaseClient();
    try {
      const { data, error } = await supabase
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
    const supabase = createSupabaseClient();
    try {
      const { data, error } = await supabase
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
    const supabase = createSupabaseClient();
    try {
      // 處理欄位名稱轉換（inStock -> instock）
      const processedData = { ...params.data };
      if (processedData.inStock !== undefined) {
        processedData.instock = processedData.inStock;
        delete processedData.inStock;
      }

      // 處理照片資源的特殊情況
      if (resource === "photos") {
        // 移除 ImageInput 產生的特殊欄位
        delete processedData.image;

        // 確保文字欄位名稱正確
        if (processedData["文字欄1"] !== undefined) {
          processedData["文字欄1"] = processedData["文字欄1"];
        }
        if (processedData["文字欄2"] !== undefined) {
          processedData["文字欄2"] = processedData["文字欄2"];
        }
      }

      // 添加時間戳
      const now = new Date().toISOString();
      processedData.created_at = now;
      processedData.updated_at = now;

      console.log("創建資料:", { resource, processedData });

      const { data, error } = await supabase
        .from(resource)
        .insert([processedData])
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
    const supabase = createSupabaseClient();
    try {
      // 處理欄位名稱轉換（inStock -> instock）
      const processedData = { ...params.data };
      if (processedData.inStock !== undefined) {
        processedData.instock = processedData.inStock;
        delete processedData.inStock;
      }

      // 處理照片資源的特殊情況
      if (resource === "photos") {
        // 移除 ImageInput 產生的特殊欄位
        delete processedData.image;

        // 確保文字欄位名稱正確
        if (processedData["文字欄1"] !== undefined) {
          processedData["文字欄1"] = processedData["文字欄1"];
        }
        if (processedData["文字欄2"] !== undefined) {
          processedData["文字欄2"] = processedData["文字欄2"];
        }
      }

      // 移除 id 欄位，因為 Supabase 不允許更新主鍵
      delete processedData.id;

      // 添加 updated_at 時間戳
      processedData.updated_at = new Date().toISOString();

      console.log("更新資料:", { resource, id: params.id, processedData });

      const { data, error } = await supabase
        .from(resource)
        .update(processedData)
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { data: data as any };
    } catch (error) {
      console.error("Error updating:", error);
      console.error("Update params:", {
        resource,
        id: params.id,
        data: params.data,
      });
      throw error;
    }
  },

  updateMany: async (resource, params) => {
    const supabase = createSupabaseClient();
    try {
      const results = await Promise.all(
        params.ids.map((id) =>
          supabase
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
    const supabase = createSupabaseClient();
    try {
      const { error } = await supabase
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
    const supabase = createSupabaseClient();
    try {
      const { error } = await supabase
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
