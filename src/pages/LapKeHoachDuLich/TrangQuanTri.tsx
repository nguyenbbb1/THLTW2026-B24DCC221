import React, { useContext, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Card, Row, Col, Statistic } from 'antd';
import { AppContext } from './index';
import { IDestination } from './types';

const { Option } = Select;

const TrangQuanTri: React.FC = () => {
	const { destinations, setDestinations, itinerary } = useContext(AppContext)!;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [editingId, setEditingId] = useState<string | null>(null);

	// Thống kê phân tích
	const statsTotalRevenue = itinerary.reduce((sum, item) => sum + item.destination.price, 0);
	const statsPopularDest =
		[...itinerary].sort(
			(a, b) =>
				itinerary.filter((i) => i.destination.id === b.destination.id).length -
				itinerary.filter((i) => i.destination.id === a.destination.id).length,
		)[0]?.destination?.name || 'Chưa có dữ liệu';

	const handleOpenModal = (record?: IDestination) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue({
				...record,
				food: record.costs.food,
				accommodation: record.costs.accommodation,
				transport: record.costs.transport,
			});
		} else {
			setEditingId(null);
			form.resetFields();
		}
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		setDestinations((prev) => prev.filter((d) => d.id !== id));
	};

	const handleSave = (values: any) => {
		const newDest: IDestination = {
			id: editingId || Date.now().toString(),
			name: values.name,
			type: values.type,
			price: values.food + values.accommodation + values.transport, // Tự động tính giá tổng
			rating: values.rating,
			image: values.image || 'https://via.placeholder.com/500x300', // Mock upload
			description: values.description,
			visitTime: values.visitTime,
			costs: {
				food: values.food,
				accommodation: values.accommodation,
				transport: values.transport,
			},
		};

		if (editingId) {
			setDestinations((prev) => prev.map((d) => (d.id === editingId ? newDest : d)));
		} else {
			setDestinations((prev) => [...prev, newDest]);
		}
		setIsModalOpen(false);
	};

	const columns = [
		{ title: 'Tên địa điểm', dataIndex: 'name', key: 'name' },
		{ title: 'Loại hình', dataIndex: 'type', key: 'type', render: (text: string) => text.toUpperCase() },
		{ title: 'Tổng chi phí (đ)', dataIndex: 'price', key: 'price', render: (val: number) => val.toLocaleString() },
		{ title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: IDestination) => (
				<Space size='middle'>
					<Button type='link' onClick={() => handleOpenModal(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record.id)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={8}>
					<Card style={{ borderRadius: 0, borderTop: '4px solid #1890ff' }}>
						<Statistic title='Tổng lượt lịch trình đã tạo' value={itinerary.length} />
					</Card>
				</Col>
				<Col span={8}>
					<Card style={{ borderRadius: 0, borderTop: '4px solid #52c41a' }}>
						<Statistic title='Địa điểm phổ biến nhất' value={statsPopularDest} />
					</Card>
				</Col>
				<Col span={8}>
					<Card style={{ borderRadius: 0, borderTop: '4px solid #D93523' }}>
						<Statistic title='Dòng tiền tạo ra (đ)' value={statsTotalRevenue.toLocaleString()} />
					</Card>
				</Col>
			</Row>

			<Card
				title='Quản lý dữ liệu điểm đến'
				extra={
					<Button
						type='primary'
						style={{ backgroundColor: '#D93523', borderRadius: 0 }}
						onClick={() => handleOpenModal()}
					>
						+ Thêm mới
					</Button>
				}
				style={{ borderRadius: 0 }}
			>
				<Table columns={columns} dataSource={destinations} rowKey='id' pagination={{ pageSize: 5 }} />
			</Card>

			<Modal
				title={editingId ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				onOk={() => form.submit()}
				okButtonProps={{ style: { backgroundColor: '#D93523', borderRadius: 0 } }}
			>
				<Form form={form} layout='vertical' onFinish={handleSave}>
					<Form.Item name='name' label='Tên địa điểm' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='type' label='Loại hình' rules={[{ required: true }]}>
						<Select>
							<Option value='sea'>Biển</Option>
							<Option value='mountain'>Núi</Option>
							<Option value='city'>Thành phố</Option>
						</Select>
					</Form.Item>
					<Form.Item name='description' label='Mô tả'>
						<Input.TextArea />
					</Form.Item>
					<Form.Item name='image' label='URL Hình ảnh (Giả lập upload)'>
						<Input />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='visitTime' label='Thời gian tham quan (h)' rules={[{ required: true }]}>
								<InputNumber style={{ width: '100%' }} min={1} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='rating' label='Đánh giá (1-5)' rules={[{ required: true }]}>
								<InputNumber style={{ width: '100%' }} min={1} max={5} step={0.1} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item name='food' label='Chi phí ăn uống' rules={[{ required: true }]}>
								<InputNumber style={{ width: '100%' }} min={0} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='accommodation' label='Chi phí lưu trú' rules={[{ required: true }]}>
								<InputNumber style={{ width: '100%' }} min={0} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='transport' label='Chi phí di chuyển' rules={[{ required: true }]}>
								<InputNumber style={{ width: '100%' }} min={0} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

export default TrangQuanTri;
