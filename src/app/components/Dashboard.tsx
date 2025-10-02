import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Grid } from "@mui/material";
import { useGetList } from "react-admin";
import { Inventory, ShoppingCart, PhotoLibrary } from "@mui/icons-material";

export const Dashboard = () => {
  const { data: products, isLoading: productsLoading } = useGetList("products");
  const { data: photos, isLoading: photosLoading } = useGetList("photos");

  const totalProducts = products?.length || 0;
  const totalPhotos = photos?.length || 0;
  const inStockProducts = products?.filter((p) => p.inStock).length || 0;
  const activePhotos = photos?.filter((p) => p.is_active).length || 0;
  const outOfStockProducts = totalProducts - inStockProducts;
  const inactivePhotos = totalPhotos - activePhotos;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ marginBottom: 3, color: "#1976d2", fontWeight: "bold" }}
      >
        視寶眼鏡後台管理系統
      </Typography>

      <Typography variant="h6" sx={{ marginBottom: 3, color: "#666" }}>
        歡迎使用後台管理系統！您可以在這裡管理所有產品和照片資料。
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              avatar={<Inventory sx={{ color: "#1976d2" }} />}
              title={
                <Typography variant="h6" component="div">
                  總產品數
                </Typography>
              }
              subheader="所有眼鏡產品總計"
            />
            <CardContent>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "#1976d2",
                  textAlign: "center",
                }}
              >
                {productsLoading ? "載入中..." : totalProducts}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                <Chip
                  label={`有庫存: ${inStockProducts}`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`缺貨: ${outOfStockProducts}`}
                  color="error"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              avatar={<PhotoLibrary sx={{ color: "#d32f2f" }} />}
              title={
                <Typography variant="h6" component="div">
                  總照片數
                </Typography>
              }
              subheader="所有照片總計"
            />
            <CardContent>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "#d32f2f",
                  textAlign: "center",
                }}
              >
                {photosLoading ? "載入中..." : totalPhotos}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                <Chip
                  label={`啟用: ${activePhotos}`}
                  color="success"
                  size="small"
                />
                <Chip
                  label={`停用: ${inactivePhotos}`}
                  color="error"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 4 }}>
        <Card>
          <CardHeader>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              系統功能說明
            </Typography>
          </CardHeader>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  sx={{ color: "#1976d2", marginBottom: 2 }}
                >
                  📦 產品管理
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  • 新增、編輯、刪除眼鏡產品
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  • 管理產品名稱、品牌、分類、圖片
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  • 設定產品庫存狀態
                </Typography>
                <Typography variant="body1">
                  • 查看產品詳細描述和規格
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h6"
                  sx={{ color: "#d32f2f", marginBottom: 2 }}
                >
                  📸 照片管理
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  • 管理首頁輪播照片
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  • 上傳品牌 Logo 和分店照片
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  • 設定照片顯示順序和狀態
                </Typography>
                <Typography variant="body1">
                  • 分類管理各種用途的照片
                </Typography>
              </Grid>
            </Grid>
            <Box
              sx={{
                marginTop: 3,
                padding: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                💡 <strong>提示：</strong>
                所有資料變更都會即時同步到前台網站，確保客戶看到最新的產品資訊。
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
