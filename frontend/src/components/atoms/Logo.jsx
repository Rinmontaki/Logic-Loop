import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png';

export default function Logo() {
  const navigate = useNavigate();
  return (
    <img
      src={logo}
      alt="Logo LPP"
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        border: '3px solid #2196f3',
        background: 'white',
        marginRight: 16,
        cursor: 'pointer'
      }}
      onClick={() => navigate('/')}
      title="Ir a inicio"
    />
  );
}
