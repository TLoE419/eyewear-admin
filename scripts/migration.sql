-- 資料庫遷移腳本：重命名欄位
-- 將 brand_name 改為 文字欄1，store_name 改為 文字欄2

-- 步驟 1: 添加新欄位
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS "文字欄1" TEXT,
ADD COLUMN IF NOT EXISTS "文字欄2" TEXT;

-- 步驟 2: 複製現有資料到新欄位
UPDATE photos 
SET "文字欄1" = brand_name 
WHERE brand_name IS NOT NULL;

UPDATE photos 
SET "文字欄2" = store_name 
WHERE store_name IS NOT NULL;

-- 步驟 3: 驗證遷移結果
SELECT 
  id,
  brand_name,
  store_name,
  "文字欄1",
  "文字欄2",
  category
FROM photos 
LIMIT 10;

-- 步驟 4: 確認無誤後，取消註解以下行來刪除舊欄位
-- ⚠️ 警告：請先確認新欄位工作正常後再執行！
-- ALTER TABLE photos DROP COLUMN brand_name;
-- ALTER TABLE photos DROP COLUMN store_name;
