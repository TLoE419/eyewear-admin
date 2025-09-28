"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { Photo, PHOTO_CATEGORIES, CreatePhotoData } from "@/types/photo";
import { PhotoCategory } from "@/lib/photoManagement";
import { usePhotoManagement } from "@/hooks/usePhotoManagement";

interface PhotoEditProps {
  photo: Photo;
  onSave: (photo: Photo) => void;
  onCancel: () => void;
}

export const PhotoEdit: React.FC<PhotoEditProps> = ({
  photo,
  onSave,
  onCancel,
}) => {
  const { updatePhoto, uploadImage, deleteImage, loading } =
    usePhotoManagement();

  const [formData, setFormData] = useState<Partial<CreatePhotoData>>({
    category: photo.category,
    title: photo.title || "",
    subtitle: photo.subtitle || "",
    文字欄1: photo.文字欄1 || "",
    文字欄2: photo.文字欄2 || "",
    display_order: photo.display_order,
    is_active: photo.is_active,
  });

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof CreatePhotoData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);

      let imageUrl = photo.image_url;

      // 如果有新圖片，先上傳
      if (newImageFile) {
        imageUrl = await uploadImage(
          newImageFile,
          formData.category! as PhotoCategory
        );

        // 刪除舊圖片
        try {
          await deleteImage(photo.image_url);
        } catch (err) {
          console.warn("Failed to delete old image:", err);
        }
      }

      // 更新照片資料
      const updatedPhoto = await updatePhoto(photo.id, {
        ...formData,
        image_url: imageUrl,
      } as Record<string, unknown>);

      onSave(updatedPhoto);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "更新失敗";
      setError(errorMessage);
    }
  };

  const getCategoryInfo = (category: PhotoCategory) => {
    return PHOTO_CATEGORIES[category];
  };

  const getRequiredFields = (category: PhotoCategory) => {
    return PHOTO_CATEGORIES[category].requiredFields;
  };

  const isFormValid = () => {
    const requiredFields = getRequiredFields(
      formData.category! as PhotoCategory
    );
    return requiredFields.every((field) => {
      switch (field) {
        case "title":
          return formData.title && formData.title.trim() !== "";
        case "subtitle":
          return formData.subtitle && formData.subtitle.trim() !== "";
        case "文字欄1":
          return formData.文字欄1 && formData.文字欄1.trim() !== "";
        case "文字欄2":
          return formData.文字欄2 && formData.文字欄2.trim() !== "";
        default:
          return true;
      }
    });
  };

  const currentImageUrl = newImagePreview || photo.image_url;

  return (
    <Box>
      {/* 標題 */}
      <Typography variant="h4" component="h1" gutterBottom>
        編輯照片
      </Typography>

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 左側：照片預覽 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                照片預覽
              </Typography>

              <Box textAlign="center">
                <Box
                  component="img"
                  src={currentImageUrl}
                  alt={formData.title || "Photo"}
                  sx={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                    borderRadius: 1,
                    cursor: "pointer",
                    mb: 2,
                  }}
                  onClick={() => setPreviewDialogOpen(true)}
                />

                <Box display="flex" gap={1} justifyContent="center">
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    size="small"
                  >
                    更換圖片
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => setPreviewDialogOpen(true)}
                    size="small"
                  >
                    預覽
                  </Button>
                </Box>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Box>

              {/* 類別資訊 */}
              <Box mt={2}>
                <Chip
                  label={
                    getCategoryInfo(formData.category! as PhotoCategory).name
                  }
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  建議尺寸:{" "}
                  {
                    getCategoryInfo(formData.category! as PhotoCategory)
                      .recommendedSize
                  }
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  支援格式:{" "}
                  {getCategoryInfo(
                    formData.category! as PhotoCategory
                  ).supportedFormats.join(", ")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 右側：表單 */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                照片資訊
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>類別</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      label="類別"
                    >
                      {Object.values(PHOTO_CATEGORIES).map((category) => (
                        <MenuItem
                          key={category.category}
                          value={category.category}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {getRequiredFields(
                  formData.category! as PhotoCategory
                ).includes("title") && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="標題 *"
                      value={formData.title || ""}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      required
                    />
                  </Grid>
                )}

                {getRequiredFields(
                  formData.category! as PhotoCategory
                ).includes("subtitle") && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="副標題 *"
                      value={formData.subtitle || ""}
                      onChange={(e) =>
                        handleInputChange("subtitle", e.target.value)
                      }
                      required
                    />
                  </Grid>
                )}

                {getRequiredFields(
                  formData.category! as PhotoCategory
                ).includes("文字欄1") && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="文字欄1 *"
                      value={formData.文字欄1 || ""}
                      onChange={(e) =>
                        handleInputChange("文字欄1", e.target.value)
                      }
                      required
                    />
                  </Grid>
                )}

                {getRequiredFields(
                  formData.category! as PhotoCategory
                ).includes("文字欄2") && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="文字欄2 *"
                      value={formData.文字欄2 || ""}
                      onChange={(e) =>
                        handleInputChange("文字欄2", e.target.value)
                      }
                      required
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="顯示順序"
                    type="number"
                    value={formData.display_order || 1}
                    onChange={(e) =>
                      handleInputChange(
                        "display_order",
                        parseInt(e.target.value) || 1
                      )
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.is_active || false}
                        onChange={(e) =>
                          handleInputChange("is_active", e.target.checked)
                        }
                      />
                    }
                    label="啟用"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* 原始資料 */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                原始資料
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    建立時間:{" "}
                    {new Date(photo.created_at).toLocaleString("zh-TW")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    更新時間:{" "}
                    {new Date(photo.updated_at).toLocaleString("zh-TW")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    圖片 URL: {photo.image_url}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 操作按鈕 */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          onClick={onCancel}
          disabled={loading}
          startIcon={<CancelIcon />}
        >
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || !isFormValid()}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? "儲存中..." : "儲存變更"}
        </Button>
      </Box>

      {/* 預覽對話框 */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>照片預覽</DialogTitle>
        <DialogContent>
          <Box textAlign="center">
            <Box
              component="img"
              src={currentImageUrl}
              alt={formData.title || "Photo"}
              sx={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
