import React, { useState, useRef, useEffect } from "react";
import ValidadorPersistente from "./ValidadorPersistente";
import "./ValidadorModal.css";

export default function ValidadorModal() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dragging, setDragging] = useState(false);
  // Responsive: usar % del viewport para posición inicial
  const getInitialPosition = () => {
    const width = Math.min(window.innerWidth * 0.95, 540);
    const height = Math.min(window.innerHeight * 0.95, 600);
    return {
      x: window.innerWidth - width - 32,
      y: window.innerHeight - height - 32
    };
  };
  const [position, setPosition] = useState(getInitialPosition());
  const [modalSize, setModalSize] = useState({
    width: Math.min(window.innerWidth * 0.95, 540),
    height: Math.min(window.innerHeight * 0.95, 600)
  });
  const dragOffset = useRef({ x: 0, y: 0 });
  const modalRef = useRef(null);

  // Drag handlers mejorados para distinguir entre click y drag
  const dragState = useRef({ isDragging: false, moved: false });
  const onDragStart = (e) => {
    dragState.current.moved = false;
    dragState.current.isDragging = true;
    setDragging(true);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    dragOffset.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchmove", onDrag, { passive: false });
    window.addEventListener("touchend", onDragEnd);
  };
  const onDrag = (e) => {
    if (!dragging && !dragState.current.isDragging) return;
    if (e.preventDefault) e.preventDefault();
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    let width = minimized ? 64 : modalSize.width;
    let height = minimized ? 64 : modalSize.height;
    let newX = clientX - dragOffset.current.x;
    let newY = clientY - dragOffset.current.y;
    // Limitar dentro de la ventana
    newX = Math.max(0, Math.min(window.innerWidth - width, newX));
    newY = Math.max(0, Math.min(window.innerHeight - height, newY));
    setPosition({ x: newX, y: newY });
    dragState.current.moved = true;
  };
  // Responsive: actualizar tamaño y posición al redimensionar ventana
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.95, 540);
      const height = Math.min(window.innerHeight * 0.95, 600);
      setModalSize({ width, height });
      setPosition(pos => {
        let x = Math.min(pos.x, window.innerWidth - width);
        let y = Math.min(pos.y, window.innerHeight - height);
        x = Math.max(0, x);
        y = Math.max(0, y);
        return { x, y };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minimized]);
  const onDragEnd = (e) => {
    setDragging(false);
    dragState.current.isDragging = false;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEnd);
    window.removeEventListener("touchmove", onDrag);
    window.removeEventListener("touchend", onDragEnd);
  };

  // Botón flotante para volver a abrir el validador
  const FloatingButton = () => (
    <button
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 2100,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #004AAD 60%, #338DFF 100%)",
        color: "#fff",
        border: "none",
        boxShadow: "0 4px 16px #004aad88",
        fontSize: 32,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s, box-shadow 0.2s"
      }}
      title="Mostrar validador"
      onClick={() => setOpen(true)}
    >
      🧑‍💻
    </button>
  );

  // Si está minimizado, mostrar burbuja flotante arrastrable
  if (!open || minimized) {
    // Siempre en la esquina inferior derecha, sin arrastrar
    const handleClick = () => {
      setOpen(true);
      setMinimized(false);
    };
    return (
      <button
        className="validador-burbuja-flotante"
        style={{
          position: "fixed",
          right: 32,
          bottom: 32,
          zIndex: 2100,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #004AAD 60%, #338DFF 100%)",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 16px #004aad88",
          fontSize: 32,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s, box-shadow 0.2s"
        }}
        title="Mostrar validador"
        onClick={handleClick}
      >
        🧑‍💻
      </button>
    );
  }

  return (
    <>
      <div
        ref={modalRef}
        className={`validador-modal-draggable${dragging ? " validador-modal-dragging" : ""}`}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 2000,
          width: modalSize.width,
          height: modalSize.height,
          maxWidth: "98vw",
          maxHeight: "98vh",
          minWidth: 280,
          minHeight: 60,
          transition: "height 0.2s, width 0.2s, left 0.2s, top 0.2s",
          display: "flex",
          flexDirection: "column",
          touchAction: "none",
          userSelect: dragging ? "none" : "auto"
        }}
      >
        <div
          className="validador-modal-header"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <span>Validador de Código</span>
          <div className="validador-modal-controls">
            <button onClick={() => setMinimized(m => !m)} title="Minimizar">🗕</button>
            <button onClick={() => setOpen(false)} title="Cerrar">✖</button>
          </div>
        </div>
        <div className="validador-modal-content">
          <ValidadorPersistente />
        </div>
      </div>
    </>
  );
}