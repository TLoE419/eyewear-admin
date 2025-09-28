// 照片管理相關的 React Hooks

import { useState, useEffect } from "react";
import {
  Photo,
  PhotoCategory,
  PhotoUpload,
  PHOTO_API_ENDPOINTS,
} from "@/lib/photoManagement";
import { PhotoApi } from "@/lib/photoApi";

// 獲取所有照片
export const usePhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        // 直接使用 PhotoApi 獲取照片
        const response = await PhotoApi.getPhotos();
        setPhotos(response.data as Photo[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return { photos, loading, error, refetch: () => window.location.reload() };
};

// 根據類別獲取照片
export const usePhotosByCategory = (category: PhotoCategory) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${PHOTO_API_ENDPOINTS.GET_PHOTOS_BY_CATEGORY}/${category}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch photos for category: ${category}`);
        }
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // 如果API失敗，使用預設照片
        setPhotos(getDefaultPhotos(category));
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [category]);

  return { photos, loading, error, refetch: () => window.location.reload() };
};

// 上傳照片
export const usePhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = async (photoData: PhotoUpload, file: File) => {
    try {
      setUploading(true);
      setError(null);

      // 直接使用 PhotoApi 上傳圖片到 Supabase Storage
      const imageUrl = await PhotoApi.uploadImage(file, photoData.category);
      
      // 創建照片記錄並保存到資料庫
      const photoRecord = {
        image_url: imageUrl,
        category: photoData.category,
        title: photoData.title || undefined,
        subtitle: photoData.subtitle || undefined,
        文字欄1: photoData.文字欄1 || undefined,
        文字欄2: photoData.文字欄2 || undefined,
        display_order: photoData.display_order || 0,
        is_active: photoData.is_active !== undefined ? photoData.is_active : true,
      };

      // 使用 PhotoApi 創建照片記錄
      const newPhoto = await PhotoApi.createPhoto(photoRecord);
      
      return newPhoto;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadPhoto, uploading, error };
};

// 更新照片
export const usePhotoUpdate = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePhoto = async (id: string, updates: Partial<Photo>) => {
    try {
      setUpdating(true);
      setError(null);

      // 直接使用 PhotoApi 更新照片
      const updatedPhoto = await PhotoApi.updatePhoto(id, updates);
      
      return updatedPhoto;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  return { updatePhoto, updating, error };
};

// 刪除照片
export const usePhotoDelete = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePhoto = async (id: string) => {
    try {
      setDeleting(true);
      setError(null);

      // 直接使用 PhotoApi 刪除照片
      await PhotoApi.deletePhoto(id);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  return { deletePhoto, deleting, error };
};

// 主要的照片管理 Hook，整合所有功能
export const usePhotoManagement = () => {
  const photosHook = usePhotos();
  const uploadHook = usePhotoUpload();
  const updateHook = usePhotoUpdate();
  const deleteHook = usePhotoDelete();

  // 獲取類別統計
  const getCategoryCounts = async (): Promise<
    Record<PhotoCategory, number>
  > => {
    try {
      const response = await fetch(PHOTO_API_ENDPOINTS.GET_PHOTOS);
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const photos: Photo[] = await response.json();

      const counts = {} as Record<PhotoCategory, number>;
      Object.values(PhotoCategory).forEach((category) => {
        counts[category] = photos.filter(
          (photo) => photo.category === category
        ).length;
      });

      return counts;
    } catch (err) {
      console.error("Failed to get category counts:", err);
      // 返回預設值
      const counts = {} as Record<PhotoCategory, number>;
      Object.values(PhotoCategory).forEach((category) => {
        counts[category] = getDefaultPhotos(category).length;
      });
      return counts;
    }
  };

  // 上傳圖片到存儲
  const uploadImage = async (
    file: File,
    category: PhotoCategory
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const response = await fetch(PHOTO_API_ENDPOINTS.UPLOAD_PHOTO, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    return result.image_url || result.url;
  };

  // 刪除圖片
  const deleteImage = async (imageUrl: string): Promise<void> => {
    // 這裡可以實現刪除存儲中的圖片的邏輯
    // 目前只是簡單的實現
    console.log("Deleting image:", imageUrl);
  };

  // 獲取照片列表（帶分頁和篩選）
  const fetchPhotos = async (
    options: {
      page?: number;
      perPage?: number;
      category?: PhotoCategory;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {}
  ) => {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append("page", options.page.toString());
      if (options.perPage) params.append("perPage", options.perPage.toString());
      if (options.category) params.append("category", options.category);
      if (options.search) params.append("search", options.search);
      if (options.sortBy) params.append("sortBy", options.sortBy);
      if (options.sortOrder) params.append("sortOrder", options.sortOrder);

      const response = await fetch(
        `${PHOTO_API_ENDPOINTS.GET_PHOTOS}?${params}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data = await response.json();
      return {
        photos: data.photos || data,
        totalPages: data.totalPages || 1,
        totalCount: data.totalCount || data.length,
      };
    } catch (err) {
      console.error("Failed to fetch photos:", err);
      throw err;
    }
  };

  // 批量刪除照片
  const deletePhotos = async (photoIds: string[]): Promise<void> => {
    try {
      const promises = photoIds.map((id) => deleteHook.deletePhoto(id));
      await Promise.all(promises);
    } catch (err) {
      console.error("Failed to delete photos:", err);
      throw err;
    }
  };

  // 更新照片順序
  const updatePhotoOrder = async (
    photoId: string,
    newOrder: number
  ): Promise<void> => {
    try {
      await updateHook.updatePhoto(photoId, { display_order: newOrder });
    } catch (err) {
      console.error("Failed to update photo order:", err);
      throw err;
    }
  };

  return {
    // 基本狀態
    photos: photosHook.photos,
    loading:
      photosHook.loading ||
      uploadHook.uploading ||
      updateHook.updating ||
      deleteHook.deleting,
    error:
      photosHook.error ||
      uploadHook.error ||
      updateHook.error ||
      deleteHook.error,

    // 基本操作
    fetchPhotos,
    uploadPhoto: uploadHook.uploadPhoto,
    updatePhoto: updateHook.updatePhoto,
    deletePhoto: deleteHook.deletePhoto,
    deletePhotos,
    uploadImage,
    deleteImage,
    updatePhotoOrder,

    // 統計功能
    getCategoryCounts,

    // 重新載入
    refetch: photosHook.refetch,
  };
};

