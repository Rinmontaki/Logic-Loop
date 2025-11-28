import React, { useState, useEffect } from "react";
import "./LibroControls.css";

export default function LibroControls({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitWidth,
  onFitHeight,
  onFitAuto,
  onPrevPage,
  onNextPage,
  onGoToPage,
  currentPage,
  totalPages,
  onToggleThumbnails,
  thumbnailsVisible,
  onReadSelection,
  currentZoom,
}) {
  const [localZoom, setLocalZoom] = useState(currentZoom || 100);

  // Sincronizar el zoom cuando cambia la prop del padre
  useEffect(() => {
    if (currentZoom !== undefined) {
      setLocalZoom(currentZoom);
    }
  }, [currentZoom]);

  const handleZoomTo = (percentage) => {
    setLocalZoom(percentage);
    
    if (percentage === 100) {
      onZoomReset?.();
    } else {
      const current = currentZoom || 100;
      const difference = percentage - current;
      const steps = Math.abs(difference) / 25;
      
      if (difference > 0) {
        // Zoom in
        for (let i = 0; i < steps; i++) {
          setTimeout(() => onZoomIn?.(), i * 50);
        }
      } else {
        // Zoom out
        for (let i = 0; i < steps; i++) {
          setTimeout(() => onZoomOut?.(), i * 50);
        }
      }
    }
  };

  const handlePageInputChange = (e) => {
    const page = Number(e.target.value);
    if (page >= 1 && page <= totalPages) {
      onGoToPage?.(page);
    }
  };

  const handlePageInputBlur = (e) => {
    let page = Number(e.target.value);
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    onGoToPage?.(page);
  };

  return (
    <nav className="libro-controls" aria-label="Controles del libro interactivo">
      <div className="libro-controls-row">

        {/* CONTROLES DE ZOOM PROFESIONALES */}
        <div className="controls-group">
          <button
            onClick={onZoomOut}
            aria-label="Alejar"
            title="Alejar"
            className="control-btn"
            disabled={localZoom <= 50}
          >
            <span className="icon">−</span>
          </button>

          <div className="zoom-display">
            <select
              value={localZoom}
              onChange={(e) => handleZoomTo(Number(e.target.value))}
              aria-label="Nivel de zoom"
              className="zoom-select"
            >
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
              <option value={175}>175%</option>
              <option value={200}>200%</option>
              <option value={250}>250%</option>
              <option value={300}>300%</option>
            </select>
            <span className="zoom-text">{localZoom}%</span>
          </div>

          <button
            onClick={onZoomIn}
            aria-label="Acercar"
            title="Acercar"
            className="control-btn"
            disabled={localZoom >= 300}
          >
            <span className="icon">+</span>
          </button>

          <button
            onClick={onZoomReset}
            aria-label="Restablecer zoom"
            title="Restablecer zoom al 100%"
            className="control-btn"
          >
            <span className="icon">⭮</span>
          </button>
        </div>

        <div className="controls-separator"></div>

        {/* AJUSTE DE PÁGINA */}
        <div className="controls-group">
          <button
            onClick={onFitWidth}
            aria-label="Ajustar al ancho"
            title="Ajustar al ancho"
            className="control-btn"
          >
            <span className="icon">⇄</span>
          </button>
          <button
            onClick={onFitHeight}
            aria-label="Ajustar al alto"
            title="Ajustar al alto"
            className="control-btn"
          >
            <span className="icon">⇅</span>
          </button>
          <button
            onClick={onFitAuto}
            aria-label="Ajuste automático"
            title="Ajuste automático"
            className="control-btn"
          >
            <span className="icon">⤢</span>
          </button>
        </div>

        <div className="controls-separator"></div>

        {/* NAVEGACIÓN DE PÁGINAS */}
        <div className="controls-group">
          <button
            onClick={onPrevPage}
            aria-label="Página anterior"
            title="Página anterior"
            className="control-btn"
            disabled={currentPage <= 1}
          >
            <span className="icon">‹</span>
          </button>

          <div className="page-navigation">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              aria-label="Número de página"
              className="page-input"
            />
            <span className="page-count">de {totalPages}</span>
          </div>

          <button
            onClick={onNextPage}
            aria-label="Página siguiente"
            title="Página siguiente"
            className="control-btn"
            disabled={currentPage >= totalPages}
          >
            <span className="icon">›</span>
          </button>
        </div>

        <div className="controls-separator"></div>

        {/* CONTROLES ADICIONALES */}
        <div className="controls-group">
          {onToggleThumbnails && (
            <button
              onClick={onToggleThumbnails}
              aria-label={thumbnailsVisible ? "Ocultar miniaturas" : "Mostrar miniaturas"}
              title={thumbnailsVisible ? "Ocultar miniaturas" : "Mostrar miniaturas"}
              className={`control-btn ${thumbnailsVisible ? 'active' : ''}`}
            >
              <span className="icon">📑</span>
            </button>
          )}

          <button
            onClick={onReadSelection}
            aria-label="Leer texto seleccionado"
            title="Leer texto seleccionado en voz alta"
            className="control-btn"
          >
            <span className="icon">🔊</span>
          </button>
        </div>

      </div>
    </nav>
  );
}