import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { Grid } from "@mui/material";
import { useGetList } from "react-admin";
import { Inventory, PhotoLibrary } from "@mui/icons-material";

export const Dashboard = () => {
  const { data: products, isLoading: productsLoading } = useGetList("products");
  const { data: photos, isLoading: photosLoading } = useGetList("photos");

  const totalProducts = products?.length || 0;
  const totalPhotos = photos?.length || 0;
  const activePhotos = photos?.filter((p) => p.is_active).length || 0;
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

      {/* 主要統計卡片 - 左右對稱 */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                  }}
                >
                  <Inventory sx={{ fontSize: 30, color: "#fff" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    產品管理
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#fff", opacity: 0.8 }}>
                    眼鏡產品總計
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  variant="h1"
                  sx={{ fontWeight: "bold", color: "#fff", mb: 1 }}
                >
                  {productsLoading ? "..." : totalProducts}
                </Typography>
                <Typography variant="h6" sx={{ color: "#fff", opacity: 0.8 }}>
                  總產品數
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "#fff", opacity: 0.8 }}>
                  所有產品均可管理
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "#fff",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(240, 147, 251, 0.3)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                  }}
                >
                  <PhotoLibrary sx={{ fontSize: 30, color: "#fff" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    照片管理
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#fff", opacity: 0.8 }}>
                    網站照片總計
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  variant="h1"
                  sx={{ fontWeight: "bold", color: "#fff", mb: 1 }}
                >
                  {photosLoading ? "..." : totalPhotos}
                </Typography>
                <Typography variant="h6" sx={{ color: "#fff", opacity: 0.8 }}>
                  總照片數
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    {activePhotos}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#fff", opacity: 0.8 }}
                  >
                    啟用中
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: "bold", color: "#fff" }}
                  >
                    {inactivePhotos}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#fff", opacity: 0.8 }}
                  >
                    已停用
                  </Typography>
                </Box>
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
                  • 管理產品名稱、品牌、圖片
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  • 上傳和管理產品圖片
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
