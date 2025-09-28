"use client";

import { Admin, Resource } from "react-admin";
import { dataProvider } from "@/lib/dynamicDataProvider";
import { authProvider } from "@/lib/authProvider";
import { ProductList, ProductEdit, ProductCreate } from "./ProductManagement";
import { LensList, LensEdit, LensCreate } from "./LensManagement";
import {
  PhotoList,
  PhotoEdit,
  PhotoCreate,
  PhotoShow,
} from "./PhotoManagement/PhotoResource";
import { Dashboard } from "./Dashboard";
import { Layout } from "./Layout";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const AdminWrapper = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        layout={Layout}
        dashboard={Dashboard}
        title="視寶眼鏡後台管理"
      >
        <Resource
          name="products"
          list={ProductList}
          edit={ProductEdit}
          create={ProductCreate}
          options={{ label: "產品管理" }}
        />
        <Resource
          name="lenses"
          list={LensList}
          edit={LensEdit}
          create={LensCreate}
          options={{ label: "鏡片管理" }}
        />
        <Resource
          name="photos"
          list={PhotoList}
          edit={PhotoEdit}
          create={PhotoCreate}
          show={PhotoShow}
          options={{ label: "照片管理" }}
        />
      </Admin>
    </ThemeProvider>
  );
};

export default AdminWrapper;
