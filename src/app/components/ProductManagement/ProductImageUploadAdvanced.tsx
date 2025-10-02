"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  LinearProgress,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { usePhotoUpload } from "@/hooks/usePhotoManagement";
import { PhotoCategory } from "@/lib/photoManagement";

interface ProductImageUploadAdvancedProps {
  onImageUploaded: (imageUrl: string) => void;
  productId?: string;
  productName?: string;
  onCancel?: () => void;
}

interface UploadFile {
  file: File;
  preview: string;
  title: string;
  subtitle: string;
}

export const ProductImageUploadAdvanced: React.FC<
  ProductImageUploadAdvancedProps
> = ({ onImageUploaded, productId, productName, onCancel }) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    imageUrl: string;
    title: string;
  }>({ open: false, imageUrl: "", title: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto } = usePhotoUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: UploadFile[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError(`檔案 ${file.name} 不是有效的圖片格式`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`檔案 ${file.name} 大小超過 5MB 限制`);
        return;
      }

      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        title: productName || `產品圖片 ${validFiles.length + 1}`,
        subtitle: `產品 ID: ${productId || "未知"}`,
      });
    });

    if (validFiles.length > 0) {
      setUploadFiles((prev) => [...prev, ...validFiles]);
      setError(null);
    }

    // 清空 input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateFileInfo = (
    index: number,
    field: keyof UploadFile,
    value: string
  ) => {
    setUploadFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, [field]: value } : file))
    );
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      setError("請先選擇要上傳的圖片");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const uploadPromises = uploadFiles.map(async (uploadFile, index) => {
        const photoData = {
          category: PhotoCategory.PRODUCT_PHOTO,
          title: uploadFile.title,
          subtitle: uploadFile.subtitle,
          display_order: index,
          is_active: true,
        };

        const uploadedPhoto = await uploadPhoto(photoData, uploadFile.file);

        // 更新進度
        setUploadProgress(((index + 1) / uploadFiles.length) * 100);

        return uploadedPhoto;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((result) => result?.image_url);

      if (successfulUploads.length > 0) {
        // 使用第一張成功上傳的圖片
        onImageUploaded(successfulUploads[0].image_url);
        setSuccess(`成功上傳 ${successfulUploads.length} 張圖片！`);

        // 清理上傳的文件
        uploadFiles.forEach((file) => URL.revokeObjectURL(file.preview));
        setUploadFiles([]);
      } else {
        throw new Error("所有圖片上傳失敗");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const openPreview = (imageUrl: string, title: string) => {
    setPreviewDialog({ open: true, imageUrl, title });
  };

  const closePreview = () => {
    setPreviewDialog({ open: false, imageUrl: "", title: "" });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        📸 產品圖片上傳
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>建議規格：</strong> 800×800px (正方形) | JPG、PNG、WebP |
          檔案大小小於 5MB
        </Typography>
      </Alert>

      {/* 文件選擇區域 */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          border: "2px dashed #ccc",
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            borderColor: "#667eea",
            backgroundColor: "#f8f9ff",
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <UploadIcon sx={{ fontSize: 48, color: "#667eea", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          點擊選擇圖片檔案
        </Typography>
        <Typography variant="body2" color="text.secondary">
          支援多檔案上傳，拖拽檔案到此區域
        </Typography>
      </Paper>

      {/* 上傳進度 */}
      {uploading && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2">
              正在上傳圖片到 Supabase Storage...
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary">
            {Math.round(uploadProgress)}% 完成
          </Typography>
        </Box>
      )}

      {/* 文件預覽列表 */}
      {uploadFiles.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
            待上傳的圖片 ({uploadFiles.length})
          </Typography>
          <Grid container spacing={2}>
            {uploadFiles.map((uploadFile, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ position: "relative" }}>
                  <CardContent>
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 120,
                        mb: 2,
                        borderRadius: 1,
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        openPreview(uploadFile.preview, uploadFile.title)
                      }
                    >
                      <img
                        src={uploadFile.preview}
                        alt={uploadFile.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          borderRadius: "50%",
                          p: 0.5,
                        }}
                      >
                        <ImageIcon sx={{ color: "white", fontSize: 16 }} />
                      </Box>
                    </Box>

                    <TextField
                      fullWidth
                      size="small"
                      label="圖片標題"
                      value={uploadFile.title}
                      onChange={(e) =>
                        updateFileInfo(index, "title", e.target.value)
                      }
                      sx={{ mb: 1 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="副標題"
                      value={uploadFile.subtitle}
                      onChange={(e) =>
                        updateFileInfo(index, "subtitle", e.target.value)
                      }
                      sx={{ mb: 1 }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={`${(uploadFile.file.size / 1024 / 1024).toFixed(
                          2
                        )} MB`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* 錯誤和成功訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* 操作按鈕 */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={uploading}>
            取消
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading || uploadFiles.length === 0}
          startIcon={uploading ? <CircularProgress size={20} /> : <CheckIcon />}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            },
          }}
        >
          {uploading ? "上傳中..." : `上傳 ${uploadFiles.length} 張圖片`}
        </Button>
      </Box>

      {/* 圖片預覽對話框 */}
      <Dialog
        open={previewDialog.open}
        onClose={closePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{previewDialog.title}</DialogTitle>
        <DialogContent>
          <img
            src={previewDialog.imageUrl}
            alt={previewDialog.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreview}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
