import React from 'react';
import { Lock } from 'lucide-react';

export function AchievementCard({ achievement, unlocked, unlockedAt }) {
  return (
    <div className={`
      relative rounded-xl p-4 border transition-all duration-200
      ${unlocked
        ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50'
        : 'bg-white/3 border-white/10'
      }
    `}>
      <div className="flex items-center gap-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
          ${unlocked ? 'bg-amber-500/15' : 'bg-white/5'}
        `}>
          {unlocked ? achievement.icon : <Lock size={18} className="text-gray-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm ${unlocked ? 'text-white' : 'text-gray-300'}`}>
            {achievement.title}
          </h3>
          <p className="text-xs mt-0.5 text-gray-400">
            {achievement.description}
          </p>
          {unlocked && unlockedAt && (
            <p className="text-xs text-amber-500/60 mt-1">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {unlocked && (
          <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
