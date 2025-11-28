import React, { useRef, useState } from "react";
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

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "linear-gradient(90deg, #eaf1ff 60%, #f7faff 100%)",
      boxSizing: "border-box",
      padding: "0",
      overflow: "hidden",
    }}>
      
      {/* Controles */}
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        padding: '15px 0',
        background: 'transparent',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        flexShrink: 0, // 👈 Evita que se encoja
      }}>
        <LibroControls
          flipRef={flipRef}
          currentPage={currentPage}
          totalPages={totalPages}
          pageTexts={pageTexts}
          onToggleThumbnails={() => setThumbnailsVisible(v => !v)}
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
      <div style={{
        flex: 1,
        width: "100vw",
        height: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 0,
        background: "#181a20",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 12px 50px rgba(0, 74, 173, 0.2)",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            minWidth: 400,
            minHeight: 600,
            maxWidth: 900,
            maxHeight: "90vh",
            margin: "auto"
          }}>
            <Flipbook
              ref={flipRef}
              fileUrl="/pdfs/libro.pdf"
              onPageChange={n => setCurrentPage(n)}
              onReady={({ totalPages }) => setTotalPages(totalPages)}
              thumbnailsVisible={thumbnailsVisible}
              onToggleThumbnails={() => setThumbnailsVisible(v => !v)}
              showControls={false}
            />
          </div>
        </div>
      </div>
    </div>
    
  );
}