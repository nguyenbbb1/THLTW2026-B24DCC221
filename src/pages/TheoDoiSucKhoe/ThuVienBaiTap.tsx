import React, { useState } from 'react';
import { Card, Row, Col, Input, Select, Tag, Modal, Button, Popconfirm } from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Exercise } from './types';
import { mockExercises } from './mockData';
import { styles } from './SharedStyles';

const ThuVienBaiTap: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMuscle, setFilterMuscle] = useState<string | undefined>(undefined);
    const [filterDiff, setFilterDiff] = useState<string | undefined>(undefined);
    const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);

    const getDifficultyColor = (diff: string) => {
        if (diff === 'Dễ') return 'green';
        if (diff === 'Trung bình') return 'gold';
        return 'red';
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExercises(exercises.filter(ex => ex.id !== id));
    };

    const filteredExercises = exercises.filter(ex => {
        const matchName = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchMuscle = filterMuscle ? ex.muscleGroup === filterMuscle : true;
        const matchDiff = filterDiff ? ex.difficulty === filterDiff : true;
        return matchName && matchMuscle && matchDiff;
    });

    return (
        <div style={{ width: '100%' }}>
            <Card style={styles.card} title={<span style={styles.title}>Thư viện bài tập</span>}>
                <Row gutter={16} style={{ marginBottom: 20 }}>
                    <Col span={8}>
                        <Input placeholder="Tìm tên bài tập..." prefix={<SearchOutlined />} onChange={e => setSearchTerm(e.target.value)} />
                    </Col>
                    <Col span={8}>
                        <Select placeholder="Nhóm cơ" style={{ width: '100%' }} onChange={setFilterMuscle} allowClear>
                            {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'].map(m => <Select.Option key={m} value={m}>{m}</Select.Option>)}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select placeholder="Độ khó" style={{ width: '100%' }} onChange={setFilterDiff} allowClear>
                            <Select.Option value="Dễ">Dễ</Select.Option>
                            <Select.Option value="Trung bình">Trung bình</Select.Option>
                            <Select.Option value="Khó">Khó</Select.Option>
                        </Select>
                    </Col>
                </Row>

                <Row gutter={[16, 16]}>
                    {filteredExercises.map(ex => (
                        <Col xs={24} sm={12} md={8} key={ex.id}>
                            <Card hoverable onClick={() => setSelectedEx(ex)}
                                actions={[
                                    <EyeOutlined key="view" onClick={() => setSelectedEx(ex)} />,
                                    <Popconfirm title="Xóa bài tập này?" onConfirm={(e) => handleDelete(ex.id, e as any)}>
                                        <DeleteOutlined key="delete" style={{ color: 'red' }} onClick={e => e.stopPropagation()} />
                                    </Popconfirm>
                                ]}
                            >
                                <Card.Meta
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            {ex.name}
                                            <Tag color={getDifficultyColor(ex.difficulty)}>{ex.difficulty}</Tag>
                                        </div>
                                    }
                                    description={
                                        <>
                                            <p style={{ margin: '5px 0' }}><b>Nhóm cơ:</b> {ex.muscleGroup}</p>
                                            <p style={{ margin: '5px 0', color: '#666' }}>{ex.description}</p>
                                            <p style={{ margin: 0 }}>🔥 {ex.caloriesPerHour} calo/giờ</p>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>

            <Modal title={selectedEx?.name} visible={!!selectedEx} onCancel={() => setSelectedEx(null)} footer={[<Button key="close" onClick={() => setSelectedEx(null)}>Đóng</Button>]}>
                {selectedEx && (
                    <div>
                        <div style={{ marginBottom: 15 }}>
                            <Tag color={getDifficultyColor(selectedEx.difficulty)}>{selectedEx.difficulty}</Tag>
                            <Tag color="blue">{selectedEx.muscleGroup}</Tag>
                            <Tag color="orange">{selectedEx.caloriesPerHour} calo/giờ</Tag>
                        </div>
                        <p><b>Mô tả:</b> {selectedEx.description}</p>
                        <div style={{ background: '#f4f7f9', padding: 15, borderRadius: 5 }}>
                            <h4>Hướng dẫn thực hiện:</h4>
                            <p style={{ whiteSpace: 'pre-line' }}>{selectedEx.instructions}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ThuVienBaiTap;