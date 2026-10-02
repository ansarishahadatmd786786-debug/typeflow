import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Target, TrendingUp, Award, Flame, BarChart2, ArrowRight, BookOpen, Clock, Trophy, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { MiniSparkline } from '../components/ProgressChart';
import {
  getAggregateStats,
  getCompletedPracticeDays,
  getDailyPractice,
  getDailyPracticeHistory,
  getLessonProgress,
  getSettings,
  getStreak,
  getTestHistory,
  saveSettings,
} from '../utils/storage';
import { getDailyGoal, getRecommendation } from '../utils/typingUtils';
import { getModeName } from '../utils/textGenerator';
import { getLessonRecommendation, LESSONS } from '../utils/lessons';

const PRACTICE_GOALS = [5, 10, 15, 20];

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDailyDashboardState() {
  const settings = getSettings();
  return {
    goalMinutes: PRACTICE_GOALS.includes(Number(settings.dailyPracticeGoalMinutes))
      ? Number(settings.dailyPracticeGoalMinutes)
      : 15,
    today: getDailyPractice(),
    days: getDailyPracticeHistory(),
    completedDays: getCompletedPracticeDays(),
    streak: getStreak(),
    lessons: getLessonProgress(),
    history: getTestHistory(),
  };
}

function useDailyDashboardState() {
  const [daily, setDaily] = useState(getDailyDashboardState);

  useEffect(() => {
    let midnightTimer;
    const refresh = () => setDaily(getDailyDashboardState());
    const scheduleMidnightRefresh = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      midnightTimer = window.setTimeout(() => {
        refresh();
        scheduleMidnightRefresh();
      }, Math.max(1000, nextMidnight.getTime() - now.getTime() + 50));
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('storage', refresh);
    document.addEventListener('visibilitychange', handleVisibility);
    scheduleMidnightRefresh();
    return () => {
      window.clearTimeout(midnightTimer);
      window.removeEventListener('storage', refresh);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const setGoal = minutes => {
    saveSettings({ ...getSettings(), dailyPracticeGoalMinutes: minutes });
    setDaily(getDailyDashboardState());
  };

  return [daily, setGoal];
}

function formatPracticeTime(seconds) {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
}

function PracticeActivity({ daily }) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = dateKey(date);
    const seconds = Number(daily.days[key]) || 0;
    const completedFromHistory = daily.history.some(test => {
      if (dateKey(new Date(test.date)) !== key) return false;
      return test.activePracticeSeconds === undefined
        || test.completedText === true
        || Number(test.activePracticeSeconds) >= 60;
    });
    return {
      key,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      complete: seconds >= 60 || Boolean(daily.completedDays[key]) || completedFromHistory,
      today: index === 6,
      seconds,
    };
  });

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-gray-400">Last 7 days</p>
        <p className="text-xs text-gray-600">1 min active or a completed passage</p>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map(day => (
          <div
            key={day.key}
            aria-label={`${day.label}${day.today ? ', today' : ''}: ${day.complete ? 'practice completed' : day.seconds > 0 ? `${formatPracticeTime(day.seconds)} practiced` : 'no practice'}`}
            title={`${day.label}: ${day.complete ? 'practice completed' : day.seconds > 0 ? `${formatPracticeTime(day.seconds)} practiced` : 'no practice'}`}
            className={`min-w-0 rounded-lg border px-1 py-2 text-center ${
              day.today
                ? 'border-indigo-400/60 bg-indigo-500/10'
                : day.complete
                  ? 'border-emerald-500/20 bg-emerald-500/10'
                  : day.seconds > 0
                    ? 'border-indigo-500/20 bg-indigo-500/5'
                  : 'border-white/5 bg-white/[0.02]'
            }`}
          >
            <div className={`text-[10px] ${day.today ? 'text-indigo-300' : 'text-gray-500'}`}>
              {day.label}
            </div>
            <div className="mt-1 flex justify-center">
              {day.complete
                ? <CheckCircle2 size={13} className="text-emerald-400" aria-hidden="true" />
                : <span className={`w-2 h-2 rounded-full mt-0.5 ${day.today ? 'bg-indigo-400' : 'bg-white/15'}`} aria-hidden="true" />}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-400">
          <span className="text-amber-300 font-semibold">{daily.streak.current}</span> day streak
        </p>
        <p className="text-xs text-gray-500">Best: {daily.streak.longest} days</p>
      </div>
    </div>
  );
}

function DailyPracticeGoal({ daily, onGoalChange }) {
  const targetSeconds = daily.goalMinutes * 60;
  const progressPct = Math.min(100, (daily.today.seconds / targetSeconds) * 100);
  const complete = progressPct >= 100;

  return (
    <section className="rounded-xl bg-white/5 border border-white/10 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Clock size={15} className="text-indigo-400" />
            Today's Practice Goal
          </h2>
          <p className="text-xs text-gray-500 mt-1">Active typing time toward your daily target.</p>
        </div>
        {complete && <CheckCircle2 size={19} className="text-emerald-400 flex-shrink-0" aria-label="Goal complete" />}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-4" role="group" aria-label="Daily practice target">
        {PRACTICE_GOALS.map(minutes => (
          <button
            key={minutes}
            type="button"
            onClick={() => onGoalChange(minutes)}
            aria-pressed={daily.goalMinutes === minutes}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              daily.goalMinutes === minutes
                ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
                : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {minutes} min
          </button>
        ))}
      </div>
      <div className="flex items-baseline justify-between gap-3 mt-4 mb-2">
        <span className="text-sm text-gray-300">Today's progress</span>
        <span className="text-right">
          <span className="block text-xs text-gray-500">{Math.round(progressPct)}%</span>
          <span className="text-sm font-semibold tabular-nums text-white">
          {formatPracticeTime(daily.today.seconds)} / {daily.goalMinutes} min
          </span>
        </span>
      </div>
      <div
        className="h-2.5 rounded-full bg-white/10 overflow-hidden"
        role="progressbar"
        aria-label="Today's practice goal progress"
        aria-valuemin={0}
        aria-valuemax={targetSeconds}
        aria-valuenow={Math.min(targetSeconds, Math.floor(daily.today.seconds))}
        aria-valuetext={`${Math.round(progressPct)}% of ${daily.goalMinutes} minutes`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${complete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className={`text-xs mt-2 ${complete ? 'text-emerald-300' : 'text-gray-500'}`} aria-live="polite">
        {complete
          ? 'Daily goal complete—wonderful consistency!'
          : daily.today.seconds > 0
            ? `${Math.max(0, Math.ceil(targetSeconds - daily.today.seconds))} seconds to go. Every focused minute counts.`
            : 'Start a typing session to make progress toward your goal.'}
      </p>
      <PracticeActivity daily={daily} />
    </section>
  );
}

function ContinueLearning({ daily, onOpenLessons }) {
  const settings = getSettings();
  const recommendation = getLessonRecommendation(daily.lessons, Number(settings.lessonAccuracyThreshold) || 90);
  const latest = Object.values(daily.lessons.attempts || {})
    .filter(attempt => attempt?.attemptedAt)
    .sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt))[0];

  return (
    <section className="rounded-xl bg-white/5 border border-white/10 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 mb-1">Lesson path</p>
      <h2 className="font-semibold text-white flex items-center gap-2">
        <BookOpen size={15} className="text-indigo-300" />
        Continue learning
      </h2>
      <p className="text-sm text-white font-medium mt-3">{recommendation.lesson.title}</p>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{recommendation.message}</p>
      {latest && (
        <p className="text-xs text-gray-400 mt-3">
          Recent lesson: {latest.title} · {latest.wpm} WPM · {latest.accuracy}% accuracy
        </p>
      )}
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        onClick={() => onOpenLessons(recommendation.lesson.id)}
      >
        {recommendation.retry ? 'Retry suggested lesson' : 'Start next lesson'}
        <ArrowRight size={14} />
      </Button>
      <button
        type="button"
        onClick={() => onOpenLessons()}
        className="w-full mt-2 text-xs text-gray-500 hover:text-gray-300 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
      >
        Browse all {LESSONS.length} lessons
      </button>
    </section>
  );
}

function StatPill({ label, value, icon: Icon, color = 'default' }) {
  const colors = {
    default: 'bg-white/5 border-white/10 text-white',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  };

  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${colors[color]}`}>
      {Icon && <Icon size={16} className="opacity-70 flex-shrink-0" />}
      <div>
        <div className="text-xs opacity-60 leading-none mb-0.5">{label}</div>
        <div className="text-sm font-bold leading-none">{value}</div>
      </div>
    </div>
  );
}

function GoalBar({ label, current, target, color }) {
  const pct = Math.min(100, target > 0 ? (current / target) * 100 : 0);
  const isDone = pct >= 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-500">{label}</span>
        <span className={isDone ? 'text-emerald-400 font-medium' : 'text-gray-400'}>
          {current > 0 ? `${current} / ${target}` : `Target: ${target}`}
          {isDone && ' ✓'}
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isDone ? 'bg-emerald-500' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [daily, setDailyGoal] = useDailyDashboardState();
  const stats = useMemo(() => getAggregateStats(), []);
  const history = useMemo(() => getTestHistory(), []);
  const streak = useMemo(() => getStreak(), []);
  const goal = useMemo(() => getDailyGoal(stats), [stats]);
  const recommendation = useMemo(() => getRecommendation(history), [history]);

  const recentWpm = useMemo(() =>
    history.slice(0, 15).reverse().map(t => t.wpm),
    [history]
  );

  const todayTests = useMemo(() =>
    history.filter(t => new Date(t.date).toDateString() === new Date().toDateString()),
    [history]
  );

  const todayBestWpm = todayTests.length > 0 ? Math.max(...todayTests.map(t => t.wpm)) : 0;
  const todayAvgAcc = todayTests.length > 0
    ? Math.round(todayTests.reduce((s, t) => s + t.accuracy, 0) / todayTests.length * 10) / 10
    : 0;

  const isNewUser = history.length === 0;
  const openLessons = lessonId => navigate('/lessons', { state: lessonId ? { lessonId } : undefined });

  if (isNewUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Hero section */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Zap size={12} />
            Welcome to TypeFlow
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Type faster.{' '}
            <span className="text-indigo-400">Type smarter.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
            Improve your typing speed and accuracy with focused practice, real-time feedback, and detailed progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate('/test')} size="xl">
              <Target size={20} />
              Take a Typing Test
            </Button>
            <Button onClick={() => navigate('/practice')} variant="secondary" size="xl">
              <BookOpen size={20} />
              Browse Practice Modes
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: '⚡',
              title: 'Real-time WPM',
              desc: 'Live words-per-minute calculation using the standard 5-char convention.',
            },
            {
              icon: '🎯',
              title: 'Accuracy Tracking',
              desc: 'Track every keystroke and identify patterns in your mistakes.',
            },
            {
              icon: '📈',
              title: 'Progress Charts',
              desc: 'Visualize your improvement over time with detailed charts.',
            },
            {
              icon: '🏆',
              title: 'Achievements',
              desc: 'Unlock achievements as you reach new speed and accuracy milestones.',
            },
          ].map(f => (
            <div key={f.title} className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          <DailyPracticeGoal daily={daily} onGoalChange={setDailyGoal} />
          <ContinueLearning daily={daily} onOpenLessons={openLessons} />
        </div>

        {/* Typing facts */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <h2 className="font-semibold text-white mb-4">Did you know?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '40 WPM', label: 'Average typist speed' },
              { value: '75 WPM', label: 'Professional typist' },
              { value: '15 min', label: 'Recommended daily practice' },
              { value: '4 weeks', label: 'Average time to improve 15 WPM' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="text-2xl font-bold text-indigo-400 mb-1">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">
            {streak.current > 0
              ? `🔥 ${streak.current} day streak — keep it going!`
              : 'Complete a test to start your streak'
            }
          </p>
        </div>
        <Button onClick={() => navigate('/test')} size="lg">
          <Zap size={16} />
          Start Typing
        </Button>
      </div>

      {/* Primary stats */}
      <div className="flex flex-wrap gap-2">
        <StatPill label="Recent WPM" value={history[0]?.wpm || 0} icon={Zap} color="indigo" />
        <StatPill label="Recent Accuracy" value={`${history[0]?.accuracy || 0}%`} icon={Target} color="emerald" />
        <StatPill label="Best WPM" value={stats.bestWpm} icon={BarChart2} />
        <StatPill label="Streak" value={`${streak.current || 0}d`} icon={Flame} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        <DailyPracticeGoal daily={daily} onGoalChange={setDailyGoal} />
        <ContinueLearning daily={daily} onOpenLessons={openLessons} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent performance */}
        <div className="lg:col-span-2 rounded-xl bg-white/5 border border-white/10 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Performance</h2>
            <button
              onClick={() => navigate('/progress')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              Full history <ArrowRight size={12} />
            </button>
          </div>

          {/* Mini stats + sparkline */}
          <div className="flex items-start gap-6 mb-5">
            <div className="space-y-3">
              <div>
                <div className="text-3xl font-bold text-white tabular-nums">{stats.averageWpm}</div>
                <div className="text-xs text-gray-500">avg WPM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tabular-nums">{stats.averageAccuracy}%</div>
                <div className="text-xs text-gray-500">avg accuracy</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-xs text-gray-600 mb-1">WPM trend</div>
              <MiniSparkline data={recentWpm} color="#6366f1" />
              <div className="text-xs text-gray-600 mt-1">{recentWpm.length} recent tests</div>
            </div>
          </div>

          {/* Recent test list */}
          <div className="space-y-0 border-t border-white/5 pt-3">
            {history.slice(0, 6).map((t, i) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20 flex-shrink-0">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-500">
                    {getModeName(t.practiceMode)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-indigo-400 tabular-nums w-16 text-right">{t.wpm} WPM</span>
                  <span className={`text-sm tabular-nums w-12 text-right ${t.accuracy >= 95 ? 'text-emerald-400' : t.accuracy >= 85 ? 'text-gray-300' : 'text-amber-400'}`}>
                    {t.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Today's Goal */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <div className="mb-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-white">Today's Typing Goals</h2>
                {todayTests.length > 0 && (
                  <span className="text-xs text-gray-600">{todayTests.length} test{todayTests.length > 1 ? 's' : ''} done</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Speed and accuracy targets for completed tests.</p>
            </div>
            <div className="space-y-3">
              <GoalBar
                label="Speed target"
                current={todayBestWpm}
                target={goal.targetWpm}
                color="bg-indigo-500"
              />
              <GoalBar
                label="Accuracy target"
                current={todayAvgAcc}
                target={goal.targetAccuracy}
                color="bg-emerald-500"
              />
            </div>
            {todayTests.length === 0 && (
              <p className="text-xs text-gray-600 mt-3 text-center">No tests today yet</p>
            )}
          </div>

          {/* Recommendation */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <h2 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Trophy size={14} className="text-amber-400" />
              Recommended
            </h2>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{recommendation.message}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/practice')}
            >
              <BookOpen size={14} />
              {getModeName(recommendation.mode)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
