// WPM calculation: 5 chars = 1 word
export function calculateWPM(correctChars, elapsedSeconds) {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = correctChars / 5;
  return Math.round(words / minutes);
}

// Accuracy calculation
export function calculateAccuracy(correctChars, totalTyped) {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 1000) / 10;
}

// Format time as MM:SS
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Format large numbers
export function formatNumber(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

// Get character state for display
export const CHAR_STATE = {
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  PENDING: 'pending',
  CURRENT: 'current',
};

// Determine finger for each key
const FINGER_MAP = {
  '`': 'left-pinky', '1': 'left-pinky', 'q': 'left-pinky', 'a': 'left-pinky', 'z': 'left-pinky',
  '2': 'left-ring', 'w': 'left-ring', 's': 'left-ring', 'x': 'left-ring',
  '3': 'left-middle', 'e': 'left-middle', 'd': 'left-middle', 'c': 'left-middle',
  '4': 'left-index', 'r': 'left-index', 'f': 'left-index', 'v': 'left-index',
  '5': 'left-index', 't': 'left-index', 'g': 'left-index', 'b': 'left-index',
  '6': 'right-index', 'y': 'right-index', 'h': 'right-index', 'n': 'right-index',
  '7': 'right-index', 'u': 'right-index', 'j': 'right-index', 'm': 'right-index',
  '8': 'right-middle', 'i': 'right-middle', 'k': 'right-middle', ',': 'right-middle',
  '9': 'right-ring', 'o': 'right-ring', 'l': 'right-ring', '.': 'right-ring',
  '0': 'right-pinky', 'p': 'right-pinky', ';': 'right-pinky', '/': 'right-pinky',
  '-': 'right-pinky', '[': 'right-pinky', '\'': 'right-pinky',
  '=': 'right-pinky', ']': 'right-pinky', '\\': 'right-pinky',
  ' ': 'thumb',
};

export function getFingerForKey(key) {
  return FINGER_MAP[key.toLowerCase()] || null;
}

// Recommendation engine
export function getRecommendation(history) {
  if (!history || history.length < 3) {
    return {
      type: 'beginner',
      message: 'Complete a few tests to get personalized recommendations.',
      mode: 'intermediate',
    };
  }

  const recent = history.slice(0, 10);
  const avgWpm = recent.reduce((s, t) => s + t.wpm, 0) / recent.length;
  const avgAcc = recent.reduce((s, t) => s + t.accuracy, 0) / recent.length;

  if (avgAcc < 85) {
    return {
      type: 'accuracy',
      message: `Your accuracy averages ${avgAcc.toFixed(0)}%. Focus on accuracy before increasing speed.`,
      mode: 'accuracy',
    };
  }

  if (avgWpm < 30) {
    return {
      type: 'beginner',
      message: `You're building a solid foundation at ${avgWpm.toFixed(0)} WPM. Try beginner mode to build muscle memory.`,
      mode: 'beginner',
    };
  }

  if (avgWpm < 50 && avgAcc >= 90) {
    return {
      type: 'speed',
      message: `Great accuracy at ${avgAcc.toFixed(0)}%! Push your speed with a Speed Challenge.`,
      mode: 'speed',
    };
  }

  if (avgWpm < 70) {
    return {
      type: 'intermediate',
      message: `You're at ${avgWpm.toFixed(0)} WPM. Intermediate practice will help you break through plateaus.`,
      mode: 'intermediate',
    };
  }

  if (avgWpm >= 70) {
    return {
      type: 'advanced',
      message: `Impressive! At ${avgWpm.toFixed(0)} WPM, challenge yourself with advanced texts.`,
      mode: 'advanced',
    };
  }

  return {
    type: 'intermediate',
    message: 'Keep practicing consistently to see steady improvement.',
    mode: 'intermediate',
  };
}

// Calculate consistency (coefficient of variation of WPM)
export function calculateConsistency(wpmSamples) {
  if (!wpmSamples || wpmSamples.length < 2) return 100;
  const avg = wpmSamples.reduce((s, v) => s + v, 0) / wpmSamples.length;
  if (avg === 0) return 100;
  const variance = wpmSamples.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / wpmSamples.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / avg) * 100;
  return Math.max(0, Math.round(100 - cv));
}

// Get goal based on current level
export function getDailyGoal(stats) {
  const avgWpm = stats.averageWpm || 0;
  const targetWpm = Math.max(30, Math.round(avgWpm * 1.1)); // 10% above average
  const targetAccuracy = Math.max(90, Math.min(98, Math.round((stats.averageAccuracy || 85) + 2)));
  return { targetWpm, targetAccuracy };
}
