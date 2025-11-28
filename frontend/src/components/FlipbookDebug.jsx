// FlipbookWithImages.jsx - VERSIÓN CORREGIDA
import "./Flipbook.css";
import React, {
  useRef, useState, useMemo, useCallback, forwardRef, useImperativeHandle, useEffect
} from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const Flipbook = forwardRef(function Flipbook({ fileUrl = "/pdfs/libro.pdf" }, ref) {
  const flipRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageImages, setPageImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false); // 👈 Nuevo estado para control

  // 1. Cargar PDF y obtener número de páginas
  const onDocLoad = ({ numPages }) => {
    console.log("📄 PDF cargado, páginas:", numPages);
    setNumPages(numPages);
    setPdfLoaded(true); // 👈 Marcar que el PDF está listo
  };

  // 2. Convertir PDF a imágenes SOLO UNA VEZ cuando el PDF esté cargado
  useEffect(() => {
    if (pdfLoaded && numPages > 0 && pageImages.length === 0) {
      console.log("🔄 Iniciando conversión a imágenes...");
      convertPdfToImages(numPages);
    }
  }, [pdfLoaded, numPages, pageImages.length]); // 👈 Dependencias correctas

  // 3. Convertir cada página a imagen
  const convertPdfToImages = async (totalPages) => {
    if (isConverting) return; // 👈 Evitar múltiples ejecuciones
    
    setIsConverting(true);
    const images = [];

    try {
      // Cargar el documento UNA sola vez
      const pdf = await pdfjs.getDocument(fileUrl).promise;
      
      for (let i = 1; i <= totalPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: ctx,
            viewport: viewport
          }).promise;

          const imageUrl = canvas.toDataURL('image/png');
          images.push(imageUrl);
          console.log(`✅ Página ${i} convertida a imagen`);
          
          // Actualizar progreso
          setPageImages([...images]);
          
        } catch (error) {
          console.error(`❌ Error convirtiendo página ${i}:`, error);
        }
      }
      
      console.log("🎉 Todas las páginas convertidas a imágenes");
    } catch (error) {
      console.error("❌ Error cargando PDF para conversión:", error);
    } finally {
      setIsConverting(false);
    }
  };

  // 4. Páginas para el flipbook (USANDO IMÁGENES)
  const pages = useMemo(() => {
    return pageImages.map((imageUrl, index) => (
      <div key={index} className="demoPage">
        <div className="page-content">
          <div className="page-number">Página {index + 1}</div>
          <img 
            src={imageUrl} 
            alt={`Página ${index + 1}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain' 
            }}
            onLoad={() => console.log(`🖼️ Imagen ${index + 1} cargada`)}
          />
        </div>
      </div>
    ));
  }, [pageImages]);

  // Estados de carga
  if (!pdfLoaded) {
    return (
      <div className="flipbook-loading">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocLoad}
          loading={<div>Cargando PDF...</div>}
        />
      </div>
    );
  }

  if (isConverting || pageImages.length < numPages) {
    const progress = Math.round((pageImages.length / numPages) * 100);
    return (
      <div className="flipbook-loading">
        <div className="loading-spinner"></div>
        <p>Convirtiendo PDF a imágenes...</p>
        <p>{pageImages.length} de {numPages} páginas ({progress}%)</p>
        <div style={{ 
          width: '300px', 
          height: '10px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '5px',
          margin: '10px auto'
        }}>
          <div style={{ 
            width: `${progress}%`, 
            height: '100%', 
            backgroundColor: '#1976d2',
            borderRadius: '5px',
            transition: 'width 0.3s'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flipbook-container">
      <HTMLFlipBook
        ref={flipRef}
        width={550}
        height={700}
        onFlip={(e) => setCurrentPage(e?.data || 0)}
        className="flipbook"
      >
        {pages}
      </HTMLFlipBook>
    </div>
  );
});

export default Flipbook;