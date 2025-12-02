import React, { useRef, useEffect } from "react";
import "./ThumbnailsBar.css";

export default function ThumbnailsBar({ pages, currentPage, onGoToPage, visible }) {
  const barRef = useRef();
  useEffect(() => {
    if (barRef.current && visible) {
      const active = barRef.current.querySelector('.thumb.active');
      if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentPage, visible]);
  const pageTitles = [
    "Página en blanco",
    "Página en blanco",
    "ALGORITMOS Y PROGRAMACIÓN BÁSICA EN LPP",
    "Introducción",
    "Tabla de contenido",
    "Tabla de contenido",
    "Tabla de contenido",
    "Tabla de contenido",
    "Tabla de contenido",
    "Tabla de contenido",
    "Tabla de contenido",
    "Tabla de contenido",
    "Tabla de contenido",
    "Tabla de contenido",
    "1.1 Contenido conceptos básicos",
    "1.1 Contenido conceptos básicos",
    "1.1 Contenido conceptos básicos",
    "1.4 Programa",
    "1.4 Programa",
    "1.6 Traductores de Lenguaje",
    "1.6 Traductores de Lenguaje",
    "1.7 Fases para desarrollar un programa",
    "1.7 Fases para desarrollar un programa",
    "1.8 Tipos de algoritmos",
    "1.9 Diagramas de Flujo",
    "1.9 Diagramas de Flujo",
    "1.9 Diagramas de Flujo",
    "1.9 Diagramas de Flujo",
    "1.9 Diagramas de Flujo",
    "1.9 Diagramas de Flujo",
    "1.9.10 Diagramas condicionales con petición",
    "1.9.12 Diagrama de flujo ciclo para",
    "1.9.13 Diagramas con funciones",
    "1.9.13 Diagramas con funciones",
    "1.12 Prueba de Escritorio",
    "1.12 Prueba de Escritorio",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "1.13 Ejercicios de la unidad",
    "2.6 Opciones adicionales en LPP",
    "2.6 Opciones adicionales en LPP",
    "2.6 Opciones adicionales en LPP",
    "2.6 Opciones adicionales en LPP",
    "2.6 Opciones adicionales en LPP",
    "2.7 Ejercicios de la unidad",
    "2.7 Ejercicios de la unidad",
    "2.7 Ejercicios de la unidad",
    "3.2 Estructura de un programa en LPP",
    "3.2 Estructura de un programa en LPP",
    "3.3 Palabras reservadas",
    "3.4 Comentarios en LPP",
    "3.5 Nomenclaturas de programación",
    "3.5 Nomenclaturas de programación",
    "3.5 Nomenclaturas de programación",
    "3.6 Identificador",
    "3.6 Identificador",
    "3.6 Identificador",
    "3.6 Identificador",
    "3.6 Identificador",
    "3.6 Identificador",
    "3.6 Identificador",
    "3.7 Entrada proceso y salida de datos",
    "3.7 Entrada proceso y salida de datos",
    "3.7 Entrada proceso y salida de datos",
    "3.7 Entrada proceso y salida de datos",
    "3.7 Entrada proceso y salida de datos",
    "3.7 Entrada proceso y salida de datos",
    "3.8 Variables",
    "3.8 Variables",
    "3.9 Tipos de datos",
    "3.9 Tipos de datos",
    "3.9 Tipos de datos",
    "3.10.1 Datos numéricos",
    "3.10.2 Tipo de dato flotante",
    "3.11 Tipo de dato lógico",
    "3.12 Tipo de dato carácter",
    "3.12.2 Tipo de dato cadena",
    "3.12.3 Tipo de dato cadena",
    "3.13 Tipos de datos compuestos",
    "3.13.1 Asignación de datos",
    "3.13.1 Asignación de datos",
    "3.13.1 Asignación de datos",
    "3.14.1 Operadores aritméticos",
    "3.14.2 Operador mod",
    "3.14.2 Operador mod",
    "3.15 Operador div",
    "3.15.1 Operador ^",
    "3.15.2 Operador de agrupar expresiones ( )",
    "3.16 Operadores relacionales",
    "3.16 Operadores relacionales",
    "3.16 Operadores relacionales",
    "3.18.1 Paréntesis internos prioridad 1",
    "3.18.2 Paréntesis prioridad 2",
    "3.18.4 Mod y Div prioridad 4",
    "3.18.5 Multiplicación (*) y división (/) prioridad 5",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "3.18.6 Suma (+) y resta (-) prioridad 6",
    "4.9 Ejercicios de la unidad",
    "4.9 Ejercicios de la unidad",
    "4.9 Ejercicios de la unidad",
    "Bibliografía",
    "Bibliografía",
    "Página en blanco"
  ];
  if (!visible) return null;
  return (
    <div className="thumbnails-bar" ref={barRef}>
      {pages.map((src, idx) => (
        <button
          key={idx}
          className={"thumb" + (currentPage === idx + 1 ? " active" : "")}
          onClick={() => onGoToPage(idx + 1)}
          aria-label={`Ir a página ${idx + 1}`}
        >
          <div className="thumb-title">
            {pageTitles[idx] || ''}
          </div>
          <img
            src={src}
            alt={`Miniatura página ${idx + 1}`}
            loading="lazy"
            width={60}
            height={84}
          />
          <span>{idx + 1}</span>
// ...existing code...
        </button>
      ))}
    </div>
  );
}
