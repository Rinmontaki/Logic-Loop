import React from "react";

export default function Temas() {
  return (
    <div style={{
      maxWidth: 600,
      margin: "40px auto",
      background: "linear-gradient(135deg, #004AAD 80%, #004AAD 100%)",
      borderRadius: 18,
      boxShadow: "0 4px 24px #004aad33",
      padding: 0,
      overflow: "hidden",
      border: "2.5px solid #338dff44"
    }}>
      <div style={{
        background: "linear-gradient(90deg, #004AAD 60%, #004AAD 100%)",
        color: "#FF7F11",
        padding: "28px 0 18px 0",
        textAlign: "center",
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 1.5
      }}>
        Temas del Curso
      </div>
      <ol style={{
        fontSize: 22,
        color: "#0B0C10",
        lineHeight: 2.1,
        margin: 0,
        padding: "32px 40px 32px 48px",
        background: "#fff",
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        boxShadow: "0 2px 8px #004aad11",
        textAlign: "center",
        listStylePosition: "inside"
      }}>
        <li>Conceptos</li>
        <li>Ciclos</li>
        <li>Funciones</li>
        <li>Vectores</li>
        <li>Matrices</li>
        <li>Archivos</li>
        <li>Registros</li>
      </ol>
    </div>
  );
}
