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
  ArrayInput,
  SimpleFormIterator,
  NumberInput,
} from "react-admin";

// 鏡片列表組件
export const LensList = () => (
  <List
    title="鏡片產品管理"
    actions={
      <TopToolbar>
        <CreateButton label="新增鏡片" />
        <ExportButton label="匯出資料" />
        <FilterButton />
      </TopToolbar>
    }
    filters={[
      <TextInput
        key="name"
        source="name"
        label="鏡片名稱"
        placeholder="搜尋鏡片名稱..."
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
      <TextField source="name" label="鏡片名稱" />
      <TextField source="brand" label="品牌" />
      <TextField source="category" label="分類" />
      <TextField source="image" label="圖片路徑" />
      <TextField source="description" label="描述" />
      <TextField source="price" label="價格" />
      <BooleanField source="inStock" label="庫存狀態" />
      <TextField source="created_at" label="創建時間" />
      <TextField source="updated_at" label="更新時間" />
      <EditButton label="編輯" />
      <ShowButton label="查看" />
      <DeleteButton label="刪除" />
    </Datagrid>
  </List>
);

// 鏡片編輯組件
export const LensEdit = () => (
  <Edit title="編輯鏡片產品">
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
        label="鏡片ID"
        disabled
        helperText="系統自動生成的唯一識別碼"
      />
      <TextInput
        source="name"
        label="鏡片名稱"
        required
        helperText="請輸入鏡片的完整名稱"
      />
      <TextInput
        source="brand"
        label="品牌"
        required
        helperText="例如：Essilor、Zeiss、Hoya 等"
      />
      <TextInput
        source="category"
        label="分類"
        required
        helperText="例如：單焦點、多焦點、變色鏡片等"
      />
      <TextInput
        source="image"
        label="圖片路徑"
        required
        helperText="鏡片圖片的檔案路徑，例如：/lenses/essilor-001.jpg"
      />
      <TextInput
        source="description"
        label="鏡片描述"
        multiline
        rows={3}
        helperText="詳細描述鏡片的特色、適用對象、使用場合等"
      />
      <NumberInput
        source="price"
        label="價格"
        required
        helperText="鏡片的售價（新台幣）"
      />
      <ArrayInput source="features" label="特色功能">
        <SimpleFormIterator>
          <TextInput
            source=""
            label="功能特色"
            helperText="例如：防藍光、抗UV、抗刮等"
          />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput
        source="specifications.material"
        label="材質"
        helperText="例如：樹脂、玻璃、PC等"
      />
      <TextInput
        source="specifications.coating"
        label="鍍膜"
        helperText="例如：多層鍍膜、防反射鍍膜等"
      />
      <TextInput
        source="specifications.thickness"
        label="折射率"
        helperText="例如：1.50、1.56、1.67、1.74等"
      />
      <TextInput
        source="specifications.transmission"
        label="透光率"
        helperText="例如：99%、95%等"
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
        helperText="鏡片首次建立的時間"
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

// 鏡片創建組件
export const LensCreate = () => (
  <Create title="新增鏡片產品">
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
        label="鏡片名稱"
        required
        helperText="請輸入鏡片的完整名稱"
      />
      <TextInput
        source="brand"
        label="品牌"
        required
        helperText="例如：Essilor、Zeiss、Hoya 等"
      />
      <TextInput
        source="category"
        label="分類"
        required
        helperText="例如：單焦點、多焦點、變色鏡片等"
      />
      <TextInput
        source="image"
        label="圖片路徑"
        required
        helperText="鏡片圖片的檔案路徑，例如：/lenses/essilor-001.jpg"
      />
      <TextInput
        source="description"
        label="鏡片描述"
        multiline
        rows={3}
        helperText="詳細描述鏡片的特色、適用對象、使用場合等"
      />
      <NumberInput
        source="price"
        label="價格"
        required
        helperText="鏡片的售價（新台幣）"
      />
      <ArrayInput source="features" label="特色功能">
        <SimpleFormIterator>
          <TextInput
            source=""
            label="功能特色"
            helperText="例如：防藍光、抗UV、抗刮等"
          />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput
        source="specifications.material"
        label="材質"
        helperText="例如：樹脂、玻璃、PC等"
      />
      <TextInput
        source="specifications.coating"
        label="鍍膜"
        helperText="例如：多層鍍膜、防反射鍍膜等"
      />
      <TextInput
        source="specifications.thickness"
        label="折射率"
        helperText="例如：1.50、1.56、1.67、1.74等"
      />
      <TextInput
        source="specifications.transmission"
        label="透光率"
        helperText="例如：99%、95%等"
      />
      <BooleanInput
        source="inStock"
        label="庫存狀態"
        helperText="勾選表示有庫存，可立即銷售"
      />
    </SimpleForm>
  </Create>
);