// 預設照片資料（當API不可用時使用）
const getDefaultPhotos = (category: PhotoCategory): Photo[] => {
  switch (category) {
    case PhotoCategory.HERO:
      return [
        {
          id: "hero-1",
          image_url: "/hero-1.jpg",
          category: PhotoCategory.HERO,
          title: "Hero Image 1",
          display_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "hero-2",
          image_url: "/hero-2.jpg",
          category: PhotoCategory.HERO,
          title: "Hero Image 2",
          display_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

    case PhotoCategory.IMAGE_SLIDER:
      return [
        {
          id: "slider-1",
          image_url: "/Store_1.jpg",
          category: PhotoCategory.IMAGE_SLIDER,
          title: "精品眼鏡",
          subtitle: "時尚與品質的完美結合",
          display_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "slider-2",
          image_url: "/Store_2.jpg",
          category: PhotoCategory.IMAGE_SLIDER,
          title: "專業服務",
          subtitle: "為您提供最優質的視覺體驗",
          display_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "slider-3",
          image_url: "/Store_3.jpg",
          category: PhotoCategory.IMAGE_SLIDER,
          title: "實體店面",
          subtitle: "歡迎蒞臨參觀選購",
          display_order: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "slider-4",
          image_url: "/Store_4.jpg",
          category: PhotoCategory.IMAGE_SLIDER,
          title: "專業驗光",
          subtitle: "精準驗光，舒適配戴",
          display_order: 4,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

    case PhotoCategory.NEWS_CAROUSEL:
      return [
        {
          id: "news-1",
          image_url: "/BVLGARI/BVLGARI_1.jpg",
          category: PhotoCategory.NEWS_CAROUSEL,
          title: "BVLGARI 眼鏡",
          文字欄1: "BVLGARI",
          display_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "news-2",
          image_url: "/GUCCI/GUCCI_1.jpg",
          category: PhotoCategory.NEWS_CAROUSEL,
          title: "GUCCI 眼鏡",
          文字欄1: "GUCCI",
          display_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "news-3",
          image_url: "/MONTBLANC/MONTBLANC_1.jpg",
          category: PhotoCategory.NEWS_CAROUSEL,
          title: "MONTBLANC 眼鏡",
          文字欄1: "MONTBLANC",
          display_order: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "news-4",
          image_url: "/Ray.Ban/RayBan_1.jpg",
          category: PhotoCategory.NEWS_CAROUSEL,
          title: "Ray-Ban 眼鏡",
          文字欄1: "Ray-Ban",
          display_order: 4,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

    case PhotoCategory.BRAND_LOGO:
      return [
        {
          id: "logo-1",
          image_url: "/Logo/rayban.jpg",
          category: PhotoCategory.BRAND_LOGO,
          文字欄1: "Ray-Ban",
          display_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "logo-2",
          image_url: "/Logo/lindberg.jpg",
          category: PhotoCategory.BRAND_LOGO,
          文字欄1: "LINDBERG",
          display_order: 2,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "logo-3",
          image_url: "/Logo/9999.jpg",
          category: PhotoCategory.BRAND_LOGO,
          文字欄1: "9999",
          display_order: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "logo-4",
          image_url: "/Logo/bvlgari.jpg",
          category: PhotoCategory.BRAND_LOGO,
          文字欄1: "BVLGARI",
          display_order: 4,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "logo-5",
          image_url: "/Logo/gucci.jpg",
          category: PhotoCategory.BRAND_LOGO,
          文字欄1: "GUCCI",
          display_order: 5,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "logo-6",
          image_url: "/Logo/montblanc.jpg",
          category: PhotoCategory.BRAND_LOGO,
          文字欄1: "MONTBLANC",
          display_order: 6,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

    case PhotoCategory.STORE_PHOTO:
      return [
        {
          id: "store-1",
          image_url: "/Store_4.jpg",
          category: PhotoCategory.STORE_PHOTO,
          title: "六甲店",
          display_order: 1,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

    default:
      return [];
  }
};
