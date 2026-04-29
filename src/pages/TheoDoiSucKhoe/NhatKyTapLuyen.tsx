import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Popconfirm, Row, Col, Space, InputNumber, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Workout } from './types';
import { mockWorkouts } from './mockData';
import { styles } from './SharedStyles';

const { RangePicker } = DatePicker;

const NhatKyTapLuyen: React.FC = () => {
    const [data, setData] = useState<Workout[]>(mockWorkouts);
    const [filteredData, setFilteredData] = useState<Workout[]>(mockWorkouts);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
    const [form] = Form.useForm();

    const handleSearch = (value: string) => {
        const filtered = data.filter(w => w.notes.toLowerCase().includes(value.toLowerCase()) || w.type.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filtered);
    };

    const handleFilterType = (value: string) => {
        if (!value) return setFilteredData(data);
        setFilteredData(data.filter(w => w.type === value));
    };

    const handleDelete = (id: string) => {
        const newData = data.filter(w => w.id !== id);
        setData(newData);
        setFilteredData(newData);
    };

    const showModal = (record?: Workout) => {
        if (record) {
            setEditingWorkout(record);
            form.setFieldsValue({ ...record, date: moment(record.date) });
        } else {
            setEditingWorkout(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newWorkout: Workout = {
                ...values,
                id: editingWorkout ? editingWorkout.id : Math.random().toString(),
                date: values.date.format('YYYY-MM-DD'),
            };

            let newData = [...data];
            if (editingWorkout) {
                newData = newData.map(w => w.id === editingWorkout.id ? newWorkout : w);
            } else {
                newData.unshift(newWorkout);
            }
            setData(newData);
            setFilteredData(newData);
            setIsModalVisible(false);
        });
    };

    const columns = [
        { title: 'Ngày', dataIndex: 'date', key: 'date' },
        { title: 'Loại', dataIndex: 'type', key: 'type', render: (text: string) => <Tag color="blue">{text}</Tag> },
        { title: 'Thời lượng (p)', dataIndex: 'duration', key: 'duration' },
        { title: 'Calo', dataIndex: 'calories', key: 'calories' },
        { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (status: string) => <Tag color={status === 'Completed' ? 'green' : 'red'}>{status}</Tag>
        },
        {
            title: 'Hành động', key: 'action',
            render: (_: any, record: Workout) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ width: '100%' }}>
            <Card style={styles.card} title={<span style={styles.title}>Nhật ký tập luyện</span>}>
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={6}>
                        <Input placeholder="Tìm theo tên bài/ghi chú..." prefix={<SearchOutlined />} onChange={(e) => handleSearch(e.target.value)} />
                    </Col>
                    <Col span={6}>
                        <Select placeholder="Lọc theo loại" style={{ width: '100%' }} onChange={handleFilterType} allowClear>
                            <Select.Option value="Cardio">Cardio</Select.Option>
                            <Select.Option value="Strength">Strength</Select.Option>
                            <Select.Option value="Yoga">Yoga</Select.Option>
                            <Select.Option value="HIIT">HIIT</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <RangePicker style={{ width: '100%' }} />
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                        <button style={styles.button} onClick={() => showModal()}><PlusOutlined /> Thêm mới</button>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 5 }} bordered />
            </Card>

            <Modal title={editingWorkout ? "Sửa buổi tập" : "Thêm buổi tập"} visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)} okText="Lưu" cancelText="Hủy">
                <Form form={form} layout="vertical">
                    <Form.Item name="date" label="Ngày tập" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="type" label="Loại bài tập" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Cardio">Cardio</Select.Option>
                            <Select.Option value="Strength">Strength</Select.Option>
                            <Select.Option value="Yoga">Yoga</Select.Option>
                            <Select.Option value="HIIT">HIIT</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="calories" label="Calo đốt" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="notes" label="Ghi chú"><Input.TextArea rows={3} /></Form.Item>
                    <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Completed">Hoàn thành</Select.Option>
                            <Select.Option value="Missed">Bỏ lỡ</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NhatKyTapLuyen;