export type OrderStatus = 'Chờ xác nhận' | 'Đang giao' | 'Hoàn thành' | 'Hủy';

export interface Customer {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
}