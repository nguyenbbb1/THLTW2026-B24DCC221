import { Customer, Product, Order } from './types';
import moment from 'moment';

export const mockCustomers: Customer[] = [
	{ id: 'KH001', name: 'Nguyễn Văn A' },
	{ id: 'KH002', name: 'Trần Thị B' },
	{ id: 'KH003', name: 'Lê Văn C' },
];

export const mockProducts: Product[] = [
	{ id: 'SP001', name: 'Laptop Dell XPS', price: 25000000 },
	{ id: 'SP002', name: 'Chuột Logitech MX Master 3', price: 2500000 },
	{ id: 'SP003', name: 'Bàn phím cơ Keychron', price: 1500000 },
	{ id: 'SP004', name: 'Màn hình LG 27 inch', price: 6000000 },
];

export const initialOrders: Order[] = [
	{
		id: 'DH001',
		customerId: 'KH001',
		orderDate: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
		items: [
			{ product: mockProducts[0], quantity: 1 },
			{ product: mockProducts[1], quantity: 2 }, // Đặt 2 con chuột
		],
		totalAmount: 30000000, // 25M + 2.5M*2
		status: 'Đang giao',
	},
	{
		id: 'DH002',
		customerId: 'KH002',
		orderDate: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
		items: [{ product: mockProducts[2], quantity: 1 }],
		totalAmount: 1500000,
		status: 'Chờ xác nhận',
	},
];
