// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Card, Button, Tag, Divider, Row, Col, message, Typography, Switch, Slider, Space, Modal } from 'antd';
import { ReloadOutlined, RobotOutlined, StockOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ChessGame: React.FC = () => {
	const [game, setGame] = useState(new Chess());
	const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
	const [isAiThinking, setIsAiThinking] = useState(false);
	const [aiEnabled, setAiEnabled] = useState(true);
	const [elo, setElo] = useState(1500);
	const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
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

	const evaluateBoard = (gameInstance: Chess) => {
		let totalEvaluation = 0;
		const board = gameInstance.board();
		for (let i = 0; i < 8; i += 1) {
			for (let j = 0; j < 8; j += 1) {
				const piece = board[i][j];
				if (piece) {
					const value = pieceValues[piece.type] || 0;
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
		isMaximizingPlayer: boolean,
	) => {
		if (depth === 0) return -evaluateBoard(gameInstance);

		const moves = gameInstance.moves();
		let currentAlpha = alphaParam;
		let currentBeta = betaParam;

		if (isMaximizingPlayer) {
			let bestEval = -99999;
			for (const move of moves) {
				gameInstance.move(move);
				bestEval = Math.max(
					bestEval,
					alphaBeta(gameInstance, depth - 1, currentAlpha, currentBeta, !isMaximizingPlayer),
				);
				gameInstance.undo();
				currentAlpha = Math.max(currentAlpha, bestEval);
				if (currentBeta <= currentAlpha) break;
			}
			return bestEval;
		}

		let bestEval = 99999;
		for (const move of moves) {
			gameInstance.move(move);
			bestEval = Math.min(bestEval, alphaBeta(gameInstance, depth - 1, currentAlpha, currentBeta, !isMaximizingPlayer));
			gameInstance.undo();
			currentBeta = Math.min(currentBeta, bestEval);
			if (currentBeta <= currentAlpha) break;
		}
		return bestEval;
	};

	const makeAiMove = () => {
		const possibleMovesList = game.moves({ verbose: true });
		if (game.game_over() || possibleMovesList.length === 0) return;
		let moveToDo = null;
		if (elo < 600) {
			moveToDo = possibleMovesList[Math.floor(Math.random() * possibleMovesList.length)];
		} else {
			let bestValue = -99999;
			let bestMove = possibleMovesList[0];
			const depth = elo >= 2500 ? 4 : elo >= 1800 ? 3 : elo >= 1200 ? 2 : 1;
			for (const move of possibleMovesList) {
				game.move(move);
				const boardValue = alphaBeta(game, depth - 1, -100000, 100000, false);
				game.undo();
				if (boardValue > bestValue) {
					bestValue = boardValue;
					bestMove = move;
				}
			}
			moveToDo = bestMove;
		}
		const finalGame = new Chess(game.fen());
		finalGame.move(moveToDo);
		setLastMove({ from: moveToDo.from, to: moveToDo.to });
		setGame(finalGame);
		setMoveHistory((prev) => [...prev, moveToDo.san]);
		setIsAiThinking(false);
	};

	useEffect(() => {
		if (aiEnabled && game.turn() === 'b' && !game.game_over() && !promotionMove) {
			setIsAiThinking(true);
			const timer = setTimeout(makeAiMove, 500);
			return () => clearTimeout(timer);
		}
	}, [game, aiEnabled, promotionMove]);

	const handleMove = (from: Square, to: Square, promotion: string = 'q') => {
		const gameCopy = new Chess(game.fen());
		try {
			const move = gameCopy.move({ from, to, promotion });
			if (move) {
				setLastMove({ from: move.from, to: move.to });
				setGame(gameCopy);
				setMoveHistory((prev) => [...prev, move.san]);
				if (gameCopy.in_checkmate()) message.error('CHIẾU HẾT!');
				return true;
			}
		} catch (e) {
			return false;
		}
		return false;
	};

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
				handleMove(selectedSquare, square);
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
				const highlightCheck = isCheck && piece?.type === 'k' && piece?.color === game.turn();
				const isSelected = selectedSquare === squarePos;
				const isLastMoveSquare = lastMove && (lastMove.from === squarePos || lastMove.to === squarePos);

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
									width: '90%',
									height: '90%',
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
									width: piece ? '90%' : '25%',
									height: piece ? '90%' : '25%',
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

	const getEloRank = (value: number) => {
		if (value < 1200) return 'Người mới (Novice)';
		if (value < 1600) return 'Trung cấp (Intermediate)';
		if (value < 2000) return 'Nâng cao (Advanced)';
		if (value < 2400) return 'Kiện tướng (Master)';
		return 'Đại kiện tướng (Grandmaster)';
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

						<Space
							direction='vertical'
							style={{ width: '100%', background: '#f9f9f9', padding: '15px', borderRadius: '4px' }}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Text strong>
									<RobotOutlined /> Stockfish AI
								</Text>
								<Switch checked={aiEnabled} onChange={setAiEnabled} />
							</div>
							<Divider style={{ margin: '10px 0' }} />
							<Text strong>
								<StockOutlined /> TRÌNH ĐỘ: {elo} ELO
							</Text>
							<Text type='secondary' style={{ display: 'block', fontSize: '12px' }}>
								{getEloRank(elo)}
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
								setGame(new Chess());
								setMoveHistory([]);
								setLastMove(null);
								setPromotionMove(null);
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
								handleMove(promotionMove.from, promotionMove.to, p.key);
								setPromotionMove(null);
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
