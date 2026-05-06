import React from 'react';
import { Row, Col, Card, Statistic, Progress, List, Tag, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UnorderedListOutlined,
  SyncOutlined
} from '@ant-design/icons';
import moment from 'moment';
import Chart from 'react-apexcharts';
import { Task } from './types';

const { Text } = Typography;

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  // 1. Phân tích số liệu cơ bản
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

  // Đã cập nhật: Xử lý loại trừ giá trị null cho task Không thời hạn
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'DONE' && t.deadline && moment(t.deadline).isBefore(moment(), 'day')
  ).length;

  // Tính phần trăm hoàn thành
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // 2. Phân tích dữ liệu cho Biểu đồ Trạng thái (Pie Chart)
  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
  const statusSeries = [todoTasks, inProgressTasks, completedTasks];
  const statusOptions: any = {
    labels: ['Cần làm', 'Đang làm', 'Hoàn thành'],
    colors: ['#fadb14', '#1890ff', '#52c41a'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
  };

  // 3. Phân tích dữ liệu cho Biểu đồ Ưu tiên (Donut Chart)
  const highPriority = tasks.filter((t) => t.priority === 'High').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'Medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'Low').length;
  const prioritySeries = [highPriority, mediumPriority, lowPriority];
  const priorityOptions: any = {
    labels: ['Cao', 'Trung bình', 'Thấp'],
    colors: ['#cf1322', '#fa8c16', '#389e0d'],
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '65%' } } },
  };

  // 4. Lọc danh sách công việc sắp đến hạn (loại trừ task Không thời hạn)
  const upcomingTasks = tasks
    .filter(t => t.status !== 'DONE' && t.deadline && moment(t.deadline).isSameOrAfter(moment(), 'day'))
    .sort((a, b) => moment(a.deadline!).valueOf() - moment(b.deadline!).valueOf())
    .slice(0, 5); // Lấy 5 công việc gần nhất

  return (
    <div style={{ paddingBottom: '24px' }}>
      {/* Row 1: Thống kê tổng quan */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Tổng số Task"
              value={totalTasks}
              prefix={<UnorderedListOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Đang thực hiện"
              value={inProgressTasks}
              prefix={<SyncOutlined spin style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Đã hoàn thành"
              value={completedTasks}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic
              title="Quá hạn"
              value={overdueTasks}
              valueStyle={{ color: overdueTasks > 0 ? '#cf1322' : '#3f8600' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Biểu đồ và Danh sách */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {/* Biểu đồ phân bố */}
        <Col xs={24} lg={16}>
          <Card title="Phân tích công việc" bordered={false} style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Row>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Text strong>Theo Trạng Thái</Text>
                {totalTasks > 0 ? (
                  <Chart options={statusOptions} series={statusSeries} type="pie" height={250} />
                ) : (
                  <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Chưa có dữ liệu</div>
                )}
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Text strong>Theo Độ Ưu Tiên</Text>
                {totalTasks > 0 ? (
                  <Chart options={priorityOptions} series={prioritySeries} type="donut" height={250} />
                ) : (
                  <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>Chưa có dữ liệu</div>
                )}
              </Col>
            </Row>

            <div style={{ marginTop: '20px' }}>
              <Text strong>Tiến độ tổng thể</Text>
              <Progress percent={completionRate} status={completionRate === 100 ? "success" : "active"} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </div>
          </Card>
        </Col>

        {/* Danh sách công việc sắp đến hạn */}
        <Col xs={24} lg={8}>
          <Card title="Sắp đến hạn (Top 5)" bordered={false} style={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <List
              itemLayout="horizontal"
              dataSource={upcomingTasks}
              locale={{ emptyText: 'Không có công việc nào sắp đến hạn' }}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text ellipsis style={{ maxWidth: '200px' }}>{item.title}</Text>}
                    description={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <ClockCircleOutlined /> {item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : 'Không thời hạn'}
                        </Text>
                        <Tag color={item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'green'}>
                          {item.priority}
                        </Tag>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;