// TraCuuVanBang.tsx
import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, message, Card } from 'antd';

export const TraCuuVanBang: React.FC = () => {
  const [form] = Form.useForm();
  const [ketQua, setKetQua] = useState<any>(null);

  const onSearch = (values: any) => {
    // 1. Kiểm tra số lượng tham số đầu vào
    const activeParams = Object.values(values).filter(val => val !== undefined && val !== null && val !== '');
    
    if (activeParams.length < 2) {
      message.error("Yêu cầu nhập ít nhất 2 tham số để thực hiện tra cứu.");
      return;
    }

    // 2. Logic gọi API Tra cứu (Mocked)
    message.loading({ content: 'Đang tra cứu...', key: 'search' });
    setTimeout(() => {
      message.success({ content: 'Tìm thấy văn bằng hợp lệ.', key: 'search' });
      // Giả lập kết quả
      setKetQua({ hoTen: values.hoTen || 'Nguyễn Văn A', maSinhVien: values.maSinhVien || 'B20DCCN001', trangThai: 'Hợp lệ' });
      // TODO: Logic cộng +1 vào luotTraCuu của QuyetDinh tương ứng
    }, 1000);
  };

  return (
    <div>
      <Form form={form} onFinish={onSearch} layout="vertical">
        <Row gutter={16}>
          <Col span={8}><Form.Item name="soHieu" label="Số hiệu văn bằng"><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="soVaoSo" label="Số vào sổ"><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="maSinhVien" label="Mã sinh viên"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="hoTen" label="Họ và tên"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="ngaySinh" label="Ngày sinh"><DatePicker style={{ width: '100%' }}/></Form.Item></Col>
        </Row>
        <Button type="primary" htmlType="submit">Tra cứu</Button>
        <Button onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>Làm mới</Button>
      </Form>

      {ketQua && (
        <Card title="Kết quả tra cứu" style={{ marginTop: 24 }}>
          <p><strong>Họ tên:</strong> {ketQua.hoTen}</p>
          <p><strong>Mã sinh viên:</strong> {ketQua.maSinhVien}</p>
          <p><strong>Trạng thái:</strong> {ketQua.trangThai}</p>
        </Card>
      )}
    </div>
  );
};