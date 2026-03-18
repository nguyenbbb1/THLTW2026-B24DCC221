import React from 'react';
import { Appointment, Service, Employee } from './types';
import { sharedStyles } from './index';

interface Props {
  appointments: Appointment[];
  services: Service[];
  employees: Employee[];
}

const ThongKeBaoCao: React.FC<Props> = ({ appointments, services, employees }) => {
  // Lọc các lịch hẹn đã hoàn thành để tính doanh thu thực tế
  const completedApps = appointments.filter((a) => a.status === 'Completed');

  // 1. Tính tổng doanh thu
  const totalRevenue = completedApps.reduce((sum, app) => {
    const service = services.find((s) => s.id === app.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  // 2. Tính hiệu suất nhân viên (Số lịch đã xong / Tổng lịch được giao)
  const getEmployeePerformance = (empId: string) => {
    const total = appointments.filter((a) => a.employeeId === empId).length;
    const done = appointments.filter((a) => a.employeeId === empId && a.status === 'Completed').length;
    return total > 0 ? ((done / total) * 100).toFixed(0) : 0;
  };

  return (
    <div>
      <h3 style={{ borderLeft: '4px solid #D93523', paddingLeft: '10px', color: '#262626', marginBottom: '20px' }}>
        BÁO CÁO DOANH THU & HIỆU SUẤT
      </h3>

      {/* Ô thông số tổng quát (Giống goalBox trang học tập) */}
      <div style={{
        padding: '30px',
        textAlign: 'center',
        marginBottom: '30px',
        backgroundColor: totalRevenue > 0 ? '#f6ffed' : '#fff1f0',
        border: `1px solid ${totalRevenue > 0 ? '#b7eb8f' : '#ffa39e'}`,
        color: totalRevenue > 0 ? '#389e0d' : '#cf1322',
        borderRadius: '0px',
      }}>
        <h3 style={{ margin: 0, textTransform: 'uppercase' }}>Tổng doanh thu thực tế</h3>
        <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>
          {totalRevenue.toLocaleString()} VND
        </p>
        <p style={{ margin: 0, fontWeight: '600' }}>
          Dựa trên {completedApps.length} lịch hẹn đã hoàn thành
        </p>
      </div>

      {/* Bảng thống kê chi tiết theo nhân viên (Giống bảng phân chia môn học) */}
      <h4 style={{ color: '#D93523', fontWeight: 'bold', marginBottom: '10px' }}>
        PHÂN TÍCH HIỆU SUẤT NHÂN VIÊN
      </h4>
      <table style={sharedStyles.table}>
        <thead>
          <tr>
            <th style={sharedStyles.th}>Tên nhân viên</th>
            <th style={sharedStyles.th}>Số lịch đã xong</th>
            <th style={sharedStyles.th}>Doanh thu mang lại</th>
            <th style={sharedStyles.th}>Tỷ lệ hoàn thành</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const empApps = completedApps.filter((a) => a.employeeId === emp.id);
            const empRevenue = empApps.reduce((sum, app) => {
              const s = services.find((ser) => ser.id === app.serviceId);
              return sum + (s?.price || 0);
            }, 0);
            const performance = getEmployeePerformance(emp.id);

            return (
              <tr key={emp.id}>
                <td style={sharedStyles.td}><strong>{emp.name}</strong></td>
                <td style={sharedStyles.td}>{empApps.length} lượt</td>
                <td style={sharedStyles.td}>{empRevenue.toLocaleString()}đ</td>
                <td style={sharedStyles.td}>
                  <span style={{
                    fontSize: '12px',
                    color: Number(performance) >= 80 ? '#389e0d' : '#faad14',
                    fontWeight: 'bold'
                  }}>
                    ● {performance}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Thống kê dịch vụ phổ biến */}
      <div style={{ marginTop: '40px' }}>
        <h4 style={{ color: '#D93523', fontWeight: 'bold', marginBottom: '10px' }}>
          DỊCH VỤ ĐƯỢC ƯA CHUỘNG NHẤT
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {services.map(s => {
            const count = completedApps.filter(a => a.serviceId === s.id).length;
            return (
              <div key={s.id} style={{
                padding: '15px',
                border: '1px solid #d9d9d9',
                minWidth: '150px',
                backgroundColor: '#fff'
              }}>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{s.name}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#D93523' }}>
                  {count} lượt
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThongKeBaoCao;