export type PhotoCategory =
  | "hero"
  | "image_slider"
  | "news_carousel"
  | "brand_logo"
  | "store_photo";

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

export interface CreatePhotoData {
  image_url: string;
  category: PhotoCategory;
  title?: string;
  subtitle?: string;
  文字欄1?: string;
  文字欄2?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdatePhotoData extends Partial<CreatePhotoData> {
  id: string;
}

export interface PhotoUploadFormData {
  file: File;
  category: PhotoCategory;
  title?: string;
  subtitle?: string;
  文字欄1?: string;
  文字欄2?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface PhotoListParams {
  category?: PhotoCategory;
  search?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PhotoListResponse {
  data: Photo[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CategoryInfo {
  category: PhotoCategory;
  name: string;
  description: string;
  maxCount: number;
  recommendedSize: string;
  supportedFormats: string[];
  requiredFields: string[];
}

export const PHOTO_CATEGORIES: Record<PhotoCategory, CategoryInfo> = {
  hero: {
    category: "hero",
    name: "Hero 輪播照片",
    description: "首頁主要輪播背景",
    maxCount: 5,
    recommendedSize: "1920x1080",
    supportedFormats: ["JPG", "PNG", "WebP"],
    requiredFields: [],
  },
  image_slider: {
    category: "image_slider",
    name: "Image Slider 輪播照片",
    description: "首頁圖片輪播區塊",
    maxCount: 10,
    recommendedSize: "1920x1080",
    supportedFormats: ["JPG", "PNG", "WebP"],
    requiredFields: ["文字欄1", "文字欄2"],
  },
  brand_logo: {
    category: "brand_logo",
    name: "Brand Logo 品牌 Logo",
    description: "品牌系列展示",
    maxCount: 20,
    recommendedSize: "400x400",
    supportedFormats: ["JPG", "PNG", "WebP", "SVG"],
    requiredFields: [],
  },
  store_photo: {
    category: "store_photo",
    name: "Store Photo 分店照片",
    description: "分店展示",
    maxCount: 10,
    recommendedSize: "1200x800",
    supportedFormats: ["JPG", "PNG", "WebP"],
    requiredFields: [],
  },
  news_carousel: {
    category: "news_carousel",
    name: "News Carousel 跑馬燈照片",
    description: "首頁新聞跑馬燈",
    maxCount: 15,
    recommendedSize: "800x800",
    supportedFormats: ["JPG", "PNG", "WebP"],
    requiredFields: [],
  },
};
