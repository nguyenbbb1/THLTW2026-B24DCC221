import React from 'react';

export const getSystemStyles = (
	status?: 'success' | 'error' | 'warning' | 'info',
): { [key: string]: React.CSSProperties } => ({
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
		borderTop: '5px solid #D93523',
	},
	title: { fontSize: '24px', fontWeight: '700', color: '#2c3e50', marginBottom: '10px' },
	badge: {
		display: 'inline-block',
		padding: '5px 15px',
		borderRadius: '0px',
		backgroundColor: '#fdeaea',
		fontSize: '14px',
		color: '#D93523',
		marginBottom: '20px',
	},
	messageBox: {
		padding: '15px',
		borderRadius: '0px',
		marginBottom: '25px',
		fontSize: '15px',
		backgroundColor:
			status === 'success' ? '#def7ec' : status === 'error' ? '#fde8e8' : status === 'warning' ? '#fef3c7' : '#fdeaea',
		color:
			status === 'success' ? '#03543f' : status === 'error' ? '#9b1c1c' : status === 'warning' ? '#92400e' : '#D93523',
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
	// ĐÃ CẬP NHẬT: Thay đổi cơ chế hiển thị của Button
	button: {
		width: '100%',
		height: '44px', // Sử dụng height cố định thay vì padding
		display: 'flex', // Kích hoạt Flexbox
		justifyContent: 'center', // Căn giữa theo trục ngang
		alignItems: 'center', // Căn giữa theo trục dọc
		borderRadius: '0px',
		border: 'none',
		backgroundColor: '#D93523',
		color: '#fff',
		fontSize: '16px',
		fontWeight: '600',
		cursor: 'pointer',
		transition: 'background 0.2s',
		margin: '0',
	},
	resetBtn: { backgroundColor: '#2d3748' },
});
