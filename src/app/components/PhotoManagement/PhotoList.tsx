"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  DragIndicator as DragIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { Photo, PHOTO_CATEGORIES } from "@/types/photo";
import { PhotoCategory } from "@/lib/photoManagement";
import { usePhotoManagement } from "@/hooks/usePhotoManagement";

interface PhotoListProps {
  onEditPhoto: (photo: Photo) => void;
  onViewPhoto: (photo: Photo) => void;
  onUploadPhoto: () => void;
}

export const PhotoList: React.FC<PhotoListProps> = ({
  onEditPhoto,
  onViewPhoto,
  onUploadPhoto,
}) => {
  const { photos, loading, error, fetchPhotos, deletePhoto, deletePhotos } =
    usePhotoManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | "">(
    ""
  );
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);

  const loadPhotos = useCallback(async () => {
    try {
      const response = await fetchPhotos({
        page,
        perPage,
        category: (selectedCategory as PhotoCategory) || undefined,
        search: searchTerm || undefined,
        sortBy: "display_order",
        sortOrder: "asc",
      });
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Failed to load photos:", err);
    }
  }, [fetchPhotos, page, perPage, selectedCategory, searchTerm]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event: { target: { value: unknown } }) => {
    setSelectedCategory(event.target.value as PhotoCategory);
    setPage(1);
  };

  const handleSelectPhoto = (photoId: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map((photo) => photo.id));
    }
  };

  const handleDeletePhoto = (photo: Photo) => {
    setPhotoToDelete(photo);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePhoto = async () => {
    if (photoToDelete) {
      try {
        await deletePhoto(photoToDelete.id);
        setDeleteDialogOpen(false);
        setPhotoToDelete(null);
        loadPhotos();
      } catch (err) {
        console.error("Failed to delete photo:", err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPhotos.length > 0) {
      try {
        await deletePhotos(selectedPhotos);
        setSelectedPhotos([]);
        loadPhotos();
      } catch (err) {
        console.error("Failed to delete photos:", err);
      }
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getCategoryInfo = (category: PhotoCategory) => {
    return PHOTO_CATEGORIES[category];
  };

  if (loading && photos.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 標題和操作按鈕 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          照片管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={onUploadPhoto}
          color="primary"
        >
          上傳照片
        </Button>
      </Box>

      {/* 搜尋和篩選 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="搜尋照片..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>類別</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="類別"
                >
                  <MenuItem value="">全部類別</MenuItem>
                  {Object.values(PHOTO_CATEGORIES).map((category) => (
                    <MenuItem key={category.category} value={category.category}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={1}>
                {selectedPhotos.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleBulkDelete}
                  >
                    刪除選中 ({selectedPhotos.length})
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 照片列表 */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selectedPhotos.length === photos.length &&
                      photos.length > 0
                    }
                    indeterminate={
                      selectedPhotos.length > 0 &&
                      selectedPhotos.length < photos.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>預覽</TableCell>
                <TableCell>標題</TableCell>
                <TableCell>類別</TableCell>
                <TableCell>品牌/分店</TableCell>
                <TableCell>順序</TableCell>
                <TableCell>狀態</TableCell>
                <TableCell>建立時間</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {photos.map((photo) => (
                <TableRow key={photo.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPhotos.includes(photo.id)}
                      onChange={() => handleSelectPhoto(photo.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      component="img"
                      src={photo.image_url}
                      alt={photo.title || "Photo"}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => onViewPhoto(photo)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {photo.title || "無標題"}
                    </Typography>
                    {photo.subtitle && (
                      <Typography variant="caption" color="text.secondary">
                        {photo.subtitle}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCategoryInfo(photo.category).name}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {photo.文字欄1 && <div>文字欄1: {photo.文字欄1}</div>}
                      {photo.文字欄2 && <div>文字欄2: {photo.文字欄2}</div>}
                      {!photo.文字欄1 && !photo.文字欄2 && (
                        <div style={{ color: "#999" }}>無資料</div>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DragIcon color="action" />
                      <Typography variant="body2">
                        {photo.display_order}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={photo.is_active ? "啟用" : "停用"}
                      size="small"
                      color={photo.is_active ? "success" : "default"}
                      variant={photo.is_active ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(photo.created_at).toLocaleDateString("zh-TW")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="檢視">
                        <IconButton
                          size="small"
                          onClick={() => onViewPhoto(photo)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="編輯">
                        <IconButton
                          size="small"
                          onClick={() => onEditPhoto(photo)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="刪除">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeletePhoto(photo)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 分頁 */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Card>

      {/* 刪除確認對話框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <Typography>確定要刪除這張照片嗎？此操作無法復原。</Typography>
          {photoToDelete && (
            <Box mt={2}>
              <Box
                component="img"
                src={photoToDelete.image_url}
                alt={photoToDelete.title || "Photo"}
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button
            onClick={confirmDeletePhoto}
            color="error"
            variant="contained"
          >
            刪除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
