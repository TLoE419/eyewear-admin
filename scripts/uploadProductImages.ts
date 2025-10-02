import { createClient } from "@supabase/supabase-js";
import { PhotoCategory } from "../src/lib/photoManagement";

// Supabase 配置
const supabaseUrl = "https://avzngmdgeisolmnomegs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em5nbWRnZWlzb2xtbm9tZWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNjAyOTksImV4cCI6MjA3MjgzNjI5OX0.CO5o7iWv2J8PfnF29bTNg0O0GKLw1q2tDikukgeIcww";

const supabase = createClient(supabaseUrl, supabaseKey);

// 產品數據
const products = [
  {
    id: "1",
    name: "Ray-Ban 經典款",
    brand: "Ray-Ban",
    image:
      "https://avzngmdgeisolmnomegs.supabase.co/storage/v1/object/public/photos/photos/1757889889666-4s13z9szuus.jpg",
    description: "經典 Ray-Ban 太陽眼鏡，時尚百搭。",
  },
  {
    id: "2",
    name: "LINDBERG 輕量鏡框",
    brand: "LINDBERG",
    image:
      "https://avzngmdgeisolmnomegs.supabase.co/storage/v1/object/public/photos/photos/1757889897319-fxus7akare9.jpg",
    description: "極致輕量設計，舒適配戴。",
  },
  {
    id: "3",
    name: "999.9 高彈性鏡框",
    brand: "9999",
    image:
      "https://avzngmdgeisolmnomegs.supabase.co/storage/v1/object/public/photos/photos/1757889897924-ytujt2ky4gl.jpg",
    description: "高彈性材質，耐用不易變形。",
  },
  {
    id: "4",
    name: "GUCCI 時尚鏡框 1",
    brand: "GUCCI",
    image:
      "https://avzngmdgeisolmnomegs.supabase.co/storage/v1/object/public/photos/photos/1757889899445-b7jevbo8fou.jpg",
    description: "奢華時尚設計，展現個人品味。",
  },
  {
    id: "11",
    name: "BVLGARI 精品鏡框 1",
    brand: "BVLGARI",
    image:
      "https://avzngmdgeisolmnomegs.supabase.co/storage/v1/object/public/photos/photos/1757889898780-qty9038lx2s.jpg",
    description: "義大利精品工藝，優雅設計。",
  },
];

async function uploadProductImages() {
  console.log("🚀 開始上傳產品圖片到 Supabase...");

  for (const product of products) {
    try {
      console.log(`\n📸 處理產品: ${product.name} (ID: ${product.id})`);

      // 從現有 URL 下載圖片
      const response = await fetch(product.image);
      if (!response.ok) {
        throw new Error(`無法下載圖片: ${response.statusText}`);
      }

      const imageBlob = await response.blob();

      // 創建檔案名稱
      const fileExt = product.image.split(".").pop() || "jpg";
      const fileName = `product_${product.id}_${Date.now()}.${fileExt}`;
      const filePath = `${PhotoCategory.PRODUCT_PHOTO}/${fileName}`;

      // 上傳到 Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, imageBlob, {
          contentType: imageBlob.type,
        });

      if (uploadError) {
        throw new Error(`上傳失敗: ${uploadError.message}`);
      }

      // 獲取公開 URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("photos").getPublicUrl(filePath);

      // 創建照片記錄
      const photoData = {
        image_url: publicUrl,
        category: PhotoCategory.PRODUCT_PHOTO,
        title: `${product.brand} - ${product.name}`,
        subtitle: `產品 ID: ${product.id}`,
        display_order: parseInt(product.id),
        is_active: true,
      };

      const { data: photoRecord, error: insertError } = await supabase
        .from("photos")
        .insert([photoData])
        .select()
        .single();

      if (insertError) {
        throw new Error(`創建照片記錄失敗: ${insertError.message}`);
      }

      console.log(`✅ 成功上傳: ${product.name}`);
      console.log(`   📷 照片 ID: ${photoRecord.id}`);
      console.log(`   🔗 圖片 URL: ${publicUrl}`);
    } catch (error) {
      console.error(`❌ 處理產品 ${product.name} 時發生錯誤:`, error);
    }
  }

  console.log("\n🎉 產品圖片上傳完成！");
}

// 執行上傳
uploadProductImages().catch(console.error);
