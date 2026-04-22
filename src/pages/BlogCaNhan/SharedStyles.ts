import React from 'react';

// Hàm tạo màu ngẫu nhiên nhưng cố định theo tên thẻ (Tránh lỗi flickering khi re-render)
export const getTagColor = (tagName: string): string => {
    const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const defaultStatus = 'success';

export const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '80vh',
        backgroundColor: '#f4f7f9',
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '0px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        textAlign: 'left',
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
        backgroundColor: defaultStatus === 'success' ? '#def7ec' : '#fdeaea',
        color: defaultStatus === 'success' ? '#03543f' : '#D93523',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '0px',
        border: '1px solid #e2e8f0',
        fontSize: '16px',
        marginBottom: '15px',
        outline: 'none',
        textAlign: 'left',
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