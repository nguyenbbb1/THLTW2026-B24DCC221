import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Typography, Space, Tag, Divider } from 'antd';
import paperImg from './image/paper.png';
import rockImg from './image/rock.png';
import scissorsImg from './image/scissors.png';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';

interface GameHistory {
  key: number;
  playerChoice: Choice;
  computerChoice: Choice;
  result: 'Thắng' | 'Thua' | 'Hòa';
  time: string;
}

const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

const choiceMap: Record<Choice, string> = {
  'Kéo': scissorsImg,
  'Búa': rockImg,
  'Bao': paperImg,
};

const KeoBuaBao: React.FC = () => {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [playerCurrent, setPlayerCurrent] = useState<Choice | null>(null);
  const [computerCurrent, setComputerCurrent] = useState<Choice | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('keobuabao_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Lỗi khi tải lịch sử:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('keobuabao_history', JSON.stringify(history));
  }, [history]);

  const onPlay = (playerChoice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayerCurrent(playerChoice);
    setComputerCurrent(computerChoice);

    let result: 'Thắng' | 'Thua' | 'Hòa';
    if (playerChoice === computerChoice) {
      result = 'Hòa';
    } else if (
      (playerChoice === 'Búa' && computerChoice === 'Kéo') ||
      (playerChoice === 'Kéo' && computerChoice === 'Bao') ||
      (playerChoice === 'Bao' && computerChoice === 'Búa')
    ) {
      result = 'Thắng';
    } else {
      result = 'Thua';
    }

    const newEntry: GameHistory = {
      key: Date.now(),
      playerChoice,
      computerChoice,
      result,
      time: new Date().toLocaleTimeString(),
    };

    setHistory([newEntry, ...history]);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('keobuabao_history');
  };

  const columns = [
    { title: 'Thời gian', dataIndex: 'time', key: 'time', align: 'center' as const },
    { title: 'Bạn', dataIndex: 'playerChoice', key: 'playerChoice', align: 'center' as const },
    { title: 'Máy', dataIndex: 'computerChoice', key: 'computerChoice', align: 'center' as const },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      align: 'center' as const,
      render: (res: string) => (
        <Tag color={res === 'Thắng' ? 'green' : res === 'Thua' ? 'red' : 'gold'}>
          {res.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <Card bordered={false} style={{ background: '#f0f2f5', minHeight: '100vh', paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 60, padding: '40px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>BẠN</Title>
          <div style={boxStyle}>
            {playerCurrent ? <img src={choiceMap[playerCurrent]} alt="you" style={imgStyle} /> : <Text type="secondary">?</Text>}
          </div>
        </div>

        <Title level={1} style={{ color: '#1890ff', margin: 0, fontSize: '48px' }}>VS</Title>

        <div style={{ textAlign: 'center' }}>
          <Title level={4}>MÁY</Title>
          <div style={boxStyle}>
            {computerCurrent ? <img src={choiceMap[computerCurrent]} alt="bot" style={imgStyle} /> : <Text type="secondary">?</Text>}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Space size={24}>
          {choices.map((item) => (
            <Button
              key={item}
              onClick={() => onPlay(item)}
              style={{ width: 130, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <img src={choiceMap[item]} alt={item} style={{ width: 55, marginBottom: 8 }} />
              <Text strong>{item}</Text>
            </Button>
          ))}
        </Space>
      </div>

      <Divider orientation="center">LỊCH SỬ VÁN ĐẤU</Divider>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card 
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Lịch sử chi tiết</span>
                    <Button danger size="small" onClick={clearHistory}>Xóa lịch sử</Button>
                </div>
            } 
            style={{ width: '100%', maxWidth: 850, borderRadius: 8 }}
        >
          <Table 
            dataSource={history} 
            columns={columns} 
            pagination={{ pageSize: 5 }} 
            size="middle" 
          />
        </Card>
      </div>
    </Card>
  );
};

const boxStyle: React.CSSProperties = {
  width: 160,
  height: 160,
  background: '#fff',
  border: '1px solid #e8e8e8',
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
};

const imgStyle: React.CSSProperties = {
  width: '75%',
  height: '75%',
  objectFit: 'contain'
};

export default KeoBuaBao;