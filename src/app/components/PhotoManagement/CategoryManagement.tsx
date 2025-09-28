"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { PhotoCategory, PHOTO_CATEGORIES } from "@/types/photo";
import { usePhotoManagement } from "@/hooks/usePhotoManagement";

interface CategoryManagementProps {
  onUploadPhoto: (category?: PhotoCategory) => void;
  onViewPhotos: (category: PhotoCategory) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  onUploadPhoto,
  onViewPhotos,
}) => {
  const { getCategoryCounts, loading, error } = usePhotoManagement();
  const [categoryCounts, setCategoryCounts] = useState<
    Record<PhotoCategory, number>
  >({} as Record<PhotoCategory, number>);

  const loadCategoryCounts = useCallback(async () => {
    try {
      const counts = await getCategoryCounts();
      setCategoryCounts(counts);
    } catch (err) {
      console.error("Failed to load category counts:", err);
    }
  }, [getCategoryCounts]);

  useEffect(() => {
    loadCategoryCounts();
  }, [loadCategoryCounts]);

  const getCategoryInfo = (category: PhotoCategory) => {
    return PHOTO_CATEGORIES[category];
  };

  const getUsagePercentage = (category: PhotoCategory) => {
    const info = getCategoryInfo(category);
    const count = categoryCounts[category] || 0;
    return Math.round((count / info.maxCount) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "error";
    if (percentage >= 70) return "warning";
    return "success";
  };

  const getUsageText = (percentage: number) => {
    if (percentage >= 90) return "接近上限";
    if (percentage >= 70) return "使用較多";
    return "使用正常";
  };

  return (
    <Box>
      {/* 標題 */}
      <Typography variant="h4" component="h1" gutterBottom>
        照片類別管理
      </Typography>

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 類別統計卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {Object.values(PHOTO_CATEGORIES).map((categoryInfo) => {
          const count = categoryCounts[categoryInfo.category] || 0;
          const percentage = getUsagePercentage(categoryInfo.category);
          const usageColor = getUsageColor(percentage);
          const usageText = getUsageText(percentage);

          return (
            <Grid item xs={12} sm={6} md={4} key={categoryInfo.category}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {categoryInfo.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {categoryInfo.description}
                      </Typography>
                    </Box>
                    <Chip label={usageText} color={usageColor} size="small" />
                  </Box>

                  <Box mb={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="body2" color="text.secondary">
                        使用數量
                      </Typography>
                      <Typography variant="h6">
                        {count} / {categoryInfo.maxCount}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 8,
                        backgroundColor: "grey.200",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${percentage}%`,
                          height: "100%",
                          backgroundColor:
                            usageColor === "error"
                              ? "error.main"
                              : usageColor === "warning"
                              ? "warning.main"
                              : "success.main",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      建議尺寸: {categoryInfo.recommendedSize}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      支援格式: {categoryInfo.supportedFormats.join(", ")}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<ViewIcon />}
                      onClick={() => onViewPhotos(categoryInfo.category)}
                    >
                      檢視
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<UploadIcon />}
                      onClick={() => onUploadPhoto(categoryInfo.category)}
                    >
                      上傳
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 詳細統計表格 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            詳細統計
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>類別</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell>使用數量</TableCell>
                    <TableCell>上限</TableCell>
                    <TableCell>使用率</TableCell>
                    <TableCell>建議尺寸</TableCell>
                    <TableCell>支援格式</TableCell>
                    <TableCell>必填欄位</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(PHOTO_CATEGORIES).map((categoryInfo) => {
                    const count = categoryCounts[categoryInfo.category] || 0;
                    const percentage = getUsagePercentage(
                      categoryInfo.category
                    );
                    const usageColor = getUsageColor(percentage);

                    return (
                      <TableRow key={categoryInfo.category}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {categoryInfo.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {categoryInfo.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{count}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {categoryInfo.maxCount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              sx={{
                                width: 60,
                                height: 8,
                                backgroundColor: "grey.200",
                                borderRadius: 1,
                                overflow: "hidden",
                              }}
                            >
                              <Box
                                sx={{
                                  width: `${percentage}%`,
                                  height: "100%",
                                  backgroundColor:
                                    usageColor === "error"
                                      ? "error.main"
                                      : usageColor === "warning"
                                      ? "warning.main"
                                      : "success.main",
                                }}
                              />
                            </Box>
                            <Typography variant="caption">
                              {percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {categoryInfo.recommendedSize}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {categoryInfo.supportedFormats.join(", ")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {categoryInfo.requiredFields.map((field) => (
                              <Chip
                                key={field}
                                label={field}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="檢視照片">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  onViewPhotos(categoryInfo.category)
                                }
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="上傳照片">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  onUploadPhoto(categoryInfo.category)
                                }
                              >
                                <UploadIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
