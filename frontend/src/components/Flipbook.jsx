import "./Flipbook.css";
import React, {
  useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect, useMemo
} from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, pdfjs } from "react-pdf";
import LibroControls from "./LibroControls";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const Flipbook = forwardRef(function Flipbook(
  {
    fileUrl = "/pdfs/libro.pdf",
    onPageChange,
    onReady,
    showControls = true,
    thumbnailsVisible = false,
    onToggleThumbnails,
  },
  ref
) {
  const flipRef = useRef(null);
  const containerRef = useRef(null);

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para zoom y pan
  const [zoom, setZoom] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // Tamaño de página lógico (se ajusta al alto de la ventana)
  const [pageW, setPageW] = useState(540);
  const [pageH, setPageH] = useState(Math.round(540 * 1.4));

  // Ajustar tamaño base de página según alto de ventana
  useEffect(() => {
    const updateSize = () => {
      const vh = window.innerHeight || 800;
      const available = vh - 220; // resta barra superior
      const newH = Math.max(360, Math.min(available, 720));
      const newW = Math.round(newH / 1.4);
      setPageH(newH);
      setPageW(newW);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Zoom y pan handlers
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.01;
      const newZoom = Math.max(0.3, Math.min(3.0, zoom + delta));
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const percentX = mouseX / rect.width;
      const percentY = mouseY / rect.height;
      const zoomDiff = newZoom - zoom;
      setPosition(prev => ({
        x: prev.x - (zoomDiff * rect.width * percentX),
        y: prev.y - (zoomDiff * rect.height * percentY)
      }));
      setZoom(newZoom);
    }
  };

  // Pan handlers
  const handleMouseDown = (e) => {
    if (zoom <= 1.0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    onReady?.({ totalPages: numPages });
  };

  // Renderizar páginas como imágenes
  const [visibleImages, setVisibleImages] = useState({});
  const getPageImage = useCallback(async (pageNum) => {
    const canvas = document.createElement('canvas');
    const loadingTask = pdfjs.getDocument(fileUrl);
    try {
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNum);

      // Renderizado HD independiente del tamaño visual (mejor calidad al hacer zoom)
      const baseViewport = page.getViewport({ scale: 1 });
      const hdScale = 2.5; // calidad alta
      const viewport = page.getViewport({ scale: hdScale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (err) {
      return null;
    }
  }, [fileUrl]);

  useEffect(() => {
    if (!numPages) return;
    // Solo cargar la página actual y la siguiente
    const pagesToShow = [currentPage + 1, currentPage + 2].filter(p => p <= numPages);
    pagesToShow.forEach(pageNum => {
      if (!visibleImages[pageNum]) {
        getPageImage(pageNum).then(img => {
          setVisibleImages(prev => ({ ...prev, [pageNum]: img }));
        });
      }
    });
  }, [currentPage, numPages, getPageImage, visibleImages]);

  const renderPages = useMemo(() => {
    return Array.from({ length: numPages }).map((_, i) => (
      <div key={i} className="page" style={{ width: pageW, height: pageH, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        {visibleImages[i + 1] ? (
          <img src={visibleImages[i + 1]} alt={`Página ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <div style={{ color: '#888', textAlign: 'center' }}>Cargando página {i + 1}...</div>
        )}
      </div>
    ));
  }, [visibleImages, pageW, pageH, numPages]);

  // Flipbook navigation
  const onFlipPage = useCallback((e) => {
    const pageIndex = e?.data ?? 0;
    setCurrentPage(pageIndex);
    onPageChange?.(pageIndex + 1);
  }, [onPageChange]);

  const resetZoomAndPan = useCallback(() => {
    setZoom(1.0);
    setPosition({ x: 0, y: 0 });
  }, []);

  useImperativeHandle(ref, () => ({
    next: () => flipRef.current?.pageFlip().flipNext(),
    prev: () => flipRef.current?.pageFlip().flipPrev(),
    goTo: (n) => {
      const idx = Math.max(0, Math.min(numPages - 1, (n ?? 1) - 1));
      flipRef.current?.pageFlip().flip(idx);
      setCurrentPage(idx);
    },
    zoomIn: () => setZoom(z => Math.min(2.5, z + 0.25)),
    zoomOut: () => setZoom(z => Math.max(0.8, z - 0.25)),
    zoomReset: resetZoomAndPan,
    getCurrentZoom: () => Math.round(zoom * 100),
  }), [numPages, zoom, resetZoomAndPan]);

  if (!numPages) {
    return (
      <div className="flipbook-loading">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => setError(err.message)}
          loading={<div>Cargando PDF...</div>}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flipbook-shell">
      {showControls && (
        <LibroControls
          onZoomIn={() => setZoom(z => Math.min(2.5, z + 0.25))}
          onZoomOut={() => setZoom(z => Math.max(0.8, z - 0.25))}
          onZoomReset={resetZoomAndPan}
          onFitWidth={() => setZoom(1.0)}
          onFitHeight={() => setZoom(1.0)}
          onPan={() => { }}
          onPrevPage={() => flipRef.current?.pageFlip().flipPrev()}
          onNextPage={() => flipRef.current?.pageFlip().flipNext()}
          onGoToPage={(n) => flipRef.current?.pageFlip().flip(n - 1)}
          currentPage={currentPage + 1}
          totalPages={numPages}
          onToggleThumbnails={onToggleThumbnails}
          thumbnailsVisible={thumbnailsVisible}
          onReadSelection={() => {
            const text = window.getSelection?.().toString();
            if (text) {
              const u = new window.SpeechSynthesisUtterance(text);
              window.speechSynthesis.speak(u);
            }
          }}
        />
      )}

      {thumbnailsVisible && (
        <div className="flipbook-thumbnails-panel">
          <div style={{padding:8, fontWeight:'bold', fontSize:15}}>Miniaturas</div>
          <div style={{display:'flex', flexDirection:'column', gap:8, overflowY:'auto', maxHeight: '70vh', padding:8}}>
            {Array.from({ length: numPages }).map((_, i) => (
              <div
                key={i}
                style={{
                  border: currentPage === i ? '2px solid #1976d2' : '1px solid #ccc',
                  borderRadius: 4,
                  background: currentPage === i ? '#e3f2fd' : '#fff',
                  cursor: 'pointer',
                  boxShadow: currentPage === i ? '0 0 6px #1976d2' : 'none',
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onClick={() => flipRef.current?.pageFlip().flip(i)}
              >
                <span style={{fontSize:13, width:32, textAlign:'right'}}>Pág. {i+1}</span>
                <div style={{width:40, height:56, background:'#eee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#888'}}>
                  {i+1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Renderizar imágenes como hijos válidos del flipbook */}
      <div
        className="flipbook-zoom-container"
        style={{
          width: pageW,
          height: pageH,
          overflow: 'hidden',
          position: 'relative',
          cursor: zoom > 1.0 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <HTMLFlipBook
          ref={flipRef}
          width={pageW}
          height={pageH}
          usePortrait={true}
          showCover={false}
          size="fixed"
          onFlip={onFlipPage}
          maxShadowOpacity={0.3}
          mobileScrollSupport={true}
          className="flipbook"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.2s',
          }}
        >
          {renderPages}
        </HTMLFlipBook>
      </div>
    </div>
  );
});

export default Flipbook;