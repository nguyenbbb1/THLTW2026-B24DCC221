import React, { useState } from 'react';
import { Table, Button, Modal, Select, Space } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { Application, Club } from './types';

interface Props {
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    clubs: Club[];
}

const QuanLyThanhVien: React.FC<Props> = ({ applications, setApplications, clubs }) => {
    const members = applications.filter(app => app.status === 'Approved');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [targetClubId, setTargetClubId] = useState<string>('');

    const handleTransfer = () => {
        setApplications(prev => prev.map(app => 
            selectedRowKeys.includes(app.id) ? { ...app, clubId: targetClubId } : app
        ));
        setTransferModalOpen(false);
        setSelectedRowKeys([]);
        setTargetClubId('');
    };

    const columns = [
        { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 120 },
        { title: 'CLB Hiện tại', dataIndex: 'clubId', key: 'clubId', render: (id: string) => clubs.find(c => c.id === id)?.name || id },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                {/* Thêm icon SwapOutlined cho nút chuyển CLB */}
                <Button type="primary" icon={<SwapOutlined />} disabled={selectedRowKeys.length === 0} onClick={() => setTransferModalOpen(true)}>
                    Chuyển CLB cho {selectedRowKeys.length} thành viên
                </Button>
            </Space>

            <Table 
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                dataSource={members} columns={columns} rowKey="id" bordered style={{ cursor: 'pointer' }} rowClassName={() => 'table-row-hover'}
            />

            <Modal title="Chuyển Câu Lạc Bộ Thành Viên" open={transferModalOpen} onOk={handleTransfer} onCancel={() => setTransferModalOpen(false)} okButtonProps={{ disabled: !targetClubId }}>
                <p>Bạn đang chọn đổi CLB cho <b>{selectedRowKeys.length}</b> thành viên đã chọn.</p>
                <Select style={{ width: '100%' }} placeholder="Chọn CLB chuyển đến" onChange={setTargetClubId} value={targetClubId || undefined}>
                    {clubs.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
                </Select>
            </Modal>
        </div>
    );
};

export default QuanLyThanhVien;