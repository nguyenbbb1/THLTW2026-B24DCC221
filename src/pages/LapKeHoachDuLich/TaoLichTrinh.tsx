import React, { useContext } from 'react';
import { List, Button, InputNumber, Typography, Row, Col, Popconfirm, Divider } from 'antd';
import { DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { AppContext } from './index';
import { getSystemStyles } from './SharedStyles';

const { Title, Text } = Typography;

const TaoLichTrinh: React.FC = () => {
	const { itinerary, setItinerary } = useContext(AppContext)!;
	const styles = getSystemStyles('info');

	const handleRemove = (id: string) => {
		setItinerary((prev) => prev.filter((item) => item.id !== id));
	};

	const handleChangeDay = (id: string, day: number | null) => {
		if (!day) return;
		setItinerary((prev) => prev.map((item) => (item.id === id ? { ...item, day } : item)));
	};

	const handleMove = (index: number, direction: 'up' | 'down') => {
		if (direction === 'up' && index === 0) return;
		if (direction === 'down' && index === itinerary.length - 1) return;

		const newItinerary = [...itinerary];
		const targetIndex = direction === 'up' ? index - 1 : index + 1;
		[newItinerary[index], newItinerary[targetIndex]] = [newItinerary[targetIndex], newItinerary[index]];
		setItinerary(newItinerary);
	};

	// Tính toán
	const totalBudget = itinerary.reduce((sum, item) => sum + item.destination.price, 0);
	const totalTime = itinerary.reduce((sum, item) => sum + item.destination.visitTime, 0);

	// Group by Day
	const groupedItinerary = itinerary.reduce((acc, item) => {
		if (!acc[item.day]) acc[item.day] = [];
		acc[item.day].push(item);
		return acc;
	}, {} as Record<number, typeof itinerary>);

	return (
		<div style={{ padding: '20px' }}>
			<Row gutter={24}>
				<Col xs={24} md={16}>
					<Title level={3}>Danh sách các điểm đến</Title>
					{Object.keys(groupedItinerary)
						.sort((a, b) => Number(a) - Number(b))
						.map((day) => (
							<div key={day} style={{ marginBottom: 30 }}>
								<div style={styles.badge}>Ngày {day}</div>
								<List
									itemLayout='horizontal'
									dataSource={groupedItinerary[Number(day)]}
									renderItem={(item, index) => {
										const globalIndex = itinerary.findIndex((i) => i.id === item.id);
										return (
											<List.Item
												style={{ background: '#fff', padding: 15, marginBottom: 10, borderLeft: '3px solid #D93523' }}
												actions={[
													<Button type='text' icon={<UpOutlined />} onClick={() => handleMove(globalIndex, 'up')} />,
													<Button
														type='text'
														icon={<DownOutlined />}
														onClick={() => handleMove(globalIndex, 'down')}
													/>,
													<InputNumber
														min={1}
														value={item.day}
														onChange={(val) => handleChangeDay(item.id, val)}
														title='Chuyển ngày'
													/>,
													<Popconfirm title='Xóa điểm đến này?' onConfirm={() => handleRemove(item.id)}>
														<Button danger icon={<DeleteOutlined />} />
													</Popconfirm>,
												]}
											>
												<List.Item.Meta
													avatar={
														<img
															src={item.destination.image}
															alt={item.destination.name}
															style={{ width: 80, height: 60, objectFit: 'cover' }}
														/>
													}
													title={<b>{item.destination.name}</b>}
													description={`Thời gian: ${
														item.destination.visitTime
													}h | Chi phí: ${item.destination.price.toLocaleString()} đ`}
												/>
											</List.Item>
										);
									}}
								/>
							</div>
						))}
					{itinerary.length === 0 && <div style={styles.messageBox}>Chưa có điểm đến nào trong lịch trình.</div>}
				</Col>

				<Col xs={24} md={8}>
					<div style={styles.card}>
						<Title level={4} style={styles.title}>
							Tổng quan lịch trình
						</Title>
						<Divider />
						<div style={{ textAlign: 'left', fontSize: 16, lineHeight: '2' }}>
							<p>
								<b>Số điểm đến:</b> {itinerary.length}
							</p>
							<p>
								<b>Tổng thời gian:</b> {totalTime} giờ
							</p>
							<p>
								<b>Dự toán chi phí:</b>
							</p>
							<Title level={2} style={{ color: '#D93523', marginTop: 0 }}>
								{totalBudget.toLocaleString('vi-VN')} đ
							</Title>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default TaoLichTrinh;
