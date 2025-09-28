/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 允許動態渲染
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
