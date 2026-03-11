import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Modal, Form, Input, Select, InputNumber, message, Tag, Typography, Space, Divider, Row, Col } from 'antd';
import { PlusOutlined, FileTextOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

interface Subject { id: string; name: string; code: string; credits: number; }
interface KnowledgeBlock { id: string; name: string; }
interface Question {
  id: string;
  subjectId: string;
  content: string;
  level: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  blockId: string;
}
interface ExamConfig {
  blockId: string;
  level: string;
  quantity: number;
}
interface Exam {
  id: string;
  subjectId: string;
  questions: Question[];
  config: ExamConfig[];
  createdAt: string;
}

const NganHangCauHoi: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [blocks] = useState<KnowledgeBlock[]>(() => {
    const saved = localStorage.getItem('blocks');
    return saved && saved !== "[]" ? JSON.parse(saved) : [
      { id: '1', name: 'Tổng quan' },
      { id: '2', name: 'Chuyên sâu' }
    ];
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('questions');
    return saved ? JSON.parse(saved) : [];
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('exams');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterSubject, setFilterSubject] = useState<string | null>(null);

  const [form] = Form.useForm();
  const [examForm] = Form.useForm();
  const [subjectForm] = Form.useForm();

  useEffect(() => { localStorage.setItem('subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('questions', JSON.stringify(questions)); }, [questions]);
  useEffect(() => { localStorage.setItem('exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('blocks', JSON.stringify(blocks)); }, [blocks]);

  const handleAddSubject = (values: any) => {
    const newSub: Subject = { ...values, id: `SUB-${Date.now()}` };
    setSubjects([...subjects, newSub]);
    setIsSubjectModalOpen(false);
    subjectForm.resetFields();
    message.success('Đã thêm môn học mới thành công!');
  };

  const handleAddQuestion = (values: any) => {
    const newQ: Question = { ...values, id: `Q-${Date.now()}` };
    setQuestions([...questions, newQ]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('Thêm câu hỏi vào ngân hàng thành công!');
  };

  const handleGenerateExam = (values: any) => {
    const { subjectId, configs } = values;
    if (!configs || configs.length === 0) {
      return message.warning('Vui lòng thêm ít nhất một yêu cầu cấu trúc đề!');
    }

    let selectedQuestions: Question[] = [];
    let isError = false;

    configs.forEach((cfg: ExamConfig) => {
      const pool = questions.filter(q => 
        q.subjectId === subjectId && q.blockId === cfg.blockId && q.level === cfg.level
      );

      if (pool.length < cfg.quantity) {
        const blockName = blocks.find(b => b.id === cfg.blockId)?.name;
        message.error(`Không đủ câu hỏi: Khối ${blockName} - Mức ${cfg.level} (Hiện có: ${pool.length})`);
        isError = true;
      } else {
        const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, cfg.quantity);
        selectedQuestions = [...selectedQuestions, ...shuffled];
      }
    });

    if (isError) return;

    const newExam: Exam = {
      id: `DE-${Date.now()}`,
      subjectId,
      questions: selectedQuestions,
      config: configs,
      createdAt: new Date().toLocaleString(),
    };

    setExams([newExam, ...exams]);
    setIsExamModalOpen(false);
    examForm.resetFields();
    message.success('Tạo đề thi dựa trên cấu trúc thành công!');
  };


  const handleDeleteExam = (examId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa đề thi?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      onOk() {
        setExams(exams.filter(e => e.id !== examId));
        message.success('Đã xóa đề thi.');
      }
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    const relatedExams = exams.filter(ex => ex.questions.some(q => q.id === questionId));

    if (relatedExams.length > 0) {
      Modal.confirm({
        title: 'Câu hỏi đang được sử dụng!',
        content: `Câu hỏi này nằm trong ${relatedExams.length} đề thi. Nếu xóa câu hỏi, các đề thi liên quan cũng sẽ bị xóa. Bạn có chắc chắn?`,
        okText: 'Xóa tất cả',
        okType: 'danger',
        onOk() {
          const relatedExamIds = relatedExams.map(e => e.id);
          setExams(exams.filter(e => !relatedExamIds.includes(e.id)));
          setQuestions(questions.filter(q => q.id !== questionId));
          message.success('Đã xóa câu hỏi và các đề thi liên quan.');
        }
      });
    } else {
      setQuestions(questions.filter(q => q.id !== questionId));
      message.success('Đã xóa câu hỏi.');
    }
  };

  const handleDeleteSubject = (subjectId: string) => {
    const relatedQuestions = questions.filter(q => q.subjectId === subjectId);
    const relatedExams = exams.filter(e => e.subjectId === subjectId);

    if (relatedQuestions.length > 0 || relatedExams.length > 0) {
      Modal.confirm({
        title: 'Cảnh báo xóa dữ liệu liên kết!',
        content: `Môn học này có ${relatedQuestions.length} câu hỏi và ${relatedExams.length} đề thi liên quan. Nếu tiếp tục, toàn bộ các dữ liệu này sẽ bị xóa sạch.`,
        okText: 'Xác nhận xóa hết',
        okType: 'danger',
        onOk() {
          setExams(exams.filter(e => e.subjectId !== subjectId));
          setQuestions(questions.filter(q => q.subjectId !== subjectId));
          setSubjects(subjects.filter(s => s.id !== subjectId));
          message.success('Đã xóa môn học và toàn bộ dữ liệu liên quan.');
        }
      });
    } else {
      setSubjects(subjects.filter(s => s.id !== subjectId));
      message.success('Đã xóa môn học.');
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchSearch = q.content.toLowerCase().includes(searchText.toLowerCase());
    const matchSub = filterSubject ? q.subjectId === filterSubject : true;
    return matchSearch && matchSub;
  });

  return (
    <Card title={<Title level={3}>Hệ thống Ngân hàng câu hỏi</Title>} style={{ margin: 24 }} bordered={false}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="1. Danh mục & Môn học" key="1">
           <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsSubjectModalOpen(true)}>Thêm môn học mới</Button>
           <Table 
            style={{ marginTop: 16 }}
            dataSource={subjects} 
            rowKey="id"
            columns={[
              { title: 'Mã môn', dataIndex: 'code', key: 'code' },
              { title: 'Tên môn', dataIndex: 'name', key: 'name' },
              { title: 'Số tín chỉ', dataIndex: 'credits', key: 'credits' },
              { title: 'Thao tác', render: (_, r) => (
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSubject(r.id)} />
              )}
            ]}
           />
        </TabPane>

        <TabPane tab="2. Quản lý Câu hỏi" key="2">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}><Input prefix={<SearchOutlined />} placeholder="Tìm nội dung câu hỏi..." onChange={e => setSearchText(e.target.value)} /></Col>
            <Col span={6}>
              <Select placeholder="Lọc theo môn học" style={{ width: '100%' }} allowClear onChange={setFilterSubject}>
                {subjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
              </Select>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} disabled={subjects.length === 0}>
                Thêm câu hỏi
              </Button>
            </Col>
          </Row>
          <Table 
            dataSource={filteredQuestions} 
            rowKey="id" 
            columns={[
              { title: 'Nội dung', dataIndex: 'content', ellipsis: true },
              { title: 'Mức độ', dataIndex: 'level', render: (l) => <Tag color={l === 'Khó' || l === 'Rất khó' ? 'red' : 'blue'}>{l}</Tag> },
              { title: 'Môn học', render: (_, r) => subjects.find(s => s.id === r.subjectId)?.name || 'N/A' },
              { title: 'Khối KT', render: (_, r) => blocks.find(b => b.id === r.blockId)?.name || 'N/A' },
              { title: 'Thao tác', render: (_, r) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteQuestion(r.id)} /> }
            ]} 
          />
        </TabPane>

        <TabPane tab="3. Quản lý Đề thi" key="3">
          <Button type="primary" icon={<FileTextOutlined />} onClick={() => setIsExamModalOpen(true)} disabled={questions.length === 0}>
            Tạo đề thi tự động
          </Button>
          <Table 
            style={{ marginTop: 16 }}
            dataSource={exams} 
            rowKey="id"
            expandable={{
              expandedRowRender: record => (
                <div style={{ padding: '10px 40px', background: '#fafafa' }}>
                  <Divider orientation="left" plain>Nội dung câu hỏi trong đề</Divider>
                  {record.questions.map((q, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <Text strong>Câu {i + 1}:</Text> {q.content} <Tag style={{ marginLeft: 8 }}>{q.level}</Tag>
                    </div>
                  ))}
                </div>
              ),
            }}
            columns={[
              { title: 'Mã đề', dataIndex: 'id' },
              { title: 'Môn học', render: (_, r) => subjects.find(s => s.id === r.subjectId)?.name },
              { title: 'Số câu', render: (_, r) => r.questions.length },
              { title: 'Ngày tạo', dataIndex: 'createdAt' },
              { title: 'Thao tác', render: (_, r) => (
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteExam(r.id)} />
              )}
            ]}
          />
        </TabPane>
      </Tabs>

      <Modal title="Thêm môn học mới" visible={isSubjectModalOpen} onCancel={() => setIsSubjectModalOpen(false)} onOk={() => subjectForm.submit()} destroyOnClose>
        <Form form={subjectForm} layout="vertical" onFinish={handleAddSubject}>
          <Form.Item name="code" label="Mã môn học" rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}><Input placeholder="VD: TH01" /></Form.Item>
          <Form.Item name="name" label="Tên môn học" rules={[{ required: true, message: 'Vui lòng nhập tên môn!' }]}><Input placeholder="VD: Tin học cơ sở" /></Form.Item>
          <Form.Item name="credits" label="Số tín chỉ" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Thêm câu hỏi tự luận" visible={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleAddQuestion}>
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
            <Select placeholder="Chọn môn">{subjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="blockId" label="Khối kiến thức" rules={[{ required: true }]}>
            <Select placeholder="Chọn khối">{blocks.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="level" label="Mức độ khó" rules={[{ required: true }]}>
            <Select placeholder="Chọn độ khó">
              {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(l => <Option key={l} value={l}>{l}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true }]}><Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi..." /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Thiết lập cấu trúc đề thi" visible={isExamModalOpen} onCancel={() => setIsExamModalOpen(false)} onOk={() => examForm.submit()} width={700} destroyOnClose>
        <Form form={examForm} layout="vertical" onFinish={handleGenerateExam}>
          <Form.Item name="subjectId" label="Chọn môn học tạo đề" rules={[{ required: true }]}>
            <Select placeholder="Chọn môn">{subjects.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}</Select>
          </Form.Item>
          
          <Text strong>Cấu trúc câu hỏi (Nhấn nút để thêm dòng):</Text>
          <Form.List name="configs">
            {(fields, { add, remove }) => (
              <div style={{ marginTop: 8 }}>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'blockId']} rules={[{ required: true, message: 'Chọn khối' }]}>
                      <Select placeholder="Khối kiến thức" style={{ width: 160 }}>
                        {blocks.map(b => <Option key={b.id} value={b.id}>{b.name}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'level']} rules={[{ required: true, message: 'Chọn mức' }]}>
                      <Select placeholder="Mức độ" style={{ width: 120 }}>
                        {['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(l => <Option key={l} value={l}>{l}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'Số lượng' }]}>
                      <InputNumber min={1} placeholder="Số câu" style={{ width: 90 }} />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm tiêu chí lựa chọn</Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
};

export default NganHangCauHoi;