import React, { useState } from 'react';
import { Tabs, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import { Club, Application, HistoryLog } from './types';
import DanhSachCauLacBo from './DanhSachCauLacBo';
import QuanLyDonDangKy from './QuanLyDonDangKy';
import QuanLyThanhVien from './QuanLyThanhVien';
import BaoCaoThongKe from './BaoCaoThongKe';

const { TabPane } = Tabs; // Trích xuất TabPane để tương thích với AntD v4

const QuanLyCauLacBo: React.FC = () => {
    // 1. Khởi tạo Dữ liệu giả lập (State)
    const [clubs, setClubs] = useState<Club[]>([
        { id: 'C1', avatar: '💻', name: 'CLB Lập Trình', foundedDate: '2020-01-01', description: '<b>Code</b> and build.', leader: 'Nguyễn Văn A', isActive: true },
        { id: 'C2', avatar: '🎸', name: 'CLB Âm Nhạc', foundedDate: '2021-05-15', description: 'Âm nhạc kết nối.', leader: 'Trần Thị B', isActive: true },
    ]);

    const [applications, setApplications] = useState<Application[]>([
        { id: 'A1', fullName: 'Lê Văn C', email: 'c@gmail.com', phone: '0123456789', gender: 'Nam', address: 'Hà Nội', strengths: 'ReactJS', clubId: 'C1', reason: 'Muốn học hỏi', status: 'Pending' },
        { id: 'A2', fullName: 'Phạm Thị D', email: 'd@gmail.com', phone: '0987654321', gender: 'Nữ', address: 'Hà Nội', strengths: 'Hát', clubId: 'C2', reason: 'Đam mê', status: 'Approved' },
    ]);

    const [histories, setHistories] = useState<HistoryLog[]>([]);

    const addHistory = (action: string, details: string) => {
        setHistories(prev => [{
            id: Date.now().toString(),
            action,
            timestamp: dayjs().format('HH:mm DD/MM/YYYY'),
            details
        }, ...prev]);
    };

    // 2. Cấu hình CSS-in-JS nâng cấp (Đã xóa Times New Roman, cải thiện bóng đổ và khoảng cách)
    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '80vh',
            backgroundColor: '#f4f7f9',
            padding: '20px',
        },
        card: {
            width: '100%',
            maxWidth: '1200px',
            backgroundColor: '#fff',
            padding: '50px', // Tăng khoảng cách trong card
            borderRadius: '0px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.08)', // Tăng bóng đổ tinh tế hơn
            borderTop: '5px solid #D93523',
        },
        title: { 
            fontSize: '28px', // Tăng kích thước tiêu đề
            fontWeight: '700', 
            color: '#2c3e50', 
            marginBottom: '40px', // Tăng khoảng cách dưới tiêu đề
            textAlign: 'center',
            textTransform: 'uppercase'
        },
        // Tùy chỉnh thanh Tabs AntD v4 thông qua CSS nội tuyến (Tạo phong cách Tabs hiện đại hơn)
        tabs: {
            background: '#fff',
            borderBottom: 'none',
        },
    };

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#D93523', borderRadius: 0 } }}>
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Hệ Thống Quản Lý Câu Lạc Bộ</h1>
                    
                    {/* Sử dụng cú pháp TabPane và tùy chỉnh Tabs AntD v4 bằng CSS nội tuyến */}
                    <Tabs defaultActiveKey="1" style={styles.tabs} destroyInactiveTabPane={false}>
                        <TabPane tab="Danh sách CLB" key="1">
                            <DanhSachCauLacBo clubs={clubs} setClubs={setClubs} />
                        </TabPane>
                        
                        <TabPane tab="Đơn Đăng Ký" key="2">
                            <QuanLyDonDangKy applications={applications} setApplications={setApplications} clubs={clubs} addHistory={addHistory} histories={histories} />
                        </TabPane>
                        
                        <TabPane tab="Thành Viên" key="3">
                            <QuanLyThanhVien applications={applications} setApplications={setApplications} clubs={clubs} />
                        </TabPane>
                        
                        <TabPane tab="Báo Cáo & Thống Kê" key="4">
                            <BaoCaoThongKe clubs={clubs} applications={applications} />
                        </TabPane>
                    </Tabs>
                    
                </div>
            </div>
        </ConfigProvider>
    );
};

export default QuanLyCauLacBo;