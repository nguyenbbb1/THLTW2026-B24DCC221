import React, { useState } from 'react';
import { Table, Button, Space, Modal, Tag, Input } from 'antd';
import { CheckOutlined, CloseOutlined, HistoryOutlined } from '@ant-design/icons';
import { Application, Club, HistoryLog } from './types';

interface Props {
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    clubs: Club[];
    addHistory: (action: string, details: string) => void;
    histories: HistoryLog[];
}

const QuanLyDonDangKy: React.FC<Props> = ({ applications, setApplications, clubs, addHistory, histories }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [rejectModalvisible, setRejectModalvisible] = useState(false);
    const [historyModalvisible, setHistoryModalvisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [targetApps, setTargetApps] = useState<string[]>([]);

    const handleApprove = (ids: string[]) => {
        setApplications(prev => prev.map(app => ids.includes(app.id) ? { ...app, status: 'Approved' } : app));
        addHistory('Duyệt đơn', `Đã duyệt ${ids.length} đơn đăng ký (ID: ${ids.join(', ')})`);
        setSelectedRowKeys([]);
    };

    const handleRejectClick = (ids: string[]) => {
        setTargetApps(ids);
        setRejectModalvisible(true);
    };

    const confirmReject = () => {
        setApplications(prev => prev.map(app => targetApps.includes(app.id) ? { ...app, status: 'Rejected', note: rejectReason } : app));
        addHistory('Từ chối đơn', `Đã từ chối ${targetApps.length} đơn với lý do: ${rejectReason}`);
        setRejectModalvisible(false);
        setRejectReason('');
        setSelectedRowKeys([]);
    };

    const columns = [
        { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 120 },
        { title: 'CLB', dataIndex: 'clubId', key: 'clubId', render: (id: string) => clubs.find(c => c.id === id)?.name || id },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 100, align: 'center',
            render: (status: string) => {
                const color = status === 'Approved' ? 'green' : status === 'Rejected' ? 'red' : 'orange';
                return <Tag color={color} style={{ marginRight: 0 }}>{status}</Tag>;
            }
        },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        {
            title: 'Thao tác', key: 'action', width: 200, align: 'center',
            render: (_: any, record: Application) => (
                <Space size="small">
                    {/* Cập nhật thành nút có khung (type="default") và icon CheckOutlined */}
                    <Button 
                        size="small"
                        type="default" 
                        disabled={record.status !== 'Pending'} 
                        icon={<CheckOutlined />} 
                        onClick={() => handleApprove([record.id])}
                        style={{ borderColor: record.status === 'Pending' ? '#d9d9d9' : '#f5f5f5' }}
                    >
                        Duyệt
                    </Button>
                    {/* Cập nhật thành nút có khung (type="default") và icon CloseOutlined */}
                    <Button 
                        size="small"
                        type="default" 
                        danger 
                        disabled={record.status !== 'Pending'} 
                        icon={<CloseOutlined />} 
                        onClick={() => handleRejectClick([record.id])}
                    >
                        Từ chối
                    </Button>
                </Space>
            ),
        },
    ];

    const historyColumns = [
        { title: 'Thời gian', dataIndex: 'timestamp', key: 'timestamp', width: 150 },
        { title: 'Hành động', dataIndex: 'action', key: 'action', width: 120 },
        { title: 'Chi tiết', dataIndex: 'details', key: 'details' },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                {/* Thêm icon CheckOutlined và CloseOutlined cho các nút thao tác hàng loạt */}
                <Button type="primary" icon={<CheckOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleApprove(selectedRowKeys as string[])}>
                    Duyệt {selectedRowKeys.length} đơn đã chọn
                </Button>
                <Button danger type="primary" icon={<CloseOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => handleRejectClick(selectedRowKeys as string[])}>
                    Từ chối {selectedRowKeys.length} đơn đã chọn
                </Button>
                {/* Thêm icon HistoryOutlined cho nút lịch sử */}
                <Button icon={<HistoryOutlined />} onClick={() => setHistoryModalvisible(true)}>Xem lịch sử duyệt</Button>
            </Space>

            <Table 
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                dataSource={applications} columns={columns} rowKey="id" bordered style={{ cursor: 'pointer' }} rowClassName={() => 'table-row-hover'}
            />

            <Modal title="Lý do từ chối đơn" visible={rejectModalvisible} onOk={confirmReject} onCancel={() => setRejectModalvisible(false)} okButtonProps={{ disabled: !rejectReason.trim() }}>
                <Input.TextArea rows={4} placeholder="Bắt buộc nhập lý do từ chối đơn này..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            </Modal>

            <Modal title="Lịch sử thao tác duyệt/từ chối" visible={historyModalvisible} onCancel={() => setHistoryModalvisible(false)} footer={null} width={700}>
                <Table dataSource={histories} columns={historyColumns} rowKey="id" size="small" bordered />
            </Modal>
        </div>
    );
};

export default QuanLyDonDangKy;