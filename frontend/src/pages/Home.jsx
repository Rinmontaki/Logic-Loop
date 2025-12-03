import React from "react";
import LppCardsCarousel from "../components/LppCardsCarousel";

export default function Home() {
  return (
    <div className="home-landing">
      <h1 className="home-title">Bienvenido a Logic Loop</h1>
      <p className="home-desc">
        Plataforma interactiva para aprender y practicar pseudocódigo LPP.<br />
        Accede a temas, galería, creadores y mucho más tras iniciar sesión.
      </p>
      {/* Puedes agregar aquí un botón llamativo para ir a login o registro */}

      <section className="lpp-intro-section" style={{ marginTop: 48 }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--azul-claro, #004aad)',
          marginBottom: 24,
          textAlign: 'center',
          letterSpacing: '0.01em'
        }}>
          ¿LPP? ¿Cómo empiezo con esto?
        </h2>
        <LppCardsCarousel />
      </section>
    </div>
  );
}

/*
El validador de código se ha removido de la Home y solo estará en la ruta /validador.
*/
