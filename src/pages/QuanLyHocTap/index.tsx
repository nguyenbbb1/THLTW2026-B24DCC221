import React, { useState, useEffect } from 'react';

interface Session {
	id: string;
	subject: string;
	dateTime: string;
	duration: number;
	content: string;
}

const QuanLyHocTap: React.FC = () => {
	const [subjects, setSubjects] = useState<string[]>(['Toán', 'Văn', 'Anh', 'Khoa học', 'Công nghệ']);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [monthlyGoal, setMonthlyGoal] = useState<number>(40);
	const [view, setView] = useState<'subjects' | 'progress' | 'goals'>('subjects');

	const [newSession, setNewSession] = useState({
		subject: '',
		dateTime: '',
		duration: '',
		content: '',
	});
	const [newSubName, setNewSubName] = useState('');
	const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
	const [editingSubIndex, setEditingSubIndex] = useState<number | null>(null);

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

	const handleAddSession = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newSession.subject || !newSession.duration) return;

		if (editingSessionId) {
			setSessions(
				sessions.map((s) =>
					s.id === editingSessionId ? { ...s, ...newSession, duration: parseInt(newSession.duration, 10) } : s,
				),
			);
			setEditingSessionId(null);
		} else {
			const session: Session = {
				id: Date.now().toString(),
				subject: newSession.subject,
				dateTime: newSession.dateTime,
				duration: parseInt(newSession.duration, 10),
				content: newSession.content,
			};
			setSessions([session, ...sessions]);
		}
		setNewSession({ subject: '', dateTime: '', duration: '', content: '' });
	};

	const handleEditSession = (session: Session) => {
		setEditingSessionId(session.id);
		setNewSession({
			subject: session.subject,
			dateTime: session.dateTime,
			duration: session.duration.toString(),
			content: session.content,
		});
	};

	const handleAddOrUpdateSubject = () => {
		if (!newSubName) return;
		if (editingSubIndex !== null) {
			const updatedSubjects = [...subjects];
			updatedSubjects[editingSubIndex] = newSubName;
			setSubjects(updatedSubjects);
			setEditingSubIndex(null);
		} else if (!subjects.includes(newSubName)) {
			setSubjects([...subjects, newSubName]);
		}
		setNewSubName('');
	};

	const handleEditSubject = (index: number) => {
		setEditingSubIndex(index);
		setNewSubName(subjects[index]);
	};

	const totalHours = (sessions.reduce((sum, s) => sum + s.duration, 0) / 60).toFixed(1);
	const isGoalAchieved = parseFloat(totalHours) >= monthlyGoal;

	const styles: Record<string, React.CSSProperties> = {
		wrapper: { padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
		card: {
			backgroundColor: '#fff',
			padding: '30px',
			borderRadius: '0px',
			borderTop: '5px solid #D93523',
			boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
		},
		navBar: { display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd' },
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
		btnSecondary: {
			backgroundColor: '#595959',
			color: '#fff',
			border: 'none',
			padding: '10px 20px',
			cursor: 'pointer',
			borderRadius: '0px',
			fontWeight: '600',
			marginLeft: '5px',
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
			borderRadius: '0px',
		},
		actionBtn: {
			border: 'none',
			background: 'none',
			cursor: 'pointer',
			fontWeight: 'bold',
			marginRight: '10px',
		},
	};

	return (
		<div style={styles.wrapper}>
			<div style={styles.card}>
				<h2 style={{ color: '#262626', marginBottom: '20px', fontWeight: 'bold' }}>QUẢN LÝ TIẾN ĐỘ HỌC TẬP</h2>

				<div style={styles.navBar}>
					{(['subjects', 'progress', 'goals'] as const).map((t) => (
						<button
							key={t}
							onClick={() => setView(t)}
							style={{
								padding: '10px 20px',
								cursor: 'pointer',
								borderRadius: '0px',
								border: 'none',
								backgroundColor: view === t ? '#D93523' : 'transparent',
								color: view === t ? '#fff' : '#666',
								fontWeight: 'bold',
								textTransform: 'uppercase',
							}}
						>
							{t === 'subjects' ? 'Danh mục môn học' : t === 'progress' ? 'Tiến độ học tập' : 'Mục tiêu học tập'}
						</button>
					))}
				</div>

				{view === 'subjects' && (
					<div>
						<div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
							<input
								style={styles.input}
								placeholder='Tên môn học...'
								value={newSubName}
								onChange={(e) => setNewSubName(e.target.value)}
							/>
							<button style={styles.btnPrimary} onClick={handleAddOrUpdateSubject}>
								{editingSubIndex !== null ? 'CẬP NHẬT' : 'THÊM'}
							</button>
							{editingSubIndex !== null && (
								<button
									style={styles.btnSecondary}
									onClick={() => {
										setEditingSubIndex(null);
										setNewSubName('');
									}}
								>
									HỦY
								</button>
							)}
						</div>
						{subjects.map((s, index) => (
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
								<div>
									<button style={{ ...styles.actionBtn, color: '#1890ff' }} onClick={() => handleEditSubject(index)}>
										Sửa
									</button>
									<button
										style={{ ...styles.actionBtn, color: '#D93523' }}
										onClick={() => setSubjects(subjects.filter((x) => x !== s))}
									>
										Xóa
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{view === 'progress' && (
					<div>
						<form
							onSubmit={handleAddSession}
							style={{ backgroundColor: '#fafafa', padding: '20px', border: '1px solid #eee' }}
						>
							<h4 style={{ marginTop: 0 }}>{editingSessionId ? 'Chỉnh sửa buổi học' : 'Ghi nhận buổi học mới'}</h4>
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
								{editingSessionId ? 'CẬP NHẬT THÔNG TIN' : 'LƯU THÔNG TIN'}
							</button>
							{editingSessionId && (
								<button
									type='button'
									style={styles.btnSecondary}
									onClick={() => {
										setEditingSessionId(null);
										setNewSession({ subject: '', dateTime: '', duration: '', content: '' });
									}}
								>
									HỦY
								</button>
							)}
						</form>

						<table style={styles.table}>
							<thead>
								<tr>
									<th style={styles.th}>Môn học</th>
									<th style={styles.th}>Thời gian</th>
									<th style={styles.th}>Thời lượng</th>
									<th style={styles.th}>Nội dung</th> {/* Thêm tiêu đề cột Nội dung */}
									<th style={styles.th}>Hành động</th>
								</tr>
							</thead>
							<tbody>
								{sessions.map((s) => (
									<tr key={s.id}>
										<td style={styles.td}>{s.subject}</td>
										<td style={styles.td}>{s.dateTime.replace('T', ' ')}</td>
										<td style={styles.td}>{s.duration} phút</td>
										<td style={styles.td}>{s.content}</td> {/* Hiển thị dữ liệu nội dung */}
										<td style={styles.td}>
											<button style={{ ...styles.actionBtn, color: '#1890ff' }} onClick={() => handleEditSession(s)}>
												Sửa
											</button>
											<button
												style={{ ...styles.actionBtn, color: '#D93523' }}
												onClick={() => setSessions(sessions.filter((x) => x !== s.id))}
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

				{view === 'goals' && (
					<div>
						<div style={styles.goalBox}>
							<h3 style={{ margin: 0 }}>
								{isGoalAchieved ? 'ĐÃ HOÀN THÀNH MỤC TIÊU TỔNG' : 'ĐANG THỰC HIỆN MỤC TIÊU'}
							</h3>
							<p style={{ fontSize: '24px', fontWeight: 'bold' }}>
								{totalHours} / {monthlyGoal} GIỜ
							</p>
						</div>

						<div style={{ marginBottom: '30px' }}>
							<label htmlFor='goalInput' style={{ fontWeight: 'bold' }}>
								Điều chỉnh mục tiêu tổng (giờ/tháng):
							</label>
							<input
								id='goalInput'
								style={styles.input}
								type='number'
								value={monthlyGoal}
								onChange={(e) => setMonthlyGoal(parseInt(e.target.value, 10))}
							/>
						</div>

						<h3 style={{ borderLeft: '4px solid #D93523', paddingLeft: '10px', color: '#262626' }}>
							PHÂN CHIA TIẾN ĐỘ THEO MÔN HỌC
						</h3>
						<table style={styles.table}>
							<thead>
								<tr>
									<th style={styles.th}>Tên môn học</th>
									<th style={styles.th}>Số giờ đã học</th>
									<th style={styles.th}>Tỷ lệ đóng góp</th>
									<th style={styles.th}>Trạng thái</th>
								</tr>
							</thead>
							<tbody>
								{subjects.map((sub) => {
									const subMinutes = sessions.filter((s) => s.subject === sub).reduce((sum, s) => sum + s.duration, 0);
									const subHours = (subMinutes / 60).toFixed(1);
									const contribution =
										parseFloat(totalHours) > 0 ? ((parseFloat(subHours) / parseFloat(totalHours)) * 100).toFixed(0) : 0;

									return (
										<tr key={sub}>
											<td style={styles.td}>
												<strong>{sub}</strong>
											</td>
											<td style={styles.td}>{subHours} giờ</td>
											<td style={styles.td}>{contribution}%</td>
											<td style={styles.td}>
												<span
													style={{
														fontSize: '12px',
														color: parseFloat(subHours) > 0 ? '#389e0d' : '#8c8c8c',
													}}
												>
													{parseFloat(subHours) > 0 ? '● Có tiến triển' : '○ Chưa bắt đầu'}
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default QuanLyHocTap;
