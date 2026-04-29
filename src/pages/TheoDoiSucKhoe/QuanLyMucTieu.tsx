import React, { useState } from 'react';
import { Card, Row, Col, Progress, Button, Drawer, Form, Input, Select, DatePicker, Popconfirm, Segmented, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Goal } from './types';
import { mockGoals } from './mockData';
import { styles } from './SharedStyles';

const QuanLyMucTieu: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
    const [filterStatus, setFilterStatus] = useState<string>('Tất cả');
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [form] = Form.useForm();

    const handleDelete = (id: string) => setGoals(goals.filter(g => g.id !== id));

    const handleAdd = () => {
        form.validateFields().then(values => {
            const newGoal: Goal = {
                ...values,
                id: Math.random().toString(),
                deadline: values.deadline.format('YYYY-MM-DD'),
                currentValue: 0
            };
            setGoals([newGoal, ...goals]);
            setIsDrawerVisible(false);
            form.resetFields();
        });
    };

    const updateCurrentValue = (id: string, value: number) => {
        setGoals(goals.map(g => g.id === id ? { ...g, currentValue: value } : g));
    };

    const filteredGoals = filterStatus === 'Tất cả' ? goals : goals.filter(g => g.status === filterStatus);

    return (
        <div style={{ width: '100%' }}>
            <Card style={styles.card} title={<span style={styles.title}>Quản lý mục tiêu</span>}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                    <Col>
                        <Segmented options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']} value={filterStatus} onChange={setFilterStatus as any} />
                    </Col>
                    <Col>
                        <button style={{ ...styles.button, width: 'auto', padding: '10px 20px' }} onClick={() => setIsDrawerVisible(true)}>
                            <PlusOutlined /> Thêm Mục Tiêu
                        </button>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    {filteredGoals.map(goal => {
                        const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                        return (
                            <Col xs={24} md={12} lg={8} key={goal.id}>
                                <Card type="inner" title={goal.name} extra={
                                    <Popconfirm title="Xóa?" onConfirm={() => handleDelete(goal.id)}>
                                        <Button type="text" danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                }>
                                    <p><b>Loại:</b> {goal.type}</p>
                                    <p><b>Hạn chót:</b> {goal.deadline}</p>
                                    <p><b>Trạng thái:</b> {goal.status}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <span><b>Hiện tại:</b></span>
                                        <InputNumber value={goal.currentValue} onChange={(v) => updateCurrentValue(goal.id, v || 0)} />
                                        <span>/ {goal.targetValue}</span>
                                    </div>
                                    <Progress percent={percent} status={percent >= 100 ? 'success' : 'active'} strokeColor="#D93523" />
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Card>

            <Drawer title="Thêm mục tiêu mới" width={400} onClose={() => setIsDrawerVisible(false)} visible={isDrawerVisible}
                extra={<Button onClick={handleAdd} type="primary" style={{ backgroundColor: '#D93523', border: 'none' }}>Lưu</Button>}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Giảm cân">Giảm cân</Select.Option>
                            <Select.Option value="Tăng cơ">Tăng cơ</Select.Option>
                            <Select.Option value="Cải thiện sức bền">Cải thiện sức bền</Select.Option>
                            <Select.Option value="Khác">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="targetValue" label="Giá trị mục tiêu (Kg, Km...)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="deadline" label="Hạn chót" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                    <Form.Item name="status" label="Trạng thái" initialValue="Đang thực hiện">
                        <Select>
                            <Select.Option value="Đang thực hiện">Đang thực hiện</Select.Option>
                            <Select.Option value="Đã đạt">Đã đạt</Select.Option>
                            <Select.Option value="Đã hủy">Đã hủy</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default QuanLyMucTieu;