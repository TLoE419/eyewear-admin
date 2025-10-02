import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { usePhotoUpload } from "@/hooks/usePhotoManagement";
import { PhotoCategory } from "@/lib/photoManagement";

interface ProductImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  productId?: string;
  productName?: string;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  onImageUploaded,
  productId,
  productName,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadPhoto } = usePhotoUpload();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("請選擇圖片檔案");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("圖片檔案大小不能超過 5MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const photoData = {
        category: PhotoCategory.PRODUCT_PHOTO,
        title: productName || "產品圖片",
        subtitle: `產品 ID: ${productId || "未知"}`,
        display_order: 0,
        is_active: true,
      };

      const uploadedPhoto = await uploadPhoto(photoData, file);

      if (uploadedPhoto?.image_url) {
        onImageUploaded(uploadedPhoto.image_url);
        setError(null);
      } else {
        throw new Error("上傳失敗，未返回圖片 URL");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
        📸 上傳產品圖片
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          建議尺寸：800×800px (正方形) | 格式：JPG、PNG | 檔案大小：小於 5MB
        </Typography>
      </Alert>

      <Button
        variant="contained"
        component="label"
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
        disabled={uploading}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
          },
        }}
      >
        {uploading ? "上傳中..." : "選擇圖片檔案"}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileSelect}
        />
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {uploading && (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            正在上傳圖片到 Supabase Storage...
          </Typography>
        </Box>
      )}
    </Box>
  );
};
