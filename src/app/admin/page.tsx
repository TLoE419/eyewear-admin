"use client";

import dynamic from "next/dynamic";

// 動態導入 AdminSelector，禁用 SSR
const AdminSelector = dynamic(() => import("../components/AdminSelector"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
      }}
    >
      載入後台管理系統...
    </div>
  ),
});

const AdminPage = () => {
  return <AdminSelector />;
};

export default AdminPage;
