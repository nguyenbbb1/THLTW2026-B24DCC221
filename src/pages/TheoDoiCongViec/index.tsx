import React, { useState, useEffect } from 'react';
import { Tabs, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DropResult } from 'react-beautiful-dnd';
import Dashboard from './Dashboard';
import KanbanBoard from './KanbanBoard';
import TaskList from './TaskList';
import TaskFormModal from './TaskFormModal';
import { Task, TaskStatus } from './types';
import { getSharedStyles } from './SharedStyles';

const { TabPane } = Tabs;

const STORAGE_KEY = 'PERSONAL_TASKS_DATA';

const TheoDoiCongViec: React.FC = () => {
  const styles = getSharedStyles();

  // State quản lý danh sách Tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // State quản lý Modal Form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load dữ liệu từ LocalStorage khi khởi tạo
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Lỗi parse dữ liệu từ localStorage", error);
      }
    }
  }, []);

  // Lưu dữ liệu vào LocalStorage mỗi khi tasks thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Xử lý kéo thả Kanban
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === draggableId ? { ...task, status: newStatus } : task
      )
    );
    message.success('Đã cập nhật trạng thái công việc');
  };

  // Thêm mới hoặc Cập nhật
  const handleSaveTask = (values: Partial<Task>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => (t.id === editingTask.id ? { ...t, ...values } as Task : t)));
      message.success('Cập nhật thành công!');
    } else {
      const newTask: Task = {
        ...(values as Task),
        id: Date.now().toString(),
        tags: values.tags || [],
      };
      setTasks(prev => [...prev, newTask]);
      message.success('Thêm mới thành công!');
    }
    setIsModalVisible(false);
    setEditingTask(null);
  };

  // Xóa task
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    message.success('Đã xóa công việc');
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalVisible(true);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={styles.title}>Quản Lý Công Việc Cá Nhân</h2>
        <Button style={{...styles.button, width: 'auto'}} icon={<PlusOutlined />} onClick={openAddModal}>
          Thêm Công Việc
        </Button>
      </div>

      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Dashboard" key="1">
          <Dashboard tasks={tasks} />
        </TabPane>
        <TabPane tab="Kanban Board" key="2">
          <KanbanBoard tasks={tasks} onDragEnd={handleDragEnd} />
        </TabPane>
        <TabPane tab="Danh sách (Table)" key="3">
          <TaskList
            tasks={tasks}
            onEdit={(task) => { setEditingTask(task); setIsModalVisible(true); }}
            onDelete={handleDeleteTask}
          />
        </TabPane>
      </Tabs>

      <TaskFormModal
        visible={isModalVisible}
        onCancel={() => { setIsModalVisible(false); setEditingTask(null); }}
        onFinish={handleSaveTask}
        initialValues={editingTask}
      />
    </div>
  );
};

export default TheoDoiCongViec;