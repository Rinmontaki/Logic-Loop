import React from 'react';
import Logo from '../atoms/Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-content">
        <div className="footer-logo">
          <Logo />
        </div>
        <div className="footer-info">
          <div className="footer-title">Logic Loop</div>
          <div className="footer-copyright">© 2025 Logic Loop. Todos los derechos reservados.</div>
          <div className="footer-links">
            <a href="/terminos" target="_blank" rel="noopener noreferrer">Términos y condiciones</a>
            <span className="footer-sep">|</span>
            <a href="/privacidad" target="_blank" rel="noopener noreferrer">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
