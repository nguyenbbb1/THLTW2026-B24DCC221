import React, { useState, useMemo, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import DanhSachDonHang from './DanhSachDonHang';
import ModalDonHang from './ModalDonHang';
import { Order } from './types';
import { initialOrders, mockCustomers } from './mockData';
import { styles } from './SharedStyles';

const QuanLyDonHang: React.FC = () => {
  localStorage.clear();
  // Khởi tạo State từ LocalStorage, nếu không có thì lấy dữ liệu mẫu
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('main_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Đồng bộ hóa danh sách đơn hàng chính vào Local Storage mỗi khi có sự thay đổi
  useEffect(() => {
    localStorage.setItem('main_orders', JSON.stringify(orders));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!searchText) return orders;
    const lowerSearch = searchText.toLowerCase();
    return orders.filter(order => {
      const customerName = mockCustomers.find(c => c.id === order.customerId)?.name.toLowerCase() || '';
      return order.id.toLowerCase().includes(lowerSearch) || customerName.includes(lowerSearch);
    });
  }, [orders, searchText]);

  const handleAdd = () => {
    setEditingOrder(null);
    setModalVisible(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setModalVisible(true);
  };

  // Xử lý lưu khi SỬA 1 đơn hàng
  const handleSaveSingleOrder = (savedOrder: Order) => {
    setOrders(prev => prev.map(o => (o.id === savedOrder.id ? savedOrder : o)));
    message.success('Cập nhật đơn hàng thành công!');
    setModalVisible(false);
  };

  // Xử lý lưu khi THÊM NHIỀU đơn hàng từ danh sách chờ
  const handleSaveBulkOrders = (newOrders: Order[]) => {
    setOrders(prev => [...newOrders, ...prev]);
    message.success(`Đã thêm thành công ${newOrders.length} đơn hàng!`);
    setModalVisible(false);
  };

  const handleCancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'Hủy' } : o)));
    message.success('Đã hủy đơn hàng!');
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, maxWidth: '1000px' }}>
        <div style={styles.title}>QUẢN LÝ ĐƠN HÀNG</div>
        <div style={styles.badge}>Hệ thống vận hành</div>

        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input
            placeholder="Tìm theo Mã ĐH hoặc Tên Khách Hàng"
            prefix={<SearchOutlined style={{ color: '#bfbfbf', marginRight: '8px' }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: '350px', height: '44px', borderRadius: 0, marginBottom: 0 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ ...styles.button, width: 'auto', marginBottom: 0 }}
            onClick={handleAdd}
          >
            Thêm Đơn Hàng
          </Button>
        </div>

        <DanhSachDonHang
          orders={filteredOrders}
          onEdit={handleEdit}
          onCancelOrder={handleCancelOrder}
        />

        <ModalDonHang
          visible={modalVisible}
          editingOrder={editingOrder}
          onCancel={() => setModalVisible(false)}
          onSaveSingle={handleSaveSingleOrder}
          onSaveBulk={handleSaveBulkOrders}
        />
      </div>
    </div>
  );
};

export default QuanLyDonHang;