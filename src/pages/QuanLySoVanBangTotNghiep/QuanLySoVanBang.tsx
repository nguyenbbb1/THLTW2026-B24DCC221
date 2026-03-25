import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Space, message, Tag } from 'antd';
import { SoVanBang } from './types';

export const QuanLySoVanBang: React.FC = () => {
  // Mock data khởi tạo
  const [danhSachSo, setDanhSachSo] = useState<SoVanBang[]>([
    { id: 'S2025', nam: 2025, tenSo: 'Sổ Gốc Cấp Bằng Tốt Nghiệp 2025', dangSuDung: false },
    { id: 'S2026', nam: 2026, tenSo: 'Sổ Gốc Cấp Bằng Tốt Nghiệp 2026', dangSuDung: true },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddOrUpdate = (values: any) => {
    // Ràng buộc: Mỗi năm chỉ nên có 1 sổ chính (trừ khi có nghiệp vụ phân tách đặc thù)
    const isNamTontai = danhSachSo.some(so => so.nam === values.nam);
    if (isNamTontai && !values.id) {
      message.error(`Sổ văn bằng cho năm ${values.nam} đã tồn tại!`);
      return;
    }

    const newSo: SoVanBang = {
      id: values.id || `S${values.nam}-${Date.now()}`,
      ...values,
    };

    setDanhSachSo([...danhSachSo, newSo]);
    message.success('Đã lưu thông tin Sổ văn bằng.');
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Mã Sổ', dataIndex: 'id', key: 'id' },
    { title: 'Năm Cấp', dataIndex: 'nam', key: 'nam', sorter: (a: SoVanBang, b: SoVanBang) => a.nam - b.nam },
    { title: 'Tên Sổ', dataIndex: 'tenSo', key: 'tenSo' },
    { 
      title: 'Trạng Thái', 
      dataIndex: 'dangSuDung', 
      key: 'dangSuDung',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>{status ? 'Đang mở (Cấp số)' : 'Đã chốt (Khóa)'}</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: SoVanBang) => (
        <Space size="middle">
          <Button type="link" onClick={() => {
            form.setFieldsValue(record);
            setIsModalVisible(true);
          }}>Chỉnh sửa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3>Danh mục Sổ Văn Bằng</h3>
        <Button type="primary" onClick={() => { form.resetFields(); setIsModalVisible(true); }}>
          Mở Sổ Mới
        </Button>
      </div>
      
      <Table columns={columns} dataSource={danhSachSo} rowKey="id" bordered pagination={{ pageSize: 10 }} />

      <Modal title="Thông tin Sổ Văn Bằng" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} onFinish={handleAddOrUpdate} layout="vertical" initialValues={{ dangSuDung: true }}>
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="nam" label="Năm cấp bằng" rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
            <InputNumber style={{ width: '100%' }} min={1990} max={2100} />
          </Form.Item>
          <Form.Item name="tenSo" label="Tên sổ" rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}>
            <Input placeholder="VD: Sổ Gốc Cấp Bằng Tốt Nghiệp 2026" />
          </Form.Item>
          <Form.Item name="dangSuDung" label="Trạng thái mở sổ" valuePropName="checked">
            <Switch checkedChildren="Mở" unCheckedChildren="Khóa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};