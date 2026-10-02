import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  RefreshCw,
  TrendingUp,
  XCircle,
  Target,
  Zap,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from './Button';
import { getTestHistory } from '../utils/storage';

function MetricBox({ label, value, icon: Icon, color = 'indigo' }) {
  const styles = {
    indigo: {
      border: 'border-indigo-500/20',
      bg: 'bg-indigo-500/8',
      text: 'text-indigo-400',
    },
    emerald: {
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/8',
      text: 'text-emerald-400',
    },
    red: {
      border: 'border-red-500/20',
      bg: 'bg-red-500/8',
      text: 'text-red-400',
    },
    amber: {
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/8',
      text: 'text-amber-400',
    },
    blue: {
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/8',
      text: 'text-blue-400',
    },
    gray: {
      border: 'border-white/10',
      bg: 'bg-white/5',
      text: 'text-gray-300',
    },
  };

  const s = styles[color] || styles.indigo;

  return (
    <div
      className={`rounded-xl p-4 border ${s.border} ${s.bg} text-center`}
    >
      {Icon && (
        <Icon
          size={16}
          className={`mx-auto mb-1.5 ${s.text}`}
        />
      )}

      <div
        className={`text-2xl font-bold ${s.text} tabular-nums`}
      >
        {value}
      </div>

      <div className="text-xs text-gray-500 mt-0.5">
        {label}
      </div>
    </div>
  );
}

function PerformanceBar({ label, value, max, color }) {
  const pct =
    max > 0
      ? Math.min(100, (value / max) * 100)
      : 0;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>

        <span className="text-gray-300 font-medium">
          {value}
        </span>
      </div>

      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ResultCard({ result, onRetry, onNewTest }) {
  const navigate = useNavigate();

  const {
    previousBest,
    isNewBest,
    isFirstTest,
    improvement,
  } = useMemo(() => {
    const history = getTestHistory();

    // The latest result is stored first.
    // Compare it with all previous tests.
    const prev = history.slice(1);

    const prevBest =
      prev.length > 0
        ? Math.max(...prev.map((test) => test.wpm || 0))
        : 0;

    const firstTest = history.length <= 1;

    return {
      previousBest: prevBest,
      isNewBest: !firstTest && result.wpm > prevBest,
      isFirstTest: firstTest,
      improvement: result.wpm - prevBest,
    };
  }, [result.wpm]);

  const getPerformanceMessage = () => {
    if (isFirstTest) {
      return {
        msg: 'Great start! Keep practicing to see your improvement.',
        emoji: '🎯',
      };
    }

    if (isNewBest) {
      return {
        msg: `Personal best! You improved by ${improvement} WPM over your previous best of ${previousBest} WPM.`,
        emoji: '🏆',
      };
    }

    if (improvement >= -3) {
      return {
        msg: "You're very close to your best. Stay focused and push through!",
        emoji: '⚡',
      };
    }

    return {
      msg: 'Keep practicing consistently — each session brings improvement.',
      emoji: '💪',
    };
  };

  const { msg, emoji } = getPerformanceMessage();

  const accRating = (() => {
    if (result.accuracy >= 99) {
      return {
        label: 'Perfect',
        color: 'text-emerald-400',
      };
    }

    if (result.accuracy >= 96) {
      return {
        label: 'Excellent',
        color: 'text-emerald-400',
      };
    }

    if (result.accuracy >= 90) {
      return {
        label: 'Great',
        color: 'text-blue-400',
      };
    }

    if (result.accuracy >= 80) {
      return {
        label: 'Good',
        color: 'text-indigo-400',
      };
    }

    if (result.accuracy >= 70) {
      return {
        label: 'Fair',
        color: 'text-amber-400',
      };
    }

    return {
      label: 'Needs Work',
      color: 'text-red-400',
    };
  })();

  return (
    <div className="w-full max-w-2xl mx-auto fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">
          {emoji}
        </div>

        {isNewBest && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-medium mb-3">
            <Trophy size={14} />
            New Personal Best!
          </div>
        )}

        <p className="text-xs font-semibold tracking-[0.18em] text-indigo-300 uppercase mb-1">
          Your Speed
        </p>

        <div className="text-5xl sm:text-6xl font-bold text-white tabular-nums leading-none mb-1">
          {result.wpm}
          <span className="text-xl sm:text-2xl text-indigo-300 ml-2">
            WPM
          </span>
        </div>

        <h2 className="text-lg font-semibold text-white mb-2">
          Test Complete
        </h2>

        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          {msg}
        </p>
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <MetricBox
          label="Accuracy"
          value={`${result.accuracy}%`}
          icon={Target}
          color="emerald"
        />

        <MetricBox
          label="Errors"
          value={result.errors}
          icon={XCircle}
          color="red"
        />

        <MetricBox
          label="Correct"
          value={result.correctChars}
          icon={CheckCircle}
          color="emerald"
        />

        <MetricBox
          label="Duration"
          value={`${result.duration}s`}
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Character breakdown */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-400 mb-4">
          Character Breakdown
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <CheckCircle
                size={14}
                className="text-emerald-400"
              />

              <span className="text-xl font-bold text-emerald-400 tabular-nums">
                {result.correctChars}
              </span>
            </div>

            <div className="text-xs text-gray-600">
              Correct
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <XCircle
                size={14}
                className="text-red-400"
              />

              <span className="text-xl font-bold text-red-400 tabular-nums">
                {result.incorrectChars}
              </span>
            </div>

            <div className="text-xs text-gray-600">
              Incorrect
            </div>
          </div>

          <div className="text-center">
            <div className="text-xl font-bold text-gray-300 tabular-nums mb-1">
              {result.totalChars}
            </div>

            <div className="text-xs text-gray-600">
              Total Typed
            </div>
          </div>
        </div>

        {/* Accuracy bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500">
              Accuracy
            </span>

            <span
              className={`font-medium ${accRating.color}`}
            >
              {result.accuracy}% — {accRating.label}
            </span>
          </div>

          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
              style={{
                width: `${result.accuracy}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* vs Personal Best */}
      {!isFirstTest && (
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            vs. Personal Best
          </h3>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <PerformanceBar
                label={`This test: ${result.wpm} WPM`}
                value={result.wpm}
                max={Math.max(
                  result.wpm,
                  previousBest,
                  1
                )}
                color="bg-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">
              Previous best:{' '}
              <span className="text-white font-medium">
                {previousBest} WPM
              </span>
            </span>

            <span
              className={`text-sm font-bold ${
                improvement >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}
            >
              {improvement > 0 ? '+' : ''}
              {improvement} WPM
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onRetry}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          <RefreshCw size={16} />
          Try Again
        </Button>

        <Button
          onClick={onNewTest}
          variant="secondary"
          size="lg"
          className="flex-1"
        >
          <Zap size={16} />
          New Test
        </Button>

        <Button
          onClick={() => navigate('/progress')}
          variant="ghost"
          size="lg"
          className="flex-1"
        >
          <TrendingUp size={16} />
          Progress
        </Button>
      </div>

      {/* Newly unlocked achievements */}
      {result.newlyUnlocked &&
        result.newlyUnlocked.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center achievement-pop">
            <p className="text-amber-400 font-semibold mb-0.5">
              🏅 {result.newlyUnlocked.length} Achievement
              {result.newlyUnlocked.length > 1 ? 's' : ''}{' '}
              Unlocked!
            </p>

            <p className="text-amber-300/60 text-xs">
              Check the Achievements page to see your progress.
            </p>
          </div>
        )}
    </div>
  );
}