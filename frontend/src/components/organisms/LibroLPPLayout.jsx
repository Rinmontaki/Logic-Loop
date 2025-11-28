import React from "react";
import "./LibroLPPLayout.css";
import "./LibroLPPLayout.anim.css";

export default function LibroLPPLayout({ children}) {
  return (
    <div className="libro-lpp-layout">
  {/* Contenido principal */}
  {children}
    </div>
  );
}
