import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, DatePicker, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Club } from './types';
import dayjs from 'dayjs';

interface Props {
    clubs: Club[];
    setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
}

const DanhSachCauLacBo: React.FC<Props> = ({ clubs, setClubs }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingClub, setEditingClub] = useState<Club | null>(null);
    const [form] = Form.useForm();

    const handleAddOrEdit = (values: any) => {
        const newData = { ...values, foundedDate: values.foundedDate.format('YYYY-MM-DD') };
        if (editingClub) {
            setClubs(clubs.map(c => c.id === editingClub.id ? { ...newData, id: editingClub.id } : c));
        } else {
            setClubs([...clubs, { ...newData, id: Date.now().toString() }]);
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDelete = (id: string) => {
        setClubs(clubs.filter(c => c.id !== id));
    };

    const columns = [
        { title: 'Ảnh', dataIndex: 'avatar', key: 'avatar', width: 80, align: 'center' },
        { title: 'Tên CLB', dataIndex: 'name', key: 'name', sorter: (a: Club, b: Club) => a.name.localeCompare(b.name) },
        { title: 'Ngày thành lập', dataIndex: 'foundedDate', key: 'foundedDate', width: 120 },
        { title: 'Chủ nhiệm', dataIndex: 'leader', key: 'leader' },
        { title: 'Hoạt động', dataIndex: 'isActive', key: 'isActive', width: 100, align: 'center', render: (val: boolean) => val ? 'Có' : 'Không' },
        {
            title: 'Thao tác', key: 'action', width: 220, align: 'center',
            render: (_: any, record: Club) => (
                <Space size="small">
                    {/* Cập nhật thành nút có khung (type="default") và icon */}
                    <Button 
                        size="small"
                        type="default" 
                        icon={<EditOutlined />} 
                        onClick={() => { setEditingClub(record); form.setFieldsValue({ ...record, foundedDate: dayjs(record.foundedDate) }); setIsModalVisible(true); }}
                        style={{ borderColor: '#d9d9d9' }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm title="Chắc chắn xóa CLB này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        {/* Cập nhật thành nút có khung (type="default") và icon */}
                        <Button 
                            size="small"
                            type="default" 
                            danger 
                            icon={<DeleteOutlined />}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* Thêm icon PlusOutlined cho nút thêm */}
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingClub(null); form.resetFields(); setIsModalVisible(true); }} style={{ marginBottom: 16 }}>Thêm Câu Lạc Bộ
            </Button>
            {/* Thêm hiệu ứng hover cho bảng */}
            <Table dataSource={clubs} columns={columns} rowKey="id" bordered style={{ cursor: 'pointer' }} rowClassName={() => 'table-row-hover'} />

            <Modal title={editingClub ? "Sửa CLB" : "Thêm CLB"} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={handleAddOrEdit}>
                    <Form.Item name="avatar" label="Ảnh đại diện (Emoji/URL)" rules={[{ required: true }]}><Input placeholder="Ví dụ: 💻 hoặc URL ảnh" /></Form.Item>
                    <Form.Item name="name" label="Tên Câu lạc bộ" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="foundedDate" label="Ngày thành lập" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="description" label="Mô tả (HTML)" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
                    <Form.Item name="leader" label="Chủ nhiệm" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="isActive" label="Hoạt động" valuePropName="checked" initialValue={true}><Switch /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DanhSachCauLacBo;