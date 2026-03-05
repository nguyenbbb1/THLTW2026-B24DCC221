// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Card, Button, Tag, Divider, Row, Col, message, Typography, Switch, Slider, Space, Modal, Alert } from 'antd';
import { ReloadOutlined, RobotOutlined, StockOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ChessGame: React.FC = () => {
	// Khởi tạo game từ localStorage nếu có, nếu không thì tạo mới
	const [game, setGame] = useState(() => {
		const savedFen = localStorage.getItem('chess_game_fen');
		return savedFen ? new Chess(savedFen) : new Chess();
	});

	const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

	const [moveHistory, setMoveHistory] = useState<string[]>(() => {
		const savedHistory = localStorage.getItem('chess_game_history');
		return savedHistory ? JSON.parse(savedHistory) : [];
	});

	const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
	const [isAiThinking, setIsAiThinking] = useState(false);

	// Mặc định luôn là false (tắt bot) khi load trang
	const [aiEnabled, setAiEnabled] = useState(false);

	const [elo, setElo] = useState(() => {
		const savedElo = localStorage.getItem('chess_game_elo');
		return savedElo ? parseInt(savedElo, 10) : 1500;
	});

	const [lastMove, setLastMove] = useState(() => {
		const savedLastMove = localStorage.getItem('chess_game_lastmove');
		return savedLastMove ? JSON.parse(savedLastMove) : null;
	});

	const [promotionMove, setPromotionMove] = useState<{ from: Square; to: Square } | null>(null);

	const PRIMARY_COLOR = '#D93523';
	const HIGHLIGHT_MOVE_COLOR = 'rgba(144, 238, 144, 0.5)';

	const pieceSymbols: Record<string, string> = {
		wP: '♙',
		wN: '♘',
		wB: '♗',
		wR: '♖',
		wQ: '♕',
		wK: '♔',
		bP: '♟',
		bN: '♞',
		bB: '♝',
		bR: '♜',
		bQ: '♛',
		bK: '♚',
	};

	const pieceValues: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

	// [Bảng PST được giữ nguyên như bản cũ...]
	const pst = {
		p: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[50, 50, 50, 50, 50, 50, 50, 50],
			[10, 10, 20, 30, 30, 20, 10, 10],
			[5, 5, 10, 25, 25, 10, 5, 5],
			[0, 0, 0, 20, 20, 0, 0, 0],
			[5, -5, -10, 0, 0, -10, -5, 5],
			[5, 10, 10, -20, -20, 10, 10, 5],
			[0, 0, 0, 0, 0, 0, 0, 0],
		],
		n: [
			[-50, -40, -30, -30, -30, -30, -40, -50],
			[-40, -20, 0, 5, 5, 0, -20, -40],
			[-30, 5, 10, 15, 15, 10, 5, -30],
			[-30, 0, 15, 20, 20, 15, 0, -30],
			[-30, 5, 15, 20, 20, 15, 5, -30],
			[-30, 0, 10, 15, 15, 10, 0, -30],
			[-40, -20, 0, 0, 0, 0, -20, -40],
			[-50, -40, -30, -30, -30, -30, -40, -50],
		],
		b: [
			[-20, -10, -10, -10, -10, -10, -10, -20],
			[-10, 5, 0, 0, 0, 0, 5, -10],
			[-10, 10, 10, 10, 10, 10, 10, -10],
			[-10, 0, 10, 10, 10, 10, 0, -10],
			[-10, 5, 5, 10, 10, 5, 5, -10],
			[-10, 0, 5, 10, 10, 5, 0, -10],
			[-10, 0, 0, 0, 0, 0, 0, -10],
			[-20, -10, -10, -10, -10, -10, -10, -20],
		],
		r: [
			[0, 0, 0, 5, 5, 0, 0, 0],
			[5, 10, 10, 10, 10, 10, 10, 5],
			[-5, 0, 0, 0, 0, 0, 0, -5],
			[-5, 0, 0, 0, 0, 0, 0, -5],
			[-5, 0, 0, 0, 0, 0, 0, -5],
			[-5, 0, 0, 0, 0, 0, 0, -5],
			[5, 10, 10, 10, 10, 10, 10, 5],
			[0, 0, 0, 0, 0, 0, 0, 0],
		],
		q: [
			[-20, -10, -10, -5, -5, -10, -10, -20],
			[-10, 0, 0, 0, 0, 0, 0, -10],
			[-10, 0, 5, 5, 5, 5, 0, -10],
			[-5, 0, 5, 5, 5, 5, 0, -5],
			[0, 0, 5, 5, 5, 5, 0, -5],
			[-10, 5, 5, 5, 5, 5, 0, -10],
			[-10, 0, 5, 0, 0, 0, 0, -10],
			[-20, -10, -10, -5, -5, -10, -10, -20],
		],
		k: [
			[20, 30, 10, 0, 0, 10, 30, 20],
			[20, 20, 0, 0, 0, 0, 20, 20],
			[-10, -20, -20, -20, -20, -20, -20, -10],
			[-20, -30, -30, -40, -40, -30, -30, -20],
			[-30, -40, -40, -50, -50, -40, -40, -30],
			[-30, -40, -40, -50, -50, -40, -40, -30],
			[-30, -40, -40, -50, -50, -40, -40, -30],
			[-30, -40, -40, -50, -50, -40, -40, -30],
		],
	};

	// Tự động lưu trạng thái khi có thay đổi
	useEffect(() => {
		localStorage.setItem('chess_game_fen', game.fen());
		localStorage.setItem('chess_game_history', JSON.stringify(moveHistory));
		localStorage.setItem('chess_game_elo', elo.toString());
		localStorage.setItem('chess_game_lastmove', JSON.stringify(lastMove));
	}, [game, moveHistory, elo, lastMove]);

	const evaluateBoard = (gameInstance: Chess) => {
		let totalEvaluation = 0;
		const board = gameInstance.board();
		for (let i = 0; i < 8; i += 1) {
			for (let j = 0; j < 8; j += 1) {
				const piece = board[i][j];
				if (piece) {
					let value = pieceValues[piece.type] || 0;
					if (pst[piece.type]) {
						const posValue = piece.color === 'w' ? pst[piece.type][7 - i][j] : pst[piece.type][i][j];
						value += posValue;
					}
					totalEvaluation += piece.color === 'w' ? -value : value;
				}
			}
		}
		return totalEvaluation;
	};

	const alphaBeta = (
		gameInstance: Chess,
		depth: number,
		alphaParam: number,
		betaParam: number,
		isMaximizing: boolean,
	) => {
		if (depth === 0) return -evaluateBoard(gameInstance);
		const moves = gameInstance.moves();
		let currentAlpha = alphaParam;
		let currentBeta = betaParam;
		if (isMaximizing) {
			let bestEval = -99999;
			for (const move of moves) {
				gameInstance.move(move);
				bestEval = Math.max(bestEval, alphaBeta(gameInstance, depth - 1, currentAlpha, currentBeta, false));
				gameInstance.undo();
				currentAlpha = Math.max(currentAlpha, bestEval);
				if (currentBeta <= currentAlpha) break;
			}
			return bestEval;
		}
		let bestEval = 99999;
		for (const move of moves) {
			gameInstance.move(move);
			bestEval = Math.min(bestEval, alphaBeta(gameInstance, depth - 1, currentAlpha, currentBeta, true));
			gameInstance.undo();
			currentBeta = Math.min(currentBeta, bestEval);
			if (currentBeta <= currentAlpha) break;
		}
		return bestEval;
	};

	const checkGameOver = (gameInstance: Chess) => {
		if (gameInstance.game_over()) {
			if (gameInstance.in_checkmate()) message.error('CHIẾU HẾT!');
			else if (gameInstance.in_draw()) message.info('HÒA THEO LUẬT FIDE');
		}
	};

	const makeAiMove = () => {
		const possibleMovesList = game.moves({ verbose: true });
		if (game.game_over() || possibleMovesList.length === 0) return;
		let bestValue = -99999;
		let bestMoves = [];
		const depth = elo >= 2500 ? 4 : elo >= 1800 ? 3 : elo >= 1200 ? 2 : 1;
		for (const move of possibleMovesList) {
			game.move(move);
			const boardValue = alphaBeta(game, depth - 1, -100000, 100000, false);
			game.undo();
			if (boardValue > bestValue) {
				bestValue = boardValue;
				bestMoves = [move];
			} else if (boardValue === bestValue) {
				bestMoves.push(move);
			}
		}
		const moveToDo = bestMoves[Math.floor(Math.random() * bestMoves.length)];
		const finalGame = new Chess(game.fen());
		finalGame.move(moveToDo);
		setLastMove({ from: moveToDo.from, to: moveToDo.to });
		setGame(finalGame);
		setMoveHistory((prev) => [...prev, moveToDo.san]);
		setIsAiThinking(false);
		checkGameOver(finalGame);
	};

	useEffect(() => {
		if (aiEnabled && game.turn() === 'b' && !game.game_over() && !promotionMove) {
			setIsAiThinking(true);
			const timer = setTimeout(makeAiMove, 600);
			return () => clearTimeout(timer);
		}
	}, [game, aiEnabled, promotionMove]);

	const onSquareClick = (square: Square) => {
		if (game.game_over() || isAiThinking || promotionMove) return;
		if (!selectedSquare) {
			const piece = game.get(square);
			if (piece && piece.color === game.turn()) {
				setSelectedSquare(square);
				setPossibleMoves(game.moves({ square, verbose: true }).map((m) => m.to));
			}
		} else {
			const piece = game.get(selectedSquare);
			const isPromotion =
				piece?.type === 'p' &&
				((piece.color === 'w' && square[1] === '8') || (piece.color === 'b' && square[1] === '1'));
			if (isPromotion && game.moves({ square: selectedSquare, verbose: true }).some((m) => m.to === square)) {
				setPromotionMove({ from: selectedSquare, to: square });
			} else {
				const gameCopy = new Chess(game.fen());
				try {
					const move = gameCopy.move({ from: selectedSquare, to: square, promotion: 'q' });
					if (move) {
						setLastMove({ from: move.from, to: move.to });
						setGame(gameCopy);
						setMoveHistory((prev) => [...prev, move.san]);
						checkGameOver(gameCopy);
					}
				} catch (e) {}
			}
			setSelectedSquare(null);
			setPossibleMoves([]);
		}
	};

	const renderBoard = () => {
		const board = [];
		const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
		const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		const isCheck = game.in_check();
		for (let i = 0; i < 8; i += 1) {
			for (let j = 0; j < 8; j += 1) {
				const squarePos = (cols[j] + rows[i]) as Square;
				const piece = game.get(squarePos);
				const isDark = (i + j) % 2 !== 0;
				const isPossibleMove = possibleMoves.includes(squarePos);
				const isSelected = selectedSquare === squarePos;
				const isLastMoveSquare = lastMove && (lastMove.from === squarePos || lastMove.to === squarePos);
				const highlightCheck = isCheck && piece?.type === 'k' && piece?.color === game.turn();

				board.push(
					<div
						key={squarePos}
						onClick={() => onSquareClick(squarePos)}
						style={{
							width: '100%',
							aspectRatio: '1/1',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							fontSize: 'min(8vw, 48px)',
							cursor: isAiThinking ? 'not-allowed' : 'pointer',
							backgroundColor: highlightCheck ? PRIMARY_COLOR : isDark ? '#b58863' : '#f0d9b5',
							color: piece?.color === 'w' ? '#FFFFFF' : '#000000',
							boxShadow: isSelected ? `inset 0 0 0 4px ${PRIMARY_COLOR}` : 'none',
							position: 'relative',
							boxSizing: 'border-box',
							userSelect: 'none',
						}}
					>
						{isLastMoveSquare && !isSelected && !highlightCheck && (
							<div
								style={{
									position: 'absolute',
									width: '100%',
									height: '100%',
									backgroundColor: HIGHLIGHT_MOVE_COLOR,
									zIndex: 1,
									pointerEvents: 'none',
								}}
							/>
						)}
						{isPossibleMove && (
							<div
								style={{
									position: 'absolute',
									width: piece ? '100%' : '25%',
									height: piece ? '100%' : '25%',
									border: piece ? '4px solid rgba(0,0,0,0.15)' : 'none',
									borderRadius: piece ? '0' : '50%',
									backgroundColor: piece ? 'transparent' : 'rgba(0,0,0,0.1)',
									pointerEvents: 'none',
									zIndex: 2,
								}}
							/>
						)}
						{piece && (
							<span style={{ display: 'block', lineHeight: 1, zIndex: 3 }}>{`${
								pieceSymbols[piece.color + piece.type.toUpperCase()]
							}\uFE0E`}</span>
						)}
					</div>,
				);
			}
		}
		return board;
	};

	return (
		<div style={{ padding: '24px', background: '#fafafa', minHeight: '100vh' }}>
			<Row gutter={[32, 32]} justify='center'>
				<Col xs={24} lg={12}>
					<Card
						bordered={false}
						bodyStyle={{ padding: '8px' }}
						style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderTop: `6px solid ${PRIMARY_COLOR}` }}
					>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(8, 12.5%)',
								border: '2px solid #333',
								gap: 0,
								lineHeight: 0,
								overflow: 'hidden',
							}}
						>
							{renderBoard()}
						</div>
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card bordered={false}>
						<div
							style={{
								textAlign: 'center',
								marginBottom: '20px',
								padding: '15px',
								border: `2px solid ${PRIMARY_COLOR}`,
								fontWeight: 'bold',
								backgroundColor: game.turn() === 'w' ? '#fff' : '#000',
								color: game.turn() === 'w' ? '#000' : '#fff',
							}}
						>
							{isAiThinking ? (
								<>
									<RobotOutlined spin /> STOCKFISH ĐANG NGHĨ...
								</>
							) : game.turn() === 'w' ? (
								'LƯỢT TRẮNG'
							) : (
								'LƯỢT ĐEN'
							)}
						</div>

						{/* Thông báo cảnh báo AI khi bật */}
						{aiEnabled && (
							<Alert
								message='Cảnh báo chế độ AI'
								description='Chế độ Stockfish Web đang được phát triển, tính toán có thể chưa hoàn thiện.'
								type='warning'
								showIcon
								style={{ marginBottom: '16px' }}
							/>
						)}

						<Space
							direction='vertical'
							style={{ width: '100%', background: '#f9f9f9', padding: '15px', borderRadius: '4px' }}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Text strong>
									<RobotOutlined /> Stockfish AI
								</Text>
								<Switch
									checked={aiEnabled}
									onChange={(val) => {
										setAiEnabled(val);
										if (val) message.warning('Lưu ý: Chế độ AI hiện chưa hoàn thiện!');
									}}
								/>
							</div>
							<Divider style={{ margin: '10px 0' }} />
							<Text strong>
								<StockOutlined /> TRÌNH ĐỘ: {elo} ELO
							</Text>
							<Slider
								min={400}
								max={2800}
								step={100}
								value={elo}
								onChange={setElo}
								disabled={!aiEnabled}
								trackStyle={{ backgroundColor: PRIMARY_COLOR }}
								handleStyle={{ borderColor: PRIMARY_COLOR }}
							/>
						</Space>
						<Divider orientation='left'>LỊCH SỬ</Divider>
						<div
							style={{
								height: '120px',
								overflowY: 'auto',
								background: '#fff',
								border: '1px solid #eee',
								padding: '8px',
								marginBottom: '15px',
							}}
						>
							<Row gutter={[4, 4]}>
								{moveHistory.map((m, i) => (
									<Col span={8} key={`history-${m}-${i}`}>
										<Tag style={{ width: '100%', textAlign: 'center', borderRadius: 0 }}>
											{i + 1}. {m}
										</Tag>
									</Col>
								))}
							</Row>
						</div>
						<Button
							block
							size='large'
							icon={<ReloadOutlined />}
							onClick={() => {
								const newGame = new Chess();
								setGame(newGame);
								setMoveHistory([]);
								setLastMove(null);
								setPromotionMove(null);
								// Xóa dữ liệu cũ trong storage
								localStorage.removeItem('chess_game_fen');
								localStorage.removeItem('chess_game_history');
								localStorage.removeItem('chess_game_lastmove');
							}}
							style={{ backgroundColor: PRIMARY_COLOR, color: '#fff', fontWeight: 'bold', borderRadius: 0 }}
						>
							VÁN MỚI
						</Button>
					</Card>
				</Col>
			</Row>

			<Modal title='Chọn quân phong cấp' visible={!!promotionMove} footer={null} closable={false} centered width={300}>
				<div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
					{[
						{ key: 'q', name: 'Hậu' },
						{ key: 'r', name: 'Xe' },
						{ key: 'b', name: 'Tượng' },
						{ key: 'n', name: 'Mã' },
					].map((p) => (
						<Button
							key={p.key}
							onClick={() => {
								const gameCopy = new Chess(game.fen());
								const move = gameCopy.move({ from: promotionMove.from, to: promotionMove.to, promotion: p.key });
								if (move) {
									setLastMove({ from: move.from, to: move.to });
									setGame(gameCopy);
									setMoveHistory((prev) => [...prev, move.san]);
									setPromotionMove(null);
								}
							}}
							style={{
								height: '60px',
								width: '60px',
								fontSize: '24px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<span>{pieceSymbols[(game.turn() === 'w' ? 'w' : 'b') + p.key.toUpperCase()]}</span>
						</Button>
					))}
				</div>
			</Modal>
		</div>
	);
};

export default ChessGame;
