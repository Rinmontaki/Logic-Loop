import React, { useEffect, useRef, useState } from "react";

const galeriaData = [
  { nombre: "Conceptos", archivo: "Conceptos.png" },
  { nombre: "Ciclos", archivo: "ciclos.png" },
  { nombre: "Funciones", archivo: "funciones.png" },
  { nombre: "Vectores", archivo: "vectores.jpg" },
  { nombre: "Matrices", archivo: "matrices.jpg" },
  { nombre: "Archivos", archivo: "archivos.jpg" },
  { nombre: "Registros", archivo: "registros.jpg" }
];

export default function Galeria() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % galeriaData.length);
    }, 3500);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  return (
    <div style={{
      maxWidth: 700,
      margin: "40px auto",
      background: "linear-gradient(135deg, #004AAD 80%, #ffb300 100%)",
      borderRadius: 18,
      boxShadow: "0 4px 24px #004aad33",
      padding: 0,
      overflow: "hidden",
      border: "2.5px solid #338dff44"
    }}>
      <div style={{
        background: "linear-gradient(90deg, #004AAD 60%, #ffb300 100%)",
        color: "#fff",
        padding: "28px 0 18px 0",
        textAlign: "center",
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 1.5
      }}>
        Galería de Temas
      </div>
      <div style={{
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 0 32px 0",
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        minHeight: 420
      }}>
        <h3 style={{ color: "#004AAD", marginBottom: 18, fontSize: 24, fontWeight: 600 }}>{galeriaData[index].nombre}</h3>
        <img
          src={require(`../../../Imagenes/img Galeria/${galeriaData[index].archivo}`)}
          alt={galeriaData[index].nombre}
          style={{
            maxWidth: 520,
            maxHeight: 340,
            borderRadius: 12,
            boxShadow: "0 2px 16px #004aad22",
            border: "2px solid #ffb300",
            background: "#eaeaea"
          }}
        />
        <div style={{ marginTop: 24, display: "flex", gap: 7, justifyContent: "center" }}>
          {galeriaData.map((item, i) => (
            <button
              key={item.nombre}
              onClick={() => setIndex(i)}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: "none",
                background: i === index ? "#004AAD" : "#ffb300",
                opacity: i === index ? 1 : 0.5,
                cursor: "pointer",
                transition: "background 0.2s, opacity 0.2s"
              }}
              aria-label={item.nombre}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
