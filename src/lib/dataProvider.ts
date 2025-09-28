import { DataProvider } from "react-admin";
import { dataStore } from "./dataStore";

// 模擬API端點 - 目前未使用
// const API_URL = "/api";

// const httpClient = (url: string, options: Record<string, unknown> = {}) => {
//   if (!options.headers) {
//     options.headers = new Headers({ Accept: "application/json" });
//   }
//   return fetchUtils.fetchJson(url, options);
// };

export const dataProvider: DataProvider = {
  getList: (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] = [];

    if (resource === "products") {
      data = dataStore.products.getAll();
    } else if (resource === "lenses") {
      data = dataStore.lenses.getAll();
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    // 應用過濾器
    if (params.filter) {
      Object.keys(params.filter).forEach((key) => {
        if (params.filter[key]) {
          data = data.filter((item) =>
            item[key]
              ?.toString()
              .toLowerCase()
              .includes(params.filter[key].toString().toLowerCase())
          );
        }
      });
    }

    // 應用排序
    const { field = "id", order = "ASC" } = params.sort || {};
    data.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (order === "ASC") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // 應用分頁
    const { page = 1, perPage = 10 } = params.pagination || {};
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = data.slice(startIndex, endIndex);

    return Promise.resolve({
      data: paginatedData,
      total: data.length,
    });
  },

  getOne: (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;

    if (resource === "products") {
      data = dataStore.products.getById(params.id.toString());
    } else if (resource === "lenses") {
      data = dataStore.lenses.getById(params.id.toString());
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    if (!data) {
      throw new Error(`${resource} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve({ data: data as any });
  },

  getMany: (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] = [];

    if (resource === "products") {
      data = dataStore.products.getAll();
    } else if (resource === "lenses") {
      data = dataStore.lenses.getAll();
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredData = data.filter((item: any) =>
      params.ids.includes(item.id)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve({ data: filteredData as any });
  },

  getManyReference: () => {
    return Promise.resolve({ data: [], total: 0 });
  },

  create: (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newRecord: any;

    if (resource === "products") {
      newRecord = dataStore.products.create(params.data);
    } else if (resource === "lenses") {
      newRecord = dataStore.lenses.create(params.data);
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve({ data: newRecord as any });
  },

  update: (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updatedRecord: any;

    if (resource === "products") {
      updatedRecord = dataStore.products.update(
        params.id.toString(),
        params.data
      );
    } else if (resource === "lenses") {
      updatedRecord = dataStore.lenses.update(
        params.id.toString(),
        params.data
      );
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve({ data: updatedRecord as any });
  },

  updateMany: (resource, params) => {
    // 批量更新
    const results = params.ids.map((id) => {
      if (resource === "products") {
        return dataStore.products.update(id.toString(), params.data);
      } else if (resource === "lenses") {
        return dataStore.lenses.update(id.toString(), params.data);
      }
      return null;
    });

    return Promise.resolve({ data: results.filter(Boolean) });
  },

  delete: (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deletedRecord: any;

    if (resource === "products") {
      deletedRecord = dataStore.products.delete(params.id.toString());
    } else if (resource === "lenses") {
      deletedRecord = dataStore.lenses.delete(params.id.toString());
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve({ data: deletedRecord as any });
  },

  deleteMany: (resource, params) => {
    // 批量刪除
    const results = params.ids.map((id) => {
      if (resource === "products") {
        return dataStore.products.delete(id.toString());
      } else if (resource === "lenses") {
        return dataStore.lenses.delete(id.toString());
      }
      return null;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.resolve({ data: results.filter(Boolean) as any });
  },
};
