// 內存數據存儲，模擬數據庫
import productsData from "@/data/products.json";
import lensesData from "@/data/lenses.json";

// 創建數據的深拷貝，避免修改原始數據
const products = JSON.parse(JSON.stringify(productsData));
const lenses = JSON.parse(JSON.stringify(lensesData));

export const dataStore = {
  // 產品相關操作
  products: {
    getAll: () => products,
    getById: (id: string) =>
      products.find((p: Record<string, unknown>) => p.id === id),
    create: (newProduct: Record<string, unknown>) => {
      const product = { ...newProduct, id: Date.now().toString() };
      products.push(product);
      return product;
    },
    update: (id: string, updatedProduct: Record<string, unknown>) => {
      const index = products.findIndex(
        (p: Record<string, unknown>) => p.id === id
      );
      if (index !== -1) {
        products[index] = { ...updatedProduct, id };
        return products[index];
      }
      throw new Error("Product not found");
    },
    delete: (id: string) => {
      const index = products.findIndex(
        (p: Record<string, unknown>) => p.id === id
      );
      if (index !== -1) {
        products.splice(index, 1);
        return { id };
      }
      throw new Error("Product not found");
    },
  },

  // 鏡片相關操作
  lenses: {
    getAll: () => lenses,
    getById: (id: string) =>
      lenses.find((l: Record<string, unknown>) => l.id === id),
    create: (newLens: Record<string, unknown>) => {
      const lens = { ...newLens, id: Date.now().toString() };
      lenses.push(lens);
      return lens;
    },
    update: (id: string, updatedLens: Record<string, unknown>) => {
      const index = lenses.findIndex(
        (l: Record<string, unknown>) => l.id === id
      );
      if (index !== -1) {
        lenses[index] = { ...updatedLens, id };
        return lenses[index];
      }
      throw new Error("Lens not found");
    },
    delete: (id: string) => {
      const index = lenses.findIndex(
        (l: Record<string, unknown>) => l.id === id
      );
      if (index !== -1) {
        lenses.splice(index, 1);
        return { id };
      }
      throw new Error("Lens not found");
    },
  },
};
