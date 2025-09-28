import {
  Layout as ReactAdminLayout,
  AppBar,
  UserMenu,
  Title,
} from "react-admin";
import { MenuItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import { Logout, AdminPanelSettings } from "@mui/icons-material";

const MyAppBar = () => (
  <AppBar
    userMenu={
      <UserMenu>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>登出系統</ListItemText>
        </MenuItem>
      </UserMenu>
    }
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <AdminPanelSettings sx={{ color: "white" }} />
      <Title title="視寶眼鏡後台管理系統" />
    </Box>
  </AppBar>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Layout = (props: any) => (
  <ReactAdminLayout {...props} appBar={MyAppBar} />
);
