// 照片管理系統類型定義和工具函數

export enum PhotoCategory {
  HERO = "hero",
  IMAGE_SLIDER = "image_slider",
  NEWS_CAROUSEL = "news_carousel",
  BRAND_LOGO = "brand_logo",
  STORE_PHOTO = "store_photo",
  PRODUCT_PHOTO = "product_photo",
}

export interface Photo {
  id: string;
  image_url: string;
  category: PhotoCategory;
  title?: string;
  subtitle?: string;
  文字欄1?: string;
  文字欄2?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PhotoUpload {
  category: PhotoCategory;
  title?: string;
  subtitle?: string;
  文字欄1?: string;
  文字欄2?: string;
  display_order?: number;
  is_active?: boolean;
}

// API 端點
export const PHOTO_API_ENDPOINTS = {
  GET_PHOTOS: "/api/photos",
  GET_PHOTOS_BY_CATEGORY: "/api/photos/category",
  UPLOAD_PHOTO: "/api/photos/upload",
  UPDATE_PHOTO: "/api/photos",
  DELETE_PHOTO: "/api/photos",
} as const;

// 照片類別配置
export const PHOTO_CATEGORY_CONFIG = {
  [PhotoCategory.HERO]: {
    name: "Hero 輪播照片",
    description: "首頁主要輪播照片",
    maxCount: 5,
    recommendedSize: "1920x1080",
    allowedFormats: ["jpg", "jpeg", "png", "webp"],
  },
  [PhotoCategory.IMAGE_SLIDER]: {
    name: "圖片輪播",
    description: "首頁圖片輪播區塊",
    maxCount: 10,
    recommendedSize: "1920x1080",
    allowedFormats: ["jpg", "jpeg", "png", "webp"],
  },
  [PhotoCategory.NEWS_CAROUSEL]: {
    name: "新聞跑馬燈",
    description: "首頁新聞跑馬燈照片",
    maxCount: 20,
    recommendedSize: "800x800",
    allowedFormats: ["jpg", "jpeg", "png", "webp"],
  },
  [PhotoCategory.BRAND_LOGO]: {
    name: "品牌Logo",
    description: "品牌Logo照片",
    maxCount: 50,
    recommendedSize: "400x400",
    allowedFormats: ["jpg", "jpeg", "png", "webp", "svg"],
  },
  [PhotoCategory.STORE_PHOTO]: {
    name: "分店照片",
    description: "分店展示照片",
    maxCount: 20,
    recommendedSize: "1200x800",
    allowedFormats: ["jpg", "jpeg", "png", "webp"],
  },
} as const;
