import React, { useState, useEffect } from 'react';

// 1. Định nghĩa Interface cho dữ liệu
interface Session {
	id: string;
	subject: string;
	dateTime: string;
	duration: number; // đơn vị: phút
	content: string;
}

const QuanLyHocTap: React.FC = () => {
	// --- STATES ---
	const [subjects, setSubjects] = useState<string[]>(['Toán', 'Văn', 'Anh', 'Khoa học', 'Công nghệ']);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [monthlyGoal, setMonthlyGoal] = useState<number>(40); // Mục tiêu tổng giờ học
	const [view, setView] = useState<'progress' | 'subjects' | 'goals'>('progress');

	// Form states
	const [newSession, setNewSession] = useState({ subject: '', dateTime: '', duration: '', content: '' });
	const [newSubName, setNewSubName] = useState('');

	// --- LOCAL STORAGE (Đồng bộ dữ liệu) ---
	useEffect(() => {
		const savedSubjects = localStorage.getItem('subjects');
		const savedSessions = localStorage.getItem('sessions');
		const savedGoal = localStorage.getItem('monthlyGoal');

		if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
		if (savedSessions) setSessions(JSON.parse(savedSessions));
		if (savedGoal) setMonthlyGoal(JSON.parse(savedGoal));
	}, []);

	useEffect(() => {
		localStorage.setItem('subjects', JSON.stringify(subjects));
		localStorage.setItem('sessions', JSON.stringify(sessions));
		localStorage.setItem('monthlyGoal', JSON.stringify(monthlyGoal));
	}, [subjects, sessions, monthlyGoal]);

	// --- LOGIC XỬ LÝ ---
	const handleAddSession = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newSession.subject || !newSession.duration) return;
		const session: Session = {
			id: Date.now().toString(),
			subject: newSession.subject,
			dateTime: newSession.dateTime,
			duration: parseInt(newSession.duration),
			content: newSession.content,
		};
		setSessions([session, ...sessions]);
		setNewSession({ subject: '', dateTime: '', duration: '', content: '' });
	};

	const totalHours = (sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1);
	const isGoalAchieved = parseFloat(totalHours) >= monthlyGoal;

	// --- HỆ THỐNG STYLES (Đỏ #D93523, Góc vuông 0px) ---
	const styles: { [key: string]: React.CSSProperties } = {
		wrapper: { padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
		card: {
			backgroundColor: '#fff',
			padding: '30px',
			borderRadius: '0px',
			borderTop: '5px solid #D93523',
			boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
		},
		navBar: { display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd' },
		navTab: (active: boolean) => ({
			padding: '10px 20px',
			cursor: 'pointer',
			borderRadius: '0px',
			border: 'none',
			backgroundColor: active ? '#D93523' : 'transparent',
			color: active ? '#fff' : '#666',
			fontWeight: 'bold',
		}),
		input: {
			width: '100%',
			padding: '10px',
			marginBottom: '12px',
			border: '1px solid #d9d9d9',
			borderRadius: '0px',
			outline: 'none',
		},
		btnPrimary: {
			backgroundColor: '#D93523',
			color: '#fff',
			border: 'none',
			padding: '10px 20px',
			cursor: 'pointer',
			borderRadius: '0px',
			fontWeight: '600',
		},
		table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
		th: { borderBottom: '2px solid #f0f0f0', padding: '12px', textAlign: 'left', color: '#D93523' },
		td: { borderBottom: '1px solid #f0f0f0', padding: '12px' },
		goalBox: {
			padding: '20px',
			textAlign: 'center',
			marginBottom: '20px',
			backgroundColor: isGoalAchieved ? '#f6ffed' : '#fff1f0',
			border: `1px solid ${isGoalAchieved ? '#b7eb8f' : '#ffa39e'}`,
			color: isGoalAchieved ? '#389e0d' : '#cf1322',
		},
	};

	return (
		<div style={styles.wrapper}>
			<div style={styles.card}>
				<h2 style={{ color: '#262626', marginBottom: '20px' }}>HỆ THỐNG QUẢN LÝ HỌC TẬP</h2>

				{/* Navigation */}
				<div style={styles.navBar}>
					<button style={styles.navTab(view === 'progress')} onClick={() => setView('progress')}>
						TIẾN ĐỘ
					</button>
					<button style={styles.navTab(view === 'subjects')} onClick={() => setView('subjects')}>
						MÔN HỌC
					</button>
					<button style={styles.navTab(view === 'goals')} onClick={() => setView('goals')}>
						MỤC TIÊU
					</button>
				</div>

				{/* View: Tiến độ học tập */}
				{view === 'progress' && (
					<div>
						<form
							onSubmit={handleAddSession}
							style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #eee' }}
						>
							<h4 style={{ marginTop: 0 }}>Ghi nhận buổi học mới</h4>
							<select
								style={styles.input}
								value={newSession.subject}
								onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
							>
								<option value=''>-- Chọn môn học --</option>
								{subjects.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
							<input
								style={styles.input}
								type='datetime-local'
								value={newSession.dateTime}
								onChange={(e) => setNewSession({ ...newSession, dateTime: e.target.value })}
							/>
							<input
								style={styles.input}
								type='number'
								placeholder='Thời lượng (phút)'
								value={newSession.duration}
								onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
							/>
							<textarea
								style={styles.input}
								placeholder='Nội dung bài học...'
								value={newSession.content}
								onChange={(e) => setNewSession({ ...newSession, content: e.target.value })}
							/>
							<button type='submit' style={styles.btnPrimary}>
								LƯU THÔNG TIN
							</button>
						</form>

						<table style={styles.table}>
							<thead>
								<tr>
									<th style={styles.th}>Môn học</th>
									<th style={styles.th}>Thời gian</th>
									<th style={styles.th}>Thời lượng</th>
									<th style={styles.th}>Hành động</th>
								</tr>
							</thead>
							<tbody>
								{sessions.map((s) => (
									<tr key={s.id}>
										<td style={styles.td}>{s.subject}</td>
										<td style={styles.td}>{s.dateTime.replace('T', ' ')}</td>
										<td style={styles.td}>{s.duration} phút</td>
										<td style={styles.td}>
											<button
												onClick={() => setSessions(sessions.filter((x) => x.id !== s.id))}
												style={{ color: '#D93523', border: 'none', background: 'none', cursor: 'pointer' }}
											>
												Xóa
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* View: Danh mục môn học */}
				{view === 'subjects' && (
					<div>
						<div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
							<input
								style={styles.input}
								placeholder='Thêm môn học mới...'
								value={newSubName}
								onChange={(e) => setNewSubName(e.target.value)}
							/>
							<button
								style={styles.btnPrimary}
								onClick={() => {
									if (newSubName) setSubjects([...subjects, newSubName]);
									setNewSubName('');
								}}
							>
								THÊM
							</button>
						</div>
						{subjects.map((s) => (
							<div
								key={s}
								style={{
									padding: '12px',
									borderBottom: '1px solid #eee',
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<span>{s}</span>
								<span
									style={{ color: '#D93523', cursor: 'pointer' }}
									onClick={() => setSubjects(subjects.filter((x) => x !== s))}
								>
									Gỡ bỏ
								</span>
							</div>
						))}
					</div>
				)}

				{/* View: Mục tiêu */}
				{view === 'goals' && (
					<div>
						<div style={styles.goalBox}>
							<h3 style={{ margin: 0 }}>{isGoalAchieved ? 'ĐÃ HOÀN THÀNH MỤC TIÊU' : 'ĐANG THỰC HIỆN'}</h3>
							<p style={{ fontSize: '24px', fontWeight: 'bold' }}>
								{totalHours} / {monthlyGoal} GIỜ
							</p>
						</div>
						<label>Điều chỉnh mục tiêu (giờ/tháng):</label>
						<input
							style={styles.input}
							type='number'
							value={monthlyGoal}
							onChange={(e) => setMonthlyGoal(parseInt(e.target.value))}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

// ĐẢM BẢO DÒNG NÀY LUÔN Ở CUỐI CÙNG
export default QuanLyHocTap;
