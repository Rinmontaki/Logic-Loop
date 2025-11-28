// ResultsPanel.jsx
import { useState } from 'react';
import '../stylesRetosLPP.css';

export function ResultsPanel({ result }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('resumen');

  const handleCopy = () => {
    if (!result?.correctedCode) return;
    navigator.clipboard.writeText(result.correctedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabButtonClass = (tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
      activeTab === tab
        ? 'border-blue-600 text-blue-700 bg-white'
        : 'border-transparent text-black hover:text-black hover:bg-slate-100'
    }`;

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Tabs Header */}
      <div className="border-b bg-slate-50">
        <div className="flex">
          <button
            type="button"
            className={tabButtonClass('resumen')}
            onClick={() => setActiveTab('resumen')}
          >
            Resumen
          </button>
          <button
            type="button"
            className={tabButtonClass('errores')}
            onClick={() => setActiveTab('errores')}
          >
            Errores en tu código
          </button>
          <button
            type="button"
            className={tabButtonClass('corregido')}
            onClick={() => setActiveTab('corregido')}
          >
            Código corregido
          </button>
          <button
            type="button"
            className={tabButtonClass('pruebas')}
            onClick={() => setActiveTab('pruebas')}
          >
            Pruebas ejecutadas
          </button>
        </div>
      </div>

      {/* Tab: Resumen */}
      {activeTab === 'resumen' && (
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">
              {result.success ? '✅' : '❌'}
            </span>
            <div>
              <h3
                className={`mb-2 font-semibold ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {result.success
                  ? '¡Excelente trabajo!'
                  : 'Tu código necesita algunas correcciones'}
              </h3>
              <p className="text-black">{result.message}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-black font-semibold">
              Verificación de requisitos:
            </h4>
            {result.checks?.map((check, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <span className="text-lg flex-shrink-0">
                  {check.passed ? '✅' : '❌'}
                </span>
                <span className="text-black">{check.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Errores */}
      {activeTab === 'errores' && (
        <div className="p-6 space-y-4">
          {result.errors && result.errors.length > 0 ? (
            <>
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <span className="text-red-600 text-xl flex-shrink-0 mt-0.5">⚠️</span>
                <div>
                  <h4 className="text-red-900 mb-1 font-semibold">
                    Se encontraron {result.errors.length} problemas
                  </h4>
                  <p className="text-sm text-black">
                    Revisa los siguientes puntos y corrige tu código:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {result.errors.map((error, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-slate-100 text-black rounded text-sm">
                        Línea {error.line}
                      </span>
                    </div>
                    <p className="text-black">{error.message}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <span className="text-4xl mb-3 block">✅</span>
              <h4 className="text-black mb-2 font-semibold">
                ¡No se encontraron errores!
              </h4>
              <p className="text-black">
                Tu código cumple con todos los requisitos del reto.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Código corregido */}
      {activeTab === 'corregido' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h4 className="text-black mb-1 font-semibold">
                Versión corregida de tu código
              </h4>
              <p className="text-sm text-black">
                Esta es una solución válida generada por el validador
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 rounded-md border text-sm font-medium text-black hover:bg-slate-50 transition-colors"
            >
              <span className="mr-2">{copied ? '✅' : '📋'}</span>
              {copied ? 'Copiado' : 'Copiar código'}
            </button>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-white font-mono whitespace-pre">
              {result.correctedCode}
            </pre>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-black">
              💡 <span className="font-semibold">Tip:</span> Analiza las diferencias
              entre tu código y esta solución para entender qué necesita mejorarse.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Pruebas ejecutadas */}
      {activeTab === 'pruebas' && (
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-black mb-2 font-semibold">
              Casos de prueba ejecutados
            </h4>
            <p className="text-sm text-black">
              Tu código fue evaluado contra {result.testCases?.length || 0} casos de
              prueba
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="text-left p-3 text-black text-sm">Caso</th>
                  <th className="text-left p-3 text-black text-sm">Entrada</th>
                  <th className="text-left p-3 text-black text-sm">
                    Salida esperada
                  </th>
                  <th className="text-left p-3 text-black text-sm">
                    Salida obtenida
                  </th>
                  <th className="text-left p-3 text-black text-sm">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {result.testCases?.map((testCase, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50">
                    <td className="p-3 text-black text-sm">{testCase.case}</td>
                    <td className="p-3">
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded text-black">
                        {testCase.input || '(vacío)'}
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded text-black">
                        {testCase.expectedOutput}
                      </code>
                    </td>
                    <td className="p-3">
                      <code
                        className={`text-sm px-2 py-1 rounded ${
                          testCase.passed
                            ? 'bg-green-100 text-black'
                            : 'bg-red-100 text-black'
                        }`}
                      >
                        {testCase.actualOutput}
                      </code>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 text-sm ${
                          testCase.passed ? 'text-black' : 'text-black'
                        }`}
                      >
                        <span>{testCase.passed ? '✅' : '❌'}</span>
                        {testCase.passed ? 'Pasó' : 'Falló'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4">
            <span className="text-black text-sm">
              Total de pruebas: {result.testCases?.length || 0}
            </span>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-black">
                ✓ Pasadas: {result.testCases?.filter((t) => t.passed).length || 0}
              </span>
              <span className="text-black">
                ✗ Fallidas:{' '}
                {result.testCases
                  ? result.testCases.filter((t) => !t.passed).length
                  : 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}