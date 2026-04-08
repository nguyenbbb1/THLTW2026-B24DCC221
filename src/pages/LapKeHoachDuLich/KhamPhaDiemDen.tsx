import React, { useState, useContext } from 'react';
import { Row, Col, Card, Select, Input, Rate, Button, Typography, Tag, message } from 'antd';
import { AppContext } from './index';
import { IDestination } from './types';
import { getSystemStyles } from './SharedStyles';

const { Meta } = Card;
const { Option } = Select;
const { Title, Text } = Typography;

const KhamPhaDiemDen: React.FC = () => {
	const { destinations, setItinerary } = useContext(AppContext)!;
	const [filterType, setFilterType] = useState<string>('all');
	const [sortOrder, setSortOrder] = useState<string>('default');
	const [searchText, setSearchText] = useState<string>('');

	const styles = getSystemStyles();

	// Logic Lọc & Sắp xếp
	let processedData = [...destinations];

	if (filterType !== 'all') {
		processedData = processedData.filter((d) => d.type === filterType);
	}

	if (searchText) {
		processedData = processedData.filter((d) => d.name.toLowerCase().includes(searchText.toLowerCase()));
	}

	if (sortOrder === 'price_asc') processedData.sort((a, b) => a.price - b.price);
	if (sortOrder === 'price_desc') processedData.sort((a, b) => b.price - a.price);
	if (sortOrder === 'rating_desc') processedData.sort((a, b) => b.rating - a.rating);

	const handleAddToItinerary = (destination: IDestination) => {
		setItinerary((prev) => [...prev, { id: Date.now().toString(), day: 1, destination }]);
		message.success(`Đã thêm ${destination.name} vào lịch trình!`);
	};

	return (
		<div style={{ padding: '20px' }}>
			<Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
				<Col xs={24} md={8}>
					<Input.Search
						placeholder='Tìm kiếm điểm đến...'
						onChange={(e) => setSearchText(e.target.value)}
						style={{ borderRadius: 0 }}
					/>
				</Col>
				<Col xs={24} md={8}>
					<Select defaultValue='all' style={{ width: '100%' }} onChange={setFilterType}>
						<Option value='all'>Tất cả loại hình</Option>
						<Option value='sea'>Biển</Option>
						<Option value='mountain'>Núi</Option>
						<Option value='city'>Thành phố</Option>
						<Option value='cave'>Hang động</Option>
					</Select>
				</Col>
				<Col xs={24} md={8}>
					<Select defaultValue='default' style={{ width: '100%' }} onChange={setSortOrder}>
						<Option value='default'>Sắp xếp mặc định</Option>
						<Option value='price_asc'>Giá: Thấp đến Cao</Option>
						<Option value='price_desc'>Giá: Cao đến Thấp</Option>
						<Option value='rating_desc'>Đánh giá: Cao nhất</Option>
					</Select>
				</Col>
			</Row>

			<Row gutter={[24, 24]}>
				{processedData.map((item) => (
					<Col xs={24} sm={12} lg={8} key={item.id}>
						<Card
							hoverable
							cover={<img alt={item.name} src={item.image} style={{ height: 200, objectFit: 'cover' }} />}
							actions={[
								<div style={{ padding: '0 10px' }}>
									{' '}
									<Button style={styles.button} onClick={() => handleAddToItinerary(item)}>
										Thêm vào lịch trình
									</Button>
								</div>,
							]}
						>
							<Meta
								title={
									<Title level={4} style={{ margin: 0 }}>
										{item.name}
									</Title>
								}
								description={
									<div style={{ marginTop: 10 }}>
										<Tag
											color={
												item.type === 'sea'
													? 'blue'
													: item.type === 'mountain'
													? 'green'
													: item.type === 'expedition' || item.type === 'cave'
													? 'gold'
													: 'geekblue'
											}
										>
											{item.type.toUpperCase()}
										</Tag>
										<div style={{ margin: '10px 0' }}>
											<Rate disabled defaultValue={item.rating} allowHalf />
										</div>
										<Text strong style={{ color: '#D93523', fontSize: '16px' }}>
											{item.price.toLocaleString('vi-VN')} VND
										</Text>
										<p style={{ marginTop: 10, color: '#666' }}>{item.description}</p>
									</div>
								}
							/>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default KhamPhaDiemDen;
