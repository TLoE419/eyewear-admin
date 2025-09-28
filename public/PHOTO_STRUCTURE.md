# 照片資料夾結構說明

## 📁 資料夾結構

```
public/
├── hero/           # Hero 輪播照片 (1920x1080)
├── slider/         # Image Slider 輪播照片 (1920x1080)
├── brands/         # 品牌 Logo (400x400)
├── stores/         # 分店照片 (1200x800)
├── news/           # 新聞跑馬燈照片 (800x800)
├── Ray.Ban/        # Ray-Ban 產品照片
├── LINDBERG/       # LINDBERG 產品照片
├── 999.9/          # 999.9 產品照片
├── GUCCI/          # GUCCI 產品照片
├── BVLGARI/        # BVLGARI 產品照片
└── MONTBLANC/      # MONTBLANC 產品照片
```

## 📸 照片規格

| 類別 | 建議尺寸 | 用途 | 必填欄位 |
|------|----------|------|----------|
| Hero | 1920x1080 | 首頁主要輪播背景 | 無 |
| Image Slider | 1920x1080 | 首頁圖片輪播區塊 | 標題、副標題 |
| Brand Logo | 400x400 | 品牌系列展示 | 品牌名稱 |
| Store Photo | 1200x800 | 分店展示 | 標題、分店名稱 |
| News Carousel | 800x800 | 首頁新聞跑馬燈 | 標題、品牌名稱 |

## 🚀 使用方式

1. 將照片檔案放入對應的資料夾
2. 前往 http://localhost:3002 進入照片管理系統
3. 在照片管理系統中編輯照片資訊
4. 調整顯示順序和啟用狀態

## 📝 注意事項

- 支援格式: JPG, PNG, WebP, SVG
- 檔案大小限制: 10MB
- 建議使用高品質圖片以獲得最佳顯示效果
