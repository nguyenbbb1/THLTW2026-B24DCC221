import React, { useState, useCallback, useEffect } from 'react';
import { Typography, Statistic, Row, Col, message, InputNumber, Button, Space, Input } from 'antd';
import { DollarCircleOutlined, FireOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SYMBOLS_CONFIG = [
  { icon: '🍎', label: 'Táo', win2_refund: 0.1, win2_bonus: 0.0, win3_bonus: 0.1 },
  { icon: '🍊', label: 'Cam', win2_refund: 0.1, win2_bonus: 0.1, win3_bonus: 0.2 },
  { icon: '🍋', label: 'Chanh', win2_refund: 0.2, win2_bonus: 0.2, win3_bonus: 0.3 },
  { icon: '🍉', label: 'Dưa hấu', win2_refund: 0.3, win2_bonus: 0.3, win3_bonus: 0.4 },
  { icon: '🍒', label: 'Anh đào', win2_refund: 0.4, win2_bonus: 0.4, win3_bonus: 0.5 },
  { icon: '🍍', label: 'Dứa', win2_refund: 0.5, win2_bonus: 0.5, win3_bonus: 0.6 },
  { icon: '🍇', label: 'Nho', win2_refund: 0.6, win2_bonus: 0.6, win3_bonus: 0.7 },
  { icon: '⭐', label: 'Sao', win2_refund: 0.7, win2_bonus: 0.7, win3_bonus: 0.8 },
  { icon: '🔔', label: 'Chuông', win2_refund: 0.8, win2_bonus: 0.8, win3_bonus: 0.9 },
  { icon: '7️⃣', label: 'Số 7', win2_refund: 0.9, win2_bonus: 0.9, win3_bonus: 1.0 },
  { icon: '💎', label: 'Kim cương', win2_refund: 1.0, win2_bonus: 1.0, win3_bonus: 3.0, isJackpot: true },
];

const THEME_COLOR = '#D93523';

const SlotMachine: React.FC = () => {
  const [reels, setReels] = useState(['💎', '💎', '💎']);
  const [spinningStates, setSpinningStates] = useState([false, false, false]);
  const [isPulling, setIsPulling] = useState(false);
  
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('slot_balance');
    return saved !== null ? JSON.parse(saved) : 1190;
  });
  const [winAmount, setWinAmount] = useState<number>(() => {
    const saved = localStorage.getItem('slot_winAmount');
    return saved !== null ? JSON.parse(saved) : 0;
  });
  const [betAmount, setBetAmount] = useState<number>(() => {
    const saved = localStorage.getItem('slot_betAmount');
    return saved !== null ? JSON.parse(saved) : 10;
  });
  const [debt, setDebt] = useState<number>(() => {
    const saved = localStorage.getItem('slot_debt');
    return saved !== null ? JSON.parse(saved) : 0;
  });
  const [spinsSinceLoan, setSpinsSinceLoan] = useState<number>(() => {
    const saved = localStorage.getItem('slot_spinsSinceLoan');
    return saved !== null ? JSON.parse(saved) : 0;
  });

  const [bankInput, setBankInput] = useState<string>('');
  const [forceJackpot, setForceJackpot] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('slot_balance', JSON.stringify(balance));
    localStorage.setItem('slot_winAmount', JSON.stringify(winAmount));
    localStorage.setItem('slot_betAmount', JSON.stringify(betAmount));
    localStorage.setItem('slot_debt', JSON.stringify(debt));
    localStorage.setItem('slot_spinsSinceLoan', JSON.stringify(spinsSinceLoan));
  }, [balance, winAmount, betAmount, debt, spinsSinceLoan]);

  const performReset = () => {
    setBalance(1190);
    setDebt(0);
    setSpinsSinceLoan(0);
    setWinAmount(0);
    setBetAmount(10);
    setBankInput('');
    message.warning("Đã reset toàn bộ dữ liệu về trạng thái ban đầu!");
  };

  const handleBorrow = () => {
    if (bankInput === 'reset') {
      performReset();
      return;
    }

    if (bankInput === 'admin') {
      setBalance(prev => prev + 1000000000);
      message.success("Thần tài đến !!!");
      setBankInput('');
      return;
    }

    if (bankInput === 'JACKPOT') {
      setForceJackpot(true);
      message.success("Bạn đột nhiên cảm thấy may mắn tràn trề ??");
      setBankInput('');
      return;
    }

    const amount = parseFloat(bankInput);
    if (isNaN(amount) || amount <= 0) return;
    
    if (debt > 0) {
      message.error("Bạn phải trả hết nợ cũ để reset lượt miễn phí lãi!");
      return;
    }
    
    setBalance(prev => prev + amount);
    setDebt(amount);
    setSpinsSinceLoan(0);
    setBankInput('');
    message.success(`Đã vay $${amount}. Bạn có 10 lượt quay không tính lãi.`);
  };

  const handleRepay = () => {
    if (bankInput === 'reset') {
      performReset();
      return;
    }

    if (bankInput === 'admin') {
      setDebt(0);
      setSpinsSinceLoan(0);
      message.success("Xóa sạch nợ nần !?");
      setBankInput('');
      return;
    }

    const amount = parseFloat(bankInput);
    if (isNaN(amount) || amount <= 0) return;
    
    if (balance < amount) {
      message.error("Số dư không đủ để trả nợ!");
      return;
    }
    
    const payValue = Math.min(amount, debt);
    setBalance(prev => prev - payValue);
    setDebt(prev => prev - payValue);
    
    if (debt - payValue <= 0) {
      setSpinsSinceLoan(0);
      setDebt(0);
      message.success("Đã trả hết nợ. Lượt miễn phí lãi đã được reset.");
    } else {
      message.success(`Đã trả $${payValue}.`);
    }
    setBankInput('');
  };

  const calculatePrize = (finalReels: string[], currentBet: number) => {
    const [r1, r2, r3] = finalReels;
    if (r1 === r2 && r2 === r3) {
      const config = SYMBOLS_CONFIG.find(s => s.icon === r1);
      if (config) {
        if (config.isJackpot) {
          return (currentBet * config.win3_bonus * 1000) + currentBet;
        }
        return (currentBet * config.win3_bonus) + currentBet;
      }
    }
    if (r1 === r2 || r2 === r3 || r1 === r3) {
      const commonIcon = (r1 === r2 || r1 === r3) ? r1 : r2;
      const config = SYMBOLS_CONFIG.find(s => s.icon === commonIcon);
      if (config) {
        return (currentBet * config.win2_refund) + (currentBet * config.win2_bonus);
      }
    }
    return 0;
  };

  const handleSpin = useCallback(() => {
    if (spinningStates.some(s => s) || isPulling) return;
    const currentBet = betAmount || 0;
    if (currentBet <= 0) {
      message.error('Vui lòng nhập số tiền cược hợp lệ.');
      return;
    }

    if (balance < currentBet) {
      message.warning('Số dư không đủ!');
      return;
    }

    setIsPulling(true);
    setWinAmount(0);
    setBalance(prev => prev - currentBet);

    let interestToAdd = 0;
    if (debt > 0 && spinsSinceLoan >= 10) {
      interestToAdd = Math.round(debt * 0.05);
      setDebt(prev => prev + interestToAdd);
      message.info(`Lãi 5% ($${interestToAdd}) đã được cộng vào khoản nợ của bạn!`);
    }

    setTimeout(() => {
      setIsPulling(false);
      setSpinningStates([true, true, true]);
      const results: string[] = [];

      if (forceJackpot) {
        results[0] = '💎';
        results[1] = '💎';
        results[2] = '💎';
        setForceJackpot(false);
      } else {
        results[0] = SYMBOLS_CONFIG[Math.floor(Math.random() * SYMBOLS_CONFIG.length)].icon;

        if (Math.random() * 100 <= 30) {
          results[1] = results[0];
        } else {
          const others = SYMBOLS_CONFIG.filter(s => s.icon !== results[0]);
          results[1] = others[Math.floor(Math.random() * others.length)].icon;
        }

        const rand3 = Math.random() * 100;
        if (results[0] === results[1]) {
          const threshold = results[0] === '💎' ? 0.1 : 1.0; 
          if (rand3 <= threshold) {
            results[2] = results[0];
          } else {
            const others = SYMBOLS_CONFIG.filter(s => s.icon !== results[0]);
            results[2] = others[Math.floor(Math.random() * others.length)].icon;
          }
        } else {
          if (rand3 <= 20) {
            results[2] = Math.random() > 0.5 ? results[0] : results[1];
          } else {
            const others = SYMBOLS_CONFIG.filter(s => s.icon !== results[0] && s.icon !== results[1]);
            results[2] = others[Math.floor(Math.random() * others.length)].icon;
          }
        }
      }

      setTimeout(() => {
        setReels(prev => [results[0], prev[1], prev[2]]);
        setSpinningStates([false, true, true]);
      }, 1500);
      setTimeout(() => {
        setReels(prev => [prev[0], results[1], prev[2]]);
        setSpinningStates([false, false, true]);
      }, 2200);
      setTimeout(() => {
        setReels(prev => [prev[0], prev[1], results[2]]);
        setSpinningStates([false, false, false]);
        
        const prize = calculatePrize(results, currentBet);
        setWinAmount(prize);
        setBalance(prev => prev + prize);
        if (debt > 0) setSpinsSinceLoan(prev => prev + 1);

        if (results[0] === results[1] && results[1] === results[2]) {
          const isDiamondJackpot = results[0] === '💎';
          message.success(isDiamondJackpot ? `🎰 MEGA DIAMOND JACKPOT x1000! +$${prize}` : `🔥 JACKPOT! +$${prize}`);
        } else if (prize > 0) {
          message.info(`Win: +$${prize}`);
        }
      }, 3000);
    }, 400); 
  }, [spinningStates, isPulling, balance, betAmount, debt, spinsSinceLoan, forceJackpot]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Row gutter={20} justify="center" style={{ width: '100%', maxWidth: '640px' }}>
          <Col span={8}>
            <div style={styles.statBox}>
              <Statistic title="SỐ DƯ" value={balance} prefix={<DollarCircleOutlined />} valueStyle={{ color: THEME_COLOR, fontWeight: 800 }} />
            </div>
          </Col>
          <Col span={8}>
            <div style={styles.statBox}>
              <Statistic title="THẮNG" value={winAmount} prefix="+" valueStyle={{ color: '#52c41a', fontWeight: 800 }} />
            </div>
          </Col>
          <Col span={8}>
            <div style={styles.statBox}>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>CƯỢC</Text>
              <InputNumber
                min={1}
                max={balance}
                value={betAmount}
                onChange={(val) => setBetAmount(val || 0)}
                disabled={spinningStates.some(s => s) || isPulling}
                style={{ width: '100%', fontWeight: 700 }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <div style={styles.gameArea}>
        <div style={styles.machineFrame}>
          <div style={styles.machineHeader}>
            <Title level={3} style={{ color: '#fff', margin: 0, letterSpacing: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
               <FireOutlined /> SLOT MACHINE <FireOutlined />
            </Title>
          </div>
          <div style={styles.reelsWrapper}>
            {reels.map((symbol, i) => (
              <div key={i} style={styles.reelColumn}>
                <div style={{
                  ...styles.symbolTrack,
                  animation: spinningStates[i] ? `infiniteScroll 0.5s linear infinite` : 'none',
                  animationDelay: `${i * 0.15}s`
                }}>
                  {spinningStates[i] ? (
                    [...SYMBOLS_CONFIG, ...SYMBOLS_CONFIG].map((s, idx) => <div key={idx} style={styles.symbolItem}>{s.icon}</div>)
                  ) : (
                    <div style={styles.symbolItem}>{symbol}</div>
                  )}
                </div>
              </div>
            ))}
            <div style={styles.glassOverlay} />
          </div>
          <div style={styles.footerInfo}>
             <Text style={{ color: '#fff', opacity: 0.8, fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>
                PULL THE LEVER • ${betAmount} PER SPIN
             </Text>
          </div>
        </div>
        <div 
          style={{
            ...styles.leverSystem,
            cursor: spinningStates.some(s => s) ? 'not-allowed' : 'pointer'
          }} 
          onClick={handleSpin}
        >
          <div style={{
            ...styles.leverRod, 
            transform: isPulling ? 'rotateX(55deg)' : 'rotateX(0)',
            backgroundColor: isPulling ? '#999' : '#ccc'
          }}>
            <div style={{
                ...styles.leverKnob,
                backgroundColor: spinningStates.some(s => s) ? '#444' : THEME_COLOR,
                top: isPulling ? '-15px' : '-30px'
            }} />
          </div>
          <div style={styles.leverBase} />
        </div>
      </div>

      <div style={styles.bankContainer}>
        <Title level={4} style={{ color: '#1a1a1a', marginBottom: '15px' }}>
          <BankOutlined /> NGÂN HÀNG NHÀ CÁI
        </Title>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Statistic title="TIỀN ĐANG NỢ" value={debt} prefix="$" valueStyle={{ color: '#cf1322' }} />
            {debt > 0 && (
                <Text type="danger" style={{ fontSize: '12px' }}>
                  {spinsSinceLoan < 10 ? `${10 - spinsSinceLoan} lượt miễn lãi còn lại` : "Đang tính lãi 5% vào nợ"}
                </Text>
            )}
          </Col>
          <Col span={8}>
            <Input
              value={bankInput}
              onChange={(e) => setBankInput(e.target.value)}
              style={{ width: '100%' }}
              placeholder="Nhập số tiền cần vay/trả"
            />
          </Col>
          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" danger block onClick={handleBorrow} disabled={spinningStates.some(s => s)}>
                VAY NỢ
              </Button>
              <Button block onClick={handleRepay} disabled={spinningStates.some(s => s)}>
                TRẢ NỢ
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <style>{`
        @keyframes infiniteScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  header: {
    marginBottom: '40px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  statBox: {
    backgroundColor: '#fff',
    padding: '12px 15px',
    borderRadius: '0px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    borderTop: `4px solid ${THEME_COLOR}`,
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  gameArea: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '35px',
    marginBottom: '40px'
  },
  machineFrame: {
    backgroundColor: '#1a1a1a',
    padding: '25px',
    borderRadius: '40px',
    boxShadow: `0 30px 60px rgba(0,0,0,0.3)`,
    border: `10px solid ${THEME_COLOR}`,
    width: '640px',
    textAlign: 'center',
    zIndex: 2,
    position: 'relative',
  },
  machineHeader: {
    paddingBottom: '20px',
  },
  reelsWrapper: {
    display: 'flex',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    padding: '15px',
    gap: '10px',
    height: '240px',
    overflow: 'hidden',
    position: 'relative',
    border: '4px solid #333',
  },
  reelColumn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '5px',
    position: 'relative',
    border: '1px solid #ddd',
  },
  symbolTrack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  symbolItem: {
    fontSize: '90px',
    height: '210px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(rgba(0,0,0,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.1) 100%)',
  },
  footerInfo: {
    marginTop: '25px',
  },
  leverSystem: {
    position: 'absolute',
    right: '-35px',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    perspective: '1000px',
  },
  leverRod: {
    width: '14px',
    height: '140px',
    backgroundColor: '#ccc',
    borderRadius: '10px',
    position: 'relative',
    transformOrigin: 'bottom center',
    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  leverKnob: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    position: 'absolute',
    left: '-15px',
    boxShadow: 'inset -5px -5px 12px rgba(0,0,0,0.4)',
    transition: 'background-color 0.3s, top 0.4s',
  },
  leverBase: {
    width: '45px',
    height: '75px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    marginTop: '-5px',
  },
  bankContainer: {
    width: '100%',
    maxWidth: '640px',
    backgroundColor: '#ffffff',
    padding: '20px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    textAlign: 'center'
  }
};

export default SlotMachine;