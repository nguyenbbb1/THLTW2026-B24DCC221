import React, { useState, useEffect } from 'react';

const DoanSo: React.FC = () => {
	const [targetNumber, setTargetNumber] = useState<number>(0);
	const [guess, setGuess] = useState<string>('');
	const [attemptsLeft, setAttemptsLeft] = useState<number>(10);
	const [message, setMessage] = useState<string>('Hệ thống đã chọn một số bí mật (1-100)');
	const [status, setStatus] = useState<'info' | 'success' | 'error' | 'warning'>('info');
	const [isGameOver, setIsGameOver] = useState<boolean>(false);

	const initGame = () => {
		const winRate36 = 25;
		const roll = Math.floor(Math.random() * 100) + 1;
		const finalTarget = roll <= winRate36 ? 36 : Math.floor(Math.random() * 100) + 1;

		setTargetNumber(finalTarget);
		setAttemptsLeft(10);
		setMessage('Bắt đầu lượt chơi mới! Chúc bạn may mắn.');
		setStatus('info');
		setIsGameOver(false);
		setGuess('');
	};

	useEffect(() => {
		initGame();
	}, []);

	const handleGuess = (e: React.FormEvent) => {
		e.preventDefault();
		const userGuess = parseInt(guess);

		if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
			setMessage('Lỗi: Vui lòng nhập số trong khoảng 1 - 100.');
			setStatus('error');
			return;
		}

		const currentAttempts = attemptsLeft - 1;
		setAttemptsLeft(currentAttempts);

		if (userGuess === targetNumber) {
			setMessage(`CHÚC MỪNG! Bạn đã đoán đúng số ${targetNumber}!`);
			setStatus('success');
			setIsGameOver(true);
		} else if (currentAttempts === 0) {
			setMessage(`GAME OVER! Số đúng là: ${targetNumber}.`);
			setStatus('error');
			setIsGameOver(true);
		} else {
			const hint = userGuess < targetNumber ? 'THẤP' : 'CAO';
			setMessage(`Bạn đoán quá ${hint}! Thử lại nhé.`);
			setStatus('warning');
		}
		setGuess('');
	};

	const styles: { [key: string]: React.CSSProperties } = {
		container: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			minHeight: '80vh',
			backgroundColor: '#f4f7f9',
			padding: '20px',
		},
		card: {
			width: '100%',
			maxWidth: '400px',
			backgroundColor: '#fff',
			padding: '40px',
			borderRadius: '0px',
			boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
			textAlign: 'center',
			borderTop: '5px solid #D93523', // Thêm viền màu chủ đạo
		},
		title: { fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginBottom: '10px' },
		badge: {
			display: 'inline-block',
			padding: '5px 15px',
			borderRadius: '0px',
			backgroundColor: '#fdeaea',
			fontSize: '14px',
			color: '#D93523',
			marginBottom: '20px', // Màu đỏ #D93523
		},
		messageBox: {
			padding: '15px',
			borderRadius: '0px',
			marginBottom: '25px',
			fontSize: '15px',
			backgroundColor:
				status === 'success'
					? '#def7ec'
					: status === 'error'
					? '#fde8e8'
					: status === 'warning'
					? '#fef3c7'
					: '#fdeaea',
			color:
				status === 'success'
					? '#03543f'
					: status === 'error'
					? '#9b1c1c'
					: status === 'warning'
					? '#92400e'
					: '#D93523',
		},
		input: {
			width: '100%',
			padding: '12px 15px',
			borderRadius: '0px',
			border: '1px solid #e2e8f0',
			fontSize: '16px',
			marginBottom: '15px',
			outline: 'none',
			textAlign: 'center',
		},
		button: {
			width: '100%',
			padding: '12px',
			borderRadius: '0px',
			border: 'none',
			backgroundColor: '#D93523',
			color: '#fff',
			fontSize: '16px',
			fontWeight: '600', // Nút màu #D93523
			cursor: 'pointer',
			transition: 'background 0.2s',
		},
		resetBtn: { backgroundColor: '#2d3748' },
	};

	return (
		<div style={styles.container}>
			<div style={styles.card}>
				<h1 style={styles.title}>Trò Chơi Đoán Số</h1>
				<div style={styles.badge}>Số lượt còn lại: {attemptsLeft}</div>
				<div style={styles.messageBox}>{message}</div>
				{!isGameOver ? (
					<form onSubmit={handleGuess}>
						<input
							style={styles.input}
							type='number'
							value={guess}
							onChange={(e) => setGuess(e.target.value)}
							placeholder='Nhập con số may mắn...'
							autoFocus
						/>
						<button type='submit' style={styles.button}>
							Xác nhận dự đoán
						</button>
					</form>
				) : (
					<button onClick={initGame} style={{ ...styles.button, ...styles.resetBtn }}>
						Chơi lại ngay
					</button>
				)}
			</div>
		</div>
	);
};

export default DoanSo;
