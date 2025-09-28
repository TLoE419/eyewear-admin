import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  BooleanField,
  BooleanInput,
  Create,
  EditButton,
  DeleteButton,
  ShowButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
} from "react-admin";

// 產品列表組件
export const ProductList = () => (
  <List
    title="眼鏡產品管理"
    actions={
      <TopToolbar>
        <CreateButton label="新增產品" />
        <ExportButton label="匯出資料" />
        <FilterButton />
      </TopToolbar>
    }
    filters={[
      <TextInput
        key="name"
        source="name"
        label="產品名稱"
        placeholder="搜尋產品名稱..."
      />,
      <TextInput
        key="brand"
        source="brand"
        label="品牌"
        placeholder="搜尋品牌..."
      />,
      <TextInput
        key="category"
        source="category"
        label="分類"
        placeholder="搜尋分類..."
      />,
    ]}
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="name" label="產品名稱" />
      <TextField source="brand" label="品牌" />
      <TextField source="category" label="分類" />
      <TextField source="image" label="圖片路徑" />
      <TextField source="description" label="描述" />
      <BooleanField source="inStock" label="庫存狀態" />
      <TextField source="created_at" label="創建時間" />
      <TextField source="updated_at" label="更新時間" />
      <EditButton label="編輯" />
      <ShowButton label="查看" />
      <DeleteButton label="刪除" />
    </Datagrid>
  </List>
);

// 產品編輯組件
export const ProductEdit = () => (
  <Edit title="編輯眼鏡產品">
    <SimpleForm
      sx={{
        width: "100%",
        padding: 3,
        "& .MuiFormControl-root": {
          marginBottom: 2,
        },
      }}
    >
      <TextInput
        source="id"
        label="產品ID"
        disabled
        helperText="系統自動生成的唯一識別碼"
      />
      <TextInput
        source="name"
        label="產品名稱"
        required
        helperText="請輸入眼鏡產品的完整名稱"
      />
      <TextInput
        source="brand"
        label="品牌"
        required
        helperText="例如：Ray-Ban、GUCCI、BVLGARI 等"
      />
      <TextInput
        source="category"
        label="分類"
        required
        helperText="例如：太陽眼鏡、光學眼鏡、運動眼鏡等"
      />
      <TextInput
        source="image"
        label="圖片路徑"
        required
        helperText="產品圖片的檔案路徑，例如：/products/rayban-001.jpg"
      />
      <TextInput
        source="description"
        label="產品描述"
        multiline
        rows={3}
        helperText="詳細描述產品的特色、材質、適用場合等"
      />
      <BooleanInput
        source="inStock"
        label="庫存狀態"
        helperText="勾選表示有庫存，可立即銷售"
      />
      <TextInput
        source="created_at"
        label="創建時間"
        disabled
        helperText="產品首次建立的時間"
      />
      <TextInput
        source="updated_at"
        label="更新時間"
        disabled
        helperText="最後一次修改的時間"
      />
    </SimpleForm>
  </Edit>
);

// 產品創建組件
export const ProductCreate = () => (
  <Create title="新增眼鏡產品">
    <SimpleForm
      sx={{
        width: "100%",
        padding: 3,
        "& .MuiFormControl-root": {
          marginBottom: 2,
        },
      }}
    >
      <TextInput
        source="name"
        label="產品名稱"
        required
        helperText="請輸入眼鏡產品的完整名稱"
      />
      <TextInput
        source="brand"
        label="品牌"
        required
        helperText="例如：Ray-Ban、GUCCI、BVLGARI 等"
      />
      <TextInput
        source="category"
        label="分類"
        required
        helperText="例如：太陽眼鏡、光學眼鏡、運動眼鏡等"
      />
      <TextInput
        source="image"
        label="圖片路徑"
        required
        helperText="產品圖片的檔案路徑，例如：/products/rayban-001.jpg"
      />
      <TextInput
        source="description"
        label="產品描述"
        multiline
        rows={3}
        helperText="詳細描述產品的特色、材質、適用場合等"
      />
      <BooleanInput
        source="inStock"
        label="庫存狀態"
        helperText="勾選表示有庫存，可立即銷售"
      />
    </SimpleForm>
  </Create>
);
