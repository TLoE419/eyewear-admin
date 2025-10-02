import React, { useState } from "react";
import { useInput, useRecordContext } from "react-admin";
import {
  Box,
  TextField,
  Button,
  Card,
  CardMedia,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { CloudUpload, Edit, Close } from "@mui/icons-material";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductImageUploadAdvanced } from "./ProductImageUploadAdvanced";

interface ProductImageFieldProps {
  source: string;
  label?: string;
}

export const ProductImageField: React.FC<ProductImageFieldProps> = ({
  source,
  label,
}) => {
  const record = useRecordContext();
  const { field } = useInput({ source });
  const [showUploader, setShowUploader] = useState(false);
  const [showAdvancedUploader, setShowAdvancedUploader] = useState(false);

  const handleImageUploaded = (imageUrl: string) => {
    field.onChange(imageUrl);
    setShowUploader(false);
    setShowAdvancedUploader(false);
  };

  return (
    <Box>
      <TextField
        fullWidth
        label={label || "圖片路徑"}
        value={field.value || ""}
        onChange={(e) => field.onChange(e.target.value)}
        helperText="產品圖片的檔案路徑，例如：/products/rayban-001.jpg"
        sx={{ mb: 2 }}
      />

      {/* 圖片預覽 */}
      {field.value && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            📸 圖片預覽
          </Typography>
          <Card sx={{ maxWidth: 300, border: "1px solid #e0e0e0" }}>
            <CardMedia
              component="img"
              height="200"
              image={field.value}
              alt="產品圖片預覽"
              sx={{
                objectFit: "cover",
                "&:hover": {
                  transform: "scale(1.02)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div style="
                      height: 200px; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      background-color: #f5f5f5; 
                      color: #666;
                      font-size: 14px;
                    ">
                      圖片載入失敗
                    </div>
                  `;
                }
              }}
            />
          </Card>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            圖片 URL: {field.value}
          </Typography>
        </Box>
      )}

      {/* 上傳按鈕區域 */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          onClick={() => setShowUploader(!showUploader)}
        >
          {showUploader ? "隱藏簡單上傳器" : "簡單上傳"}
        </Button>

        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => setShowAdvancedUploader(true)}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
            },
          }}
        >
          高級上傳器
        </Button>
      </Box>

      {/* 簡單上傳器 */}
      {showUploader && (
        <Box sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
          <ProductImageUpload
            onImageUploaded={handleImageUploaded}
            productId={record?.id?.toString()}
            productName={record?.name}
          />
        </Box>
      )}

      {/* 高級上傳器對話框 */}
      <Dialog
        open={showAdvancedUploader}
        onClose={() => setShowAdvancedUploader(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: "relative" }}>
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 1,
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
              }}
              onClick={() => setShowAdvancedUploader(false)}
            >
              <Close />
            </IconButton>
            <ProductImageUploadAdvanced
              onImageUploaded={handleImageUploaded}
              productId={record?.id?.toString()}
              productName={record?.name}
              onCancel={() => setShowAdvancedUploader(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
