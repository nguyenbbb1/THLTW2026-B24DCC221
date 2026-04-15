import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message, Table, InputNumber, Space, Popconfirm, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Order } from './types';
import { mockCustomers, mockProducts } from './mockData';
import moment from 'moment';

const { Option } = Select;

interface ModalDonHangProps {
  visible: boolean;
  editingOrder: Order | null;
  onCancel: () => void;
  onSaveSingle: (order: Order) => void;
  onSaveBulk: (orders: Order[]) => void;
}

const ModalDonHang: React.FC<ModalDonHangProps> = ({
  visible,
  editingOrder,
  onCancel,
  onSaveSingle,
  onSaveBulk,
}) => {
  const [form] = Form.useForm();

  // Trạng thái Bảng chờ (Draft) lưu trong Local Storage
  const [draftOrders, setDraftOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('draft_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Tự động lưu Bảng chờ vào Local Storage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('draft_orders', JSON.stringify(draftOrders));
  }, [draftOrders]);

  useEffect(() => {
    if (visible) {
      if (editingOrder) {
        form.setFieldsValue({
          ...editingOrder,
          productIds: editingOrder.products.map(p => p.id),
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingOrder, form]);

  // Hàm tạo mã tự động: DH + Timestamp + Random 3 số
  const generateOrderId = () => {
    return 'DH' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100).toString();
  };

  // Tính tổng tiền dựa trên sản phẩm và số lượng
  const calculateTotal = (productIds: string[], quantity: number) => {
    const selectedProducts = mockProducts.filter(p => productIds.includes(p.id));
    const basePrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    return basePrice * quantity;
  };

  // Thêm đơn hàng vào bảng nháp (Chế độ Thêm mới)
  const handleAddDraft = async () => {
    try {
      const values = await form.validateFields();
      const selectedProducts = mockProducts.filter(p => values.productIds.includes(p.id));

      const newDraftOrder: Order = {
        id: generateOrderId(),
        customerId: values.customerId,
        orderDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        products: selectedProducts,
        totalAmount: calculateTotal(values.productIds, values.quantity),
        status: values.status,
        quantity: values.quantity,
      };

      setDraftOrders([...draftOrders, newDraftOrder]);
      // Reset form nhưng giữ lại trạng thái mặc định
      form.resetFields(['customerId', 'productIds']);
      message.success('Đã thêm vào bảng chờ!');
    } catch (error) {
      message.error('Vui lòng điền đủ thông tin!');
    }
  };

  // Thay đổi số lượng trực tiếp trong bảng chờ
  const handleDraftQuantityChange = (id: string, newQuantity: number | null) => {
    if (!newQuantity) return;
    setDraftOrders(prev => prev.map(order => {
      if (order.id === id) {
        const basePrice = order.products.reduce((sum, p) => sum + p.price, 0);
        return { ...order, quantity: newQuantity, totalAmount: basePrice * newQuantity };
      }
      return order;
    }));
  };

  // Xóa đơn hàng khỏi bảng chờ
  const handleRemoveDraft = (id: string) => {
    setDraftOrders(prev => prev.filter(order => order.id !== id));
  };

  // Xử lý nút LƯU CHÍNH của Modal
  const handleFinalSubmit = () => {
    if (editingOrder) {
      // Logic Lưu khi đang Edit 1 đơn cụ thể
      form.validateFields().then(values => {
        const selectedProducts = mockProducts.filter(p => values.productIds.includes(p.id));
        const updatedOrder: Order = {
          ...editingOrder,
          customerId: values.customerId,
          products: selectedProducts,
          totalAmount: calculateTotal(values.productIds, values.quantity),
          status: values.status,
          quantity: values.quantity,
        };
        onSaveSingle(updatedOrder);
      });
    } else {
      // Logic Lưu tất cả Bảng chờ vào hệ thống
      if (draftOrders.length === 0) {
        message.warning('Danh sách chờ đang trống! Vui lòng thêm đơn hàng.');
        return;
      }
      onSaveBulk(draftOrders);
      setDraftOrders([]); // Xóa draft sau khi lưu thành công
      localStorage.removeItem('draft_orders');
    }
  };

  const getCustomerName = (id: string) => mockCustomers.find(c => c.id === id)?.name;

  const draftColumns = [
    { title: 'Mã ĐH', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', key: 'customer', render: (_: any, record: Order) => getCustomerName(record.customerId) },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (_: any, record: Order) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(val) => handleDraftQuantityChange(record.id, val)}
        />
      )
    },
    { title: 'Tổng tiền', key: 'total', render: (_: any, record: Order) => record.totalAmount.toLocaleString() },
    {
      title: 'Xóa',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveDraft(record.id)} />
      )
    }
  ];

  return (
    <Modal
      title={editingOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleFinalSubmit}
      okText={editingOrder ? "Lưu Thay Đổi" : "Lưu Tất Cả Đơn Hàng"}
      cancelText="Đóng"
      width={editingOrder ? 500 : 800} // Mở rộng Modal nếu ở chế độ Thêm mới (để chứa bảng)
      okButtonProps={{ style: { backgroundColor: '#D93523', borderColor: '#D93523', borderRadius: '0px' } }}
      cancelButtonProps={{ style: { borderRadius: '0px' } }}
    >
      <Form layout="vertical" form={form} initialValues={{ status: 'Chờ xác nhận', quantity: 1 }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Form.Item label="Khách hàng" name="customerId" rules={[{ required: true }]} style={{ flex: 1, minWidth: '200px' }}>
            <Select placeholder="Chọn khách hàng">
              {mockCustomers.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]} style={{ width: '150px' }}>
            <Select>
              <Option value="Chờ xác nhận">Chờ xác nhận</Option>
              <Option value="Đang giao">Đang giao</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Hủy">Hủy</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Sản phẩm" name="productIds" rules={[{ required: true, message: 'Chọn ít nhất 1 SP' }]}>
          <Select mode="multiple" placeholder="Chọn sản phẩm">
            {mockProducts.map(p => (
              <Option key={p.id} value={p.id}>{p.name} - {p.price.toLocaleString()}đ</Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '20px' }}>
          <Form.Item label="Số lượng" name="quantity" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
            <InputNumber min={1} style={{ width: '100px' }} />
          </Form.Item>

          {/* Nút này chỉ xuất hiện khi Thêm Mới */}
          {!editingOrder && (
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddDraft}>
              Thêm vào bảng chờ
            </Button>
          )}
        </div>
      </Form>

      {/* Bảng hiển thị danh sách nháp chỉ xuất hiện ở chế độ Thêm Mới */}
      {!editingOrder && (
        <>
          <Divider>Danh Sách Đơn Hàng Chờ Thêm</Divider>
          <Table
            size="small"
            columns={draftColumns}
            dataSource={draftOrders}
            rowKey="id"
            pagination={{ pageSize: 3 }}
            locale={{ emptyText: 'Chưa có đơn hàng nào trong danh sách chờ' }}
          />
        </>
      )}
    </Modal>
  );
};

export default ModalDonHang;