import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Lock, Zap } from 'lucide-react';
import { AchievementCard } from '../components/AchievementCard';
import { Button } from '../components/Button';
import { getAchievementDefs, getUnlockedAchievements } from '../utils/storage';

const CATEGORIES = [
  { id: 'milestones', label: 'Milestones', icon: '🏆' },
  { id: 'speed', label: 'Speed', icon: '⚡' },
  { id: 'accuracy', label: 'Accuracy', icon: '🎯' },
  { id: 'streaks', label: 'Streaks', icon: '🔥' },
];

export function Achievements() {
  const navigate = useNavigate();
  const achievementDefs = useMemo(() => getAchievementDefs(), []);
  const unlocked = useMemo(() => getUnlockedAchievements(), []);

  const unlockedCount = Object.keys(unlocked).length;
  const totalCount = achievementDefs.length;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  const byCategory = useMemo(() => {
    const cats = {};
    CATEGORIES.forEach(c => { cats[c.id] = []; });
    achievementDefs.forEach(a => {
      if (cats[a.category]) {
        cats[a.category].push(a);
      }
    });
    return cats;
  }, [achievementDefs]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unlockedCount} of {totalCount} unlocked
          </p>
        </div>
        {unlockedCount === 0 && (
          <Button onClick={() => navigate('/test')} size="sm">
            <Zap size={14} />
            Start Earning
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white">Overall Progress</h2>
          <span className="text-sm text-indigo-400 font-medium">{pct}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{unlockedCount} earned</span>
          <span>{totalCount - unlockedCount} remaining</span>
        </div>
      </div>

      {/* Empty state */}
      {unlockedCount === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
          <Trophy size={36} className="mx-auto mb-3 text-gray-600" />
          <h2 className="text-lg font-semibold text-white mb-1">No achievements yet</h2>
          <p className="text-gray-500 text-sm">
            Complete typing tests to start unlocking achievements.
          </p>
        </div>
      )}

      {/* Achievements by category */}
      {CATEGORIES.map(cat => {
        const catAchievements = byCategory[cat.id] || [];
        const catUnlocked = catAchievements.filter(a => unlocked[a.id]).length;

        return (
          <div key={cat.id}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{cat.icon}</span>
              <h2 className="font-semibold text-white">{cat.label}</h2>
              <span className="text-xs text-gray-400 ml-auto">
                {catUnlocked}/{catAchievements.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catAchievements.map(achievement => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked={!!unlocked[achievement.id]}
                  unlockedAt={unlocked[achievement.id]?.unlockedAt}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
