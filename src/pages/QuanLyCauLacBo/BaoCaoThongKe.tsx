import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { TeamOutlined, HourglassOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Club, Application } from './types';

interface Props {
    clubs: Club[];
    applications: Application[];
}

const BaoCaoThongKe: React.FC<Props> = ({ clubs, applications }) => {
    const pending = applications.filter(a => a.status === 'Pending').length;
    const approved = applications.filter(a => a.status === 'Approved').length;
    const rejected = applications.filter(a => a.status === 'Rejected').length;

    // Chuẩn bị dữ liệu cho biểu đồ (Đã tối ưu logic)
    const chartData = clubs.map(club => {
        const clubApps = applications.filter(a => a.clubId === club.id);
        return {
            name: club.name,
            Pending: clubApps.filter(a => a.status === 'Pending').length,
            Approved: clubApps.filter(a => a.status === 'Approved').length,
            Rejected: clubApps.filter(a => a.status === 'Rejected').length,
        };
    });

    // Tính toán giá trị max thực tế để biểu đồ không quá thấp
    const maxVal = Math.max(...chartData.flatMap(d => [d.Pending, d.Approved, d.Rejected]), 1);

    return (
        <div>
            {/* Tăng gutter để các statistic rộng rãi hơn */}
            <Row gutter={24} style={{ marginBottom: 40 }}>
                {/* Thêm icon và màu sắc cho các statistic */}
                <Col span={6}>
                    <Card bordered={false} bodyStyle={{ padding: '24px 20px', background: '#e6f7ff', borderLeft: '5px solid #1890ff' }}>
                        <Statistic title="Tổng số Câu lạc bộ" value={clubs.length} valueStyle={{ color: '#1890ff' }} prefix={<TeamOutlined style={{ marginRight: 8 }} />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} bodyStyle={{ padding: '24px 20px', background: '#fffbe6', borderLeft: '5px solid #faad14' }}>
                        <Statistic title="Đơn Chờ duyệt" value={pending} valueStyle={{ color: '#faad14' }} prefix={<HourglassOutlined style={{ marginRight: 8 }} />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} bodyStyle={{ padding: '24px 20px', background: '#f6ffed', borderLeft: '5px solid #52c41a' }}>
                        <Statistic title="Đơn Đã duyệt" value={approved} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined style={{ marginRight: 8 }} />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} bodyStyle={{ padding: '24px 20px', background: '#fff1f0', borderLeft: '5px solid #f5222d' }}>
                        <Statistic title="Đơn Từ chối" value={rejected} valueStyle={{ color: '#f5222d' }} prefix={<StopOutlined style={{ marginRight: 8 }} />} />
                    </Card>
                </Col>
            </Row>

            {/* Thêm bóng đổ cho card biểu đồ */}
            <Card title="Biểu đồ Thống kê Số lượng Đơn đăng ký theo từng Câu lạc bộ" bordered={false} style={{ boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                {/* Tăng chiều cao biểu đồ và thêm bóng đổ cho các cột */}
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '280px', gap: '20px', paddingBottom: '10px', borderBottom: '1px solid #e8e8e8' }}>
                    {chartData.map(data => (
                        <div key={data.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '230px', width: '100%', justifyContent: 'center' }}>
                                {/* Cột Pending - Thêm bóng đổ tinh tế */}
                                <div style={{ width: '22px', backgroundColor: '#faad14', height: `${(data.Pending / maxVal) * 100}%`, position: 'relative', boxShadow: '2px 0 5px rgba(250, 173, 20, 0.2)' }}>
                                    <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', fontWeight: 'bold', color: '#faad14' }}>{data.Pending}</span>
                                </div>
                                {/* Cột Approved - Thêm bóng đổ tinh tế */}
                                <div style={{ width: '22px', backgroundColor: '#52c41a', height: `${(data.Approved / maxVal) * 100}%`, position: 'relative', boxShadow: '2px 0 5px rgba(82, 196, 26, 0.2)' }}>
                                    <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', fontWeight: 'bold', color: '#52c41a' }}>{data.Approved}</span>
                                </div>
                                {/* Cột Rejected - Thêm bóng đổ tinh tế */}
                                <div style={{ width: '22px', backgroundColor: '#f5222d', height: `${(data.Rejected / maxVal) * 100}%`, position: 'relative', boxShadow: '2px 0 5px rgba(245, 34, 45, 0.2)' }}>
                                    <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', fontWeight: 'bold', color: '#f5222d' }}>{data.Rejected}</span>
                                </div>
                            </div>
                            <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#2c3e50' }}>{data.name}</div>
                        </div>
                    ))}
                </div>
                {/* Cải thiện hiển thị chú giải */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
                    <span style={{ fontSize: '13px' }}><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#faad14', marginRight: '8px' }}></span>Đơn Chờ duyệt</span>
                    <span style={{ fontSize: '13px' }}><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#52c41a', marginRight: '8px' }}></span>Đơn Đã duyệt</span>
                    <span style={{ fontSize: '13px' }}><span style={{ display: 'inline-block', width: '14px', height: '14px', background: '#f5222d', marginRight: '8px' }}></span>Đơn Từ chối</span>
                </div>
            </Card>
        </div>
    );
};

export default BaoCaoThongKe;