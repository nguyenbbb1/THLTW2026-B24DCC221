import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Tag, Space, Typography } from 'antd';
import moment from 'moment';
import { Task, TaskStatus } from './types';

const { Text } = Typography;

interface KanbanBoardProps {
  tasks: Task[];
  onDragEnd: (result: DropResult) => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'TODO', title: 'Cần làm', color: '#f0f2f5' },
  { id: 'IN_PROGRESS', title: 'Đang làm', color: '#e6f7ff' },
  { id: 'DONE', title: 'Hoàn thành', color: '#f6ffed' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
        {COLUMNS.map((column) => {
          // Phân loại task theo từng cột trạng thái
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <div key={column.id} style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ padding: '10px', backgroundColor: column.color, fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
                {column.title} ({columnTasks.length})
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ background: '#f9f9f9', padding: '10px', minHeight: '500px' }}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style, marginBottom: '10px' }}
                          >
                            <Card size="small" title={task.title} hoverable>
                              <Space direction="vertical" style={{ width: '100%' }}>
                                <Text type="secondary">{task.description}</Text>

                                {/* Xử lý logic hiển thị Deadline có thể null */}
                                {task.deadline ? (
                                  <Text strong style={{ color: moment(task.deadline).isBefore(moment(), 'day') && task.status !== 'DONE' ? 'red' : 'inherit' }}>
                                    Hạn: {moment(task.deadline).format('DD/MM/YYYY')}
                                  </Text>
                                ) : (
                                  <Text type="secondary" italic>Không thời hạn</Text>
                                )}

                                <div>
                                  <Tag color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green'}>
                                    {task.priority}
                                  </Tag>
                                  {task.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                </div>
                              </Space>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;