import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio } from 'antd';
import moment from 'moment';
import { Task } from './types';
import { getSharedStyles } from './SharedStyles';

const { Option } = Select;

interface TaskFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: Partial<Task>) => void;
  initialValues?: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ visible, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();
  const styles = getSharedStyles();
  const [deadlineType, setDeadlineType] = useState<'none' | 'today' | 'tomorrow' | 'custom'>('none');

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        let type: 'none' | 'today' | 'tomorrow' | 'custom' = 'none';
        let dateObj = null;

        if (initialValues.deadline) {
          const mDate = moment(initialValues.deadline);
          if (mDate.isSame(moment(), 'day')) {
            type = 'today';
          } else if (mDate.isSame(moment().add(1, 'days'), 'day')) {
            type = 'tomorrow';
          } else {
            type = 'custom';
            dateObj = mDate;
          }
        }

        setDeadlineType(type);
        form.setFieldsValue({
          ...initialValues,
          deadlineType: type,
          deadlineDate: dateObj,
        });
      } else {
        setDeadlineType('none');
        form.resetFields();
        // Thiết lập giá trị mặc định khi mở form thêm mới
        form.setFieldsValue({
          deadlineType: 'none',
          status: 'TODO'
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      let finalDeadline: string | null = null;

      if (values.deadlineType === 'today') {
        finalDeadline = moment().endOf('day').toISOString();
      } else if (values.deadlineType === 'tomorrow') {
        finalDeadline = moment().add(1, 'days').endOf('day').toISOString();
      } else if (values.deadlineType === 'custom') {
        finalDeadline = values.deadlineDate.toISOString();
      } // Nếu 'none', finalDeadline giữ nguyên là null

      onFinish({
        ...values,
        deadline: finalDeadline,
      });
    });
  };

  return (
    <Modal
      title={initialValues ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      width={600}
    >
      <div style={{ ...styles.messageBox, backgroundColor: '#f4f7f9', color: '#2c3e50', border: '1px solid #e2e8f0' }}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tên công việc" rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}>
            <Input placeholder="Nhập tên..." style={styles.input} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết..." style={{...styles.input, textAlign: 'left'}} />
          </Form.Item>

          <Form.Item label="Hạn hoàn thành" required>
            <Form.Item name="deadlineType" noStyle>
              <Radio.Group onChange={(e) => setDeadlineType(e.target.value)} style={{ marginBottom: 15, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Radio.Button value="none">Không thời hạn</Radio.Button>
                <Radio.Button value="today">Hôm nay</Radio.Button>
                <Radio.Button value="tomorrow">Ngày mai</Radio.Button>
                <Radio.Button value="custom">Tùy chọn ngày</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {deadlineType === 'custom' && (
              <Form.Item name="deadlineDate" rules={[{ required: true, message: 'Vui lòng chọn ngày cụ thể!' }]} noStyle>
                <DatePicker style={{ width: '100%', marginTop: '8px' }} format="DD/MM/YYYY" placeholder="Chọn ngày hoàn thành" />
              </Form.Item>
            )}
          </Form.Item>

          {/* Trường trạng thái mới được bổ sung */}
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
            <Select placeholder="Chọn trạng thái">
              <Option value="TODO">Cần làm</Option>
              <Option value="IN_PROGRESS">Đang làm</Option>
              <Option value="DONE">Hoàn thành</Option>
            </Select>
          </Form.Item>

          <Form.Item name="priority" label="Độ ưu tiên" rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên!' }]}>
            <Select placeholder="Chọn độ ưu tiên">
              <Option value="High">Cao</Option>
              <Option value="Medium">Trung bình</Option>
              <Option value="Low">Thấp</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Nhập tags..." />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default TaskFormModal;