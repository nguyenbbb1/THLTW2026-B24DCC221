import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Tag } from './types';

interface Props {
  tags: Tag[];
  onAddTag: (name: string) => void;
  onEditTag: (id: string, name: string) => void;
  onDeleteTag: (id: string) => void;
}

const QuanLyThe: React.FC<Props> = ({ tags, onAddTag, onEditTag, onDeleteTag }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingId(tag.id);
      form.setFieldsValue({ name: tag.name });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleFinish = (values: { name: string }) => {
    if (editingId) {
      onEditTag(editingId, values.name);
      message.success('Đã cập nhật thẻ!');
    } else {
      onAddTag(values.name);
      message.success('Đã thêm thẻ mới!');
    }
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số bài viết đang sử dụng',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Tag) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm
            title="Xóa thẻ này sẽ không xóa bài viết. Tiếp tục?"
            onConfirm={() => {
              onDeleteTag(record.id);
              message.success('Đã xóa thẻ.');
            }}
          >
            <Button danger icon={<DeleteOutlined />} disabled={record.count > 0} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()} style={{ marginBottom: 16 }}>
        Thêm thẻ mới
      </Button>

      <Table columns={columns} dataSource={tags} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title={editingId ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên thẻ" rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Lưu</Button>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default QuanLyThe;