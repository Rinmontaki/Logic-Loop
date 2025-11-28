
import React, { useState } from "react";
import "./AccesoModal.css";


async function registerUser({ nombre, email, password }) {
  const response = await fetch("http://localhost:4000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: nombre, email, password })
  });
  return response.json();
}

async function loginUser({ usuarioOEmail, password }) {
  // El backend acepta usuario o email en el campo username
  const response = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usuarioOEmail, password })
  });
  return response.json();
}

export default function AccesoModal({ open, onClose }) {
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ usuarioOEmail: '', password: '', remember: false });
  const [registerData, setRegisterData] = useState({ nombre: '', email: '', password: '', terms: false });
  const [error, setError] = useState('');

  if (!open) return null;

  // Handlers
  const handleLoginChange = e => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleRegisterChange = e => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleLoginSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!loginData.usuarioOEmail || !loginData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    try {
      const res = await loginUser(loginData);
      if (res.error) {
        setError(res.error);
      } else if (res.token) {
        localStorage.setItem('token', res.token);
        setError('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          setError('');
          onClose && onClose();
        }, 1200);
      } else {
        setError('Error desconocido al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  const handleRegisterSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!registerData.nombre || !registerData.email || !registerData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    try {
      const res = await registerUser(registerData);
      if (res.error) {
        setError(res.error);
      } else {
        setError('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setTimeout(() => {
          setShowLogin(true);
          setError('');
        }, 1200);
        setRegisterData({ nombre: '', email: '', password: '', terms: false });
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="modal-bg" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg, #0d1628 80%, #338dff22 100%)",
      zIndex: 3000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(8px) saturate(120%)"
    }}>
      <div className="wrapper" style={{
        display: 'flex',
        background: 'linear-gradient(135deg, #0d1628 80%, #338dff22 100%)',
        border: '2.5px solid #338dff44',
        borderRadius: 24,
        boxShadow: '0 8px 32px #004aad88, 0 1.5px 8px #0002',
        minWidth: 320,
        maxWidth: 420,
        width: '96vw',
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button
          className="icon-close"
          onClick={onClose}
          tabIndex={0}
          aria-label="Cerrar ventana"
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClose()}
          type="button"
        >
          <ion-icon name="close">x</ion-icon>
        </button>
        <div className="form-slider" style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          transition: 'transform 0.5s cubic-bezier(.4,2,.6,1)',
          transform: showLogin ? 'translateX(0)' : 'translateX(-100%)'
        }}>
          {/* Login Form */}
          <div className="form-box login" style={{
            minWidth: '100%',
            maxWidth: '100%',
            transition: 'opacity 0.3s',
            opacity: showLogin ? 1 : 0.3,
            pointerEvents: showLogin ? 'auto' : 'none'
          }}>
            <h2>Iniciar Sesión</h2>
            {error && showLogin && <div className="error-message">{error}</div>}
            <form onSubmit={handleLoginSubmit} autoComplete="on">
              <div className="input-box">
                <span className="icon"><ion-icon name="mail"></ion-icon></span>
                <input
                  type="text"
                  name="usuarioOEmail"
                  required
                  value={loginData.usuarioOEmail}
                  onChange={handleLoginChange}
                  autoComplete="username"
                />
                <label>Usuario o correo</label>
              </div>
              <div className="input-box">
                <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
                <input type="password" name="password" required value={loginData.password} onChange={handleLoginChange} autoComplete="current-password" />
                <label>Contraseña</label>
              </div>
              <div className="remember-forgot">
                <label><input type="checkbox" name="remember" checked={loginData.remember} onChange={handleLoginChange} /> Recuérdame</label>
                <a href="#">¿Olvidaste tu contraseña?</a>
              </div>
              <button type="submit" className="btn">Iniciar Sesión</button>
              <div className="login-register">
                <p>¿Aún no tienes una cuenta? <a href="#" className="register-link" onClick={e => { e.preventDefault(); setShowLogin(false); }}>Regístrate</a></p>
              </div>
            </form>
          </div>
          {/* Register Form */}
          <div className="form-box register" style={{
            minWidth: '100%',
            maxWidth: '100%',
            transition: 'opacity 0.3s',
            opacity: showLogin ? 0.3 : 1,
            pointerEvents: showLogin ? 'none' : 'auto'
          }}>
            <h2>Registrarse</h2>
            {error && !showLogin && <div className="error-message">{error}</div>}
            <form onSubmit={handleRegisterSubmit} autoComplete="on">
              <div className="input-box">
                <span className="icon"><ion-icon name="person"></ion-icon></span>
                <input type="text" name="nombre" required value={registerData.nombre} onChange={handleRegisterChange} />
                <label>Nombre de Usuario</label>
              </div>
              <div className="input-box">
                <span className="icon"><ion-icon name="mail"></ion-icon></span>
                <input type="email" name="email" required value={registerData.email} onChange={handleRegisterChange} autoComplete="email" />
                <label>Correo</label>
              </div>
              <div className="input-box">
                <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
                <input type="password" name="password" required minLength={6} value={registerData.password} onChange={handleRegisterChange} autoComplete="new-password" />
                <label>Contraseña (mínimo 6 caracteres)</label>
              </div>
              <div className="remember-forgot">
                <label><input type="checkbox" name="terms" required checked={registerData.terms} onChange={handleRegisterChange} /> Acepto los términos y condiciones</label>
              </div>
              <button type="submit" className="btn">Registrarse</button>
              <div className="login-register">
                <p>¿Ya tienes una cuenta? <a href="#" className="login-link" onClick={e => { e.preventDefault(); setShowLogin(true); }}>Inicia Sesión</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

