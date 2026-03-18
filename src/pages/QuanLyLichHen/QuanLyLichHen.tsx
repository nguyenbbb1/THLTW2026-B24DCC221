import React, { useState, useEffect, useRef } from 'react';
import { Appointment, Employee, Service, WorkSlot } from './types';
import { sharedStyles } from './index';

interface Props {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  employees: Employee[];
  services: Service[];
}

const QuanLyLichHen: React.FC<Props> = ({ appointments, setAppointments, employees, services }) => {
  const [customerName, setCustomerName] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [selectedSerId, setSelectedSerId] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(''); 
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<WorkSlot[]>([]);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(24);

  const isMouseDown = useRef(false);
  const lastAction = useRef<'select' | 'deselect' | null>(null);

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

  useEffect(() => {
    if (selectedWeek) {
      const [year, week] = selectedWeek.split('-W').map(Number);
      const startDay = new Date(year, 0, 1 + (week - 1) * 7);
      const dayOfWeek = startDay.getDay(); 
      const diff = startDay.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const monday = new Date(startDay.setDate(diff));
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday); d.setDate(monday.getDate() + i);
        dates.push(d.toISOString().split('T')[0]);
      }
      setWeekDates(dates);
    } else {
      setWeekDates([]);
      setSelectedSlots([]); 
    }

    const handleMouseUpGlobal = () => { isMouseDown.current = false; lastAction.current = null; };
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, [selectedWeek]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = Math.max(0, startHour); i < Math.min(24, endHour); i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00-${(i + 1).toString().padStart(2, '0')}:00`);
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  // Tìm thông tin nhân viên đang được chọn
  const currentEmployee = employees.find(e => e.id === selectedEmpId);

  const handleSlotAction = (day: string, time: string, forceAction?: 'select' | 'deselect') => {
    if (!selectedWeek || !selectedEmpId) return;

    // LẤY GIỜ BẮT ĐẦU ĐỂ SO SÁNH VỚI LỊCH CÔNG TÁC (VD: "08:00")
    const startTime = time.split('-')[0];
    const isWorking = currentEmployee?.workSlots?.some(s => s.day === day && s.time === startTime);

    // CHỈ CHO PHÉP CHỌN NẾU NHÂN VIÊN CÓ LỊCH CÔNG TÁC
    if (!isWorking) return;

    setSelectedSlots(prev => {
      const exists = prev.some(s => s.day === day && s.time === time);
      const action = forceAction || (exists ? 'deselect' : 'select');
      if (action === 'select' && !exists) return [...prev, { day, time }];
      if (action === 'deselect' && exists) return prev.filter(s => !(s.day === day && s.time === time));
      return prev;
    });
  };

  const toggleColumn = (day: string) => {
    if (!selectedWeek || !selectedEmpId) return;
    // Chỉ toggle những ô mà nhân viên có đi làm
    const workTimesInDay = timeSlots.filter(t => currentEmployee?.workSlots?.some(s => s.day === day && s.time === t.split('-')[0]));
    const allInCol = workTimesInDay.every(t => selectedSlots.some(s => s.day === day && s.time === t));
    
    setSelectedSlots(allInCol 
      ? prev => prev.filter(s => s.day !== day) 
      : prev => [...prev.filter(s => s.day !== day), ...workTimesInDay.map(t => ({ day, time: t }))]
    );
  };

  const toggleRow = (time: string) => {
    if (!selectedWeek || !selectedEmpId) return;
    // Chỉ toggle những ô Thứ mà nhân viên có đi làm vào giờ này
    const workDaysInRow = days.filter(d => currentEmployee?.workSlots?.some(s => s.day === d && s.time === time.split('-')[0]));
    const allInRow = workDaysInRow.every(d => selectedSlots.some(s => s.day === d && s.time === time));
    
    setSelectedSlots(allInRow 
      ? prev => prev.filter(s => s.time !== time) 
      : prev => [...prev.filter(s => s.time !== time), ...workDaysInRow.map(d => ({ day: d, time }))]
    );
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWeek) return alert("Bạn chưa chọn tuần làm việc!");
    if (!customerName || !selectedEmpId || selectedSlots.length === 0) return alert("Vui lòng điền đủ thông tin!");

    const primarySlot = selectedSlots[0];
    const dateStr = weekDates[days.indexOf(primarySlot.day)];
    const timeStr = selectedSlots.map(s => s.time).sort().join(', ');

    const appData = { customerName, employeeId: selectedEmpId, serviceId: selectedSerId, date: dateStr, time: timeStr };

    if (editingAppId) {
      setAppointments(appointments.map(a => a.id === editingAppId ? { ...a, ...appData } : a));
      setEditingAppId(null);
    } else {
      setAppointments([{ id: Date.now().toString(), ...appData, status: 'Pending', createdAt: new Date().toISOString() }, ...appointments]);
    }
    resetForm();
  };

  const resetForm = () => {
    setCustomerName(''); setSelectedEmpId(''); setSelectedSerId('');
    setSelectedSlots([]); setEditingAppId(null);
  };

  const handleEdit = (a: Appointment) => {
    setEditingAppId(a.id);
    setCustomerName(a.customerName);
    setSelectedEmpId(a.employeeId);
    setSelectedSerId(a.serviceId);
    setSelectedSlots([]); 
    window.scrollTo(0, 0);
  };

  return (
    <section>
      <h3 style={{ borderLeft: '4px solid #D93523', paddingLeft: '10px', color: '#262626' }}>ĐIỀU PHỐI LỊCH HẸN THEO TUẦN</h3>

      <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #eee', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <select style={{...sharedStyles.input, border: !selectedEmpId ? '2px solid #D93523' : '1px solid #d9d9d9'}} value={selectedEmpId} onChange={e => { setSelectedEmpId(e.target.value); setSelectedSlots([]); }}>
            <option value="">-- BƯỚC 1: CHỌN NHÂN VIÊN --</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.phone})</option>)}
          </select>
          <input style={sharedStyles.input} placeholder="Tên khách hàng..." value={customerName} onChange={e => setCustomerName(e.target.value)} />
          <select style={sharedStyles.input} value={selectedSerId} onChange={e => setSelectedSerId(e.target.value)}>
            <option value="">-- BƯỚC 2: CHỌN DỊCH VỤ --</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '15px', padding: '15px', backgroundColor: '#fff', border: '1px solid #ddd' }}>
            <div style={{ width: '180px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>BƯỚC 3: Chọn tuần:</label>
                <input type="week" style={{...sharedStyles.input, width: '100%', marginBottom: 0, border: !selectedWeek ? '2px solid #D93523' : '1px solid #d9d9d9'}} value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{fontSize: '13px', fontWeight: 'bold'}}>Giờ:</span>
                <input type="number" min="0" max="23" style={{width: '55px', padding: '5px'}} value={startHour} onChange={e => setStartHour(Number(e.target.value))} />
                <span>đến</span>
                <input type="number" min="1" max="24" style={{width: '55px', padding: '5px'}} value={endHour} onChange={e => setEndHour(Number(e.target.value))} />
            </div>
        </div>

        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>BƯỚC 4: Chọn giờ hẹn (Chỉ chọn được vùng mờ - Lịch nhân viên):</label>
        <div 
          onContextMenu={(e) => e.preventDefault()}
          style={{ 
            display: 'grid', gridTemplateColumns: '130px repeat(7, 1fr)', 
            gap: '1px', backgroundColor: '#ddd', border: '1px solid #ccc', userSelect: 'none',
            position: 'relative'
          }}
        >
          {(!selectedWeek || !selectedEmpId) && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', fontWeight: 'bold', color: '#D93523', textAlign: 'center' }}>
              VUI LÒNG CHỌN NHÂN VIÊN VÀ TUẦN <br/> ĐỂ HIỂN THỊ LỊCH CÔNG TÁC
            </div>
          )}

          <div style={{ backgroundColor: '#eee', padding: '10px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>Hàng/Cột</div>
          {days.map((d, idx) => (
            <div key={d} onClick={() => toggleColumn(d)} style={{ backgroundColor: '#f4f4f4', padding: '10px', fontSize: '14px', textAlign: 'center', cursor: 'pointer', color: '#D93523', fontWeight: 'bold' }}>
              {d} ▾ <br/> <small style={{color: '#666', fontWeight: 'normal'}}>{weekDates[idx] || '--'}</small>
            </div>
          ))}
          
          {timeSlots.map(t => (
            <React.Fragment key={t}>
              <div onClick={() => toggleRow(t)} style={{ backgroundColor: '#f4f4f4', padding: '10px', fontSize: '12px', textAlign: 'center', cursor: 'pointer', color: '#D93523', fontWeight: 'bold' }}>
                {t} ▸
              </div>
              {days.map((d, idx) => {
                const isSelected = selectedSlots.some(s => s.day === d && s.time === t);
                const isBusy = appointments.some(a => a.employeeId === selectedEmpId && a.date === weekDates[idx] && a.time.includes(t) && a.status !== 'Cancelled');
                
                // KIỂM TRA LỊCH CÔNG TÁC CỦA NHÂN VIÊN
                const startTime = t.split('-')[0];
                const isWorking = currentEmployee?.workSlots?.some(s => s.day === d && s.time === startTime);

                return (
                  <div 
                    key={d+t} 
                    onMouseDown={(e) => {
                        if(!isWorking || isBusy || !selectedWeek) return;
                        isMouseDown.current = true;
                        lastAction.current = (isSelected || e.button === 2) ? 'deselect' : 'select';
                        handleSlotAction(d, t, lastAction.current);
                    }}
                    onMouseEnter={() => isMouseDown.current && isWorking && !isBusy && selectedWeek && handleSlotAction(d, t, lastAction.current!)}
                    style={{ 
                        // Ô nào nhân viên CÓ làm việc (isWorking) thì hiện màu xám mờ (#f5f5f5)
                        // Ô nào nhân viên KHÔNG làm việc thì hiện trắng tinh và chặn click
                        backgroundColor: isBusy ? '#D93523' : (isSelected ? '#faad14' : (isWorking ? '#f5f5f5' : '#fff')), 
                        height: '35px', 
                        cursor: (isWorking && !isBusy && selectedWeek) ? 'cell' : 'not-allowed',
                        borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} 
                  >
                    {isBusy ? (
                        <span style={{fontSize: '9px', color: '#fff', fontWeight: 'bold'}}>ĐÃ CÓ HẸN</span>
                    ) : (
                        isWorking ? null : <span style={{fontSize: '8px', color: '#ccc'}}>NGHỈ</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '15px' }}>
          {editingAppId && <button style={sharedStyles.btnSecondary} onClick={resetForm}>HỦY</button>}
          <button style={sharedStyles.btnPrimary} onClick={handleSaveBooking} disabled={!selectedWeek || !selectedEmpId}>
            {editingAppId ? 'LƯU THAY ĐỔI' : 'XÁC NHẬN ĐẶT LỊCH'}
          </button>
        </div>
      </div>

      <table style={sharedStyles.table}>
        <thead>
          <tr><th style={sharedStyles.th}>Khách hàng</th><th style={sharedStyles.th}>Nhân viên</th><th style={sharedStyles.th}>Thời gian</th><th style={sharedStyles.th}>Thao tác</th></tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}>
              <td style={sharedStyles.td}><strong>{a.customerName}</strong></td>
              <td style={sharedStyles.td}>{employees.find(e => e.id === a.employeeId)?.name}</td>
              <td style={sharedStyles.td}>{a.date} | {a.time}</td>
              <td style={sharedStyles.td}>
                <button style={{...sharedStyles.actionBtn, color: '#faad14'}} onClick={() => handleEdit(a)}>Sửa</button>
                <button style={{...sharedStyles.actionBtn, color: '#D93523'}} onClick={() => setAppointments(appointments.filter(x => x.id !== a.id))}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default QuanLyLichHen;