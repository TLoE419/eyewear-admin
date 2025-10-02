import React from "react";
import { useInput, useRecordContext } from "react-admin";
import { Box } from "@mui/material";
import { ProductImageSelector } from "./ProductImageSelector";

interface ProductImageFieldProps {
  source: string;
  label?: string;
}

export const ProductImageField: React.FC<ProductImageFieldProps> = ({
  source,
}) => {
  const record = useRecordContext();
  const { field } = useInput({ source });

  const handleImageChange = (imageUrl: string) => {
    field.onChange(imageUrl);
  };

  return (
    <Box>
      <ProductImageSelector
        currentImageUrl={field.value}
        onImageChange={handleImageChange}
        productId={record?.id?.toString()}
        productName={record?.name}
      />
    </Box>
  );
};
