Logic-Loop — Proyecto de Grado (LPP)

Descripción

- Plataforma web para practicar Lógica y Fundamentos de Programación (LPP) con retos, validación automática de código, retroalimentación con IA y un visor tipo libro (Flipbook) para los contenidos.
- Arquitectura full-stack: frontend en React, backend en Node.js + Python (FastAPI) para validación y servicios auxiliares.

Estructura del proyecto

- `frontend/`: Aplicación React (UI, retos, editor de código, visor PDF tipo libro).
- `backend/`: API y servicios (Node.js para auth y rutas; Python/FastAPI para validación/IA).
- `Imagenes/`, `model/`, `test/`: recursos adicionales.

Características clave

- Editor de código con validación y pruebas automáticas.
- Panel de resultados con resumen, errores, código corregido y casos de prueba.
- Flipbook con PDF del libro LPP: miniaturas, zoom, ajuste a ancho/alto, fullscreen, y navegación estable a páginas específicas sin alterar la URL.
- Autenticación básica y esquemas para usuarios y solicitudes.

Requisitos

- Windows con PowerShell 5.1 (o superior).
- Node.js 18+ y npm.
- Python 3.10+.
- Dependencias del frontend: `react`, `react-router-dom`, `pdfjs`/`react-pdf`, `react-pageflip` (o similares según `package.json`).
- Dependencias del backend: ver `backend/package.json` y `backend/main.py`/`uvicorn`.

Instalación

1) Backend Node.js (auth y rutas)

- En PowerShell:

```powershell
cd "D:\Universidad\Proyecto de Algoritmos y Fundamentos de Programacion\Proyecto de Grado\Logic-Loop_Proyecto_Grado\Logic-Loop\backend"; npm install; node server.js
```

2) Frontend React

- Construcción y servidor estático (opción rápida):

```powershell
cd "D:\Universidad\Proyecto de Algoritmos y Fundamentos de Programacion\Proyecto de Grado\Logic-Loop_Proyecto_Grado\Logic-Loop\frontend"; npm install; npm run build; npx serve -s build
```

- Desarrollo (hot reload):

```powershell
cd "D:\Universidad\Proyecto de Algoritmos y Fundamentos de Programacion\Proyecto de Grado\Logic-Loop_Proyecto_Grado\Logic-Loop\frontend"; npm install; npm start
```

3) Backend Python (validación, IA)

```powershell
cd "D:\Universidad\Proyecto de Algoritmos y Fundamentos de Programacion\Proyecto de Grado\Logic-Loop_Proyecto_Grado\Logic-Loop\backend"; 
# Crea/activa tu entorno si lo usas
# Instala dependencias (ej.: fastapi, uvicorn, pydantic)
uvicorn main:app --reload
```

Configuración del Flipbook (PDF)

- El worker de PDF se sirve desde `frontend/public/pdf.worker.min.js` y se referencia como `/pdf.worker.min.js`.
- El libro se carga desde `frontend/public/pdfs/libro.pdf` y la ruta usada en React es `/pdfs/libro.pdf`.
- Navegación a páginas específicas: usa `navigate('/libro', { state: { targetPage: N } })` en lugar de `?page=N`. El salto ocurre tras la carga completa del PDF y del componente Flipbook.

Flujo recomendado

- Inicia el backend Node.js (`node server.js`).
- Inicia el backend Python (`uvicorn main:app --reload`).
- Corre el frontend (desarrollo `npm start` o producción `serve -s build`).

Notas de base de datos

- Base sugerida: `bd_lpp`.

Guías rápidas de desarrollo

- Enlaces al libro: evitar anchors con `href="/libro?page=15"`. Usar React Router con `state` para no bloquear el Flipbook.
- Al validar código, revisa `backend/services` (lexer, parser, semantic, code_validation) y `frontend/src/components/ResultsPanel.jsx`.

Recursos

- PDF.js CDN: https://cdnjs.com/libraries/pdf.js/2.6.347

Licencia

- Uso académico/educativo. Ajustar según necesidades del proyecto.
