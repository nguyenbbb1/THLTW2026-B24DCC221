import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, message, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { QuyetDinh, SoVanBang } from './types';

// Props giả định nhận danh sách sổ từ component cha hoặc Global State (Redux/Context)
interface Props {
  danhSachSoVanBang: SoVanBang[];
}

export const QuanLyQuyetDinh: React.FC<Props> = ({ danhSachSoVanBang }) => {
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<QuyetDinh[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddOrUpdate = (values: any) => {
    // Validate: Kiểm tra trùng lặp Số Quyết Định
    const isQdTontai = danhSachQuyetDinh.some(qd => qd.soQuyetDinh === values.soQuyetDinh && qd.id !== values.id);
    if (isQdTontai) {
      message.error(`Số Quyết định ${values.soQuyetDinh} đã tồn tại trong hệ thống!`);
      return;
    }

    const newQd: QuyetDinh = {
      id: values.id || `QD-${Date.now()}`,
      soQuyetDinh: values.soQuyetDinh,
      ngayBanHanh: values.ngayBanHanh.toISOString(),
      trichYeu: values.trichYeu,
      soVanBangId: values.soVanBangId,
      luotTraCuu: values.luotTraCuu || 0, // Mặc định là 0 khi tạo mới
    };

    if (values.id) {
      setDanhSachQuyetDinh(danhSachQuyetDinh.map(qd => qd.id === values.id ? newQd : qd));
    } else {
      setDanhSachQuyetDinh([...danhSachQuyetDinh, newQd]);
    }
    
    message.success('Đã lưu thông tin Quyết định.');
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Số QĐ', dataIndex: 'soQuyetDinh', key: 'soQuyetDinh', width: '15%' },
    { 
      title: 'Ngày Ban Hành', 
      dataIndex: 'ngayBanHanh', 
      key: 'ngayBanHanh',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      width: '15%'
    },
    { title: 'Trích Yếu', dataIndex: 'trichYeu', key: 'trichYeu', ellipsis: true },
    { 
      title: 'Thuộc Sổ', 
      dataIndex: 'soVanBangId', 
      key: 'soVanBangId',
      render: (soId: string) => {
        const so = danhSachSoVanBang.find(s => s.id === soId);
        return so ? so.tenSo : <span style={{ color: 'red' }}>Lỗi: Không tìm thấy sổ</span>;
      }
    },
    { 
      title: 'Lượt Tra Cứu', 
      dataIndex: 'luotTraCuu', 
      key: 'luotTraCuu',
      align: 'center' as const,
      render: (luot: number) => <strong>{luot.toLocaleString()}</strong>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: QuyetDinh) => (
        <Space size="middle">
          <Button type="link" onClick={() => {
            form.setFieldsValue({
              ...record,
              ngayBanHanh: dayjs(record.ngayBanHanh)
            });
            setIsModalVisible(true);
          }}>Sửa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3>Danh mục Quyết Định Tốt Nghiệp</h3>
        <Button type="primary" onClick={() => { form.resetFields(); setIsModalVisible(true); }}>
          Thêm Quyết Định
        </Button>
      </div>

      <Table columns={columns} dataSource={danhSachQuyetDinh} rowKey="id" bordered pagination={{ pageSize: 10 }} />

      <Modal title="Thông tin Quyết định" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()} width={600}>
        <Form form={form} onFinish={handleAddOrUpdate} layout="vertical">
          <Form.Item name="id" hidden><Input /></Form.Item>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="soQuyetDinh" label="Số Quyết định" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="VD: 123/QĐ-ĐH" />
            </Form.Item>
            <Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true }]} style={{ flex: 1 }}>
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="trichYeu" label="Trích yếu nội dung" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="VD: V/v công nhận tốt nghiệp đại học hệ chính quy đợt 1 năm..." />
          </Form.Item>

          <Form.Item name="soVanBangId" label="Lưu trữ vào Sổ Văn Bằng" rules={[{ required: true }]}>
            <Select placeholder="Chọn sổ văn bằng để quản lý">
              {danhSachSoVanBang.map(so => (
                <Select.Option key={so.id} value={so.id} disabled={!so.dangSuDung}>
                  {so.tenSo} {so.dangSuDung ? '' : '(Đã khóa)'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};