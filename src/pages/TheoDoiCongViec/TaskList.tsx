import React, { useState } from 'react';
import { Table, Tag, Button, Space, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Task } from './types';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const [searchText, setSearchText] = useState('');

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: Task, b: Task) => a.title.localeCompare(b.title),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text: string | null) => text ? moment(text).format('DD/MM/YYYY') : <Tag>Không thời hạn</Tag>,
      sorter: (a: Task, b: Task) => {
        if (!a.deadline) return 1;  // Đẩy task không thời hạn xuống cuối
        if (!b.deadline) return -1;
        return moment(a.deadline).unix() - moment(b.deadline).unix();
      },
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        { text: 'Cao', value: 'High' },
        { text: 'Trung bình', value: 'Medium' },
        { text: 'Thấp', value: 'Low' },
      ],
      onFilter: (value: any, record: Task) => record.priority === value,
      render: (priority: string) => {
        let color = priority === 'High' ? 'red' : priority === 'Medium' ? 'orange' : 'green';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Cần làm', value: 'TODO' },
        { text: 'Đang làm', value: 'IN_PROGRESS' },
        { text: 'Hoàn thành', value: 'DONE' },
      ],
      onFilter: (value: any, record: Task) => record.status === value,
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          'TODO': 'Cần làm',
          'IN_PROGRESS': 'Đang làm',
          'DONE': 'Hoàn thành'
        };
        return <Tag>{statusMap[status]}</Tag>;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
        </>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Tìm kiếm công việc..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={filteredTasks}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TaskList;