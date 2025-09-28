import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "眼鏡後台管理系統",
  description: "眼鏡產品和鏡片管理系統",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
