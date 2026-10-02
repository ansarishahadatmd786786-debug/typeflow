import React, { useMemo } from 'react';

function LineChart({ data, color = '#6366f1', height = 100, showGrid = true }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm" style={{ height }}>
        No data yet
      </div>
    );
  }

  if (data.length === 1) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color }}>{data[0].value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Single data point</div>
        </div>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const padTop = 12;
  const padBottom = 12;
  const chartH = height - padTop - padBottom;
  const W = 200; // viewBox units

  const toY = (v) => padTop + chartH - ((v - min) / range) * chartH;
  const toX = (i) => (i / (data.length - 1)) * W;

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.value), ...d }));

  // Smooth bezier path
  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    const prev = points[i - 1];
    const cp1x = (prev.x + p.x) / 2;
    const cp2x = (prev.x + p.x) / 2;
    return `${acc} C ${cp1x.toFixed(2)} ${prev.y.toFixed(2)} ${cp2x.toFixed(2)} ${p.y.toFixed(2)} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(2)} ${height} L 0 ${height} Z`;

  // Grid lines at 25%, 50%, 75%
  const gridValues = [0.25, 0.5, 0.75].map(pct => ({
    y: padTop + chartH - pct * chartH,
    value: Math.round(min + pct * range),
  }));

  const uniqueId = color.replace('#', 'c');

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      className="w-full"
      style={{ height }}
      preserveAspectRatio="none"
      role="img"
      aria-label="Performance chart"
    >
      <defs>
        <linearGradient id={`grad-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {showGrid && gridValues.map((g, i) => (
        <line
          key={i}
          x1="0" y1={g.y.toFixed(2)}
          x2={W} y2={g.y.toFixed(2)}
          stroke="rgba(148,163,184,0.2)"
          strokeWidth="0.8"
        />
      ))}

      {/* Area fill */}
      <path d={areaD} fill={`url(#grad-${uniqueId})`} />

      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points (only show if few points) */}
      {data.length <= 15 && points.map((p, i) => (
        <circle
          key={i}
          cx={p.x.toFixed(2)}
          cy={p.y.toFixed(2)}
          r="2"
          fill={color}
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

export function WpmChart({ history, limit = 20 }) {
  const data = useMemo(() => {
    if (!history || history.length === 0) return [];
    const recent = [...history].reverse().slice(-limit);
    return recent.map((t, i) => ({
      value: t.wpm || 0,
      label: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [history, limit]);

  const avg = data.length > 0 ? Math.round(data.reduce((s, d) => s + d.value, 0) / data.length) : 0;
  const trend = data.length > 1 ? data[data.length - 1].value - data[0].value : 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-medium text-gray-300">WPM Over Time</h3>
          {data.length > 0 && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500">avg {avg} WPM</span>
              {trend !== 0 && (
                <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trend > 0 ? '+' : ''}{trend}
                </span>
              )}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">Last {Math.min(limit, history.length)} tests</span>
      </div>
      <div className="mt-2">
        <LineChart data={data} color="#6366f1" height={100} />
      </div>
      {data.length > 0 && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>oldest</span>
          <span>newest</span>
        </div>
      )}
    </div>
  );
}

export function AccuracyChart({ history, limit = 20 }) {
  const data = useMemo(() => {
    if (!history || history.length === 0) return [];
    const recent = [...history].reverse().slice(-limit);
    return recent.map((t, i) => ({
      value: t.accuracy || 0,
      label: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [history, limit]);

  const avg = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.value, 0) / data.length * 10) / 10
    : 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-medium text-gray-300">Accuracy Over Time</h3>
          {data.length > 0 && (
            <span className="text-xs text-gray-500">avg {avg}%</span>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">Last {Math.min(limit, history.length)} tests</span>
      </div>
      <div className="mt-2">
        <LineChart data={data} color="#10b981" height={100} />
      </div>
      {data.length > 0 && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>oldest</span>
          <span>newest</span>
        </div>
      )}
    </div>
  );
}

export function MiniSparkline({ data, color = '#6366f1' }) {
  if (!data || data.length === 0) {
    return <div className="h-8 rounded opacity-30" style={{ backgroundColor: color + '20' }} />;
  }

  const values = Array.isArray(data)
    ? data.map(d => typeof d === 'number' ? d : d.value)
    : [];

  if (values.length === 0) return null;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const W = 80;
  const H = 32;

  const points = values.map((v, i) => ({
    x: (i / Math.max(values.length - 1, 1)) * W,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));

  if (points.length === 1) {
    return (
      <div className="flex items-center" style={{ height: H }}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
    );
  }

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    const prev = points[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx.toFixed(1)} ${prev.y.toFixed(1)} ${cx.toFixed(1)} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');

  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;
  const uid = color.replace('#', 'sp');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sp-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sp-grad-${uid})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
