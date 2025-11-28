import React from 'react';

export default function Button({ children, color = 'primary', ...props }) {
  const colors = {
    primary: '#0074D9', // azul
    orange: '#FF851B', // naranja
    white: '#fff'
  };
  return (
    <button
      style={{
        background: colors[color] || colors.primary,
        color: color === 'white' ? '#0074D9' : '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '8px 20px',
        fontWeight: 'bold',
        cursor: 'pointer',
        margin: 4
      }}
      {...props}
    >
      {children}
    </button>
  );
}
