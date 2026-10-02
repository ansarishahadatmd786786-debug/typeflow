import React from 'react';

export function StatCard({ label, value, sub, icon, accent = false, className = '' }) {
  return (
    <div className={`
      rounded-xl p-4 border
      ${accent
        ? 'bg-indigo-500/10 border-indigo-500/30'
        : 'bg-white/5 border-white/10 dark:bg-gray-800/50 dark:border-gray-700/50'
      }
      ${className}
    `}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className={`text-2xl font-bold truncate ${accent ? 'text-indigo-400' : 'text-white dark:text-white'}`}>
            {value}
          </p>
          {sub && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
          )}
        </div>
        {icon && (
          <div className={`text-2xl flex-shrink-0 ${accent ? 'text-indigo-400' : 'text-gray-500'}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
