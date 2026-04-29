import React from 'react';
import { Row, Col, Card, Statistic, Timeline } from 'antd';
import { FireOutlined, CalendarOutlined, TrophyOutlined, SyncOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { styles } from './SharedStyles';
import { mockWorkouts, mockHealthMetrics } from './mockData';

const Dashboard: React.FC = () => {
    // Xử lý dữ liệu biểu đồ cột (Số buổi tập trong tháng theo tuần - Giả lập 4 tuần)
    const barChartOptions = {
        chart: { type: 'bar' as const, toolbar: { show: false } },
        colors: ['#D93523'],
        xaxis: { categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'] },
    };
    const barChartSeries = [{ name: 'Số buổi tập', data: [3, 4, 2, 5] }];

    // Xử lý dữ liệu biểu đồ đường (Cân nặng)
    const lineChartOptions = {
        chart: { type: 'line' as const, toolbar: { show: false } },
        colors: ['#2c3e50'],
        stroke: { curve: 'smooth' as const },
        xaxis: { categories: mockHealthMetrics.map(m => m.date) },
    };
    const lineChartSeries = [{ name: 'Cân nặng (kg)', data: mockHealthMetrics.map(m => m.weight) }];

    return (
        <div style={{ width: '100%' }}>
            {/* 4 Thẻ Chỉ Số Nhanh */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ ...styles.card, padding: 15 }}>
                        <Statistic title="Buổi tập tháng này" value={14} prefix={<CalendarOutlined />} valueStyle={{ color: '#D93523' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ ...styles.card, padding: 15 }}>
                        <Statistic title="Calo đã đốt" value={4500} prefix={<FireOutlined />} valueStyle={{ color: '#faad14' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ ...styles.card, padding: 15 }}>
                        <Statistic title="Streak (Ngày liên tiếp)" value={5} prefix={<SyncOutlined spin />} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ ...styles.card, padding: 15 }}>
                        <Statistic title="Mục tiêu hoàn thành" value={65} suffix="%" prefix={<TrophyOutlined />} valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Biểu đồ */}
                <Col xs={24} md={16}>
                    <Card style={styles.card} title={<span style={styles.title}>Thống kê hoạt động</span>}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <h4>Số buổi tập theo tuần</h4>
                                <ReactApexChart options={barChartOptions} series={barChartSeries} type="bar" height={250} />
                            </Col>
                            <Col span={12}>
                                <h4>Thay đổi cân nặng</h4>
                                <ReactApexChart options={lineChartOptions} series={lineChartSeries} type="line" height={250} />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Timeline */}
                <Col xs={24} md={8}>
                    <Card style={{ ...styles.card, textAlign: 'left' }} title={<span style={styles.title}>5 buổi tập gần nhất</span>}>
                        <Timeline>
                            {mockWorkouts.slice(0, 5).map(w => (
                                <Timeline.Item key={w.id} color={w.status === 'Completed' ? 'green' : 'red'}>
                                    <p><b>{w.date}</b> - {w.type}</p>
                                    <p>{w.duration} phút | {w.calories} calo</p>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;