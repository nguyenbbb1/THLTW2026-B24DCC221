import React, { useState, useEffect, useRef } from 'react';
import { Employee, WorkSlot } from './types';
import { sharedStyles } from './index';

interface Props {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const QuanLyNhanVien: React.FC<Props> = ({ employees, setEmployees }) => {
  const [empName, setEmpName] = useState('');
  const [empIdCustom, setEmpIdCustom] = useState('');
  const [empMax, setEmpMax] = useState(5);
  const [selectedSlots, setSelectedSlots] = useState<WorkSlot[]>([]);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  
  // Modal xem lịch
  const [viewingSlots, setViewingSlots] = useState<WorkSlot[] | null>(null);

  // Giới hạn thời gian chuẩn 0h - 24h
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(24);

  const isMouseDown = useRef(false);
  const lastAction = useRef<'select' | 'deselect' | null>(null);

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

  useEffect(() => {
    if (!editingEmpId) {
      const nextId = employees.length + 1;
      setEmpIdCustom(`NV${nextId.toString().padStart(6, '0')}`);
    }
    
    const handleMouseUpGlobal = () => { isMouseDown.current = false; lastAction.current = null; };
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, [employees, editingEmpId]);

  // Tạo khung giờ từ 00:00 đến 24:00
  const generateTimeSlots = () => {
    const slots = [];
    // Đảm bảo không vượt quá giới hạn 0-24
    const safeStart = Math.max(0, startHour);
    const safeEnd = Math.min(24, endHour);
    
    for (let i = safeStart; i < safeEnd; i++) {
      const start = i.toString().padStart(2, '0') + ':00';
      const end = (i + 1).toString().padStart(2, '0') + ':00';
      slots.push(`${start}-${end}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSlotAction = (day: string, time: string, forceAction?: 'select' | 'deselect') => {
    setSelectedSlots(prev => {
      const exists = prev.some(s => s.day === day && s.time === time);
      const action = forceAction || (exists ? 'deselect' : 'select');
      if (action === 'select' && !exists) return [...prev, { day, time }];
      if (action === 'deselect' && exists) return prev.filter(s => !(s.day === day && s.time === time));
      return prev;
    });
  };

  const toggleColumn = (day: string) => {
    const allInCol = timeSlots.every(t => selectedSlots.some(s => s.day === day && s.time === t));
    if (allInCol) setSelectedSlots(prev => prev.filter(s => s.day !== day));
    else {
      const newSlots = timeSlots.map(t => ({ day, time: t }));
      setSelectedSlots(prev => [...prev.filter(s => s.day !== day), ...newSlots]);
    }
  };

  const toggleRow = (time: string) => {
    const allInRow = days.every(d => selectedSlots.some(s => s.day === d && s.time === time));
    if (allInRow) setSelectedSlots(prev => prev.filter(s => s.time !== time));
    else {
      const newSlots = days.map(d => ({ day: d, time }));
      setSelectedSlots(prev => [...prev.filter(s => s.time !== time), ...newSlots]);
    }
  };

  const handleSaveEmployee = () => {
    if (!empName) return alert("Vui lòng nhập tên nhân viên!");
    const employeeData = { name: empName, phone: empIdCustom, maxCustomersPerDay: empMax, workSlots: selectedSlots, workSchedule: '' };
    if (editingEmpId) setEmployees(employees.map(e => e.id === editingEmpId ? { ...e, ...employeeData } : e));
    else setEmployees([...employees, { id: Date.now().toString(), ...employeeData }]);
    resetForm();
  };

  const resetForm = () => {
    setEmpName(''); setEmpMax(5); setSelectedSlots([]); setEditingEmpId(null);
  };

  return (
    <section>
      <h3 style={{ borderLeft: '4px solid #D93523', paddingLeft: '10px', color: '#262626' }}>QUẢN LÝ NHÂN VIÊN</h3>
      
      <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #eee', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <input style={{...sharedStyles.input, backgroundColor: '#f0f0f0'}} value={empIdCustom} readOnly />
          <input style={sharedStyles.input} placeholder="Họ tên nhân viên..." value={empName} onChange={e => setEmpName(e.target.value)} />
          <input type="number" style={sharedStyles.input} value={empMax} onChange={e => setEmpMax(Number(e.target.value))} />
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Cài đặt giờ (0-24h):</span>
          <input type="number" min="0" max="23" style={{width: '60px', padding: '5px'}} value={startHour} onChange={e => setStartHour(Number(e.target.value))} />
          <span>đến</span>
          <input type="number" min="1" max="24" style={{width: '60px', padding: '5px'}} value={endHour} onChange={e => setEndHour(Number(e.target.value))} />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '120px repeat(7, 1fr)', 
          gap: '1px', 
          backgroundColor: '#ddd', 
          border: '1px solid #ccc',
          userSelect: 'none'
        }}>
          <div style={{ backgroundColor: '#eee', padding: '10px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>Hàng/Cột</div>
          {days.map(d => (
            <div 
              key={d} 
              onClick={() => toggleColumn(d)}
              style={{ backgroundColor: '#f4f4f4', padding: '10px', fontSize: '14px', textAlign: 'center', cursor: 'pointer', color: '#D93523', fontWeight: 'bold' }}
            >
              {d} ▾
            </div>
          ))}
          
          {timeSlots.map(t => (
            <React.Fragment key={t}>
              <div 
                onClick={() => toggleRow(t)}
                style={{ backgroundColor: '#f4f4f4', padding: '10px', fontSize: '13px', textAlign: 'center', cursor: 'pointer', color: '#D93523', fontWeight: 'bold' }}
              >
                {t} ▸
              </div>
              {days.map(d => (
                <div 
                  key={d+t} 
                  onMouseDown={() => { isMouseDown.current = true; const ex = selectedSlots.some(s => s.day === d && s.time === t); lastAction.current = ex ? 'deselect' : 'select'; handleSlotAction(d, t, lastAction.current); }}
                  onMouseEnter={() => { if (isMouseDown.current && lastAction.current) handleSlotAction(d, t, lastAction.current); }}
                  style={{ backgroundColor: selectedSlots.some(s => s.day === d && s.time === t) ? '#D93523' : '#fff', height: '35px', cursor: 'cell' }} 
                />
              ))}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '15px' }}>
          {editingEmpId && <button style={sharedStyles.btnSecondary} onClick={resetForm}>HỦY</button>}
          <button style={sharedStyles.btnPrimary} onClick={handleSaveEmployee}>{editingEmpId ? 'LƯU THAY ĐỔI' : 'THÊM NHÂN VIÊN'}</button>
        </div>
      </div>

      <table style={sharedStyles.table}>
        <thead>
          <tr>
            <th style={{...sharedStyles.th, width: '100px'}}>Mã NV</th>
            <th style={sharedStyles.th}>Nhân viên</th>
            <th style={sharedStyles.th}>Lịch trình</th>
            <th style={sharedStyles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td style={sharedStyles.td}><code style={{color: '#D93523', fontWeight: 'bold'}}>{e.phone}</code></td>
              <td style={sharedStyles.td}><strong>{e.name}</strong></td>
              <td style={sharedStyles.td}>
                <button 
                  style={{ ...sharedStyles.btnPrimary, padding: '6px 12px', fontSize: '12px', backgroundColor: '#595959' }}
                  onClick={() => setViewingSlots(e.workSlots || [])}
                >
                  XEM LỊCH CHI TIẾT
                </button>
              </td>
              <td style={sharedStyles.td}>
                <button style={{ ...sharedStyles.actionBtn, color: '#faad14' }} onClick={() => { setEditingEmpId(e.id); setEmpName(e.name); setEmpMax(e.maxCustomersPerDay); setSelectedSlots(e.workSlots || []); setEmpIdCustom(e.phone || ''); window.scrollTo(0,0); }}>Sửa</button>
                <button style={{ ...sharedStyles.actionBtn, color: '#D93523' }} onClick={() => setEmployees(employees.filter(x => x.id !== e.id))}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL XEM LỊCH NÂNG CẤP */}
      {viewingSlots && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', maxWidth: '95%', maxHeight: '90vh', overflow: 'auto', borderTop: '5px solid #D93523', position: 'relative' }}>
            
            {/* Nút X thoát nhanh ở góc */}
            <button 
              onClick={() => setViewingSlots(null)}
              style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#666', fontWeight: 'bold' }}
            >
              ×
            </button>

            <h3 style={{ marginTop: 0, paddingRight: '30px' }}>LỊCH TRÌNH CHI TIẾT NHÂN VIÊN</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(7, 1fr)', gap: '1px', backgroundColor: '#ddd', border: '1px solid #ccc' }}>
              <div style={{ backgroundColor: '#eee', padding: '10px' }} />
              {days.map(d => <div key={d} style={{ backgroundColor: '#f4f4f4', padding: '10px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>{d}</div>)}
              {timeSlots.map(t => (
                <React.Fragment key={t}>
                  <div style={{ backgroundColor: '#fff', padding: '10px', fontSize: '13px', fontWeight: 'bold', borderRight: '1px solid #eee' }}>{t}</div>
                  {days.map(d => (
                    <div key={d+t} style={{ backgroundColor: viewingSlots.some(s => s.day === d && s.time === t) ? '#D93523' : '#fff', height: '25px' }} />
                  ))}
                </React.Fragment>
              ))}
            </div>
            
            <button style={{ ...sharedStyles.btnPrimary, marginTop: '20px', width: '100%' }} onClick={() => setViewingSlots(null)}>ĐÓNG CỬA SỔ</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuanLyNhanVien;