"use client";

import { useEffect } from "react";

const AdminRedirect = () => {
  useEffect(() => {
    // 重定向到獨立的後台應用程式
    window.location.href = "https://admin.your-domain.com";
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        flexDirection: "column",
      }}
    >
      <div>正在重定向到後台管理系統...</div>
      <div style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>
        如果沒有自動跳轉，請點擊{" "}
        <a
          href="https://admin.your-domain.com"
          style={{ color: "#1976d2", textDecoration: "underline" }}
        >
          這裡
        </a>
      </div>
    </div>
  );
};

export default AdminRedirect;
