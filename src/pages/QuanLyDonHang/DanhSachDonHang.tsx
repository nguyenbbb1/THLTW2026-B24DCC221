import React from 'react';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import { Order } from './types';
import { mockCustomers } from './mockData';

interface DanhSachDonHangProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onCancelOrder: (id: string) => void;
}

const DanhSachDonHang: React.FC<DanhSachDonHangProps> = ({ orders, onEdit, onCancelOrder }) => {
  const getCustomerName = (id: string) => {
    return mockCustomers.find(c => c.id === id)?.name || 'Không xác định';
  };

  const statusColors: Record<string, string> = {
    'Chờ xác nhận': 'orange',
    'Đang giao': 'blue',
    'Hoàn thành': 'green',
    'Hủy': 'red',
  };

  const columns = [
    {
      title: 'Mã ĐH',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_: any, record: Order) => getCustomerName(record.customerId),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: 'Tổng tiền (VNĐ)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => amount.toLocaleString(),
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Chờ xác nhận', value: 'Chờ xác nhận' },
        { text: 'Đang giao', value: 'Đang giao' },
        { text: 'Hoàn thành', value: 'Hoàn thành' },
        { text: 'Hủy', value: 'Hủy' },
      ],
      onFilter: (value: string | number | boolean, record: Order) => record.status === value,
      render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button type="link" onClick={() => onEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn hủy đơn hàng này?"
            onConfirm={() => onCancelOrder(record.id)}
            disabled={record.status !== 'Chờ xác nhận'}
            okText="Đồng ý"
            cancelText="Không"
          >
            <Button danger disabled={record.status !== 'Chờ xác nhận'}>Hủy Đơn</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={orders} rowKey="id" />;
};

export default DanhSachDonHang;