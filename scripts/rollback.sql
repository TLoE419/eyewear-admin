-- 恢復腳本：將 文字欄1 和 文字欄2 的資料複製回舊欄位
-- 如果遷移後發現問題，可以使用此腳本恢復

-- 恢復 brand_name 欄位的資料
UPDATE photos 
SET brand_name = "文字欄1" 
WHERE "文字欄1" IS NOT NULL;

-- 恢復 store_name 欄位的資料
UPDATE photos 
SET store_name = "文字欄2" 
WHERE "文字欄2" IS NOT NULL;

-- 驗證恢復結果
SELECT 
  id,
  brand_name,
  store_name,
  "文字欄1",
  "文字欄2",
  category
FROM photos 
LIMIT 10;
