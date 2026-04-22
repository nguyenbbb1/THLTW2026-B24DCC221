import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, message, Table, InputNumber, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Order, OrderItem } from './types';
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

  // Theo dõi sản phẩm đang được chọn để render ô số lượng tương ứng
  const selectedProductIds = Form.useWatch('productIds', form) || [];

  const [draftOrders, setDraftOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('draft_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('draft_orders', JSON.stringify(draftOrders));
  }, [draftOrders]);

useEffect(() => {
    if (visible) {
      if (editingOrder) {
        // BỔ SUNG KIỂM TRA BẢO MẬT: Khởi tạo mảng rỗng nếu items bị undefined (do dữ liệu cũ)
        const itemsList = editingOrder.items || [];
        const quantitiesMap: Record<string, number> = {};

        itemsList.forEach(item => {
          if (item && item.product) {
            quantitiesMap[item.product.id] = item.quantity;
          }
        });

        form.setFieldsValue({
          customerId: editingOrder.customerId,
          status: editingOrder.status,
          // Lọc bỏ các giá trị undefined nếu có lỗi cấu trúc sâu hơn
          productIds: itemsList.map(i => i.product?.id).filter(Boolean),
          quantities: quantitiesMap,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingOrder, form]);

  const generateOrderId = () => 'DH' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100).toString();

  // Hàm tính toán tổng tiền dựa trên Mapping của { productId: quantity }
  const calculateTotal = (productIds: string[], quantities: Record<string, number>) => {
    return productIds.reduce((sum, id) => {
      const product = mockProducts.find(p => p.id === id);
      const qty = quantities[id] || 1; // Mặc định số lượng là 1 nếu chưa nhập
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  const handleAddDraft = async () => {
    try {
      const values = await form.validateFields();

      const items: OrderItem[] = values.productIds.map((id: string) => ({
        product: mockProducts.find(p => p.id === id)!,
        quantity: values.quantities ? (values.quantities[id] || 1) : 1
      }));

      const newDraftOrder: Order = {
        id: generateOrderId(),
        customerId: values.customerId,
        orderDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        items,
        totalAmount: calculateTotal(values.productIds, values.quantities || {}),
        status: values.status,
      };

      setDraftOrders([...draftOrders, newDraftOrder]);
      form.resetFields(['customerId', 'productIds', 'quantities']);
      message.success('Đã thêm vào bảng chờ!');
    } catch (error) {
      message.error('Vui lòng điền đủ thông tin!');
    }
  };

  const handleDraftQuantityChange = (orderId: string, productId: string, newQuantity: number | null) => {
    if (!newQuantity) return;
    setDraftOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        );
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        return { ...order, items: updatedItems, totalAmount: newTotal };
      }
      return order;
    }));
  };

  const handleFinalSubmit = () => {
    if (editingOrder) {
      form.validateFields().then(values => {
        const items: OrderItem[] = values.productIds.map((id: string) => ({
          product: mockProducts.find(p => p.id === id)!,
          quantity: values.quantities ? (values.quantities[id] || 1) : 1
        }));

        const updatedOrder: Order = {
          ...editingOrder,
          customerId: values.customerId,
          items,
          totalAmount: calculateTotal(values.productIds, values.quantities || {}),
          status: values.status,
        };
        onSaveSingle(updatedOrder);
      });
    } else {
      if (draftOrders.length === 0) {
        message.warning('Danh sách chờ đang trống!');
        return;
      }
      onSaveBulk(draftOrders);
      setDraftOrders([]);
      localStorage.removeItem('draft_orders');
    }
  };

const draftColumns = [
    { title: 'Mã ĐH', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', key: 'customer', render: (_: any, record: Order) => mockCustomers.find(c => c.id === record.customerId)?.name },
    {
      title: 'Chi tiết SP & Số lượng',
      key: 'items',
      width: '45%',
      render: (_: any, record: Order) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* BỔ SUNG KIỂM TRA: Đảm bảo record.items tồn tại và là một mảng hợp lệ trước khi map */}
          {record.items && record.items.length > 0 ? (
            record.items.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', borderBottom: index < record.items.length -1 ? '1px solid #f0f0f0' : 'none', padding: '4px 0' }}>
                <div style={{ flex: 2 }}>{item.product?.name || 'Sản phẩm lỗi'}</div>
                <div style={{ flex: 1, paddingLeft: '8px' }}>
                  <InputNumber
                    min={1}
                    size="small"
                    value={item.quantity}
                    onChange={(val) => handleDraftQuantityChange(record.id, item.product?.id, val)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#999', fontStyle: 'italic', fontSize: '12px' }}>Dữ liệu nháp không tương thích. Vui lòng xóa.</div>
          )}
        </div>
      )
    },
    { title: 'Tổng tiền', key: 'total', render: (_: any, record: Order) => <strong style={{ color: '#D93523' }}>{record.totalAmount?.toLocaleString()}</strong> },
    {
      title: 'Xóa',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button danger type="text" icon={<DeleteOutlined />} onClick={() => setDraftOrders(prev => prev.filter(o => o.id !== record.id))} />
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
      width={editingOrder ? 500 : 900}
      okButtonProps={{ style: { backgroundColor: '#D93523', borderColor: '#D93523', borderRadius: '0px' } }}
      cancelButtonProps={{ style: { borderRadius: '0px' } }}
    >
      <Form layout="vertical" form={form} initialValues={{ status: 'Chờ xác nhận' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Form.Item label="Khách hàng" name="customerId" rules={[{ required: true }]} style={{ flex: 1 }}>
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
          <Select mode="multiple" placeholder="Chọn sản phẩm" allowClear>
            {mockProducts.map(p => (
              <Option key={p.id} value={p.id}>{p.name} - {p.price.toLocaleString()}đ</Option>
            ))}
          </Select>
        </Form.Item>

        {/* TÍNH NĂNG MỚI: Tự động render ô Số lượng theo Sản phẩm đã chọn */}
        {selectedProductIds.length > 0 && (
          <div style={{ backgroundColor: '#fafafa', padding: '15px', border: '1px dashed #d9d9d9', marginBottom: '20px' }}>
            <div style={{ fontWeight: 600, marginBottom: '10px' }}>Thiết lập Số lượng:</div>
            {selectedProductIds.map((id: string) => {
              const product = mockProducts.find(p => p.id === id);
              return product ? (
                <Form.Item
                  key={id}
                  label={product.name}
                  name={['quantities', id]}
                  initialValue={1}
                  style={{ marginBottom: '10px' }}
                >
                  <InputNumber min={1} style={{ width: '100px' }} />
                </Form.Item>
              ) : null;
            })}
          </div>
        )}

        {!editingOrder && (
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddDraft}>
              Đẩy xuống bảng chờ
            </Button>
          </div>
        )}
      </Form>

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