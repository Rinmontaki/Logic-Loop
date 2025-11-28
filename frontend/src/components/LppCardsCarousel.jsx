import React, { useState } from "react";
import "./LppCardsCarousel.css";

const cards = [
  {
    title: "¿Qué es LPP y por qué aprenderlo?",
    alt: "¿Qué es LPP?",
    text: `El Lenguaje de Programación para Principiantes (LPP) es una herramienta pedagógica diseñada para introducir a estudiantes —especialmente en colegios y primeros semestres universitarios— al pensamiento lógico y computacional. No se trata de un lenguaje de programación profesional como Python o Java, sino de un pseudocódigo estructurado que sigue reglas sencillas y claras. Esto permite que los alumnos se concentren en comprender la lógica de los algoritmos sin distraerse con la complejidad de la sintaxis de lenguajes avanzados.\n\nEn otras palabras, LPP funciona como un “puente” que facilita el paso del pensamiento natural al pensamiento algorítmico.`
  },
  {
    title: "¿Cómo puedo empezar con LPP?",
    alt: "¿Cómo empezar con LPP?",
    text: `Para iniciarse en LPP, no se requiere experiencia previa en programación. El camino recomendado es:\n\n• Familiarizarse con la sintaxis básica: comandos simples como Escribir, Leer, Si…Entonces, Mientras o Para que representan las estructuras más comunes en cualquier lenguaje real.\n• Resolver pequeños problemas cotidianos: por ejemplo, diseñar un algoritmo que calcule el promedio de tres números, que muestre si un número es par o impar, o que imprima una tabla de multiplicar.\n• Usar plataformas interactivas (como LPP-Curso): que validan el código, corrigen errores y permiten practicar en un entorno amigable.\n• Dar el salto progresivo a lenguajes formales: una vez adquirida la lógica, la transición a C, Python o Java se vuelve mucho más natural.`
  },
  {
    title: "¿Cuál es el objetivo central de LPP?",
    alt: "Objetivo de LPP",
    text: `El objetivo central de LPP es formar en pensamiento algorítmico y resolución de problemas, más que enseñar un lenguaje en sí mismo.\n\nCon LPP se busca que los estudiantes:\n• Aprendan a descomponer un problema grande en pasos pequeños.\n• Reconozcan las estructuras de control fundamentales (condicionales, ciclos, secuencias).\n• Desarrollen habilidades de análisis lógico que podrán aplicar luego en cualquier disciplina tecnológica.\n\nEn este sentido, LPP se convierte en una herramienta para entrenar la mente en procesos ordenados y sistemáticos, una competencia clave en la era digital.`
  },
  {
    title: "¿Qué recursos ofrece LPP para el aprendizaje?",
    img: "/assets/lpp-recursos.png",
    alt: "Recursos de LPP",
    text: `LPP aporta varios elementos que enriquecen el proceso educativo:\n\n• Simplicidad sintáctica: sus instrucciones son fáciles de leer, casi como frases en español, lo que reduce la barrera de entrada.\n• Ambiente controlado de práctica: los errores son comprensibles y están pensados para guiar al aprendiz, no para frustrarlo.\n• Variedad de ejercicios progresivos: desde ejemplos básicos hasta problemas más complejos que retan al estudiante a pensar de manera abstracta.\n• Validadores y entornos gráficos: como LPP-Curso, que ofrecen retroalimentación inmediata, ejercicios guiados, galerías de ejemplos y módulos para trabajar en comunidad.\n• Transversalidad educativa: LPP no se limita a informática; se puede aplicar en matemáticas, física, lógica o resolución de problemas cotidianos.\n\nEn resumen, LPP no busca crear programadores expertos de inmediato, sino despertar en los estudiantes el hábito de pensar como un programador: analítico, lógico y orientado a soluciones.`
  }
];

export default function LppCardsCarousel() {
  const [active, setActive] = useState(0);

  const prevCard = () => setActive((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  const nextCard = () => setActive((prev) => (prev === cards.length - 1 ? 0 : prev + 1));

  return (
    <div className="lpp-carousel-container">
      <button className="lpp-carousel-arrow left" onClick={prevCard} aria-label="Anterior">&#8592;</button>
      <div className="lpp-carousel-track">
        {cards.map((card, idx) => {
          let className = "lpp-carousel-card";
          if (idx === active) className += " active";
          else if (idx === (active - 1 + cards.length) % cards.length) className += " prev";
          else if (idx === (active + 1) % cards.length) className += " next";
          else className += " hidden";
          return (
            <div className={className} key={card.title}>
              <div className="lpp-card-content">
                <h3>{card.title}</h3>
                <p>{card.text.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="lpp-carousel-arrow right" onClick={nextCard} aria-label="Siguiente">&#8594;</button>
    </div>
  );
}
