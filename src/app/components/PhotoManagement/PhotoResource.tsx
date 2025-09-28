"use client";

import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  EditButton,
  DeleteButton,
  ShowButton,
  BooleanField,
  NumberField,
  DateField,
  Filter,
  SearchInput,
  SelectInput,
  TopToolbar,
  CreateButton,
  ExportButton,
  Show,
  SimpleShowLayout,
  SimpleForm,
  Create,
  TextInput,
  NumberInput,
  BooleanInput,
} from "react-admin";
import { ChipField } from "react-admin";
import { PHOTO_CATEGORIES } from "@/types/photo";
import { ReactAdminImageUpload } from "./ReactAdminImageUpload";
import { CustomPhotoEdit } from "./CustomPhotoEdit";

const PhotoFilter = (props: Record<string, unknown>) => (
  <Filter {...props}>
    <SearchInput source="q" alwaysOn />
    <SelectInput
      source="category"
      choices={Object.values(PHOTO_CATEGORIES).map((category) => ({
        id: category.category,
        name: category.name,
      }))}
      alwaysOn
    />
  </Filter>
);

const PhotoListActions = (props: Record<string, unknown>) => (
  <TopToolbar {...props}>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const PhotoList = (props: Record<string, unknown>) => (
  <List
    {...props}
    filters={<PhotoFilter />}
    actions={<PhotoListActions />}
    sort={{ field: "display_order", order: "ASC" }}
  >
    <Datagrid>
      <ImageField source="image_url" title="預覽" />
      <TextField source="title" label="標題" />
      <ChipField source="category" label="類別" />
      <TextField source="文字欄1" label="文字欄1" />
      <TextField source="文字欄2" label="文字欄2" />
      <NumberField source="display_order" label="順序" />
      <BooleanField source="is_active" label="啟用" />
      <DateField source="created_at" label="建立時間" showTime />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const PhotoShow = (props: Record<string, unknown>) => (
  <Show {...props}>
    <SimpleShowLayout>
      <ImageField source="image_url" title="照片" />
      <TextField source="title" label="標題" />
      <TextField source="subtitle" label="副標題" />
      <ChipField source="category" label="類別" />
      <TextField source="文字欄1" label="文字欄1" />
      <TextField source="文字欄2" label="文字欄2" />
      <NumberField source="display_order" label="顯示順序" />
      <BooleanField source="is_active" label="啟用" />
      <DateField source="created_at" label="建立時間" showTime />
      <DateField source="updated_at" label="更新時間" showTime />
    </SimpleShowLayout>
  </Show>
);

export const PhotoEdit = CustomPhotoEdit;

export const PhotoCreate = (props: Record<string, unknown>) => (
  <Create {...props}>
    <SimpleForm>
      <ReactAdminImageUpload
        source="image_url"
        category="brand_logo"
        isRequired
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
        required
      />
      <TextInput source="文字欄1" label="文字欄1" />
      <TextInput source="文字欄2" label="文字欄2" />
      <NumberInput source="display_order" label="顯示順序" />
      <BooleanInput source="is_active" label="啟用" />
    </SimpleForm>
  </Create>
);
