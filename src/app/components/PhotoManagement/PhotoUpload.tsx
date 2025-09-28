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
} from "@mui/icons-material";
import { PHOTO_CATEGORIES } from "@/types/photo";
import { PhotoCategory } from "@/lib/photoManagement";
import { usePhotoUpload } from "@/hooks/usePhotoManagement";

interface PhotoUploadProps {
  onUploadComplete: (photo: Record<string, unknown>) => void;
  onCancel: () => void;
}

interface UploadFile {
  file: File;
  preview: string;
  category: PhotoCategory;
  title?: string;
  subtitle?: string;
  文字欄1?: string;
  文字欄2?: string;
  display_order?: number;
  is_active: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onUploadComplete,
  onCancel,
}) => {
  const { uploading, error: uploadError, uploadPhoto } = usePhotoUpload();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>(
    PhotoCategory.HERO
  );
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // 檢查檔案類型
      if (!file.type.startsWith("image/")) {
        alert("請選擇圖片檔案");
        return;
      }

      // 檢查檔案大小 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("檔案大小不能超過 10MB");
        return;
      }

      const preview = URL.createObjectURL(file);
      const newFile: UploadFile = {
        file,
        preview,
        category: selectedCategory,
        title: "",
        subtitle: "",
        文字欄1: "",
        文字欄2: "",
        display_order: uploadFiles.length + 1,
        is_active: true,
      };

      setUploadFiles((prev) => [...prev, newFile]);
    });

    // 清空 input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpdate = (index: number, updates: Partial<UploadFile>) => {
    setUploadFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, ...updates } : file))
    );
  };

  const handleFileRemove = (index: number) => {
    setUploadFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // 重新設定順序
      return newFiles.map((file, i) => ({ ...file, display_order: i + 1 }));
    });
  };

  const handlePreview = (file: UploadFile) => {
    setPreviewFile(file);
    setPreviewDialogOpen(true);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    try {
      for (const uploadFile of uploadFiles) {
        const photoData = {
          category: uploadFile.category,
          title: uploadFile.title || undefined,
          subtitle: uploadFile.subtitle || undefined,
          文字欄1: uploadFile.文字欄1 || undefined,
          文字欄2: uploadFile.文字欄2 || undefined,
          display_order: uploadFile.display_order,
          is_active: uploadFile.is_active,
        };

        await uploadPhoto(photoData, uploadFile.file);
      }

      // 上傳完成後清理
      setUploadFiles([]);
      onUploadComplete({ success: true });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const getCategoryInfo = (category: PhotoCategory) => {
    return PHOTO_CATEGORIES[category];
  };

  const getRequiredFields = (category: PhotoCategory) => {
    return PHOTO_CATEGORIES[category].requiredFields;
  };

  const isFormValid = () => {
    return uploadFiles.every((file) => {
      const requiredFields = getRequiredFields(file.category);
      return requiredFields.every((field) => {
        switch (field) {
          case "title":
            return file.title && file.title.trim() !== "";
          case "subtitle":
            return file.subtitle && file.subtitle.trim() !== "";
          default:
            return true;
        }
      });
    });
  };

  return (
    <Box>
      {/* 標題 */}
      <Typography variant="h4" component="h1" gutterBottom>
        上傳照片
      </Typography>

      {/* 錯誤訊息 */}
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uploadError}
        </Alert>
      )}

      {/* 上傳進度 */}
      {uploading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={24} />
              <Typography>正在上傳照片...</Typography>
            </Box>
            <LinearProgress variant="indeterminate" sx={{ mt: 1 }} />
            <Typography variant="caption" color="text.secondary">
              上傳中...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* 檔案選擇區域 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            選擇照片
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              border: "2px dashed",
              borderColor: "primary.main",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              點擊或拖拽照片到此處
            </Typography>
            <Typography variant="body2" color="text.secondary">
              支援 JPG, PNG, WebP, SVG 格式，最大 10MB
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </Paper>

          {/* 預設類別選擇 */}
          <Box mt={2}>
            <FormControl fullWidth>
              <InputLabel>預設類別</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as PhotoCategory)
                }
                label="預設類別"
              >
                {Object.values(PHOTO_CATEGORIES).map((category) => (
                  <MenuItem key={category.category} value={category.category}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 照片列表和編輯 */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              照片列表 ({uploadFiles.length})
            </Typography>

            <Grid container spacing={2}>
              {uploadFiles.map((uploadFile, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    {/* 照片預覽 */}
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box
                        component="img"
                        src={uploadFile.preview}
                        alt="Preview"
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 1,
                          cursor: "pointer",
                        }}
                        onClick={() => handlePreview(uploadFile)}
                      />
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="medium">
                          {uploadFile.file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleFileRemove(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    {/* 表單欄位 */}
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth size="small">
                          <InputLabel>類別</InputLabel>
                          <Select
                            value={uploadFile.category}
                            onChange={(e) =>
                              handleFileUpdate(index, {
                                category: e.target.value as PhotoCategory,
                              })
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

                      {getRequiredFields(uploadFile.category).includes(
                        "title"
                      ) && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="標題 *"
                            value={uploadFile.title || ""}
                            onChange={(e) =>
                              handleFileUpdate(index, { title: e.target.value })
                            }
                            required
                          />
                        </Grid>
                      )}

                      {getRequiredFields(uploadFile.category).includes(
                        "subtitle"
                      ) && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="副標題 *"
                            value={uploadFile.subtitle || ""}
                            onChange={(e) =>
                              handleFileUpdate(index, {
                                subtitle: e.target.value,
                              })
                            }
                            required
                          />
                        </Grid>
                      )}

                      {getRequiredFields(uploadFile.category).includes(
                        "文字欄1"
                      ) && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="文字欄1 *"
                            value={uploadFile.文字欄1 || ""}
                            onChange={(e) =>
                              handleFileUpdate(index, {
                                文字欄1: e.target.value,
                              })
                            }
                            required
                          />
                        </Grid>
                      )}

                      {getRequiredFields(uploadFile.category).includes(
                        "文字欄2"
                      ) && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="文字欄2 *"
                            value={uploadFile.文字欄2 || ""}
                            onChange={(e) =>
                              handleFileUpdate(index, {
                                文字欄2: e.target.value,
                              })
                            }
                            required
                          />
                        </Grid>
                      )}

                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="顯示順序"
                          type="number"
                          value={uploadFile.display_order || 1}
                          onChange={(e) =>
                            handleFileUpdate(index, {
                              display_order: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={uploadFile.is_active}
                              onChange={(e) =>
                                handleFileUpdate(index, {
                                  is_active: e.target.checked,
                                })
                              }
                            />
                          }
                          label="啟用"
                        />
                      </Grid>
                    </Grid>

                    {/* 類別資訊 */}
                    <Box mt={2}>
                      <Chip
                        label={getCategoryInfo(uploadFile.category).name}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        建議尺寸:{" "}
                        {getCategoryInfo(uploadFile.category).recommendedSize}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* 操作按鈕 */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button onClick={onCancel} disabled={uploading}>
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading || uploadFiles.length === 0 || !isFormValid()}
          startIcon={uploading ? <CircularProgress size={20} /> : <CheckIcon />}
        >
          {uploading ? "上傳中..." : `上傳 ${uploadFiles.length} 張照片`}
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
          {previewFile && (
            <Box textAlign="center">
              <Box
                component="img"
                src={previewFile.preview}
                alt="Preview"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
              <Typography variant="h6" mt={2}>
                {previewFile.file.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(previewFile.file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
