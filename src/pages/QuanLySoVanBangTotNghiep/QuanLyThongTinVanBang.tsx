// QuanLyThongTinVanBang.tsx
import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Select, message } from 'antd';
import { TruongThongTinDong, VanBang, QuyetDinh } from './types';

interface Props {
  cauHinhTruong: TruongThongTinDong[];
  danhSachQuyetDinh: QuyetDinh[];
  currentMaxSoVaoSo: number; // Được truyền từ Component cha để tính toán
}

export const QuanLyThongTinVanBang: React.FC<Props> = ({ cauHinhTruong, danhSachQuyetDinh, currentMaxSoVaoSo }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // Xử lý logic tách trường mặc định và trường động
    const { quyetDinhId, soHieu, maSinhVien, hoTen, ngaySinh, ...thongTinPhuLuc } = values;
    
    const newVanBang: VanBang = {
      id: Date.now().toString(),
      quyetDinhId,
      soVaoSo: currentMaxSoVaoSo + 1, // Logic tự động tăng
      soHieu,
      maSinhVien,
      hoTen,
      ngaySinh: ngaySinh.toISOString(),
      thongTinPhuLuc
    };

    message.success(`Đã thêm văn bằng thành công. Số vào sổ: ${newVanBang.soVaoSo}`);
    form.resetFields();
  };

  const renderDynamicField = (truong: TruongThongTinDong) => {
    switch (truong.kieuDuLieu) {
      case 'Number': return <InputNumber style={{ width: '100%' }} />;
      case 'Date': return <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />;
      case 'String': default: return <Input />;
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="Số vào sổ">
        <Input disabled value={currentMaxSoVaoSo + 1} placeholder="Hệ thống tự động cấp" />
      </Form.Item>
      
      <Form.Item name="quyetDinhId" label="Thuộc Quyết định" rules={[{ required: true }]}>
        <Select>
          {danhSachQuyetDinh.map(qd => (
            <Select.Option key={qd.id} value={qd.id}>{qd.soQuyetDinh}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="soHieu" label="Số hiệu văn bằng" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="maSinhVien" label="Mã sinh viên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}>
        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
      </Form.Item>

      {/* Render Dynamic Fields */}
      {cauHinhTruong.map(truong => (
        <Form.Item 
          key={truong.id} 
          name={truong.id} 
          label={truong.tenTruong} 
          rules={[{ required: truong.batBuoc, message: `Vui lòng nhập ${truong.tenTruong}` }]}
        >
          {renderDynamicField(truong)}
        </Form.Item>
      ))}

      <Button type="primary" htmlType="submit">Lưu thông tin văn bằng</Button>
    </Form>
  );
};