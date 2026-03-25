// CauHinhBieuMau.tsx
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm } from 'antd';
import { TruongThongTinDong } from './types';

export const CauHinhBieuMau: React.FC = () => {
  const [danhSachTruong, setDanhSachTruong] = useState<TruongThongTinDong[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = (values: any) => {
    const newTruong: TruongThongTinDong = {
      id: Date.now().toString(),
      ...values,
    };
    setDanhSachTruong([...danhSachTruong, newTruong]);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    setDanhSachTruong(danhSachTruong.filter(t => t.id !== id));
  };

  const columns = [
    { title: 'Tên trường thông tin', dataIndex: 'tenTruong', key: 'tenTruong' },
    { title: 'Kiểu dữ liệu', dataIndex: 'kieuDuLieu', key: 'kieuDuLieu' },
    { title: 'Bắt buộc', dataIndex: 'batBuoc', key: 'batBuoc', render: (val: boolean) => (val ? 'Có' : 'Không') },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: TruongThongTinDong) => (
        <Space size="middle">
          <Popconfirm title="Xóa trường này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="link">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
        Thêm trường thông tin
      </Button>
      <Table columns={columns} dataSource={danhSachTruong} rowKey="id" bordered />

      <Modal title="Thêm trường thông tin" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item name="tenTruong" label="Tên trường" rules={[{ required: true }]}>
            <Input placeholder="VD: Dân tộc, Điểm trung bình..." />
          </Form.Item>
          <Form.Item name="kieuDuLieu" label="Kiểu dữ liệu" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="String">Văn bản (String)</Select.Option>
              <Select.Option value="Number">Số (Number)</Select.Option>
              <Select.Option value="Date">Ngày tháng (Date)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="batBuoc" label="Bắt buộc nhập" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};