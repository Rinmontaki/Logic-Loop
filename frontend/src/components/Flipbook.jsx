import "./Flipbook.css";
import React, {
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
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
    onZoomChange, // callback opcional para reflejar zoom fuera
  },
  ref
) {
  const flipRef = useRef(null);
  const containerRef = useRef(null);
  const viewportRef = useRef(null); // scroll viewport para resetear scroll

  // PDF cargado una sola vez y reutilizado
  const [pdfDoc, setPdfDoc] = useState(null);

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tamaño base de página para mejor control
  const [basePageSize, setBasePageSize] = useState({ 
    width: 550, 
    height: 733
  });

  // Estados para funcionalidades
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const autoplayTimerRef = useRef(null);

  // Renderizar páginas como imágenes
  const [visibleImages, setVisibleImages] = useState({});

  // Controles avanzados
  const [zoom, setZoom] = useState(125);            // 125% por defecto para mejor legibilidad
  const [fitMode, setFitMode] = useState("auto");  // "width" | "height" | "auto"
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInfo, setSearchInfo] = useState(null); // { current, total }
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Ajustar tamaño según ventana
  useEffect(() => {
    const updateSize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      const maxHeight = vh - 140; // más espacio útil
      const maxWidth = vw - 80;
      
      let height = Math.min(maxHeight, 950); // aumentar altura base
      let width = Math.min(maxWidth, Math.round(height / 1.333));
      // mínimos razonables para mejor lectura inicial
      height = Math.max(height, 850);
      width = Math.max(width, 650);
      
      setBasePageSize({ width, height });
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Tamaño final de página en función del zoom y modo de ajuste
  const pageSize = useMemo(() => {
    const { width: baseW, height: baseH } = basePageSize;
    const aspect = baseH / baseW || 1.333;
    const scale = zoom / 100;

    let width = baseW;
    let height = baseH;

    if (fitMode === "width") {
      // Mantener ancho base, ajustar alto por aspecto
      width = baseW;
      height = baseW * aspect;
    } else if (fitMode === "height") {
      // Mantener alto base, ajustar ancho por aspecto
      height = baseH;
      width = baseH / aspect;
    } else {
      // auto: usamos base tal cual
      width = baseW;
      height = baseH;
    }

    // Aplicar zoom de forma clara
    return {
      width: width * scale,
      height: height * scale,
    };
  }, [basePageSize, zoom, fitMode]);

  // PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    onReady?.({ totalPages: numPages });
  };

  // Cargar el documento PDF una sola vez y reutilizarlo
  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjs.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        if (!cancelled) {
          setPdfDoc(pdf);
        }
      } catch (err) {
        console.error("Error cargando PDF:", err);
        if (!cancelled) {
          setError("No se pudo cargar el PDF");
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  const getPageImage = useCallback(async (pageNum) => {
    if (!pdfDoc) return null;

    try {
      const page = await pdfDoc.getPage(pageNum);
      
      // Mantener escala alta para buena calidad
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      return canvas.toDataURL("image/jpeg", 0.9);
    } catch (err) {
      console.error("Error generating page image:", err);
      return null;
    }
  }, [pdfDoc]);

  // Precargar imágenes
  useEffect(() => {
    if (!numPages || !pdfDoc) return;
    
    // Precargar solo páginas cercanas para evitar trabajo excesivo
    const pagesToPreload = [
      currentPage + 1,
      currentPage - 1
    ].filter(p => p >= 1 && p <= numPages);
    
    pagesToPreload.forEach((pageNum) => {
      if (!visibleImages[pageNum]) {
        getPageImage(pageNum).then((img) => {
          if (img) {
            setVisibleImages(prev => {
              if (prev[pageNum]) return prev;
              return { ...prev, [pageNum]: img };
            });
          }
        });
      }
    });
  }, [currentPage, numPages, pdfDoc, getPageImage, visibleImages]);

  // Renderizar páginas para el flipbook - FORMA CORRECTA
  const renderPages = useMemo(() => {
    if (!numPages) return [];
    
    const pages = [];
    for (let i = 0; i < numPages; i++) {
      pages.push(
        <div key={i} className="page-wrapper">
          <div className="demoPage">
            <div className="page-content">
              <div className="page-number">{i + 1}</div>
              <div className="pdf-page-container">
                {visibleImages[i + 1] ? (
                  <img
                    src={visibleImages[i + 1]}
                    alt={`Página ${i + 1}`}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "contain" 
                    }}
                  />
                ) : (
                  <div className="page-loading">
                    Cargando página {i + 1}...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return pages;
  }, [numPages, visibleImages]);

  // Flipbook navigation
  const onFlipPage = useCallback((e) => {
    const pageIndex = e?.data ?? 0;
    setCurrentPage(pageIndex);
    onPageChange?.(pageIndex + 1);
  }, [onPageChange]);

  // Resetear scroll al inicio cuando cambia la página
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0; // salto inmediato al inicio
    }
  }, [currentPage]);

  // Controles de zoom y ajuste
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(300, z + 25));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(50, z - 25));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
    setFitMode("auto");
  }, []);

  const handleFitWidth = useCallback(() => {
    // Ajustar el ancho de la página al contenedor visible
    const container = panContainerRef.current;
    if (container) {
      const cw = container.clientWidth || basePageSize.width;
      const scale = cw / (basePageSize.width || 1);
      setZoom(Math.min(300, Math.max(50, Math.round(scale * 100))));
    }
    setFitMode("width");
  }, [basePageSize.width]);

  const handleFitHeight = useCallback(() => {
    // Ajustar el alto de la página al contenedor visible
    const container = panContainerRef.current;
    if (container) {
      const ch = container.clientHeight || basePageSize.height;
      const scale = ch / (basePageSize.height || 1);
      setZoom(Math.min(300, Math.max(50, Math.round(scale * 100))));
    }
    setFitMode("height");
  }, [basePageSize.height]);

  const handleFitAuto = useCallback(() => {
    setFitMode("auto");
    setZoom(100);
  }, []);

  // Pantalla completa
  const toggleFullscreen = useCallback(() => {
    const outerWrapper = document.querySelector('.libro-fullscreen-wrapper');
    const target = outerWrapper || containerRef.current;
    if (!document.fullscreenElement) {
      target?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Autoplay
  const toggleAutoplay = useCallback(() => {
    setIsAutoplay((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isAutoplay) {
      autoplayTimerRef.current = setInterval(() => {
        const api = flipRef.current?.pageFlip?.();
        if (!api) return;
        
        const currentIndex = api.getCurrentPageIndex();
        const lastIndex = numPages - 1;
        
        if (currentIndex >= lastIndex) {
          api.flip(0);
        } else {
          api.flipNext();
        }
      }, 4000);
    } else if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isAutoplay, numPages]);

  // Búsqueda básica (stub)
  const handleSearchQueryChange = useCallback((q) => {
    setSearchQuery(q);
    setSearchInfo(q ? { current: 0, total: 0 } : null);
  }, []);

  const handleSearchPrev = useCallback(() => {
    // Implementar navegación de resultados cuando exista búsqueda real
  }, []);

  const handleSearchNext = useCallback(() => {
    // Implementar navegación de resultados cuando exista búsqueda real
  }, []);

  // Marcadores y lectura en voz alta
  const handleToggleBookmark = useCallback(() => {
    setIsBookmarked((prev) => !prev);
  }, []);

  const handleReadSelection = useCallback(() => {
    const selection = window.getSelection?.().toString();
    if (!selection) return;
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(selection);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Pan con mouse tipo visor de fotos (cuando zoom > 100%)
  const panContainerRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const onPanMouseDown = useCallback((e) => {
    if (zoom <= 100) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  }, [zoom, panOffset]);

  const onPanMouseMove = useCallback((e) => {
    if (!isPanning) return;
    let x = e.clientX - panStartRef.current.x;
    let y = e.clientY - panStartRef.current.y;

    // Clampear dentro de los límites visibles para que no se pierda el contenido
    const container = panContainerRef.current;
    if (container) {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const pw = pageSize.width;
      const ph = pageSize.height;

      // Si el contenido es menor que el contenedor, centrar y evitar pan
      const maxX = Math.max(0, (pw - cw) / 2);
      const maxY = Math.max(0, (ph - ch) / 2);

      // Asegurar que cuando pw>cw se permita mover hasta que el borde quede pegado
      x = Math.min(maxX, Math.max(-maxX, x));
      y = Math.min(maxY, Math.max(-maxY, y));
    }

    setPanOffset({ x, y });
  }, [isPanning]);

  const endPan = useCallback(() => {
    if (isPanning) setIsPanning(false);
  }, [isPanning]);

  useEffect(() => {
    const el = panContainerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', onPanMouseMove);
    window.addEventListener('mouseup', endPan);
    el.addEventListener('mouseleave', endPan);
    // Wheel zoom (Ctrl + wheel) to adjust zoom in place
    const onWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const step = 25;
      const delta = e.deltaY < 0 ? step : -step;
      setZoom((z) => {
        const newZoom = Math.min(300, Math.max(50, z + delta));
        return newZoom;
      });
      // Keep focal point roughly by adjusting pan toward cursor
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      setPanOffset((p) => ({ x: p.x + cx * 0.05, y: p.y + cy * 0.05 }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('mousemove', onPanMouseMove);
      window.removeEventListener('mouseup', endPan);
      el.removeEventListener('mouseleave', endPan);
      el.removeEventListener('wheel', onWheel);
    };
  }, [onPanMouseMove, endPan]);

  // Reset de pan cuando el zoom vuelve a 100% o menos
  useEffect(() => {
    if (zoom <= 100 && (panOffset.x !== 0 || panOffset.y !== 0)) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [zoom, panOffset]);

  // Notificar cambios de zoom hacia afuera (ej. para controles externos)
  useEffect(() => {
    onZoomChange?.(zoom);
  }, [zoom, onZoomChange]);

  // Keyboard navigation: arrows and home/end
  useEffect(() => {
    const onKey = (e) => {
      const api = flipRef.current?.pageFlip?.();
      if (!api) return;
      if (e.key === 'ArrowRight') {
        api.flipNext();
      } else if (e.key === 'ArrowLeft') {
        api.flipPrev();
      } else if (e.key === 'Home') {
        api.flip(0);
      } else if (e.key === 'End') {
        api.flip(Math.max(0, numPages - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [numPages]);

  // Métodos públicos para que la página `Libro` controle el flipbook
  useImperativeHandle(ref, () => ({
    // Navegación de páginas
    next: () => flipRef.current?.pageFlip().flipNext(),
    prev: () => flipRef.current?.pageFlip().flipPrev(),
    goTo: (n) => {
      const api = flipRef.current?.pageFlip();
      if (!api || !numPages) return;
      const idx = Math.max(0, Math.min(numPages - 1, (n ?? 1) - 1));
      api.flip(idx);
      setCurrentPage(idx);
    },

    // Controles de zoom y ajuste
    zoomIn: () => handleZoomIn(),
    zoomOut: () => handleZoomOut(),
    zoomReset: () => handleZoomReset(),
    fitWidth: () => handleFitWidth(),
    fitHeight: () => handleFitHeight(),
    fitAuto: () => handleFitAuto(),
    getZoom: () => zoom,
    setZoom: (val) => {
      const v = Number(val);
      if (!Number.isFinite(v)) return;
      setZoom(Math.min(300, Math.max(50, v)));
    },

    // Opcionales: exponer fullscreen y autoplay si se necesitan en el futuro
    toggleFullscreen: () => toggleFullscreen(),
    toggleAutoplay: () => toggleAutoplay(),
  }), [numPages, handleZoomIn, handleZoomOut, handleZoomReset, handleFitWidth, handleFitHeight, handleFitAuto, toggleFullscreen, toggleAutoplay, zoom]);

  if (error) {
    return (
      <div className="flipbook-shell">
        <div className="pdf-error">
          <h3>Error al cargar el PDF</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flipbook-shell">
      {showControls && (
        <LibroControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onFitWidth={handleFitWidth}
          onFitHeight={handleFitHeight}
          onFitAuto={handleFitAuto}
          fitMode={fitMode}
          onPrevPage={() => flipRef.current?.pageFlip().flipPrev()}
          onNextPage={() => flipRef.current?.pageFlip().flipNext()}
          onGoToPage={(n) => flipRef.current?.pageFlip().flip(n - 1)}
          currentPage={currentPage + 1}
          totalPages={numPages}
          onToggleThumbnails={onToggleThumbnails}
          thumbnailsVisible={thumbnailsVisible}
          onReadSelection={handleReadSelection}
          currentZoom={zoom}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          onToggleAutoplay={toggleAutoplay}
          isAutoplay={isAutoplay}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          onSearchPrev={handleSearchPrev}
          onSearchNext={handleSearchNext}
          searchInfo={searchInfo}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={isBookmarked}
        />
      )}

      {/* Panel de miniaturas */}
      {thumbnailsVisible && (
        <div className="flipbook-thumbnails-panel">
          <div className="thumbnails-header">
            <span>Miniaturas</span>
            <button className="close-thumbnails" onClick={onToggleThumbnails}>
              ×
            </button>
          </div>
          <div className="thumbnails-list">
            {Array.from({ length: numPages }, (_, i) => (
              <div
                key={i}
                className={`thumbnail-item ${currentPage === i ? 'active' : ''}`}
                onClick={() => flipRef.current?.pageFlip().flip(i)}
              >
                <div className="thumbnail-preview">
                  {visibleImages[i + 1] ? (
                    <img
                      src={visibleImages[i + 1]}
                      alt={`Miniatura página ${i + 1}`}
                    />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className="thumbnail-number">Página {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área principal del flipbook con viewport scrollable */}
      <div className={`flipbook-main-container ${showControls ? 'with-controls' : ''}`}>
        {isLoading && (
          <div className="flipbook-loading">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(err) => setError(err.message)}
              loading={<div className="loading-spinner">Cargando PDF...</div>}
            />
          </div>
        )}
        
        {numPages > 0 && (
          <div className="flipbook-scroll-viewport" ref={viewportRef}>
            <div className="flipbook-wrapper">
            <div
              ref={panContainerRef}
              className={`flipbook-pan-container ${zoom > 100 ? (isPanning ? 'panning' : 'zoomed') : ''}`}
              onMouseDown={onPanMouseDown}
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                cursor: zoom > 100 ? (isPanning ? 'grabbing' : 'grab') : 'default'
              }}
            >
              <div
                className="flipbook-pan-inner"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                  transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                  willChange: 'transform'
                }}
              >
                <HTMLFlipBook
                  key={`flip-${pageSize.width}-${pageSize.height}-${zoom}-${fitMode}`}
                  ref={flipRef}
                  width={pageSize.width}
                  height={pageSize.height}
                  size="fixed"
                  minWidth={300}
                  minHeight={400}
                  maxWidth={2000}
                  maxHeight={2000}
                  drawShadow={true}
                  flippingTime={1000}
                  usePortrait={true}
                  startPage={currentPage}
                  autoSize={false}
                  maxShadowOpacity={0.5}
                  showCover={false}
                  mobileScrollSupport={true}
                  onFlip={onFlipPage}
                  className="flipbook-component"
                >
                  {renderPages}
                </HTMLFlipBook>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Flipbook;