# 照片管理系統使用指南

## 概述

照片管理系統是 eyewear-admin 後台管理系統的一部分，用於管理首頁的所有照片，包括輪播照片、品牌 Logo、分店照片等。

## 功能特色

### 📸 照片類別管理

- **Hero 輪播照片**: 首頁主要輪播背景 (最多 5 張)
- **Image Slider 輪播照片**: 首頁圖片輪播區塊 (最多 10 張)
- **News Carousel 跑馬燈照片**: 首頁新聞跑馬燈 (最多 20 張)
- **Brand Logo 品牌 Logo**: 品牌系列展示 (最多 50 張)
- **Store Photo 分店照片**: 分店展示 (最多 20 張)

### 🛠️ 管理功能

- 照片上傳和預覽
- 批量上傳支援
- 照片資訊編輯
- 顯示順序調整
- 啟用/停用控制
- 按類別篩選和搜尋
- 分頁顯示

## 安裝和設定

### 1. 建立資料庫表

首先需要建立 photos 表：

```bash
npm run create-photos-table
```

### 2. 測試功能

測試照片管理功能是否正常：

```bash
npm run test-photos
```

### 3. 環境變數設定

確保以下環境變數已正確設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 使用指南

### 1. 進入照片管理

1. 登入後台管理系統
2. 在左側選單中點擊「照片管理」
3. 系統會顯示照片列表頁面

### 2. 上傳照片

1. 點擊「上傳照片」按鈕
2. 選擇要上傳的圖片檔案
3. 設定照片類別和相關資訊
4. 點擊「上傳」完成

#### 照片類別說明

| 類別          | 用途             | 建議尺寸  | 必填欄位       |
| ------------- | ---------------- | --------- | -------------- |
| Hero          | 首頁主要輪播背景 | 1920x1080 | 無             |
| Image Slider  | 首頁圖片輪播區塊 | 1920x1080 | 標題、副標題   |
| News Carousel | 首頁新聞跑馬燈   | 800x800   | 標題、品牌名稱 |
| Brand Logo    | 品牌系列展示     | 400x400   | 品牌名稱       |
| Store Photo   | 分店展示         | 1200x800  | 標題、分店名稱 |

### 3. 編輯照片

1. 在照片列表中點擊「編輯」按鈕
2. 修改照片資訊
3. 可以更換圖片檔案
4. 點擊「儲存變更」完成

### 4. 管理照片順序

1. 在照片列表中可以看到顯示順序
2. 編輯照片時可以調整順序數字
3. 數字越小，顯示順序越前面

### 5. 啟用/停用照片

1. 編輯照片時可以切換啟用狀態
2. 停用的照片不會在前台顯示
3. 可以批量管理照片狀態

### 6. 刪除照片

1. 在照片列表中點擊「刪除」按鈕
2. 確認刪除操作
3. 照片和相關檔案會被永久刪除

## 技術規格

### 支援的檔案格式

- JPG/JPEG
- PNG
- WebP
- SVG (僅限 Brand Logo)

### 檔案大小限制

- 最大 10MB

### 資料庫結構

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  brand_name TEXT,
  store_name TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API 端點

### 照片管理 API

- `GET /api/photos` - 獲取照片列表
- `GET /api/photos/category/{category}` - 根據類別獲取照片
- `POST /api/photos/upload` - 上傳照片
- `PUT /api/photos/{id}` - 更新照片
- `DELETE /api/photos/{id}` - 刪除照片

### 使用範例

```typescript
import { PhotoApi } from "@/lib/photoApi";

// 獲取所有照片
const photos = await PhotoApi.getPhotos();

// 根據類別獲取照片
const heroPhotos = await PhotoApi.getPhotosByCategory("hero");

// 創建照片
const newPhoto = await PhotoApi.createPhoto({
  image_url: "https://example.com/image.jpg",
  category: "hero",
  title: "新照片",
  display_order: 1,
  is_active: true,
});
```

## 故障排除

### 常見問題

1. **照片上傳失敗**

   - 檢查檔案大小是否超過 10MB
   - 確認檔案格式是否支援
   - 檢查網路連線

2. **照片無法顯示**

   - 確認照片 URL 是否正確
   - 檢查照片是否已啟用
   - 確認 Supabase Storage 設定

3. **資料庫錯誤**
   - 確認 photos 表是否已建立
   - 檢查環境變數設定
   - 確認 Supabase 連線

### 日誌檢查

查看瀏覽器開發者工具的 Console 和 Network 標籤，可以找到錯誤訊息和詳細資訊。

## 開發者資訊

### 檔案結構

```
src/
├── types/photo.ts                    # 照片類型定義
├── lib/photoApi.ts                   # 照片 API 函數
├── hooks/usePhotoManagement.ts       # 照片管理 Hook
└── app/components/PhotoManagement/   # 照片管理組件
    ├── PhotoList.tsx                 # 照片列表
    ├── PhotoUpload.tsx               # 照片上傳
    ├── PhotoEdit.tsx                 # 照片編輯
    ├── PhotoPreview.tsx              # 照片預覽
    ├── CategoryManagement.tsx        # 類別管理
    └── PhotoResource.tsx             # React Admin 資源
```

### 自定義 Hook

```typescript
import { usePhotoManagement } from "@/hooks/usePhotoManagement";

const {
  photos,
  loading,
  error,
  fetchPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto,
} = usePhotoManagement();
```

## 更新日誌

### v1.0.0 (2024-01-XX)

- 初始版本發布
- 支援 5 種照片類別
- 完整的 CRUD 操作
- 批量上傳功能
- 響應式設計

## 支援

如有問題或建議，請聯繫開發團隊或提交 Issue。
