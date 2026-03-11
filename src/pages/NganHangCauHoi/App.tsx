import React from 'react';
import NganHangCauHoi from './index';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={viVN}>
      <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
        <NganHangCauHoi />
      </div>
    </ConfigProvider>
  );
};

export default App;