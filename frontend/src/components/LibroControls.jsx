import React, { useState, useEffect } from "react";
import "./LibroControls.css";

export default function LibroControls({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitWidth,
  onFitHeight,
  onFitAuto,
  fitMode,
  onPrevPage,
  onNextPage,
  onGoToPage,
  currentPage,
  totalPages,
  onToggleThumbnails,
  thumbnailsVisible,
  onReadSelection,
  currentZoom,
  onZoomTo,
  onToggleFullscreen,
  isFullscreen,
  onToggleAutoplay,
  isAutoplay,
  searchQuery,
  onSearchQueryChange,
  onSearchPrev,
  onSearchNext,
  searchInfo,
  onToggleBookmark,
  isBookmarked,
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
    // Si existe API directa de zoom, úsala; si no, fallback incremental
    if (onZoomTo) {
      onZoomTo(percentage);
      return;
    }
    if (percentage === 100) {
      onZoomReset?.();
      return;
    }
    const current = currentZoom || 100;
    const difference = percentage - current;
    const steps = Math.abs(difference) / 25;
    if (difference > 0) {
      for (let i = 0; i < steps; i++) {
        setTimeout(() => onZoomIn?.(), i * 30);
      }
    } else if (difference < 0) {
      for (let i = 0; i < steps; i++) {
        setTimeout(() => onZoomOut?.(), i * 30);
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

        {/* Eliminado: Ajuste de página (ancho/alto/auto) */}

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
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              className={`control-btn ${isFullscreen ? 'active' : ''}`}
              aria-pressed={isFullscreen}
            >
              <span className="icon">⛶</span>
            </button>
          )}
          {/* BÚSQUEDA GLOBAL */}
          {onSearchQueryChange && (
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar en el libro..."
                value={searchQuery || ""}
                onChange={(e) => onSearchQueryChange(e.target.value)}
              />
              <button
                className="control-btn"
                type="button"
                onClick={onSearchPrev}
                title="Resultado anterior"
                aria-label="Resultado anterior"
              >
                <span className="icon">↑</span>
              </button>
              <button
                className="control-btn"
                type="button"
                onClick={onSearchNext}
                title="Siguiente resultado"
                aria-label="Siguiente resultado"
              >
                <span className="icon">↓</span>
              </button>
              {searchInfo && (
                <span className="search-info">
                  {searchInfo.current + 1}/{searchInfo.total}
                </span>
              )}
            </div>
          )}

          {/* MARCADOR DE PÁGINA */}
          {onToggleBookmark && (
            <button
              onClick={onToggleBookmark}
              aria-label={isBookmarked ? "Quitar marcador" : "Agregar marcador"}
              title={isBookmarked ? "Quitar marcador" : "Agregar marcador"}
              className={`control-btn ${isBookmarked ? "active" : ""}`}
            >
              <span className="icon">{isBookmarked ? "★" : "☆"}</span>
            </button>
          )}

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

          {onToggleAutoplay && (
            <button
              onClick={onToggleAutoplay}
              aria-label={isAutoplay ? "Detener reproducción automática" : "Reproducción automática"}
              title={isAutoplay ? "Detener reproducción automática" : "Reproducción automática"}
              className={`control-btn ${isAutoplay ? "active" : ""}`}
            >
              <span className="icon">{isAutoplay ? "⏸" : "▶"}</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}