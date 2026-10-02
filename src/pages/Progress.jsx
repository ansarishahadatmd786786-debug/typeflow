import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, Keyboard, Target, Zap, Flame, BarChart2, Award } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { WpmChart, AccuracyChart } from '../components/ProgressChart';
import { Button } from '../components/Button';
import { getAggregateStats, getTestHistory, getStreak } from '../utils/storage';
import { formatNumber } from '../utils/typingUtils';
import { getModeName } from '../utils/textGenerator';

function HistoryRow({ test }) {
  const accColor = test.accuracy >= 95 ? 'text-emerald-400'
    : test.accuracy >= 85 ? 'text-gray-300'
    : 'text-amber-400';

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-0">
      <div className="text-xs text-gray-600 w-20 flex-shrink-0">
        <div className="text-gray-500">{new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        <div className="text-gray-700">{new Date(test.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-500 truncate">
          {getModeName(test.practiceMode)}
        </span>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 text-right">
        <div>
          <div className="text-sm font-semibold text-indigo-400 tabular-nums">{test.wpm} WPM</div>
        </div>
        <div>
          <div className={`text-sm font-medium tabular-nums ${accColor}`}>{test.accuracy}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-600 tabular-nums">{test.duration}s</div>
        </div>
      </div>
    </div>
  );
}

export function Progress() {
  const navigate = useNavigate();
  const stats = useMemo(() => getAggregateStats(), []);
  const history = useMemo(() => getTestHistory(), []);
  const streak = useMemo(() => getStreak(), []);

  const isNewUser = history.length === 0;

  // Last 7 days activity
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayTests = history.filter(t => new Date(t.date).toDateString() === dateStr);
      days.push({
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        tests: dayTests.length,
        avgWpm: dayTests.length > 0
          ? Math.round(dayTests.reduce((s, t) => s + t.wpm, 0) / dayTests.length)
          : 0,
      });
    }
    return days;
  }, [history]);

  const maxDayTests = Math.max(...last7Days.map(d => d.tests), 1);
  const todayLabel = new Date().toDateString();

  if (isNewUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Progress</h1>
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <TrendingUp size={40} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-xl font-semibold text-white mb-2">No progress data yet</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Complete typing tests to start tracking your progress and see your improvement over time.
          </p>
          <Button onClick={() => navigate('/test')}>
            <Zap size={16} />
            Take Your First Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-gray-500 text-sm mt-1">
          {history.length} test{history.length !== 1 ? 's' : ''} completed
          {stats.totalPracticeTime >= 60
            ? ` · ${Math.round(stats.totalPracticeTime / 60)}m total practice`
            : ` · ${stats.totalPracticeTime}s total practice`
          }
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Best WPM" value={stats.bestWpm} icon={<Zap size={18} className="text-indigo-400" />} accent />
        <StatCard label="Avg WPM" value={stats.averageWpm} icon={<BarChart2 size={18} className="text-gray-500" />} />
        <StatCard label="Best Acc." value={`${stats.bestAccuracy}%`} icon={<Target size={18} className="text-gray-500" />} />
        <StatCard label="Avg Acc." value={`${stats.averageAccuracy}%`} icon={<Target size={18} className="text-gray-500" />} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Tests" value={stats.testsCompleted} icon={<Keyboard size={18} className="text-gray-500" />} />
        <StatCard label="Characters" value={formatNumber(stats.totalCharsTyped)} icon={<Award size={18} className="text-gray-500" />} />
        <StatCard
          label="Practice Time"
          value={stats.totalPracticeTime >= 3600
            ? `${(stats.totalPracticeTime / 3600).toFixed(1)}h`
            : stats.totalPracticeTime >= 60
              ? `${Math.round(stats.totalPracticeTime / 60)}m`
              : `${stats.totalPracticeTime}s`
          }
          icon={<Clock size={18} className="text-gray-500" />}
        />
        <StatCard
          label="Best Streak"
          value={`${streak.longest || 0}d`}
          icon={<Flame size={18} className={streak.current > 0 ? 'text-orange-400' : 'text-gray-500'} />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <WpmChart history={history} limit={20} />
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <AccuracyChart history={history} limit={20} />
        </div>
      </div>

      {/* 7-day activity */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-5">
        <h2 className="font-semibold text-white mb-4">Last 7 Days</h2>
        <div className="flex items-end gap-2 h-24 mb-2">
          {last7Days.map((day, i) => {
            const isToday = day.date === todayLabel;
            const barHeight = day.tests > 0
              ? Math.max(16, (day.tests / maxDayTests) * 80)
              : 4;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                {day.tests > 0 && (
                  <span className="text-xs text-gray-600">{day.tests}</span>
                )}
                <div className="w-full flex items-end" style={{ height: 80 }}>
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      isToday
                        ? day.tests > 0 ? 'bg-indigo-400' : 'bg-white/10'
                        : day.tests > 0 ? 'bg-indigo-600' : 'bg-white/5'
                    }`}
                    style={{ height: barHeight }}
                    title={`${day.tests} test${day.tests !== 1 ? 's' : ''}${day.avgWpm > 0 ? `, avg ${day.avgWpm} WPM` : ''}`}
                  />
                </div>
                <span className={`text-xs ${isToday ? 'text-indigo-400 font-medium' : 'text-gray-600'}`}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test history */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Test History</h2>
          <span className="text-xs text-gray-600">
            Showing {Math.min(25, history.length)} of {history.length}
          </span>
        </div>
        <div>
          {history.slice(0, 25).map(test => (
            <HistoryRow key={test.id} test={test} />
          ))}
        </div>
        {history.length > 25 && (
          <p className="text-xs text-gray-600 text-center mt-3 pt-3 border-t border-white/5">
            {history.length - 25} more tests in your history
          </p>
        )}
      </div>
    </div>
  );
}
