"use client";

import dynamic from "next/dynamic";

// 動態導入完整後台系統
const FullAdmin = dynamic(() => import("./AdminWrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">載入後台管理系統...</p>
      </div>
    </div>
  ),
});

const AdminSelector = () => {
  return <FullAdmin />;
};

export default AdminSelector;
