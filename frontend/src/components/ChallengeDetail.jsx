// ChallengeDetail.jsx
import { useState } from 'react';
import { ResultsPanel } from './ResultsPanel';
import { validateCode } from '../services/api';
import '../stylesRetosLPP.css';

// Transforma el texto de DeepSeek al formato que consume ResultsPanel
const mapFeedbackToResult = (feedbackText) => {
  if (!feedbackText) {
    return {
      success: false,
      message: 'No se recibió respuesta del validador de IA.',
      checks: [],
      errors: [],
      correctedCode: '',
      testCases: []
    };
  }

  // Extraer código corregido
  let correctedCode = '';
  const codeMatch = feedbackText.match(
    /---CODIGO_CORREGIDO---([\s\S]*?)---FIN_CODIGO_CORREGIDO---/
  );
  if (codeMatch) {
    correctedCode = codeMatch[1].trim();
  }

  // Extraer checks (JSON en una sola línea)
  let checks = [];
  const checksMatch = feedbackText.match(/---CHECKS---([\s\S]*?)---FIN_CHECKS---/);
  if (checksMatch) {
    const jsonLine = checksMatch[1].trim();
    try {
      const parsed = JSON.parse(jsonLine);
      if (Array.isArray(parsed)) {
        checks = parsed;
      }
    } catch (e) {
      checks = [];
    }
  }

  // Extraer pruebas (JSON en una sola línea)
  let testCases = [];
  const testsMatch = feedbackText.match(/---TESTS---([\s\S]*?)---FIN_TESTS---/);
  if (testsMatch) {
    const jsonLine = testsMatch[1].trim();
    try {
      const parsed = JSON.parse(jsonLine);
      if (Array.isArray(parsed)) {
        testCases = parsed;
      }
    } catch (e) {
      testCases = [];
    }
  }

  // Cuerpo principal sin bloques especiales
  let mainText = feedbackText
    .replace(/---CODIGO_CORREGIDO---[\s\S]*?---FIN_CODIGO_CORREGIDO---/g, '')
    .replace(/---CHECKS---[\s\S]*?---FIN_CHECKS---/g, '')
    .replace(/---TESTS---[\s\S]*?---FIN_TESTS---/g, '')
    .trim();

  // Caso: código correcto
  if (mainText.startsWith('Código correcto')) {
    return {
      success: true,
      message: mainText,
      checks,
      errors: [],
      correctedCode,
      testCases
    };
  }

  // Caso: errores listados como en el SYSTEM_PROMPT
  const lines = mainText.split('\n');
  const firstLine = lines[0] || 'Errores detectados en tu código.';
  const errors = [];

  lines.slice(1).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('- Línea')) return;

    const match = trimmed.match(
      /- Línea\s+(\d+):\s*(.+?)(?:\.?\s+Corrección:\s*(.+))?$/
    );
    if (match) {
      const [, lineNumber, description, correction] = match;
      errors.push({
        line: Number(lineNumber),
        message:
          description + (correction ? ` Corrección sugerida: ${correction}` : '')
      });
    }
  });

  return {
    success: errors.length === 0,
    message: firstLine,
    checks,
    errors,
    correctedCode,
    testCases
  };
};

