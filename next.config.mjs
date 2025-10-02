/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除 output: "export" 以支持 API 路由
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 允許動態渲染
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
