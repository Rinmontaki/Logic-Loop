// ChallengeDetail.jsx
import { useState, useRef, useEffect } from 'react';
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

  // Parseo de errores listados como en el SYSTEM_PROMPT
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

  // Señales robustas de éxito/fracaso
  const fatalPrefix = /^\s*❌/u.test(feedbackText) || /❌\s*Error:/u.test(feedbackText);
  const hasErrorsHeading = /^Errores encontrados\s*\(/.test(mainText);
  const codePerfect = mainText.startsWith('Código correcto');

  // Evaluar checks y pruebas si están presentes
  const checksHasFalse = Array.isArray(checks) && checks.some((c) => c && c.passed === false);
  const checksHasTrue = Array.isArray(checks) && checks.some((c) => c && c.passed === true);
  const testsHasFalse = Array.isArray(testCases) && testCases.some((t) => t && t.passed === false);
  const testsHasTrue = Array.isArray(testCases) && testCases.some((t) => t && t.passed === true);

  // Regla de decisión para success
  let success = false;
  if (fatalPrefix) {
    success = false;
  } else if (hasErrorsHeading) {
    success = false;
  } else if (errors.length > 0) {
    success = false;
  } else if (Array.isArray(checks) && checks.length > 0 && checksHasFalse) {
    success = false;
  } else if (Array.isArray(testCases) && testCases.length > 0 && testsHasFalse) {
    success = false;
  } else if (codePerfect) {
    success = true;
  } else if (Array.isArray(checks) && checks.length > 0 && !checksHasFalse && checksHasTrue) {
    // Si hay checks y todos los evaluados son true
    success = true;
  } else if (Array.isArray(testCases) && testCases.length > 0 && !testsHasFalse && testsHasTrue) {
    // Si hay pruebas y todas las evaluadas son true
    success = true;
  } else {
    // Conservador: si no hay señales claras de éxito, marcar como fallo
    success = false;
  }

  return {
    success,
    message: codePerfect ? mainText : firstLine,
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
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSoftModal, setShowSoftModal] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(challenge.attempts || 0);
  const startTimeRef = useRef(Date.now());
  const lastSubmittedRef = useRef('');
  const editorRef = useRef(null);

  const SOFT_WARNING_AT = 4; // 3–4 intentos
  const HARD_WARNING_AT = 8; // 7–8 intentos
  const HARD_WARNING_MINUTES = 25; // 25 minutos sin progreso

  const storageKeyAttempts = `attempts:${challenge.id}`;
  const storageKeyLastCode = `lastCode:${challenge.id}`;

  useEffect(() => {
    try {
      const savedAttempts = parseInt(localStorage.getItem(storageKeyAttempts) || 'NaN', 10);
      if (!isNaN(savedAttempts)) setAttemptsCount(savedAttempts);
      const lastCode = localStorage.getItem(storageKeyLastCode) || '';
      lastSubmittedRef.current = lastCode;
    } catch {}
  }, []);

  const handleEditorKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = code || '';

    // Helper to set selection after state update
    const setSel = (s, e2) => {
      setTimeout(() => {
        try {
          el.selectionStart = s;
          el.selectionEnd = e2;
        } catch {}
      }, 0);
    };

    if (start !== end) {
      // Indent/unindent all lines in selection
      const before = value.slice(0, start);
      const selected = value.slice(start, end);
      const after = value.slice(end);
      const lines = selected.split('\n');
      if (e.shiftKey) {
        let removedTotal = 0;
        const unindented = lines.map((line) => {
          if (line.startsWith('\t')) {
            removedTotal += 1;
            return line.slice(1);
          }
          const m = line.match(/^ {1,4}/);
          if (m) {
            removedTotal += m[0].length;
            return line.slice(m[0].length);
          }
          return line;
        }).join('\n');
        const nextVal = before + unindented + after;
        setCode(nextVal);
        setSel(start, Math.max(start, end - removedTotal));
      } else {
        const indented = lines.map((line) => '\t' + line).join('\n');
        const added = lines.length; // one tab per line
        const nextVal = before + indented + after;
        setCode(nextVal);
        setSel(start + 1, end + added);
      }
    } else {
      // Single caret: insert or remove indent at line start
      const before = value.slice(0, start);
      const after = value.slice(end);
      if (e.shiftKey) {
        // Unindent current line: find line start
        const lineStart = before.lastIndexOf('\n') + 1;
        let removed = 0;
        let newBefore = before;
        if (before[lineStart] === '\t') {
          newBefore = before.slice(0, lineStart) + before.slice(lineStart + 1);
          removed = 1;
        } else {
          const m = before.slice(lineStart).match(/^ {1,4}/);
          if (m) {
            newBefore = before.slice(0, lineStart) + before.slice(lineStart + m[0].length);
            removed = m[0].length;
          }
        }
        const nextVal = newBefore + after;
        setCode(nextVal);
        const pos = Math.max(start - removed, lineStart);
        setSel(pos, pos);
      } else {
        const insert = '\t';
        const nextVal = before + insert + after;
        setCode(nextVal);
        const pos = start + insert.length;
        setSel(pos, pos);
      }
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const response = await validateCode(code);
      const mapped = mapFeedbackToResult(response.feedback);
      setValidationResult(mapped);
      // Decidir si el intento fue significativo respecto al último enviado
      const normalize = (s) => {
        if (!s) return '';
        let t = String(s)
          .replace(/\/\*[\s\S]*?\*\//g, '') // quitar comentarios de bloque /* ... */
          .replace(/[\u2190\u2B05\u27F5]/g, '<-') // flechas visuales a '<-'
          .toLowerCase();
        t = t.replace(/\s+/g, ' ').trim();
        return t;
      };
      const currentNorm = normalize(code);
      const lastNorm = lastSubmittedRef.current || '';
      const meaningfulChange = currentNorm !== lastNorm;

      // Guardar último código enviado
      try {
        localStorage.setItem(storageKeyLastCode, currentNorm);
        lastSubmittedRef.current = currentNorm;
      } catch {}

      const elapsedMin = Math.floor((Date.now() - startTimeRef.current) / 60000);

      // Incrementar intentos solo si hubo cambio significativo y no fue éxito
      if (!mapped.success && meaningfulChange) {
        const nextCount = (attemptsCount || 0) + 1;
        setAttemptsCount(nextCount);
        try { localStorage.setItem(storageKeyAttempts, String(nextCount)); } catch {}

        // Aviso fuerte: muchos intentos o mucho tiempo
        if (nextCount >= HARD_WARNING_AT || elapsedMin >= HARD_WARNING_MINUTES) {
          setShowGuideModal(true);
        } else if (nextCount >= SOFT_WARNING_AT) {
          // Aviso suave: ofrecer pistas o repasar
          setShowSoftModal(true);
        }
      }

      // Detectar casos sin contenido útil: sin errores, sin checks, sin código, sin tests y mensaje vacío o de confusión
      const noContent = (!mapped.errors || mapped.errors.length === 0)
        && (!mapped.checks || mapped.checks.length === 0)
        && (!mapped.correctedCode || mapped.correctedCode.trim() === '')
        && (!mapped.testCases || mapped.testCases.length === 0);
      const confusingMsg = !mapped.message
        || mapped.message.trim() === ''
        || /No comprendo/i.test(mapped.message)
        || /No entiendo/i.test(mapped.message)
        || /No se recibió respuesta/i.test(mapped.message);
      if (noContent && confusingMsg) {
        setShowGuideModal(true);
      }
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
      setShowGuideModal(true);
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
                <p className="text-sm text-black">Intentos: {attemptsCount}</p>
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
                  ref={editorRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleEditorKeyDown}
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

        {/* Modal de guía hacia el libro */}
        {showGuideModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg border max-w-lg w-full p-6">
              <h3 className="text-black mb-3 font-semibold">
                Orientación sobre LPP
              </h3>
              <p className="text-sm text-black mb-4">
                Aun no tienes claridad con la sintaxis correcta de LPP, por lo tanto te enviaremos al Libro de Fundamentos de Programacion en LPP, para que hagas un repaso y refuerces tu conocimiento.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md border text-sm font-medium text-black hover:bg-slate-50"
                  onClick={() => {
                    setShowGuideModal(false);
                    // Recargar la página actual del reto
                    try {
                      window.location.reload();
                    } catch {}
                  }}
                >
                  Rechazar
                </button>
                <a
                  href="/libro?page=15"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowGuideModal(false)}
                >
                  Aceptar
                </a>
              </div>
            </div>
          </div>
        )}

        {showSoftModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg shadow-lg border max-w-lg w-full p-6">
              <h3 className="text-black mb-3 font-semibold">¿Te ayudo a destrabar este reto?</h3>
              <p className="text-sm text-black mb-4">
                Has intentado este ejercicio varias veces. Eso está muy bien, así se aprende.
                ¿Prefieres ver una pista o repasar rápidamente el tema?
              </p>
              <div className="flex items-center justify-end gap-3 flex-wrap">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md border text-sm font-medium text-black hover:bg-slate-50"
                  onClick={() => {
                    setShowSoftModal(false);
                    setHintsOpen(true);
                  }}
                >
                  Ver una pista
                </button>
                <a
                  href="/libro?page=15"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowSoftModal(false)}
                >
                  Repasar el tema
                </a>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md border text-sm font-medium text-black hover:bg-slate-50"
                  onClick={() => setShowSoftModal(false)}
                >
                  Seguir intentando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}