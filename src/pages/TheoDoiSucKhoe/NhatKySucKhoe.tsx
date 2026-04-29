import React, { useState } from 'react';
import { Table, Button, Modal, Form, DatePicker, Popconfirm, Space, InputNumber, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { HealthMetric } from './types';
import { mockHealthMetrics } from './mockData';
import { styles } from './SharedStyles';

const NhatKySucKhoe: React.FC = () => {
    const [data, setData] = useState<HealthMetric[]>(mockHealthMetrics);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
    const [form] = Form.useForm();

    const getBMITag = (bmi: number) => {
        if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
        if (bmi <= 24.9) return <Tag color="green">Bình thường</Tag>;
        if (bmi <= 29.9) return <Tag color="gold">Thừa cân</Tag>;
        return <Tag color="red">Béo phì</Tag>;
    };

    const handleDelete = (id: string) => setData(data.filter(d => d.id !== id));

    const showModal = (record?: HealthMetric) => {
        if (record) {
            setEditingMetric(record);
            form.setFieldsValue({ ...record, date: moment(record.date) });
        } else {
            setEditingMetric(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleValuesChange = (changedValues: any, allValues: any) => {
        if (allValues.weight && allValues.height) {
            const heightInMeter = allValues.height / 100;
            const bmi = parseFloat((allValues.weight / (heightInMeter * heightInMeter)).toFixed(2));
            form.setFieldsValue({ bmi });
        }
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            const newMetric: HealthMetric = {
                ...values,
                id: editingMetric ? editingMetric.id : Math.random().toString(),
                date: values.date.format('YYYY-MM-DD'),
            };
            let newData = [...data];
            if (editingMetric) newData = newData.map(d => d.id === editingMetric.id ? newMetric : d);
            else newData.unshift(newMetric);
            setData(newData);
            setIsModalVisible(false);
        });
    };

    const columns = [
        { title: 'Ngày', dataIndex: 'date', key: 'date' },
        { title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
        { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
        { title: 'BMI', dataIndex: 'bmi', key: 'bmi', render: (val: number) => <>{val} {getBMITag(val)}</> },
        { title: 'Nhịp tim nghỉ (bpm)', dataIndex: 'restingHeartRate', key: 'restingHeartRate' },
        { title: 'Giờ ngủ', dataIndex: 'sleepHours', key: 'sleepHours' },
        {
            title: 'Hành động', key: 'action',
            render: (_: any, record: HealthMetric) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Popconfirm title="Xóa chỉ số này?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ width: '100%' }}>
            <Card style={styles.card} title={<span style={styles.title}>Nhật ký chỉ số sức khỏe</span>}>
                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <button style={{ ...styles.button, width: 'auto', padding: '10px 20px' }} onClick={() => showModal()}>
                        <PlusOutlined /> Thêm mới
                    </button>
                </div>
                <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 5 }} bordered />
            </Card>

            <Modal title={editingMetric ? "Sửa chỉ số" : "Thêm chỉ số"} visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
                <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
                    <Form.Item name="date" label="Ngày ghi nhận" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="bmi" label="Chỉ số BMI (Tự động)"><InputNumber disabled style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="restingHeartRate" label="Nhịp tim lúc nghỉ (bpm)"><InputNumber style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="sleepHours" label="Giờ ngủ (tiếng)"><InputNumber style={{ width: '100%' }} /></Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NhatKySucKhoe;