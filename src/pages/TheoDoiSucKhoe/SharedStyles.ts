import React from 'react';

const status = 'success'; // Giá trị mặc định để demo messageBox

export const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Đổi lại flex-start để cuộn trang tốt hơn
        minHeight: '80vh',
        backgroundColor: '#f4f7f9',
        padding: '20px',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        padding: '20px', // Giảm padding so với gốc để phù hợp layout rộng
        borderRadius: '0px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        textAlign: 'center',
        borderTop: '5px solid #D93523',
        marginBottom: '20px'
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
    button: {
        width: '100%',
        padding: '12px',
        borderRadius: '0px',
        border: 'none',
        backgroundColor: '#D93523',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    resetBtn: { backgroundColor: '#2d3748' },
};