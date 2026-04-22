import React, { useState } from 'react';
import { Table, Button, Space, Input, Tag, Popconfirm, Modal, Form, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Post, Tag as TagType } from './types';
import { getTagColor } from './SharedStyles';
import TinyEditor from '@/components/TinyEditor';

interface Props {
  posts: Post[];
  tags: TagType[];
  onAddPost: (post: Omit<Post, 'id' | 'views' | 'createdAt'>) => void;
  onEditPost: (id: string, post: Partial<Post>) => void;
  onDeletePost: (id: string) => void;
}

const QuanLyBaiViet: React.FC<Props> = ({ posts, tags, onAddPost, onEditPost, onDeletePost }) => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Dữ liệu bảng sau khi áp dụng tìm kiếm bằng Text
  const filteredData = posts.filter(post =>
    post.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenModal = (post?: Post) => {
    if (post) {
      setEditingId(post.id);
      form.setFieldsValue(post);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleFinish = (values: Omit<Post, 'id' | 'views' | 'createdAt'>) => {
    if (editingId) {
      onEditPost(editingId, values);
      message.success('Cập nhật bài viết thành công!');
    } else {
      onAddPost(values);
      message.success('Thêm bài viết mới thành công!');
    }
    setIsModalVisible(false);
  };

const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đã đăng', value: 'Đã đăng' },
        { text: 'Nháp', value: 'Nháp' },
      ],
      onFilter: (value: any, record: Post) => record.status === value,
      render: (status: string) => (
        <Tag color={status === 'Đã đăng' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (postTags: string[]) => (
        <Space wrap>
          {/* Áp dụng màu ngẫu nhiên nhưng cố định */}
          {postTags.map(tag => <Tag color={getTagColor(tag)} key={tag}>{tag}</Tag>)}
        </Space>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a: Post, b: Post) => a.views - b.views,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Post) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => {
              onDeletePost(record.id);
              message.success('Đã xóa bài viết.');
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <Input.Search
          placeholder="Tìm kiếm theo tiêu đề..."
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm bài viết mới
        </Button>
      </Space>

      <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title={editingId ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatarUrl" label="Ảnh đại diện (URL)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="Thẻ (Tags)">
            <Select mode="multiple" placeholder="Chọn thẻ">
              {tags.map(tag => <Select.Option key={tag.name} value={tag.name}>{tag.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="Nháp">
            <Select>
              <Select.Option value="Nháp">Nháp</Select.Option>
              <Select.Option value="Đã đăng">Đã đăng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="summary" label="Tóm tắt">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
            <TinyEditor height={400}/>
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

export default QuanLyBaiViet;