export function ChallengeDetail({ challenge, onBack }) {
  const [code, setCode] = useState(challenge.initialCode);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const response = await validateCode(code);
      const mapped = mapFeedbackToResult(response.feedback);
      setValidationResult(mapped);
    } catch (error) {
      setValidationResult({
        success: false,
        message: 'No se pudo conectar con el validador de IA.',
        checks: [],
        errors: [
          {
            line: 1,
            message: String(error)
          }
        ],
        correctedCode: '',
        testCases: []
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleReset = () => {
    setCode(challenge.initialCode);
    setValidationResult(null);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'básico':
        return 'bg-green-100 text-black';
      case 'intermedio':
        return 'bg-yellow-100 text-black';
      case 'avanzado':
        return 'bg-red-100 text-black';
      default:
        return 'bg-slate-100 text-black';
    }
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case 'entrada/salida':
        return 'bg-blue-100 text-black';
      case 'condicionales':
        return 'bg-purple-100 text-black';
      case 'ciclos':
        return 'bg-pink-100 text-black';
      case 'arreglos':
        return 'bg-orange-100 text-black';
      default:
        return 'bg-slate-100 text-black';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white hover:bg-slate-100 transition-colors"
              >
                <span className="mr-2">←</span>
                Volver a los retos
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="text-black font-semibold">{challenge.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <span
                  className={
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' +
                    getLevelColor(challenge.level)
                  }
                >
                  {challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1)}
                </span>
                <span
                  className={
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' +
                    getThemeColor(challenge.theme)
                  }
                >
                  {challenge.theme.charAt(0).toUpperCase() + challenge.theme.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-black">Intentos: {challenge.attempts}</p>
                <p className="text-sm text-black">
                  Estado:{' '}
                  <span
                    className={
                      challenge.status === 'completado'
                        ? 'text-green-600 font-medium'
                        : 'text-black'
                    }
                  >
                    {challenge.status === 'completado' ? 'Completado ✓' : 'Pendiente'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Challenge Description */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-black mb-3 font-semibold">Descripción del reto</h2>
                <p className="text-black">{challenge.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-black mb-3 font-semibold">Requisitos</h3>
                <ul className="space-y-2">
                  {challenge.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-black">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-black mb-3 font-semibold">Ejemplo de entrada/salida</h3>
                <div className="space-y-3">
                  {challenge.examples.map((example, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4 space-y-2">
                      {example.input && (
                        <div>
                          <p className="text-sm text-black">Entrada:</p>
                          <code className="text-sm text-black">{example.input}</code>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-black">Salida:</p>
                        <code className="text-sm text-black whitespace-pre-line">
                          {example.output}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hints */}
              <div>
                <button
                  onClick={() => setHintsOpen(!hintsOpen)}
                  className="w-full inline-flex items-center justify-center px-3 py-2 rounded-md border text-sm font-medium text-white bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="mr-2">💡</span>
                  {hintsOpen ? 'Ocultar pistas' : 'Ver pistas'}
                </button>
                {hintsOpen && (
                  <div className="mt-4 space-y-2">
                    {challenge.hints.map((hint, index) => (
                      <div
                        key={index}
                        className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                      >
                        <p className="text-sm text-black">
                          <span className="font-semibold">Pista {index + 1}:</span> {hint}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-900 mb-2 font-semibold">📝 Notas sobre LPP</h4>
                <ul className="text-sm text-black space-y-1">
                  <li>• Primero declara las variables y luego escribe el bloque principal.</li>
                  <li>• El programa principal se delimita con <strong>Inicio</strong> y <strong>Fin</strong>.</li>
                  <li>• Usa <strong>Lea</strong> para entrada de datos y <strong>Escriba</strong> para salida.</li>
                  <li>• El operador de asignación es <strong>{'<-'}</strong>.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Code Editor */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Editor Header */}
              <div className="bg-slate-50 border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-black">Lenguaje:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-slate-300 text-black">
                    LPP (pseudocódigo)
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
                >
                  <span className="mr-2">⟳</span>
                  Reiniciar código
                </button>
              </div>

              {/* Code Editor */}
              <div className="p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[400px] font-mono text-sm bg-slate-900 text-slate-100 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  spellCheck={false}
                />
              </div>

              {/* Editor Footer */}
              <div className="bg-slate-50 border-t px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-black">
                  {isValidating && (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Validando con DeepSeek...
                    </span>
                  )}
                  {validationResult && !isValidating && (
                    <span
                      className={
                        validationResult.success ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {validationResult.success
                        ? '✓ Validación exitosa'
                        : '✗ Se encontraron errores'}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                    isValidating
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {isValidating ? 'Validando...' : 'Validar solución'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        {validationResult && <ResultsPanel result={validationResult} />}
      </div>
    </div>
  );
}