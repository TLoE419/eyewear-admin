# 資料庫遷移指南

## 目標

將 `brand_name` 和 `store_name` 欄位重命名為 `文字欄1` 和 `文字欄2`

## 遷移步驟

### 方法一：使用 SQL 腳本（推薦）

1. **備份資料庫**

   ```bash
   # 在 Supabase Dashboard 中匯出 photos 表格
   ```

2. **執行遷移 SQL**

   ```sql
   -- 在 Supabase Dashboard > SQL Editor 中執行
   -- 或使用 scripts/migration.sql
   ```

3. **驗證遷移結果**

   ```sql
   SELECT id, brand_name, store_name, "文字欄1", "文字欄2"
   FROM photos
   LIMIT 10;
   ```

4. **確認無誤後刪除舊欄位**
   ```sql
   ALTER TABLE photos DROP COLUMN brand_name;
   ALTER TABLE photos DROP COLUMN store_name;
   ```

### 方法二：使用 Node.js 腳本

1. **執行遷移腳本**

   ```bash
   cd /Users/tloe/Documents/eyewear-admin
   node scripts/migrateDatabase.js
   ```

2. **跟隨腳本提示完成遷移**

### 方法三：手動操作

1. **在 Supabase Dashboard 中**：

   - 進入 Table Editor
   - 選擇 `photos` 表格
   - 點擊 "Add Column"
   - 添加 `文字欄1` (TEXT)
   - 添加 `文字欄2` (TEXT)

2. **複製資料**：

   ```sql
   UPDATE photos SET "文字欄1" = brand_name WHERE brand_name IS NOT NULL;
   UPDATE photos SET "文字欄2" = store_name WHERE store_name IS NOT NULL;
   ```

3. **驗證並刪除舊欄位**

## 恢復步驟

如果遷移後發現問題，可以使用恢復腳本：

```bash
# 執行恢復 SQL
# 在 Supabase Dashboard 中執行 scripts/rollback.sql
```

## 注意事項

⚠️ **重要提醒**：

1. 遷移前務必備份資料庫
2. 先在測試環境執行遷移
3. 確認新欄位工作正常後再刪除舊欄位
4. 遷移期間暫停應用程式服務

## 驗證清單

- [ ] 資料庫備份完成
- [ ] 新欄位添加成功
- [ ] 資料複製完成
- [ ] 程式碼更新完成
- [ ] API 測試通過
- [ ] 前端功能正常
- [ ] 舊欄位刪除（可選）

## 聯絡支援

如果遇到問題，請檢查：

1. Supabase 連接狀態
2. 環境變數設定
3. 程式碼語法錯誤
4. 資料庫權限設定
