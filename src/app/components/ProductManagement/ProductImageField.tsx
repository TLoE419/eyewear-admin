import React, { useState } from "react";
import { useInput, useRecordContext } from "react-admin";
import {
  Box,
  TextField,
  Button,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import { ProductImageUpload } from "./ProductImageUpload";

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

  const handleImageUploaded = (imageUrl: string) => {
    field.onChange(imageUrl);
    setShowUploader(false);
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

      <Button
        variant="outlined"
        onClick={() => setShowUploader(!showUploader)}
        sx={{ mb: 2 }}
      >
        {showUploader ? "隱藏上傳器" : "顯示圖片上傳器"}
      </Button>

      {showUploader && (
        <ProductImageUpload
          onImageUploaded={handleImageUploaded}
          productId={record?.id?.toString()}
          productName={record?.name}
        />
      )}
    </Box>
  );
};
