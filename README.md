# 眼鏡後台管理系統 (Eyewear Admin)

這是一個基於 Next.js 和 React-admin 的眼鏡後台管理系統，用於管理眼鏡產品和鏡片資料。

## 🚀 功能特色

- ✅ **產品管理**：新增、編輯、刪除眼鏡產品
- ✅ **鏡片管理**：管理鏡片詳細規格和特色
- ✅ **實時同步**：與 Supabase 資料庫即時同步
- ✅ **響應式設計**：支援桌面和行動裝置
- ✅ **用戶認證**：簡單的管理員登入系統
- ✅ **資料統計**：儀表板顯示統計資訊

## 📋 系統需求

- Node.js 18+
- npm 或 yarn
- Supabase 帳號和專案

## 🛠️ 安裝步驟

### 1. 安裝依賴套件

```bash
npm install
```

### 2. 設置環境變數

複製 `env.example` 檔案並重新命名為 `.env.local`：

```bash
cp env.example .env.local
```

編輯 `.env.local` 檔案，填入您的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. 初始化 Supabase

```bash
npm run init-supabase
```

### 4. 檢查資料庫表格

```bash
npm run check-supabase
```

### 5. 測試資料提供者

```bash
npm run test-provider
```

## 🚀 啟動專案

### 開發模式

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:3000`

### 生產模式

```bash
npm run build
npm start
```

## 🔐 登入資訊

- **用戶名**：`admin`
- **密碼**：`admin`

## 📊 資料庫結構

### Products 表格

- `id` (string) - 產品 ID
- `name` (string) - 產品名稱
- `brand` (string) - 品牌
- `category` (string) - 分類
- `image` (string) - 圖片路徑
- `description` (string) - 描述
- `instock` (boolean) - 庫存狀態
- `created_at` (timestamp) - 創建時間
- `updated_at` (timestamp) - 更新時間

### Lenses 表格

- `id` (string) - 鏡片 ID
- `name` (string) - 鏡片名稱
- `brand` (string) - 品牌
- `category` (string) - 分類
- `image` (string) - 圖片路徑
- `description` (string) - 描述
- `price` (string) - 價格
- `features` (array) - 特色功能
- `specifications` (object) - 技術規格
- `instock` (boolean) - 庫存狀態
- `created_at` (timestamp) - 創建時間
- `updated_at` (timestamp) - 更新時間

## 🛠️ 可用腳本

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run start` - 啟動生產伺服器
- `npm run lint` - 執行 ESLint 檢查
- `npm run init-supabase` - 初始化 Supabase 連接
- `npm run check-supabase` - 檢查 Supabase 表格
- `npm run test-provider` - 測試資料提供者

## 📁 專案結構

```
eyewear-admin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx      # 儀表板
│   │   │   ├── Layout.tsx         # 佈局組件
│   │   │   ├── ProductManagement.tsx  # 產品管理
│   │   │   └── LensManagement.tsx     # 鏡片管理
│   │   └── page.tsx               # 主頁面
│   └── lib/
│       ├── authProvider.ts        # 認證提供者
│       ├── clientSupabaseDataProvider.ts  # Supabase 資料提供者
│       └── dynamicDataProvider.ts # 動態資料提供者
├── scripts/
│   ├── initSupabase.ts           # 初始化腳本
│   ├── checkSupabaseTables.ts    # 檢查表格腳本
│   └── testDataProvider.ts       # 測試腳本
├── package.json
├── next.config.mjs
├── tsconfig.json
└── README.md
```

## 🔧 技術棧

- **前端框架**：Next.js 15
- **UI 框架**：React-admin 4
- **資料庫**：Supabase (PostgreSQL)
- **樣式**：Material-UI
- **語言**：TypeScript
- **建置工具**：Turbopack

## 🐛 故障排除

### 常見問題

1. **Supabase 連接失敗**

   - 檢查環境變數是否正確設置
   - 確認 Supabase 專案 URL 和 API Key

2. **表格不存在**

   - 執行 `npm run check-supabase` 檢查表格狀態
   - 確認 Supabase 專案中有對應的表格

3. **欄位名稱錯誤**
   - 系統會自動處理 `instock` ↔ `inStock` 的轉換
   - 檢查資料庫欄位是否為 `instock`（小寫）

## 📞 支援

如有問題，請檢查：

1. 環境變數設置
2. Supabase 專案配置
3. 資料庫表格結構
4. 網路連接狀態

## 📄 授權

此專案僅供學習和開發使用。
