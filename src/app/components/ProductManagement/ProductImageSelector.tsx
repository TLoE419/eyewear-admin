"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { usePhotoUpload } from "@/hooks/usePhotoManagement";
import { PhotoCategory } from "@/lib/photoManagement";

interface ProductImageSelectorProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  productId?: string;
  productName?: string;
}

export const ProductImageSelector: React.FC<ProductImageSelectorProps> = ({
  currentImageUrl,
  onImageChange,
}) => {
  const [, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto } = usePhotoUpload();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      setError("請選擇圖片檔案");
      return;
    }

    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("檔案大小不能超過 5MB");
      return;
    }

    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    setError(null);

    // 自動上傳
    try {
      setUploading(true);
      const photoData = {
        category: PhotoCategory.PRODUCT_PHOTO,
        title: "產品圖片",
        subtitle: "產品圖片",
        display_order: 0,
        is_active: true,
      };
      
      const uploadedPhoto = await uploadPhoto(photoData, file);
      
      if (uploadedPhoto?.image_url) {
        onImageChange(uploadedPhoto.image_url);
        
        // 清理預覽
        if (newImagePreview) {
          URL.revokeObjectURL(newImagePreview);
        }
        setNewImageFile(null);
        setNewImagePreview(null);
      } else {
        throw new Error("上傳失敗，未返回圖片 URL");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
    }
  };

  const openPreview = () => {
    if (newImagePreview) {
      window.open(newImagePreview, "_blank");
    } else if (currentImageUrl) {
      window.open(currentImageUrl, "_blank");
    }
  };

  const displayImage = newImagePreview || currentImageUrl;

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
        📸 產品圖片
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          建議尺寸：800×800px (正方形) | 格式：JPG、PNG、WebP | 檔案大小：小於 5MB
        </Typography>
      </Alert>

      {/* 圖片顯示區域 */}
      <Card sx={{ mb: 2, maxWidth: 300 }}>
        <CardContent>
          {displayImage ? (
            <Box>
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  borderRadius: 1,
                  overflow: "hidden",
                  mb: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <img
                  src={displayImage}
                  alt="產品圖片"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <Box display="flex" gap={1} justifyContent="center">
                <Button
                  variant="outlined"
                  startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  size="small"
                  disabled={uploading}
                >
                  {uploading ? "上傳中..." : "更換圖片"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={openPreview}
                  size="small"
                >
                  預覽
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 200,
                border: "2px dashed #ccc",
                borderRadius: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "#667eea",
                  backgroundColor: "#f8f9ff",
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon sx={{ fontSize: 48, color: "#667eea", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                點擊選擇圖片
              </Typography>
            </Box>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </CardContent>
      </Card>

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 圖片資訊 */}
      {displayImage && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            圖片 URL: {displayImage}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
