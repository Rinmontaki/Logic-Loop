// ProgressCard.jsx
import { challenges } from '../data/challenges';
import '../stylesRetosLPP.css';

export function ProgressCard({ completedCount, totalCount, progressPercentage }) {
  const basicChallenges = challenges.filter((c) => c.level === 'básico');
  const basicCompleted = basicChallenges.filter((c) => c.status === 'completado').length;

  const conditionalChallenges = challenges.filter((c) => c.theme === 'condicionales');
  const conditionalCompleted = conditionalChallenges.filter(
    (c) => c.status === 'completado'
  ).length;

  const cycleChallenges = challenges.filter((c) => c.theme === 'ciclos');
  const cycleCompleted = cycleChallenges.filter((c) => c.status === 'completado').length;

  const clampedProgress = Math.max(0, Math.min(100, progressPercentage || 0));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <h3 className="text-black font-semibold">Tu progreso</h3>

      {/* Progreso general */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-black">Progreso general</span>
          <span className="text-black font-medium">{clampedProgress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        <p className="text-xs text-black">
          {completedCount} de {totalCount} retos completados
        </p>
      </div>

      {/* Progreso por categoría */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-500 text-lg flex-shrink-0">✅</span>
          <span className="text-black">Retos básicos</span>
          <span className="ml-auto text-black">
            {basicCompleted}/{basicChallenges.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-500 text-lg flex-shrink-0">🧩</span>
          <span className="text-black">Condicionales</span>
          <span className="ml-auto text-black">
            {conditionalCompleted}/{conditionalChallenges.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-black text-lg flex-shrink-0">🔁</span>
          <span className="text-black">Ciclos</span>
          <span className="ml-auto text-black">
            {cycleCompleted}/{cycleChallenges.length}
          </span>
        </div>
      </div>
    </div>
  );
}