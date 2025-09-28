import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  Create,
  ImageField,
  SelectInput,
  required,
  BooleanField,
} from "react-admin";

// 產品列表組件
export const ProductList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="產品名稱" />
      <TextField source="brand" label="品牌" />
      <TextField source="category" label="類別" />
      <ImageField
        source="image"
        label="圖片"
        sx={{ maxWidth: 100, maxHeight: 100 }}
      />
      <BooleanField source="inStock" label="有庫存" />
    </Datagrid>
  </List>
);

// 產品編輯組件
export const ProductEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled label="ID" />
      <TextInput source="name" validate={required()} label="產品名稱" />
      <TextInput source="brand" validate={required()} label="品牌" />
      <SelectInput
        source="category"
        choices={[
          { id: "經典款式", name: "經典款式" },
          { id: "輕量設計", name: "輕量設計" },
          { id: "創新科技", name: "創新科技" },
          { id: "奢華時尚", name: "奢華時尚" },
          { id: "精品工藝", name: "精品工藝" },
          { id: "商務精英", name: "商務精英" },
        ]}
        validate={required()}
        label="類別"
      />
      <TextInput source="image" validate={required()} label="圖片路徑" />
      <TextInput source="description" multiline rows={3} label="描述" />
      <BooleanInput source="inStock" label="有庫存" />
    </SimpleForm>
  </Edit>
);

// 產品創建組件
export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} label="產品名稱" />
      <TextInput source="brand" validate={required()} label="品牌" />
      <SelectInput
        source="category"
        choices={[
          { id: "經典款式", name: "經典款式" },
          { id: "輕量設計", name: "輕量設計" },
          { id: "創新科技", name: "創新科技" },
          { id: "奢華時尚", name: "奢華時尚" },
          { id: "精品工藝", name: "精品工藝" },
          { id: "商務精英", name: "商務精英" },
        ]}
        validate={required()}
        label="類別"
      />
      <TextInput source="image" validate={required()} label="圖片路徑" />
      <TextInput source="description" multiline rows={3} label="描述" />
      <BooleanInput source="inStock" label="有庫存" />
    </SimpleForm>
  </Create>
);
