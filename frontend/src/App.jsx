import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";
import Home from "./pages/Home.jsx";
import Libro from "./pages/Libro.jsx"; // ⬅️ usamos tu página Libro
import LibroLPPLayout from "./components/organisms/LibroLPPLayout";
import ValidadorPersistente from "./components/organisms/ValidadorPersistente";
import ValidadorModal from "./components/organisms/ValidadorModal";
import Temas from "./pages/Temas";
import Galeria from "./pages/Galeria";
import RetosLPP from "./pages/RetosLPP";

export default function App() {
  const handleLoginClick = () => {
    window.location.href = "/login";
  };
  const isAuth = !!localStorage.getItem("token");

  // Controles de capítulos para el libro (UI del layout)
  const [capitulo, setCapitulo] = React.useState(1);
  const capitulos = [1, 2, 3, 4, 5, 6];
  const CapituloControls = (
    <div>
      {capitulos.map((c) => (
        <button
          key={c}
          className={"libro-lpp-chapter-btn" + (capitulo === c ? " active" : "")}
          onClick={() => setCapitulo(c)}
        >
          Capítulo {c}
        </button>
      ))}
    </div>
  );

  return (
    <Router>
      <Navbar onLoginClick={handleLoginClick} />
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/temas" element={<Temas />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route
              path="/libro"
              element={
                isAuth ? (
                  <LibroLPPLayout
                    chapterControls={CapituloControls}
                  >
                    <Libro />
                    </LibroLPPLayout>
                    ) : (
                      <Home />
                    )
                    }
                    />
            <Route
              path="/retos"
              element={
                isAuth ? (
                  <LibroLPPLayout>
                    <RetosLPP />
                  </LibroLPPLayout>
                ) : (
                  <Home />
                )
              }
            />
          </Routes>

          {/* El validador flotante ha sido eliminado por solicitud */}
        </div>
        <Footer />
      </div>
    </Router>
  );
}
