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

export interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  products: Product[];
  totalAmount: number;
  status: OrderStatus;
  quantity: number;
}