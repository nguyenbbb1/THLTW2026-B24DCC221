import React, { createContext, useState } from 'react';
import { ConfigProvider, Tabs, Typography } from 'antd';
import KhamPhaDiemDen from './KhamPhaDiemDen';
import TaoLichTrinh from './TaoLichTrinh';
import QuanLyNganSach from './QuanLyNganSach';
import TrangQuanTri from './TrangQuanTri';
import { IAppContext, IDestination, IItineraryItem, IBudgetConfig } from './types';
import { initialDestinations } from './mockData';

const { Title } = Typography;
const { TabPane } = Tabs;

export const AppContext = createContext<IAppContext | null>(null);

const LapKeHoachDuLichApp: React.FC = () => {
    const [destinations, setDestinations] = useState<IDestination[]>(initialDestinations);
    const [itinerary, setItinerary] = useState<IItineraryItem[]>([]);
    const [budgetConfig, setBudgetConfig] = useState<IBudgetConfig>({ maxBudget: 10000000 });

    const contextValue: IAppContext = {
        destinations, setDestinations,
        itinerary, setItinerary,
        budgetConfig, setBudgetConfig
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#D93523',
                    borderRadius: 0,
                },
            }}
        >
            <AppContext.Provider value={contextValue}>
                <div style={{ padding: '20px', background: '#f4f7f9', minHeight: '80vh' }}>
                    <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderTop: '5px solid #D93523', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Title level={3} style={{ margin: 0, color: '#D93523' }}>Travel Planning System</Title>
                    </div>

                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Khám Phá Điểm Đến" key="1">
                            <KhamPhaDiemDen />
                        </TabPane>
                        <TabPane tab="Tạo Lịch Trình" key="2">
                            <TaoLichTrinh />
                        </TabPane>
                        <TabPane tab="Quản Lý Ngân Sách" key="3">
                            <QuanLyNganSach />
                        </TabPane>
                        <TabPane tab="Trang Quản Trị" key="4">
                            <TrangQuanTri />
                        </TabPane>
                    </Tabs>
                </div>
            </AppContext.Provider>
        </ConfigProvider>
    );
};

export default LapKeHoachDuLichApp;