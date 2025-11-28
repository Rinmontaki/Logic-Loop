// ChallengeCard.jsx
import '../stylesRetosLPP.css';

export function ChallengeCard({ challenge, onSelect }) {
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

  const getStatusIcon = () => {
    switch (challenge.status) {
      case 'completado':
        return <span className="text-green-500 text-lg">✅</span>;
      case 'en progreso':
        return <span className="text-yellow-500 text-lg">⏳</span>;
      default:
        return <span className="text-slate-300 text-lg">○</span>;
    }
  };

  const getStatusText = () => {
    switch (challenge.status) {
      case 'completado': 
        return 'Completado';
      case 'en progreso': 
        return 'En progreso';
      default: 
        return 'Pendiente';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-black pr-4 font-semibold">{challenge.title}</h3>
          {getStatusIcon()}
        </div>

        <div className="flex flex-wrap gap-2">
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

        <p className="text-black text-sm line-clamp-2">
          {challenge.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-black">{getStatusText()}</span>
          <button
            onClick={onSelect}
            className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Resolver
          </button>
        </div>
      </div>
    </div>
  );
}