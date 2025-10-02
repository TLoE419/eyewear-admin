// 內存數據存儲，模擬數據庫
import productsData from "@/data/products.json";

// 創建數據的深拷貝，避免修改原始數據
const products = JSON.parse(JSON.stringify(productsData));

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
};
