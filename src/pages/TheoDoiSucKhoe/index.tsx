import React from 'react';
import { Tabs } from 'antd';
import { DashboardOutlined, ScheduleOutlined, HeartOutlined, AimOutlined, BookOutlined } from '@ant-design/icons';
import { styles } from './SharedStyles';
import Dashboard from './Dashboard';
import NhatKyTapLuyen from './NhatKyTapLuyen';
import NhatKySucKhoe from './NhatKySucKhoe';
import QuanLyMucTieu from './QuanLyMucTieu';
import ThuVienBaiTap from './ThuVienBaiTap';

const { TabPane } = Tabs;

const TheoDoiSucKhoeApp: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={{ width: '100%', maxWidth: '1200px' }}>
                <h1 style={{ ...styles.title, textAlign: 'center', marginBottom: '30px' }}>
                    ỨNG DỤNG THEO DÕI SỨC KHỎE
                </h1>

                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab={<span><DashboardOutlined /> Dashboard</span>} key="1">
                        <Dashboard />
                    </TabPane>
                    <TabPane tab={<span><ScheduleOutlined /> Nhật ký tập luyện</span>} key="2">
                        <NhatKyTapLuyen />
                    </TabPane>
                    <TabPane tab={<span><HeartOutlined /> Nhật ký sức khỏe</span>} key="3">
                        <NhatKySucKhoe />
                    </TabPane>
                    <TabPane tab={<span><AimOutlined /> Quản lý mục tiêu</span>} key="4">
                        <QuanLyMucTieu />
                    </TabPane>
                    <TabPane tab={<span><BookOutlined /> Thư viện bài tập</span>} key="5">
                        <ThuVienBaiTap />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default TheoDoiSucKhoeApp;