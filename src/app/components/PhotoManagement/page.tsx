"use client";

import React, { useState } from "react";
import { Box, Container, Tabs, Tab, Paper } from "@mui/material";
import { PhotoList } from "./PhotoList";
import { PhotoUpload } from "./PhotoUpload";
import { CategoryManagement } from "./CategoryManagement";
import { PhotoEdit } from "./PhotoEdit";
import { PhotoPreview } from "./PhotoPreview";
import { Photo } from "@/types/photo";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`photo-tabpanel-${index}`}
      aria-labelledby={`photo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `photo-tab-${index}`,
    "aria-controls": `photo-tabpanel-${index}`,
  };
}

export default function PhotoManagementPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditPhoto(photo);
    setCurrentTab(2); // 切換到編輯頁面
  };

  const handleViewPhoto = (photo: Photo) => {
    setPreviewPhoto(photo);
    setPreviewOpen(true);
  };

  const handleUploadPhoto = () => {
    setCurrentTab(1); // 切換到上傳頁面
  };

  const handleViewPhotosByCategory = () => {
    // 這裡可以實現按類別篩選照片列表
    setCurrentTab(0); // 切換到列表頁面
  };

  const handleUploadComplete = () => {
    setCurrentTab(0); // 上傳完成後回到列表頁面
  };

  const handleEditComplete = () => {
    setEditPhoto(null);
    setCurrentTab(0); // 編輯完成後回到列表頁面
  };

  const handleEditCancel = () => {
    setEditPhoto(null);
    setCurrentTab(0); // 取消編輯後回到列表頁面
  };

  const handleUploadCancel = () => {
    setCurrentTab(0); // 取消上傳後回到列表頁面
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="照片管理標籤"
            variant="fullWidth"
          >
            <Tab label="照片列表" {...a11yProps(0)} />
            <Tab label="上傳照片" {...a11yProps(1)} />
            <Tab label="類別管理" {...a11yProps(2)} />
            {editPhoto && <Tab label="編輯照片" {...a11yProps(3)} />}
          </Tabs>
        </Paper>

        <TabPanel value={currentTab} index={0}>
          <PhotoList
            onEditPhoto={handleEditPhoto}
            onViewPhoto={handleViewPhoto}
            onUploadPhoto={() => handleUploadPhoto()}
          />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <PhotoUpload
            onUploadComplete={handleUploadComplete}
            onCancel={handleUploadCancel}
          />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <CategoryManagement
            onUploadPhoto={handleUploadPhoto}
            onViewPhotos={handleViewPhotosByCategory}
          />
        </TabPanel>

        {editPhoto && (
          <TabPanel value={currentTab} index={3}>
            <PhotoEdit
              photo={editPhoto}
              onSave={handleEditComplete}
              onCancel={handleEditCancel}
            />
          </TabPanel>
        )}
      </Box>

      {/* 照片預覽對話框 */}
      {previewPhoto && (
        <PhotoPreview
          photo={previewPhoto}
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setPreviewPhoto(null);
          }}
          onEdit={handleEditPhoto}
          onDelete={(photo) => {
            // 這裡可以實現刪除功能
            console.log("Delete photo:", photo);
          }}
        />
      )}
    </Container>
  );
}
