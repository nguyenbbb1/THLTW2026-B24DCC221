import React from 'react';
import { Appointment, Employee } from './types';
import { sharedStyles } from './index';

interface Props {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  employees: Employee[];
}

const DanhGiaDichVu: React.FC<Props> = ({ appointments, setAppointments, employees }) => {
  
  // Hàm cập nhật đánh giá và phản hồi
  const handleRate = (id: string, rating: number, comment: string) => {
    setAppointments(
      appointments.map((a) =>
        a.id === id ? { ...a, rating, comment } : a
      )
    );
  };

  // Chỉ lọc những lịch hẹn đã hoàn thành để hiển thị trong danh sách đánh giá
  const completedAppointments = appointments.filter(a => a.status === 'Completed');

  return (
    <div>
      <h3 style={{ borderLeft: '4px solid #D93523', paddingLeft: '10px', color: '#262626', marginBottom: '20px' }}>
        PHẢN HỒI & ĐÁNH GIÁ DỊCH VỤ
      </h3>

      {completedAppointments.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#8c8c8c', border: '1px dashed #d9d9d9' }}>
          Chưa có lịch hẹn nào hoàn thành để thực hiện đánh giá.
        </div>
      ) : (
        <table style={sharedStyles.table}>
          <thead>
            <tr>
              <th style={sharedStyles.th}>Khách hàng</th>
              <th style={sharedStyles.th}>Nhân viên phụ trách</th>
              <th style={sharedStyles.th}>Đánh giá (Sao)</th>
              <th style={sharedStyles.th}>Nội dung phản hồi</th>
              <th style={sharedStyles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {completedAppointments.map((a) => (
              <tr key={a.id}>
                <td style={sharedStyles.td}><strong>{a.customerName}</strong></td>
                <td style={sharedStyles.td}>
                  {employees.find(e => e.id === a.employeeId)?.name || 'N/A'}
                </td>
                <td style={sharedStyles.td}>
                  <span style={{ color: '#faad14', fontWeight: 'bold' }}>
                    {a.rating ? `${a.rating} ★` : 'Chưa có'}
                  </span>
                </td>
                <td style={sharedStyles.td}>
                  <span style={{ fontStyle: 'italic', color: '#595959' }}>
                    {a.comment || 'Chưa có ý kiến...'}
                  </span>
                </td>
                <td style={sharedStyles.td}>
                  {!a.rating ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        style={{ ...sharedStyles.actionBtn, color: '#389e0d' }}
                        onClick={() => handleRate(a.id, 5, "Dịch vụ tuyệt vời!")}
                      >
                        Tốt (5★)
                      </button>
                      <button 
                        style={{ ...sharedStyles.actionBtn, color: '#D93523' }}
                        onClick={() => handleRate(a.id, 1, "Cần cải thiện")}
                      >
                        Kém
                      </button>
                    </div>
                  ) : (
                    <button 
                      style={{ ...sharedStyles.actionBtn, color: '#1890ff' }}
                      onClick={() => handleRate(a.id, 0, "")}
                    >
                      Xóa đánh giá
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Phần tóm tắt chỉ số hài lòng (UI bổ trợ giống GoalBox) */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#fffbe6', 
        border: '1px solid #ffe58f', 
        display: 'flex', 
        justifyContent: 'space-around',
        textAlign: 'center'
      }}>
        <div>
          <h4 style={{ margin: 0, color: '#856404' }}>TỔNG LƯỢT ĐÁNH GIÁ</h4>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0' }}>
            {completedAppointments.filter(a => a.rating).length}
          </p>
        </div>
        <div>
          <h4 style={{ margin: 0, color: '#856404' }}>ĐIỂM TRUNG BÌNH</h4>
          <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0' }}>
            {(completedAppointments.reduce((sum, a) => sum + (a.rating || 0), 0) / 
              (completedAppointments.filter(a => a.rating).length || 1)).toFixed(1)} ★
          </p>
        </div>
      </div>
    </div>
  );
};

export default DanhGiaDichVu;