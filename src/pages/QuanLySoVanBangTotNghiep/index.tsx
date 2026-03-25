import React, { useState } from 'react';
import { Tabs, Alert } from 'antd';
import { QuanLySoVanBang } from './QuanLySoVanBang';
import { QuanLyQuyetDinh } from './QuanLyQuyetDinh';
import { CauHinhBieuMau } from './CauHinhBieuMau';
import { QuanLyThongTinVanBang } from './QuanLyThongTinVanBang';
import { TraCuuVanBang } from './TraCuuVanBang';

// Khai báo kiểu dữ liệu chung
import { SoVanBang, QuyetDinh, TruongThongTinDong } from './types';

const { TabPane } = Tabs; // Sử dụng TabPane để đảm bảo tương thích 100% với các bản AntD cũ

const QuanLySoVanBangTotNghiep: React.FC = () => {
  // 1. Quản lý State tập trung (Lift State Up) để chia sẻ dữ liệu giữa các Tab
  const [danhSachSoVanBang, setDanhSachSoVanBang] = useState<SoVanBang[]>([
    { id: 'S2026', nam: 2026, tenSo: 'Sổ Gốc Cấp Bằng 2026', dangSuDung: true },
  ]);
  
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<QuyetDinh[]>([]);
  const [cauHinhTruong, setCauHinhTruong] = useState<TruongThongTinDong[]>([]);

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: 20 }}>Hệ thống Quản lý Sổ Văn bằng Tốt nghiệp</h2>
      
      {/* 2. Cấu trúc Tabs tương thích ngược */}
      <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
        
        <TabPane tab="1. Quản lý Sổ Gốc" key="1">
          {/* Cần điều chỉnh QuanLySoVanBang để nhận props nếu muốn đồng bộ toàn diện, 
              hiện tại component này đang dùng state nội bộ theo mã trước đó */}
          <Alert message="Lưu ý: Component này đang chạy độc lập." type="info" showIcon style={{ marginBottom: 16 }} />
          <QuanLySoVanBang />
        </TabPane>

        <TabPane tab="2. Quản lý Quyết định" key="2">
          {/* Truyền danh sách Sổ vào Quyết định để ánh xạ */}
          <QuanLyQuyetDinh danhSachSoVanBang={danhSachSoVanBang} />
        </TabPane>

        <TabPane tab="3. Cấu hình Biểu mẫu" key="3">
          <CauHinhBieuMau />
        </TabPane>

        <TabPane tab="4. Cấp phát Văn bằng" key="4">
          <QuanLyThongTinVanBang 
            cauHinhTruong={cauHinhTruong} 
            danhSachQuyetDinh={danhSachQuyetDinh} 
            currentMaxSoVaoSo={100} 
          />
        </TabPane>

        <TabPane tab="5. Tra cứu Văn bằng (Public)" key="5">
          <TraCuuVanBang />
        </TabPane>

      </Tabs>
    </div>
  );
};

export default QuanLySoVanBangTotNghiep;