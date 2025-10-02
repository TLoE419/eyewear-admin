import { DataProvider } from "react-admin";
import { dataStore } from "./dataStore";
import { ProductApi } from "./productApi";
import { PhotoApi } from "./photoApi";

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] = [];
    let total = 0;

    if (resource === "products") {
      try {
        const response = await ProductApi.getProducts({
          search: params.filter?.name || params.filter?.brand,
          page: params.pagination?.page || 1,
          perPage: params.pagination?.perPage || 10,
          sortBy: params.sort?.field || "created_at",
          sortOrder:
            (params.sort?.order?.toLowerCase() as "asc" | "desc") || "desc",
        });
        data = response.data;
        total = response.total;
      } catch (error) {
        console.error(
          "Error fetching products from Supabase, falling back to local data:",
          error
        );
        data = dataStore.products.getAll();
        total = data.length;
      }
    } else if (resource === "photos") {
      try {
        const response = await PhotoApi.getPhotos({
          page: params.pagination?.page || 1,
          perPage: params.pagination?.perPage || 10,
          sortBy: params.sort?.field || "display_order",
          sortOrder:
            (params.sort?.order?.toLowerCase() as "asc" | "desc") || "asc",
        });
        data = response.data;
        total = response.total;
      } catch (error) {
        console.error("Error fetching photos:", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    return Promise.resolve({
      data: data,
      total: total,
    });
  },

  getOne: async (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;

    if (resource === "products") {
      try {
        data = await ProductApi.getProduct(params.id.toString());
      } catch (error) {
        console.error(
          "Error fetching product from Supabase, falling back to local data:",
          error
        );
        data = dataStore.products.getById(params.id.toString());
      }
    } else if (resource === "photos") {
      try {
        data = await PhotoApi.getPhoto(params.id.toString());
      } catch (error) {
        console.error("Error fetching photo:", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    if (!data) {
      throw new Error(`${resource} not found`);
    }

    return Promise.resolve({ data: data });
  },

  getMany: async (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any[] = [];

    if (resource === "products") {
      try {
        const response = await ProductApi.getProducts();
        data = response.data;
      } catch (error) {
        console.error(
          "Error fetching products from Supabase, falling back to local data:",
          error
        );
        data = dataStore.products.getAll();
      }
    } else if (resource === "photos") {
      try {
        const response = await PhotoApi.getPhotos();
        data = response.data;
      } catch (error) {
        console.error("Error fetching photos:", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    const filteredData = data.filter(
      (
        item: any // eslint-disable-line @typescript-eslint/no-explicit-any
      ) => params.ids.includes(item.id)
    );

    return Promise.resolve({ data: filteredData });
  },

  getManyReference: () => {
    return Promise.resolve({ data: [], total: 0 });
  },

  create: async (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newRecord: any;

    if (resource === "products") {
      try {
        newRecord = await ProductApi.createProduct(params.data);
      } catch (error) {
        console.error(
          "Error creating product in Supabase, falling back to local data:",
          error
        );
        newRecord = dataStore.products.create(params.data);
      }
    } else if (resource === "photos") {
      try {
        newRecord = await PhotoApi.createPhoto(params.data);
      } catch (error) {
        console.error("Error creating photo:", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    return Promise.resolve({ data: newRecord });
  },

  update: async (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updatedRecord: any;

    if (resource === "products") {
      try {
        updatedRecord = await ProductApi.updateProduct(
          params.id.toString(),
          params.data
        );
      } catch (error) {
        console.error(
          "Error updating product in Supabase, falling back to local data:",
          error
        );
        updatedRecord = dataStore.products.update(
          params.id.toString(),
          params.data
        );
      }
    } else if (resource === "photos") {
      try {
        updatedRecord = await PhotoApi.updatePhoto(
          params.id.toString(),
          params.data
        );
      } catch (error) {
        console.error("Error updating photo:", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    return Promise.resolve({ data: updatedRecord });
  },

  updateMany: async (resource, params) => {
    const results = await Promise.all(
      params.ids.map(async (id) => {
        if (resource === "products") {
          try {
            return await ProductApi.updateProduct(id.toString(), params.data);
          } catch (error) {
            console.error(
              "Error updating product in Supabase, falling back to local data:",
              error
            );
            return dataStore.products.update(id.toString(), params.data);
          }
        } else if (resource === "photos") {
          try {
            return await PhotoApi.updatePhoto(id.toString(), params.data);
          } catch (error) {
            console.error("Error updating photo:", error);
            return null;
          }
        }
        return null;
      })
    );

    return Promise.resolve({ data: results.filter(Boolean) });
  },

  delete: async (resource, params) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deletedRecord: any;

    if (resource === "products") {
      try {
        await ProductApi.deleteProduct(params.id.toString());
        deletedRecord = { id: params.id };
      } catch (error) {
        console.error(
          "Error deleting product in Supabase, falling back to local data:",
          error
        );
        deletedRecord = dataStore.products.delete(params.id.toString());
      }
    } else if (resource === "photos") {
      try {
        deletedRecord = await PhotoApi.deletePhoto(params.id.toString());
      } catch (error) {
        console.error("Error deleting photo:", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Unknown resource"));
    }

    return Promise.resolve({ data: deletedRecord });
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(async (id) => {
        if (resource === "products") {
          try {
            await ProductApi.deleteProduct(id.toString());
          } catch (error) {
            console.error(
              "Error deleting product in Supabase, falling back to local data:",
              error
            );
            dataStore.products.delete(id.toString());
          }
        } else if (resource === "photos") {
          try {
            await PhotoApi.deletePhoto(id.toString());
          } catch (error) {
            console.error("Error deleting photo:", error);
          }
        }
      })
    );

    return Promise.resolve({ data: params.ids });
  },
};
