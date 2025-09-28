"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudDownload as DownloadIcon,
} from "@mui/icons-material";
import { Photo, PHOTO_CATEGORIES } from "@/types/photo";

interface PhotoPreviewProps {
  photo: Photo;
  open: boolean;
  onClose: () => void;
  onEdit?: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photo,
  open,
  onClose,
  onEdit,
  onDelete,
}) => {
  const getCategoryInfo = (category: string) => {
    return PHOTO_CATEGORIES[category as keyof typeof PHOTO_CATEGORIES];
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = photo.image_url;
    link.download = photo.title || "photo";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const categoryInfo = getCategoryInfo(photo.category);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">照片詳情</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* 左側：照片 */}
          <Grid item xs={12} md={8}>
            <Box textAlign="center">
              <Box
                component="img"
                src={photo.image_url}
                alt={photo.title || "Photo"}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: 1,
                  boxShadow: 2,
                }}
              />
            </Box>
          </Grid>

          {/* 右側：資訊 */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  基本資訊
                </Typography>

                <Box mb={2}>
                  <Chip
                    label={categoryInfo.name}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {categoryInfo.description}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {photo.title && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      標題
                    </Typography>
                    <Typography variant="body1">{photo.title}</Typography>
                  </Box>
                )}

                {photo.subtitle && (
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      副標題
                    </Typography>
                    <Typography variant="body1">{photo.subtitle}</Typography>
                  </Box>
                )}

                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    顯示順序
                  </Typography>
                  <Typography variant="body1">{photo.display_order}</Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    狀態
                  </Typography>
                  <Chip
                    label={photo.is_active ? "啟用" : "停用"}
                    color={photo.is_active ? "success" : "default"}
                    variant={photo.is_active ? "filled" : "outlined"}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    建立時間
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(photo.created_at)}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    更新時間
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(photo.updated_at)}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    圖片 URL
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: "break-all",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    {photo.image_url}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            variant="outlined"
          >
            下載
          </Button>
          {onEdit && (
            <Button
              startIcon={<EditIcon />}
              onClick={() => onEdit(photo)}
              variant="outlined"
            >
              編輯
            </Button>
          )}
          {onDelete && (
            <Button
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(photo)}
              color="error"
              variant="outlined"
            >
              刪除
            </Button>
          )}
          <Button onClick={onClose} variant="contained">
            關閉
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
