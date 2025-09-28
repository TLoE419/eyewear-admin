"use client";

import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  BooleanInput,
} from "react-admin";
import { ReactAdminImageUpload } from "./ReactAdminImageUpload";
import { PHOTO_CATEGORIES, PhotoCategory } from "@/types/photo";
import { PhotoApi } from "@/lib/photoApi";

export const CustomPhotoEdit = (props: Record<string, unknown>) => {
  const handleReplaceImage = async (oldUrl: string) => {
    try {
      // 刪除舊圖片
      await PhotoApi.deleteImage(oldUrl);
      console.log("舊圖片已刪除:", oldUrl);
    } catch (error) {
      console.error("刪除舊圖片失敗:", error);
      throw error;
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm>
        <ReactAdminImageUpload
          source="image_url"
          category={
            (props.record as { category?: PhotoCategory })?.category ||
            "brand_logo"
          }
          onReplaceImage={handleReplaceImage}
        />
        <TextInput source="title" label="標題" />
        <TextInput source="subtitle" label="副標題" />
        <SelectInput
          source="category"
          label="類別"
          choices={Object.values(PHOTO_CATEGORIES).map((category) => ({
            id: category.category,
            name: category.name,
          }))}
        />
        <TextInput source="文字欄1" label="文字欄1" />
        <TextInput source="文字欄2" label="文字欄2" />
        <NumberInput source="display_order" label="顯示順序" />
        <BooleanInput source="is_active" label="啟用" />
      </SimpleForm>
    </Edit>
  );
};
