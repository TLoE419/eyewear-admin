import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { useGetList } from "react-admin";

// 定義產品的類型
interface Product {
  id: string;
  inStock: boolean;
  [key: string]: unknown;
}

export const Dashboard = () => {
  const { data: products, total: productsTotal } = useGetList("products");

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        後台管理儀表板
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader title="產品總數" />
          <CardContent>
            <Typography variant="h3" color="primary">
              {productsTotal || 0}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="庫存產品" />
          <CardContent>
            <Typography variant="h3" color="success.main">
              {products?.filter((p: Product) => p.inStock).length || 0}
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          快速操作
        </Typography>
        <div className="flex gap-4">
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography variant="h6">管理產品</Typography>
              <Typography variant="body2" color="text.secondary">
                新增、編輯或刪除眼鏡產品
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Box>
    </Box>
  );
};
