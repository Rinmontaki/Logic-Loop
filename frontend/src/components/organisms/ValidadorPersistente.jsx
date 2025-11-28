import React, { useState, useEffect } from "react";
import CodeEditor from "../CodeEditor";
import FeedbackPanel from "../FeedbackPanel";
import Loader from "../Loader";
import { validateCode } from "../../services/api";

export default function ValidadorPersistente({ initialCode = 'Inicio\nEscriba "Hola Mundo"\nFin' }) {
  const [code, setCode] = useState(() => localStorage.getItem('validador_code') || initialCode);
  const [feedback, setFeedback] = useState(() => localStorage.getItem('validador_feedback') || "");
  const [errors, setErrors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('validador_errors')) || [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

    const handleClear = () => {
      setCode("");
    };

  useEffect(() => {
    localStorage.setItem('validador_code', code);
  }, [code]);
  useEffect(() => {
    localStorage.setItem('validador_feedback', feedback);
  }, [feedback]);
  useEffect(() => {
    localStorage.setItem('validador_errors', JSON.stringify(errors));
  }, [errors]);

  const handleValidate = async () => {
    setLoading(true);
    try {
      const result = await validateCode(code);
      setFeedback(result.feedback);
      setErrors(result.errors);
    } catch (e) {
      setFeedback("Error de conexión con el servidor");
      setErrors([]);
    }
    setLoading(false);
  };

  return (
    <div className="validador-container">
      <h2 className="validador-title">Validador de Código LPP</h2>
      <CodeEditor value={code} onChange={setCode} />
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={handleValidate} disabled={loading}>
          {loading ? <Loader /> : "Validar"}
        </button>
        <button onClick={handleClear} disabled={loading}>
          Limpiar
        </button>
      </div>
      <FeedbackPanel feedback={feedback} errors={errors} />
    </div>
  );
}