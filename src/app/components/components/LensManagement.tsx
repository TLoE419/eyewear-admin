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
  ArrayInput,
  SimpleFormIterator,
  NumberInput,
  SelectInput,
  required,
  BooleanField,
} from "react-admin";

// 鏡片列表組件
export const LensList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="鏡片名稱" />
      <TextField source="brand" label="品牌" />
      <TextField source="category" label="類別" />
      <ImageField
        source="image"
        label="圖片"
        sx={{ maxWidth: 100, maxHeight: 100 }}
      />
      <TextField source="price" label="價格" />
      <BooleanField source="inStock" label="有庫存" />
    </Datagrid>
  </List>
);

// 鏡片編輯組件
export const LensEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled label="ID" />
      <TextInput source="name" validate={required()} label="鏡片名稱" />
      <TextInput source="brand" validate={required()} label="品牌" />
      <SelectInput
        source="category"
        choices={[
          { id: "高清晰度", name: "高清晰度" },
          { id: "防護型", name: "防護型" },
          { id: "漸進多焦", name: "漸進多焦" },
          { id: "變色鏡片", name: "變色鏡片" },
          { id: "數位護眼", name: "數位護眼" },
        ]}
        validate={required()}
        label="類別"
      />
      <TextInput source="image" validate={required()} label="圖片路徑" />
      <TextInput source="description" multiline rows={3} label="描述" />
      <ArrayInput source="features" label="特色功能">
        <SimpleFormIterator>
          <TextInput source="" label="功能" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="specifications.material" label="材質" />
      <TextInput source="specifications.coating" label="鍍膜" />
      <NumberInput source="specifications.thickness" label="厚度" />
      <TextInput source="specifications.transmission" label="透光率" />
      <TextInput source="price" validate={required()} label="價格" />
      <BooleanInput source="inStock" label="有庫存" />
    </SimpleForm>
  </Edit>
);

// 鏡片創建組件
export const LensCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} label="鏡片名稱" />
      <TextInput source="brand" validate={required()} label="品牌" />
      <SelectInput
        source="category"
        choices={[
          { id: "高清晰度", name: "高清晰度" },
          { id: "防護型", name: "防護型" },
          { id: "漸進多焦", name: "漸進多焦" },
          { id: "變色鏡片", name: "變色鏡片" },
          { id: "數位護眼", name: "數位護眼" },
        ]}
        validate={required()}
        label="類別"
      />
      <TextInput source="image" validate={required()} label="圖片路徑" />
      <TextInput source="description" multiline rows={3} label="描述" />
      <ArrayInput source="features" label="特色功能">
        <SimpleFormIterator>
          <TextInput source="" label="功能" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="specifications.material" label="材質" />
      <TextInput source="specifications.coating" label="鍍膜" />
      <NumberInput source="specifications.thickness" label="厚度" />
      <TextInput source="specifications.transmission" label="透光率" />
      <TextInput source="price" validate={required()} label="價格" />
      <BooleanInput source="inStock" label="有庫存" />
    </SimpleForm>
  </Create>
);
