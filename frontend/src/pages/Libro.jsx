import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LibroControls from "../components/LibroControls";
import Flipbook from "../components/Flipbook";
import "../components/LibroControls.css";


export default function Libro() {
  const flipRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Leer página objetivo desde state para no depender de la URL
  const targetPage = Number(location.state?.targetPage) || null;
  // Normalizar URL si viene como /libro?page=15: quitar query y pasar state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get('page') || '0', 10);
    if (!isNaN(pageParam) && pageParam > 0) {
      // Navegar a la misma ruta sin query, preservando el state con targetPage
      navigate('/libro', { state: { targetPage: pageParam }, replace: true });
    }
  }, [location.search, navigate]);
  const [pageTexts] = useState(undefined);
  const [thumbnailsVisible, setThumbnailsVisible] = useState(false);
  const [zoom, setZoom] = useState(125);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Control para realizar el salto solo una vez de forma confiable
  const [didJump, setDidJump] = useState(false);
  // Señales de readiness
  const [pdfReady, setPdfReady] = useState(false);
  const [flipReady, setFlipReady] = useState(false);

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

  // Importante: NO saltar de página hasta que el Flipbook esté listo.
  // Se elimina el efecto que intentaba navegar antes de que el componente termine de cargar,
  // para evitar cambios de ruta y garantizar que el salto ocurra únicamente tras onReady.

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
              onReady={({ totalPages }) => {
                setTotalPages(totalPages);
                setPdfReady(true);
              }}
              onInteractiveReady={() => setFlipReady(true)}
              thumbnailsVisible={thumbnailsVisible}
              onToggleThumbnails={() => setThumbnailsVisible((v) => !v)}
              onZoomChange={handleZoomChange}
              showControls={false}
            />
          </div>
        </div>
      </div>
      {/* Efecto de salto confiable */}
      <LibroJumpEffect
        flipRef={flipRef}
        totalPages={totalPages}
        targetPage={targetPage}
        didJump={didJump}
        setDidJump={setDidJump}
        pdfReady={pdfReady}
        flipReady={flipReady}
      />
    </div>
  );
}

// Efecto robusto: espera a que Flipbook exponga la API y salta una sola vez
// Esto cubre casos donde onReady ocurre antes de que HTMLFlipBook monte totalmente.
export function LibroJumpEffect({ flipRef, totalPages, targetPage, didJump, setDidJump, pdfReady, flipReady }) {
  useEffect(() => {
    if (didJump) return;
    if (!pdfReady || !flipReady) return;
    if (!Number.isFinite(targetPage) || targetPage <= 0) return;
    if (!totalPages || totalPages <= 0) return;

    const safePage = Math.min(totalPages, Math.max(1, targetPage));
    let attempts = 0;
    const maxAttempts = 20; // ~2s si interval es 100ms
    const interval = setInterval(() => {
      attempts++;
      const api = flipRef.current?.pageFlip?.();
      if (api && typeof api.flip === 'function') {
        api.flip(safePage - 1);
        setDidJump(true);
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [didJump, flipRef, totalPages, targetPage, setDidJump, pdfReady, flipReady]);
  return null;
}