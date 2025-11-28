import React, { useRef } from 'react';
import Logo from '../atoms/Logo';
import NavItem from '../molecules/NavItem';
import Button from '../atoms/Button';
import AccesoModal from './AccesoModal';

const navItemsBase = [
  { label: 'Temas', to: '/temas' },
  { label: 'Galeria', to: '/galeria' },
  { label: 'Retos LPP', to: '/retos' },
  { label: 'Creadores', to: '/creadores' }
];


function Navbar() {
  const isAuth = !!localStorage.getItem('token');
  const [showAcceso, setShowAcceso] = React.useState(false);
  // Estado para animar el NavItem después de login
  const [showOverlay, setShowOverlay] = React.useState(false);
  const libroRef = useRef(null);
  React.useEffect(() => {
    if (isAuth && !sessionStorage.getItem('libroLPPAnim')) {
      setShowOverlay(true);
      sessionStorage.setItem('libroLPPAnim', '1');
      setTimeout(() => setShowOverlay(false), 10000);
    }
  }, [isAuth]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('libroLPPAnim');
    window.location.href = '/';
  };
  // Calcular posición del NavItem para el overlay
  const [focusRect, setFocusRect] = React.useState(null);
  React.useEffect(() => {
    if (showOverlay && libroRef.current) {
      const rect = libroRef.current.getBoundingClientRect();
      setFocusRect(rect);
    }
  }, [showOverlay]);
  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Logo />
          {isAuth && (
            <>
              <NavItem label="Libro + LPP" to="/libro" navRef={libroRef} />
              <NavItem label="Retos LPP" to="/retos" />
            </>
          )}
          {navItemsBase.filter(item => item.label !== "Retos LPP").map(item => (
            <NavItem key={item.to} label={item.label} to={item.to} />
          ))}
        </div>
        {isAuth ? (
          <Button color="orange" onClick={handleLogout}>Cerrar sesión</Button>
        ) : (
          <Button color="orange" onClick={() => setShowAcceso(true)}>Acceder</Button>
        )}
      </nav>
      {showOverlay && focusRect && (
        <div className="libro-overlay-anim" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            transition: 'background 0.7s',
            animation: 'libroOverlayFade 10s linear forwards',
          }} />
          <div style={{
            position: 'absolute',
            top: focusRect.top - 8,
            left: focusRect.left - 8,
            width: focusRect.width + 16,
            height: focusRect.height + 16,
            borderRadius: 12,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
            border: '3px solid #ffb300',
            background: 'rgba(255,255,255,0.08)',
            transition: 'all 0.7s',
            animation: 'libroOverlayFocus 5s cubic-bezier(.4,2,.6,1) forwards',
            pointerEvents: 'none',
          }} />
        </div>
      )}
      <AccesoModal open={showAcceso} onClose={() => setShowAcceso(false)} />
    </>
  );
}

export default Navbar;
