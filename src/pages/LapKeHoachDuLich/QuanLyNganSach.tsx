import React, { useContext, useState } from 'react';
import { Row, Col, Progress, Typography, InputNumber, Button, Divider, Alert } from 'antd';
import { AppContext } from './index';
import { getSystemStyles } from './SharedStyles';

const { Title, Text } = Typography;

const QuanLyNganSach: React.FC = () => {
	const { itinerary, budgetConfig, setBudgetConfig } = useContext(AppContext)!;
	const [inputBudget, setInputBudget] = useState<number>(budgetConfig.maxBudget);

	// Tính toán tổng hợp chi phí từ danh sách lịch trình
	const totalCosts = itinerary.reduce(
		(acc, item) => {
			acc.food += item.destination.costs.food;
			acc.accommodation += item.destination.costs.accommodation;
			acc.transport += item.destination.costs.transport;
			return acc;
		},
		{ food: 0, accommodation: 0, transport: 0 },
	);

	const totalUsed = totalCosts.food + totalCosts.accommodation + totalCosts.transport;
	const isExceeded = totalUsed > budgetConfig.maxBudget;

	const statusType = isExceeded ? 'error' : totalUsed / budgetConfig.maxBudget > 0.8 ? 'warning' : 'success';
	const styles = getSystemStyles(statusType);

	const handleUpdateBudget = () => {
		setBudgetConfig({ maxBudget: inputBudget });
	};

	return (
		<div style={{ padding: '20px' }}>
			<Row gutter={32}>
				<Col xs={24} md={10}>
					<div style={styles.card}>
						<Title level={4} style={styles.title}>
							Thiết lập ngân sách tổng
						</Title>
						<InputNumber
							style={styles.input}
							value={inputBudget}
							onChange={(val) => setInputBudget(val || 0)}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						/>
						<Button style={styles.button} onClick={handleUpdateBudget}>
							Cập nhật ngân sách
						</Button>
						<Divider />

						<div style={styles.messageBox}>
							<Text strong>Tình trạng: </Text>
							{isExceeded
								? `Vượt ngân sách ${(totalUsed - budgetConfig.maxBudget).toLocaleString()} đ!`
								: `Còn dư ${(budgetConfig.maxBudget - totalUsed).toLocaleString()} đ`}
						</div>
					</div>
				</Col>

				<Col xs={24} md={14}>
					<div style={{ background: '#fff', padding: 30, borderTop: '5px solid #2c3e50' }}>
						<Title level={3}>Phân bổ ngân sách</Title>

						{isExceeded && (
							<Alert
								message='Cảnh báo vượt ngân sách'
								description='Chi tiêu dự kiến của lịch trình đã vượt quá cấu hình ngân sách ban đầu. Vui lòng điều chỉnh lại lịch trình hoặc tăng ngân sách.'
								type='error'
								showIcon
								style={{ marginBottom: 20, borderRadius: 0 }}
							/>
						)}

						<div style={{ marginBottom: 20 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
								<Text>Ăn uống ({totalCosts.food.toLocaleString()} đ)</Text>
								<Text>{totalUsed > 0 ? ((totalCosts.food / totalUsed) * 100).toFixed(1) : 0}%</Text>
							</div>
							<Progress
								percent={totalUsed > 0 ? (totalCosts.food / totalUsed) * 100 : 0}
								showInfo={false}
								strokeColor='#D93523'
							/>
						</div>

						<div style={{ marginBottom: 20 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
								<Text>Lưu trú ({totalCosts.accommodation.toLocaleString()} đ)</Text>
								<Text>{totalUsed > 0 ? ((totalCosts.accommodation / totalUsed) * 100).toFixed(1) : 0}%</Text>
							</div>
							<Progress
								percent={totalUsed > 0 ? (totalCosts.accommodation / totalUsed) * 100 : 0}
								showInfo={false}
								strokeColor='#1890ff'
							/>
						</div>

						<div style={{ marginBottom: 20 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
								<Text>Di chuyển ({totalCosts.transport.toLocaleString()} đ)</Text>
								<Text>{totalUsed > 0 ? ((totalCosts.transport / totalUsed) * 100).toFixed(1) : 0}%</Text>
							</div>
							<Progress
								percent={totalUsed > 0 ? (totalCosts.transport / totalUsed) * 100 : 0}
								showInfo={false}
								strokeColor='#52c41a'
							/>
						</div>

						<Divider />
						<Title level={4}>
							Tổng chi phí ước tính: <span style={{ color: '#D93523' }}>{totalUsed.toLocaleString()} đ</span>
						</Title>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default QuanLyNganSach;
