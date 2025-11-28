// ChallengeList.jsx
import { useState } from 'react';
import { challenges } from '../data/challenges';
import { ChallengeCard } from './ChallengeCard';
import { ProgressCard } from './ProgressCard';
import '../stylesRetosLPP.css';

export function ChallengeList({ onSelectChallenge }) {
  const [levelFilter, setLevelFilter] = useState('todos');
  const [themeFilter, setThemeFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  const filteredChallenges = challenges.filter((challenge) => {
    if (levelFilter !== 'todos' && challenge.level !== levelFilter) return false;
    if (themeFilter !== 'todos' && challenge.theme !== themeFilter) return false;
    if (statusFilter !== 'todos' && challenge.status !== statusFilter) return false;
    return true;
  });

  const completedCount = challenges.filter((c) => c.status === 'completado').length;
  const totalCount = challenges.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const clearFilters = () => {
    setLevelFilter('todos');
    setThemeFilter('todos');
    setStatusFilter('todos');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-white">📘</span>
                </div>
                <div>
                  <h1 className="text-black font-semibold">Retos de Algoritmos en LPP</h1>
                  <p className="text-black text-sm">
                    Lenguaje de Programación para Principiantes
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-black text-sm">Progreso</p>
                <p className="text-black font-medium">
                  {completedCount}/{totalCount} retos completados
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Progress and Filters */}
          <div className="lg:col-span-1 space-y-6">
            <ProgressCard
              completedCount={completedCount}
              totalCount={totalCount}
              progressPercentage={progressPercentage}
            />

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <h3 className="text-black font-semibold">Filtros</h3>

              <div className="space-y-2">
                <label className="text-sm text-black">Nivel</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="básico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-black">Tema</label>
                <select
                  value={themeFilter}
                  onChange={(e) => setThemeFilter(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="entrada/salida">Entrada/Salida</option>
                  <option value="condicionales">Condicionales</option>
                  <option value="ciclos">Ciclos</option>
                  <option value="arreglos">Arreglos</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-black">Estado</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="en progreso">En progreso</option>
                  <option value="completado">Completados</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full inline-flex items-center justify-center px-3 py-2 rounded-md border text-sm font-medium text-white hover:bg-slate-50 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Right Column - Challenge Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-black text-sm">
                Mostrando {filteredChallenges.length} de {totalCount} retos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onSelect={() => onSelectChallenge(challenge)}
                />
              ))}
            </div>
            {filteredChallenges.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <p className="text-black">
                  No se encontraron retos con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}