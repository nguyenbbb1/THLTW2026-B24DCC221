import React, { useState, useEffect } from 'react';
import { Employee, Service, Appointment } from './types';
import QuanLyNhanVien from './QuanLyNhanVien';
import QuanLyDichVu from './QuanLyDichVu'; // Import file mới tách
import QuanLyLichHenComponent from './QuanLyLichHen';
import DanhGiaDichVu from './DanhGiaDichVu';
import ThongKeBaoCao from './ThongKeBaoCao';

export const sharedStyles: Record<string, any> = {
  wrapper: { padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '0px',
    borderTop: '5px solid #D93523',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  navBar: { display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd', overflowX: 'auto', gap: '2px' },
  navButton: (active: boolean) => ({
    padding: '12px 24px',
    cursor: 'pointer',
    borderRadius: '0px',
    border: 'none',
    backgroundColor: active ? '#D93523' : 'transparent',
    color: active ? '#fff' : '#666',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    outline: 'none',
  }),
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '1px solid #d9d9d9',
    borderRadius: '0px',
    fontSize: '14px',
    outline: 'none',
  },
  btnPrimary: {
    backgroundColor: '#D93523',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '0px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  // Bổ sung nút Hủy (Secondary) màu xám đậm
  btnSecondary: {
    backgroundColor: '#595959',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '0px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionBtn: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px',
    fontSize: '13px',
  },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { borderBottom: '2px solid #f0f0f0', padding: '12px', textAlign: 'left', color: '#D93523', textTransform: 'uppercase', fontSize: '13px' },
  td: { borderBottom: '1px solid #f0f0f0', padding: '12px', fontSize: '14px' },
};

const QuanLyLichHenPage: React.FC = () => {
  // 1. Quản lý State tập trung
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Cập nhật lại các kiểu view (Tách nhanvien và dichvu)
  const [view, setView] = useState<'nhanvien' | 'dichvu' | 'lichhen' | 'danhgia' | 'thongke'>('nhanvien');

  // 2. Persistence & Initial Data
  useEffect(() => {
    const savedData = localStorage.getItem('booking_system_v2');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setEmployees(parsed.employees || []);
      setServices(parsed.services || []);
      setAppointments(parsed.appointments || []);
    } else {
      // Khởi tạo dữ liệu mẫu nếu chưa có
      setEmployees([
        { id: 'e1', name: 'Trần Nguyên', workSchedule: '', maxCustomersPerDay: 8, workSlots: [{day: 'Thứ 2', time: '08:00'}] },
      ]);
      setServices([
        { id: 's1', name: 'Tư vấn giải pháp', price: 500000, duration: 1, unit: 'giờ' },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('booking_system_v2', JSON.stringify({ employees, services, appointments }));
  }, [employees, services, appointments]);

  return (
    <div style={sharedStyles.wrapper}>
      <div style={sharedStyles.card}>
        <h2 style={{ color: '#262626', marginBottom: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Hệ Thống Quản Lý Lịch Hẹn
        </h2>

        {/* Navigation Tabs - Đã tách thành 5 Tab */}
        <div style={sharedStyles.navBar}>
          <button onClick={() => setView('nhanvien')} style={sharedStyles.navButton(view === 'nhanvien')}>
            1. Nhân sự & Lịch trình
          </button>
          <button onClick={() => setView('dichvu')} style={sharedStyles.navButton(view === 'dichvu')}>
            2. Danh mục dịch vụ
          </button>
          <button onClick={() => setView('lichhen')} style={sharedStyles.navButton(view === 'lichhen')}>
            3. Điều phối lịch hẹn
          </button>
          <button onClick={() => setView('danhgia')} style={sharedStyles.navButton(view === 'danhgia')}>
            4. Phản hồi khách hàng
          </button>
          <button onClick={() => setView('thongke')} style={sharedStyles.navButton(view === 'thongke')}>
            5. Báo cáo doanh thu
          </button>
        </div>

        {/* Render Components tương ứng */}
        <main style={{ marginTop: '20px' }}>
          {view === 'nhanvien' && (
            <QuanLyNhanVien 
              employees={employees} 
              setEmployees={setEmployees} 
            />
          )}

          {view === 'dichvu' && (
            <QuanLyDichVu 
              services={services} 
              setServices={setServices} 
            />
          )}

          {view === 'lichhen' && (
            <QuanLyLichHenComponent 
              appointments={appointments} 
              setAppointments={setAppointments} 
              employees={employees} 
              services={services} 
            />
          )}

          {view === 'danhgia' && (
            <DanhGiaDichVu 
              appointments={appointments} 
              setAppointments={setAppointments} 
              employees={employees} 
            />
          )}

          {view === 'thongke' && (
            <ThongKeBaoCao 
              appointments={appointments} 
              services={services} 
              employees={employees} 
            />
          )}
        </main>
      </div>
      
      <footer style={{ marginTop: '20px', textAlign: 'center', color: '#8c8c8c', fontSize: '12px' }}>
        © 2026 Quản lý lịch hẹn - Đồng bộ thiết kế v2.1
      </footer>
    </div>
  );
};

export default QuanLyLichHenPage;