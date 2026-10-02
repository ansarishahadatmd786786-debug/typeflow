import React from 'react';
import { ArrowRight } from 'lucide-react';

export function PracticeCard({ icon, title, description, badge, difficulty, onClick }) {
  const difficultyColors = {
    Beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Intermediate: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Advanced: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    Challenge: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    Specialized: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  };

  return (
    <button
      onClick={onClick}
      className="h-full w-full text-left rounded-xl p-4 bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-200 group"
    >
      <div className="flex h-full items-stretch gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
          {icon}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-medium text-white text-sm break-words">{title}</h3>
            {difficulty && (
              <span className={`max-w-full text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColors[difficulty] || difficultyColors.Intermediate}`}>
                {difficulty}
              </span>
            )}
            {badge && (
              <span className="max-w-full text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 break-words">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-auto pt-2 text-xs text-gray-500 break-words">{description}</p>
        </div>
        <ArrowRight size={16} className="text-gray-600 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" aria-hidden="true" />
      </div>
    </button>
  );
}
