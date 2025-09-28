import { Layout as ReactAdminLayout, AppBar, TitlePortal } from "react-admin";
import { Typography, Box } from "@mui/material";

const CustomAppBar = () => (
  <AppBar>
    <TitlePortal />
    <Box flex="1" />
    <Typography variant="h6" color="inherit">
      視寶眼鏡後台管理系統
    </Typography>
  </AppBar>
);

export const Layout = (
  props: React.ComponentProps<typeof ReactAdminLayout>
) => <ReactAdminLayout {...props} appBar={CustomAppBar} />;
