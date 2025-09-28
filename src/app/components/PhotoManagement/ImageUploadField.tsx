"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { PhotoApi } from "@/lib/photoApi";
import { PhotoCategory } from "@/types/photo";

interface ImageUploadFieldProps {
  source: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onReplaceImage?: (oldUrl: string, newUrl: string) => Promise<void>;
  category?: PhotoCategory;
  required?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  source,
  label,
  value = "",
  onChange,
  onReplaceImage,
  category = "brand_logo",
  required = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      setError("請選擇圖片檔案");
      return;
    }

    // 檢查檔案大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("檔案大小不能超過 10MB");
      return;
    }

    try {
      setLoading(true);
      const oldUrl = value; // 保存舊的圖片 URL
      const newImageUrl = await PhotoApi.uploadImage(file, category);

      // 如果有舊圖片且提供了替換回調，則刪除舊圖片
      if (oldUrl && onReplaceImage) {
        try {
          await onReplaceImage(oldUrl, newImageUrl);
        } catch (replaceError) {
          console.warn("Failed to replace old image:", replaceError);
          // 即使替換失敗，也繼續使用新圖片
        }
      }

      setPreviewUrl(newImageUrl);
      onChange?.(newImageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "上傳失敗";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setPreviewUrl(url);
    onChange?.(url);
  };

  const currentImageUrl = previewUrl || value;

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label} {required && "*"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 圖片預覽 */}
      {currentImageUrl && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Box
            component="img"
            src={currentImageUrl}
            alt="預覽"
            sx={{
              maxWidth: "100%",
              maxHeight: 200,
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
        </Paper>
      )}

      {/* 上傳按鈕 */}
      <Box sx={{ mb: 2 }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id={`file-input-${source}`}
        />
        <label htmlFor={`file-input-${source}`}>
          <Button
            variant="outlined"
            component="span"
            startIcon={<UploadIcon />}
            disabled={loading}
            fullWidth
          >
            {loading ? "上傳中..." : "選擇圖片檔案"}
          </Button>
        </label>
      </Box>

      {/* URL 輸入框 */}
      <TextField
        fullWidth
        label="或輸入圖片 URL"
        value={value}
        onChange={handleUrlChange}
        placeholder="https://example.com/image.jpg"
        helperText="您可以上傳檔案或直接輸入圖片 URL"
      />
    </Box>
  );
};
