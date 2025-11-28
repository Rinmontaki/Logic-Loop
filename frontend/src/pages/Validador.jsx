import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import FeedbackPanel from '../components/FeedbackPanel';
import Loader from '../components/Loader';
import { validateCode } from '../services/api';

export default function Validador() {
  const [code, setCode] = useState('Inicio\nEscriba "Hola Mundo"\nFin');
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const handleClear = () => {
      setCode("");
      setFeedback("");
      setErrors([]);
    };

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
