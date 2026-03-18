import React, { useState, useEffect } from 'react';
import { Service } from './types';
import { sharedStyles } from './index';

interface Props {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

const QuanLyDichVu: React.FC<Props> = ({ services, setServices }) => {
  const [serName, setSerName] = useState('');
  const [serIdCustom, setSerIdCustom] = useState(''); // Mã DV00000x
  const [serPrice, setSerPrice] = useState('');
  const [serDuration, setSerDuration] = useState(1);
  const [serUnit, setSerUnit] = useState<'phút' | 'giờ' | 'buổi' | 'ngày'>('giờ');
  const [serDesc, setSerDesc] = useState(''); // Mô tả dịch vụ
  const [editingSerId, setEditingSerId] = useState<string | null>(null);

  // Xem chi tiết mô tả (Modal)
  const [viewingDesc, setViewingDesc] = useState<{name: string, desc: string} | null>(null);

  // Tự động tạo mã DV mới
  useEffect(() => {
    if (!editingSerId) {
      const nextId = services.length + 1;
      setSerIdCustom(`DV${nextId.toString().padStart(6, '0')}`);
    }
  }, [services, editingSerId]);

  const handleSaveService = () => {
    if (!serName || !serPrice) return alert("Vui lòng nhập đầy đủ tên và giá dịch vụ!");
    
    const serviceData = {
      name: serName,
      serviceIdCustom: serIdCustom,
      price: Number(serPrice),
      duration: serDuration,
      unit: serUnit,
      description: serDesc
    };

    if (editingSerId) {
      setServices(services.map(s => s.id === editingSerId ? { ...s, ...serviceData } : s));
      setEditingSerId(null);
    } else {
      setServices([...services, { id: Date.now().toString(), ...serviceData }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setSerName('');
    setSerPrice('');
    setSerDuration(1);
    setSerUnit('giờ');
    setSerDesc('');
    setEditingSerId(null);
  };

  const handleEdit = (s: Service) => {
    setEditingSerId(s.id);
    setSerIdCustom(s.serviceIdCustom || '');
    setSerName(s.name);
    setSerPrice(s.price.toString());
    setSerDuration(s.duration);
    setSerUnit(s.unit || 'phút');
    setSerDesc(s.description || '');
    window.scrollTo(0, 0);
  };

  return (
    <section>
      <h3 style={{ borderLeft: '4px solid #D93523', paddingLeft: '10px', color: '#262626' }}>
        QUẢN LÝ DANH MỤC DỊCH VỤ
      </h3>

      <div style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #eee', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Mã dịch vụ:</label>
            <input style={{ ...sharedStyles.input, backgroundColor: '#f0f0f0' }} value={serIdCustom} readOnly />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Tên dịch vụ:</label>
            <input style={sharedStyles.input} placeholder="Nhập tên dịch vụ..." value={serName} onChange={e => setSerName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Giá tiền (VND):</label>
            <input style={sharedStyles.input} type="number" placeholder="Ví dụ: 500000" value={serPrice} onChange={e => setSerPrice(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Thời gian:</label>
              <input style={sharedStyles.input} type="number" value={serDuration} onChange={e => setSerDuration(Number(e.target.value))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Đơn vị:</label>
              <select style={sharedStyles.input} value={serUnit} onChange={e => setSerUnit(e.target.value as any)}>
                <option value="phút">Phút</option>
                <option value="giờ">Giờ</option>
                <option value="buổi">Buổi</option>
                <option value="ngày">Ngày</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Mô tả ngắn gọn:</label>
            <textarea 
              style={{ ...sharedStyles.input, height: '38px', resize: 'none' }} 
              placeholder="Mô tả chi tiết công việc..." 
              value={serDesc} 
              onChange={e => setSerDesc(e.target.value)} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {editingSerId && (
            <button style={sharedStyles.btnSecondary} onClick={resetForm}>HỦY</button>
          )}
          <button style={sharedStyles.btnPrimary} onClick={handleSaveService}>
            {editingSerId ? 'LƯU THAY ĐỔI' : 'THÊM DỊCH VỤ'}
          </button>
        </div>
      </div>

      <table style={sharedStyles.table}>
        <thead>
          <tr>
            <th style={{ ...sharedStyles.th, width: '120px' }}>Mã DV</th>
            <th style={sharedStyles.th}>Tên Dịch Vụ</th>
            <th style={sharedStyles.th}>Đơn giá / Thời gian</th>
            <th style={sharedStyles.th}>Mô tả</th>
            <th style={sharedStyles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td style={sharedStyles.td}><code style={{ color: '#D93523', fontWeight: 'bold' }}>{s.serviceIdCustom}</code></td>
              <td style={sharedStyles.td}><strong>{s.name}</strong></td>
              <td style={sharedStyles.td}>{s.price.toLocaleString()}đ / {s.duration} {s.unit}</td>
              <td style={sharedStyles.td}>
                <button 
                  style={{ ...sharedStyles.btnPrimary, padding: '4px 8px', fontSize: '11px', backgroundColor: '#595959' }}
                  onClick={() => setViewingDesc({ name: s.name, desc: s.description || 'Không có mô tả.' })}
                >
                  CHI TIẾT
                </button>
              </td>
              <td style={sharedStyles.td}>
                <button style={{ ...sharedStyles.actionBtn, color: '#faad14' }} onClick={() => handleEdit(s)}>Sửa</button>
                <button style={{ ...sharedStyles.actionBtn, color: '#D93523' }} onClick={() => { if(window.confirm('Xóa dịch vụ này?')) setServices(services.filter(x => x.id !== s.id)) }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

{/* MODAL CHI TIẾT DỊCH VỤ - SỬA LỖI TRÀN CHỮ */}
{viewingDesc && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', maxWidth: '600px', width: '90%', borderTop: '5px solid #D93523', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <button 
              onClick={() => setViewingDesc(null)}
              style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', background: 'none', fontSize: '26px', cursor: 'pointer', color: '#666' }}
            >
              ×
            </button>
            <h3 style={{ marginTop: 0, color: '#D93523', fontSize: '20px', textTransform: 'uppercase' }}>Chi tiết dịch vụ</h3>
            <p style={{ marginBottom: '10px' }}><strong>Tên dịch vụ:</strong> {viewingDesc.name}</p>
            
            {/* Vùng chứa mô tả - QUAN TRỌNG: Thêm xử lý ngắt dòng */}
            <div style={{ 
              marginTop: '15px', 
              padding: '20px', 
              backgroundColor: '#f9f9f9', 
              border: '1px solid #eee', 
              lineHeight: '1.6',
              maxHeight: '400px',
              overflowY: 'auto',
              wordBreak: 'break-word', // Tự động ngắt từ dài
              whiteSpace: 'pre-wrap',   // Giữ lại các khoảng trắng và ngắt dòng
              color: '#333'
            }}>
              {viewingDesc.desc}
            </div>
            
            <button 
              style={{ ...sharedStyles.btnPrimary, marginTop: '25px', width: '100%', letterSpacing: '1px' }} 
              onClick={() => setViewingDesc(null)}
            >
              ĐÓNG CỬA SỔ
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuanLyDichVu;