# 照片管理系統設定指南

## 🚀 快速設定步驟

### 1. 環境變數設定 ✅

環境變數已經設定完成，位於 `.env.local` 檔案中。

### 2. 建立 Supabase 資料庫表

請在 Supabase Dashboard 的 SQL 編輯器中執行以下 SQL：

#### 建立 photos 表

```sql
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hero', 'image_slider', 'news_carousel', 'brand_logo', 'store_photo')),
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

#### 建立索引

```sql
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_display_order ON photos(display_order);
CREATE INDEX IF NOT EXISTS idx_photos_is_active ON photos(is_active);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at);
```

#### 建立更新時間觸發器

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_photos_updated_at ON photos;
CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. 建立 Storage Bucket

在 Supabase Dashboard 中：

1. 前往 **Storage** 頁面
2. 點擊 **"New bucket"**
3. 設定如下：
   - **名稱**: `photos`
   - **公開**: 是
   - **檔案大小限制**: `10MB`
   - **允許的 MIME 類型**: `image/jpeg, image/png, image/webp, image/svg+xml`
4. 點擊 **"Create bucket"**

### 4. 測試設定

執行以下命令測試設定是否正確：

```bash
# 測試資料庫表
npm run test-photos-simple

# 檢查 Storage bucket
npm run create-photos-bucket
```

### 5. 啟動開發伺服器

```bash
npm run dev
```

然後前往 [http://localhost:3000](http://localhost:3000) 查看照片管理系統。

## 📋 功能驗證清單

- [ ] photos 表已建立
- [ ] 索引已建立
- [ ] 觸發器已建立
- [ ] photos Storage bucket 已建立
- [ ] 測試資料插入成功
- [ ] 開發伺服器正常啟動
- [ ] 照片管理頁面可以訪問

## 🎯 使用方式

1. **進入照片管理**: 登入後台 → 左側選單 → 照片管理
2. **上傳照片**: 點擊「上傳照片」按鈕
3. **管理照片**: 在照片列表中編輯、刪除、預覽照片
4. **類別管理**: 查看各類別的照片統計

## 🔧 故障排除

### 常見問題

1. **表不存在錯誤**

   - 確保已在 Supabase Dashboard 中執行 SQL 建立表

2. **Storage bucket 不存在**

   - 確保已在 Supabase Dashboard 中建立 photos bucket

3. **環境變數錯誤**

   - 檢查 `.env.local` 檔案中的 Supabase 配置

4. **權限錯誤**
   - 確保 Supabase 專案的 RLS 政策允許操作

### 檢查命令

```bash
# 檢查環境變數
cat .env.local

# 測試資料庫連線
npm run test-photos-simple

# 檢查 Storage bucket
npm run create-photos-bucket
```

## 📞 支援

如有問題，請檢查：

1. Supabase Dashboard 中的錯誤日誌
2. 瀏覽器開發者工具的 Console
3. 終端機的錯誤訊息

完成所有設定後，照片管理系統就可以正常使用了！
