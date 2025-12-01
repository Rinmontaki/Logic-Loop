import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LibroControls from "../components/LibroControls";
import Flipbook from "../components/Flipbook";
import "../components/LibroControls.css";


export default function Libro() {
  const flipRef = useRef(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageTexts] = useState(undefined);
  const [thumbnailsVisible, setThumbnailsVisible] = useState(false);
  const [zoom, setZoom] = useState(125);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Funciones para controles del Flipbook
  const handleZoomIn = () => flipRef.current?.zoomIn();
  const handleZoomOut = () => flipRef.current?.zoomOut();
  const handleZoomReset = () => flipRef.current?.zoomReset();
  const handleFitWidth = () => flipRef.current?.fitWidth();
  const handleFitHeight = () => flipRef.current?.fitHeight();
  const handleFitAuto = () => flipRef.current?.fitAuto();
  const handlePrevPage = () => flipRef.current?.prev();
  const handleNextPage = () => flipRef.current?.next();
  const handleGoToPage = (n) => flipRef.current?.goTo(n);
  const handleZoomChange = (z) => setZoom(z);
  const handleSetZoom = (val) => flipRef.current?.setZoom?.(val);
  const handleToggleFullscreen = () => {
    flipRef.current?.toggleFullscreen?.();
  };

  // Escuchar cambios reales de fullscreen (ESC, F11, etc.)
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div className="libro-fullscreen-wrapper" style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'transparent',
      boxSizing: 'border-box',
      padding: 0,
      overflow: 'hidden'
    }}>
      <div className="libro-controls-top">
        <LibroControls
          currentPage={currentPage}
          totalPages={totalPages}
          onToggleThumbnails={() => setThumbnailsVisible((v) => !v)}
          thumbnailsVisible={thumbnailsVisible}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onFitWidth={handleFitWidth}
          onFitHeight={handleFitHeight}
          onFitAuto={handleFitAuto}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onGoToPage={handleGoToPage}
          currentZoom={zoom}
          onZoomTo={handleSetZoom}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
          onReadSelection={() => {
            if (window.getSelection) {
              const text = window.getSelection().toString();
              if (text) {
                const utter = new window.SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utter);
              }
            }
          }}
        />
      </div>

      {/* Contenedor principal del libro - ALTURA EXPLÍCITA */}
      <div
        style={{
          flex: 1,
          width: "100vw",
          height: "calc(100vh - 96px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 0,
          background: "#181a20",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Flipbook
              ref={flipRef}
              fileUrl="/pdfs/libro.pdf"
              onPageChange={(n) => setCurrentPage(n)}
              onReady={({ totalPages }) => setTotalPages(totalPages)}
              thumbnailsVisible={thumbnailsVisible}
              onToggleThumbnails={() => setThumbnailsVisible((v) => !v)}
              onZoomChange={handleZoomChange}
              showControls={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}