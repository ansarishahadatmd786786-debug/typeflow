// Storage keys
const KEYS = {
  TEST_HISTORY: 'typeflow_history',
  SETTINGS: 'typeflow_settings',
  ACHIEVEMENTS: 'typeflow_achievements',
  STREAK: 'typeflow_streak',
  STATS: 'typeflow_stats',
  DAILY_PRACTICE: 'typeflow_daily_practice_v1',
  LESSON_PROGRESS: 'typeflow_lesson_progress_v1',
};

export const BACKUP_FORMAT_VERSION = 1;
const BACKUP_APP_ID = 'TypeFlow';

export const DAILY_STREAK_THRESHOLD_SECONDS = 60;
const MAX_KEY_ACTIVITY_GAP_SECONDS = 2;
const MAX_ACTIVE_SECONDS_PER_KEY_GAP = 1;

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDateKey(value) {
  if (typeof value !== 'string') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : localDateKey(parsed);
}

function dayDifference(fromKey, toKey) {
  if (!fromKey || !toKey) return null;
  const [fromYear, fromMonth, fromDay] = fromKey.split('-').map(Number);
  const [toYear, toMonth, toDay] = toKey.split('-').map(Number);
  const from = new Date(fromYear, fromMonth - 1, fromDay);
  const to = new Date(toYear, toMonth - 1, toDay);
  return Math.round((to - from) / 86400000);
}

// Safe get from localStorage
function safeGet(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

// Safe set to localStorage
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Safe remove from localStorage
function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNonNegative(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function validateBackupData(data) {
  if (!isRecord(data)) throw new Error('Backup data must be a JSON object.');
  const allowedKeys = new Set(Object.values(KEYS));
  const unknownKeys = Object.keys(data).filter(key => !allowedKeys.has(key));
  if (unknownKeys.length > 0) {
    throw new Error(`Backup contains unsupported data keys: ${unknownKeys.join(', ')}.`);
  }

  for (const key of Object.values(KEYS)) {
    if (!Object.hasOwn(data, key)) continue;
    const value = data[key];
    if (value === null) continue;

    if (key === KEYS.TEST_HISTORY) {
      if (!Array.isArray(value) || !value.every(item => isRecord(item)
        && typeof item.date === 'string'
        && !Number.isNaN(Date.parse(item.date))
        && isFiniteNonNegative(item.wpm)
        && isFiniteNonNegative(item.accuracy))) {
        throw new Error('Test history must be an array of valid typing results.');
      }
    } else if (key === KEYS.SETTINGS) {
      if (!isRecord(value)) throw new Error('Settings must be a JSON object.');
      const supportedSettings = {
        theme: setting => ['dark', 'light', 'system'].includes(setting),
        soundEnabled: setting => typeof setting === 'boolean',
        showKeyboard: setting => typeof setting === 'boolean',
        showNextKey: setting => typeof setting === 'boolean',
        showFingerGuide: setting => typeof setting === 'boolean',
        showTimer: setting => typeof setting === 'boolean',
        caretStyle: setting => ['line', 'block', 'underline'].includes(setting),
        defaultDuration: setting => [15, 30, 60, 120, 300].includes(setting),
        defaultPracticeMode: setting => [
          'beginner',
          'intermediate',
          'advanced',
          'speed',
          'accuracy',
          'difficult',
          'numbers',
          'special',
          'programming',
        ].includes(setting),
        dailyPracticeGoalMinutes: setting => [5, 10, 15, 20].includes(setting),
        lessonAccuracyThreshold: setting => [80, 85, 90, 95, 100].includes(setting),
      };
      for (const [setting, isValid] of Object.entries(supportedSettings)) {
        if (value[setting] !== undefined && !isValid(value[setting])) {
          throw new Error(`Settings contain an invalid value for "${setting}". Choose a value supported by TypeFlow.`);
        }
      }
    } else if (key === KEYS.ACHIEVEMENTS) {
      if (!isRecord(value) || !Object.values(value).every(isRecord)) {
        throw new Error('Achievements must be an object containing achievement records.');
      }
    } else if (key === KEYS.STREAK) {
      if (!isRecord(value)
        || !Number.isInteger(value.current) || value.current < 0
        || !Number.isInteger(value.longest) || value.longest < 0
        || (value.lastPracticeDate !== null && typeof value.lastPracticeDate !== 'string')) {
        throw new Error('Streak data has an invalid structure.');
      }
    } else if (key === KEYS.STATS) {
      if (!isRecord(value)) throw new Error('Statistics must be a JSON object.');
    } else if (key === KEYS.DAILY_PRACTICE) {
      if (!isRecord(value) || value.version !== 1 || !isRecord(value.days)) {
        throw new Error('Daily practice data has an unsupported or invalid structure.');
      }
      if (!Object.entries(value.days).every(([date, seconds]) =>
        isDateKey(date) && isFiniteNonNegative(seconds))) {
        throw new Error('Daily practice history contains an invalid date or time.');
      }
      if (value.completedDays !== undefined
        && (!isRecord(value.completedDays) || !Object.entries(value.completedDays).every(([date, done]) =>
          isDateKey(date) && typeof done === 'boolean'))) {
        throw new Error('Daily completed-day history has an invalid structure.');
      }
      if (value.lastActivityAt !== undefined && !isFiniteNonNegative(value.lastActivityAt)) {
        throw new Error('Daily practice activity timestamp is invalid.');
      }
    } else if (key === KEYS.LESSON_PROGRESS) {
      if (!isRecord(value) || value.version !== 1
        || !isRecord(value.completed) || !isRecord(value.attempts)) {
        throw new Error('Lesson progress has an unsupported or invalid structure.');
      }
      if (!Object.values(value.completed).every(item => isRecord(item)
        && typeof item.completedAt === 'string'
        && !Number.isNaN(Date.parse(item.completedAt))
        && isFiniteNonNegative(item.wpm)
        && isFiniteNonNegative(item.accuracy))) {
        throw new Error('Completed lesson records are invalid.');
      }
      if (!Object.values(value.attempts).every(item => isRecord(item)
        && typeof item.lessonId === 'string'
        && typeof item.title === 'string'
        && isFiniteNonNegative(item.wpm)
        && isFiniteNonNegative(item.accuracy)
        && typeof item.completed === 'boolean'
        && typeof item.attemptedAt === 'string'
        && !Number.isNaN(Date.parse(item.attemptedAt)))) {
        throw new Error('Lesson attempt records are invalid.');
      }
    }
  }
}

export function createBackup() {
  const data = {};
  for (const key of Object.values(KEYS)) {
    const raw = localStorage.getItem(key);
    data[key] = raw === null ? null : JSON.parse(raw);
  }
  const backup = {
    app: BACKUP_APP_ID,
    backupVersion: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
  validateBackup(backup);
  return backup;
}

export function validateBackup(backup) {
  if (!isRecord(backup)) throw new Error('The selected file must contain a TypeFlow backup JSON object.');
  if (backup.app !== BACKUP_APP_ID) throw new Error('This file is not a TypeFlow backup.');
  if (backup.backupVersion !== BACKUP_FORMAT_VERSION) {
    throw new Error(`Unsupported backup version. This app supports version ${BACKUP_FORMAT_VERSION}.`);
  }
  if (typeof backup.exportedAt !== 'string' || Number.isNaN(Date.parse(backup.exportedAt))) {
    throw new Error('Backup export timestamp is missing or invalid.');
  }
  validateBackupData(backup.data);
  return backup.data;
}

export function restoreBackup(backup) {
  const data = validateBackup(backup);
  const keys = Object.values(KEYS);
  const previous = new Map(keys.map(key => [key, localStorage.getItem(key)]));
  const next = new Map(keys.map(key => [
    key,
    data[key] === undefined || data[key] === null ? null : JSON.stringify(data[key]),
  ]));

  try {
    for (const [key, value] of next) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
  } catch (error) {
    let rollbackFailed = false;
    for (const [key, value] of previous) {
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        rollbackFailed = true;
      }
    }
    if (rollbackFailed) {
      throw new Error('Restore failed and LocalStorage could not fully roll back. Check browser storage availability before continuing.');
    }
    throw new Error(`Restore failed; your previous data was restored. ${error.message}`);
  }
}

// ===========================
// TEST HISTORY
// ===========================
function readTestHistory() {
  let item;
  try {
    item = localStorage.getItem(KEYS.TEST_HISTORY);
  } catch {
    return { history: [], readable: false };
  }

  if (item === null) return { history: [], readable: true };
  try {
    const history = JSON.parse(item);
    return {
      history: Array.isArray(history) ? history : [],
      readable: true,
    };
  } catch {
    return { history: [], readable: true };
  }
}

export function getTestHistory() {
  return readTestHistory().history;
}

export function saveTestResult(result) {
  const { history, readable } = readTestHistory();
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    wpm: Math.round(result.wpm || 0),
    accuracy: Math.round((result.accuracy || 0) * 10) / 10,
    correctChars: result.correctChars || 0,
    incorrectChars: result.incorrectChars || 0,
    totalChars: result.totalChars || 0,
    errors: result.errors || 0,
    duration: result.duration || 60,
    activePracticeSeconds: Math.max(0, result.activePracticeSeconds || 0),
    completedText: result.completedText === true,
    mode: result.mode || 'time',
    practiceMode: result.practiceMode || 'intermediate',
  };
  history.unshift(entry); // newest first
  // Keep only last 500 results
  const trimmed = history.slice(0, 500);
  if (readable) safeSet(KEYS.TEST_HISTORY, trimmed);
  return entry;
}

export function clearTestHistory() {
  safeRemove(KEYS.TEST_HISTORY);
}

// ===========================
// SETTINGS
// ===========================
const DEFAULT_SETTINGS = {
  theme: 'dark',
  soundEnabled: false,
  showKeyboard: true,
  showNextKey: true,
  showFingerGuide: true,
  showTimer: true,
  caretStyle: 'line', // 'line' | 'block' | 'underline'
  defaultDuration: 60,
  defaultPracticeMode: 'intermediate',
  dailyPracticeGoalMinutes: 15,
  lessonAccuracyThreshold: 90,
};

export function getSettings() {
  const stored = safeGet(KEYS.SETTINGS, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function saveSettings(settings) {
  safeSet(KEYS.SETTINGS, settings);
}

// ===========================
// STREAK
// ===========================
function getStoredStreak() {
  const stored = safeGet(KEYS.STREAK, null);
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
    return { current: 0, longest: 0, lastPracticeDate: null };
  }
  return stored;
}

export function getStreak() {
  const stored = getStoredStreak();
  const lastPracticeDate = normalizeDateKey(stored.lastPracticeDate);
  const daysSincePractice = dayDifference(lastPracticeDate, localDateKey());
  return {
    current: daysSincePractice !== null && daysSincePractice >= 0 && daysSincePractice <= 1
      ? Number(stored.current) || 0
      : 0,
    longest: Number(stored.longest) || 0,
    lastPracticeDate,
  };
}

export function updateStreak(practiceDate = new Date()) {
  const stored = getStoredStreak();
  const lastPracticeDate = normalizeDateKey(stored.lastPracticeDate);
  const today = localDateKey(practiceDate);
  const daysSincePractice = dayDifference(lastPracticeDate, today);

  if (daysSincePractice === 0) {
    return getStreak();
  }

  const newCurrent = daysSincePractice === 1
    ? (Number(stored.current) || 0) + 1
    : 1;

  const newStreak = {
    current: newCurrent,
    longest: Math.max(newCurrent, Number(stored.longest) || 0),
    lastPracticeDate: today,
  };
  safeSet(KEYS.STREAK, newStreak);
  return newStreak;
}

export function getDailyPractice(date = new Date()) {
  const practice = safeGet(KEYS.DAILY_PRACTICE, { version: 1, days: {} });
  const seconds = Number(practice?.days?.[localDateKey(date)]) || 0;
  return { seconds: Math.max(0, seconds), date: localDateKey(date) };
}

export function getDailyPracticeHistory() {
  const practice = safeGet(KEYS.DAILY_PRACTICE, { version: 1, days: {} });
  return practice?.days && typeof practice.days === 'object' ? practice.days : {};
}

export function getCompletedPracticeDays() {
  const practice = safeGet(KEYS.DAILY_PRACTICE, { version: 1, days: {} });
  return practice?.completedDays && typeof practice.completedDays === 'object'
    ? practice.completedDays
    : {};
}

export function recordPracticeKeystroke(previousTimestamp, timestamp = Date.now()) {
  const date = new Date(timestamp);
  const practice = safeGet(KEYS.DAILY_PRACTICE, { version: 1, days: {} });
  const days = practice?.days && typeof practice.days === 'object' ? practice.days : {};
  const key = localDateKey(date);
  const completedDays = practice?.completedDays && typeof practice.completedDays === 'object'
    ? practice.completedDays
    : {};
  const lastActivityAt = Number(practice?.lastActivityAt);
  const sameLocalDay = previousTimestamp !== null
    && localDateKey(new Date(previousTimestamp)) === key;
  const lastActivityIsToday = Number.isFinite(lastActivityAt)
    && localDateKey(new Date(lastActivityAt)) === key;
  const previous = Math.max(
    sameLocalDay ? previousTimestamp : 0,
    lastActivityIsToday ? lastActivityAt : 0,
  );
  const elapsedSeconds = previous > 0 ? (timestamp - previous) / 1000 : 0;
  const activeSeconds = elapsedSeconds > 0 && elapsedSeconds <= MAX_KEY_ACTIVITY_GAP_SECONDS
    ? Math.min(elapsedSeconds, MAX_ACTIVE_SECONDS_PER_KEY_GAP)
    : 0;
  const total = (Number(days[key]) || 0) + activeSeconds;
  safeSet(KEYS.DAILY_PRACTICE, {
    version: 1,
    days: { ...days, [key]: total },
    completedDays,
    lastActivityAt: Math.max(lastActivityIsToday ? lastActivityAt : 0, timestamp),
  });

  if (total >= DAILY_STREAK_THRESHOLD_SECONDS) updateStreak(date);
  return activeSeconds;
}

export function recordMeaningfulPractice(date = new Date()) {
  const practice = safeGet(KEYS.DAILY_PRACTICE, { version: 1, days: {} });
  const completedDays = practice?.completedDays && typeof practice.completedDays === 'object'
    ? practice.completedDays
    : {};
  const key = localDateKey(date);
  safeSet(KEYS.DAILY_PRACTICE, {
    ...practice,
    version: 1,
    completedDays: { ...completedDays, [key]: true },
  });
  return updateStreak(date);
}

export function getLessonProgress() {
  const stored = safeGet(KEYS.LESSON_PROGRESS, {});
  return {
    version: 1,
    completed: stored?.completed && typeof stored.completed === 'object' ? stored.completed : {},
    attempts: stored?.attempts && typeof stored.attempts === 'object' ? stored.attempts : {},
  };
}

export function saveLessonResult(lesson, result) {
  const progress = getLessonProgress();
  const completed = { ...progress.completed };
  const attempts = { ...progress.attempts };
  const previous = attempts[lesson.id] || {};
  const isCompleted = result.completedText === true;

  attempts[lesson.id] = {
    lessonId: lesson.id,
    title: lesson.title,
    wpm: Number(result.wpm) || 0,
    accuracy: Number(result.accuracy) || 0,
    activePracticeSeconds: Number(result.activePracticeSeconds) || 0,
    completed: isCompleted,
    attemptedAt: new Date().toISOString(),
  };

  if (isCompleted) {
    completed[lesson.id] = {
      completedAt: previous.completedAt || new Date().toISOString(),
      wpm: Number(result.wpm) || 0,
      accuracy: Number(result.accuracy) || 0,
    };
  }

  const next = { version: 1, completed, attempts };
  safeSet(KEYS.LESSON_PROGRESS, next);
  return next;
}

// ===========================
// ACHIEVEMENTS
// ===========================
const ACHIEVEMENT_DEFS = [
  { id: 'first_test', title: 'First Keystroke', description: 'Complete your first typing test', icon: '🎯', category: 'milestones' },
  { id: 'tests_10', title: 'Getting Warmed Up', description: 'Complete 10 typing tests', icon: '🔥', category: 'milestones' },
  { id: 'tests_25', title: 'On a Roll', description: 'Complete 25 typing tests', icon: '🚀', category: 'milestones' },
  { id: 'tests_50', title: 'Dedicated Typist', description: 'Complete 50 typing tests', icon: '💪', category: 'milestones' },
  { id: 'tests_100', title: 'Century Club', description: 'Complete 100 typing tests', icon: '🏆', category: 'milestones' },
  { id: 'wpm_30', title: 'Steady Fingers', description: 'Achieve 30 WPM', icon: '⌨️', category: 'speed' },
  { id: 'wpm_40', title: 'Building Speed', description: 'Achieve 40 WPM', icon: '⚡', category: 'speed' },
  { id: 'wpm_50', title: 'Speed Typist', description: 'Achieve 50 WPM', icon: '💨', category: 'speed' },
  { id: 'wpm_60', title: 'Fast Hands', description: 'Achieve 60 WPM', icon: '🏎️', category: 'speed' },
  { id: 'wpm_80', title: 'Speed Demon', description: 'Achieve 80 WPM', icon: '⚡', category: 'speed' },
  { id: 'wpm_100', title: 'Lightning Fingers', description: 'Achieve 100 WPM', icon: '🌩️', category: 'speed' },
  { id: 'acc_90', title: 'Accurate Typist', description: 'Achieve 90% accuracy', icon: '🎯', category: 'accuracy' },
  { id: 'acc_95', title: 'Precision Typist', description: 'Achieve 95% accuracy', icon: '🔬', category: 'accuracy' },
  { id: 'acc_98', title: 'Near Perfect', description: 'Achieve 98% accuracy', icon: '💎', category: 'accuracy' },
  { id: 'acc_100', title: 'Flawless', description: 'Achieve 100% accuracy', icon: '✨', category: 'accuracy' },
  { id: 'streak_3', title: 'Consistent', description: '3 day streak', icon: '🔥', category: 'streaks' },
  { id: 'streak_7', title: 'Week Warrior', description: '7 day streak', icon: '🗓️', category: 'streaks' },
  { id: 'streak_30', title: 'Monthly Master', description: '30 day streak', icon: '📅', category: 'streaks' },
  { id: 'chars_1000', title: 'Getting Started', description: 'Type 1,000 characters', icon: '📝', category: 'milestones' },
  { id: 'chars_10000', title: 'Wordsmith', description: 'Type 10,000 characters', icon: '📚', category: 'milestones' },
  { id: 'chars_50000', title: 'Prolific Typist', description: 'Type 50,000 characters', icon: '📖', category: 'milestones' },
  { id: 'perfect_test', title: 'Perfect Run', description: 'Complete a test with 100% accuracy', icon: '🌟', category: 'accuracy' },
];

export function getAchievementDefs() {
  return ACHIEVEMENT_DEFS;
}

export function getUnlockedAchievements() {
  return safeGet(KEYS.ACHIEVEMENTS, {});
}

export function checkAndUnlockAchievements(stats, streak) {
  const unlocked = getUnlockedAchievements();
  const history = getTestHistory();
  const newlyUnlocked = [];

  const check = (id, condition) => {
    if (!unlocked[id] && condition) {
      unlocked[id] = {
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(id);
    }
  };

  const totalTests = history.length;
  const totalChars = history.reduce((s, t) => s + (t.correctChars || 0), 0);
  const bestWpm = history.reduce((m, t) => Math.max(m, t.wpm || 0), 0);
  const bestAcc = history.reduce((m, t) => Math.max(m, t.accuracy || 0), 0);

  check('first_test', totalTests >= 1);
  check('tests_10', totalTests >= 10);
  check('tests_25', totalTests >= 25);
  check('tests_50', totalTests >= 50);
  check('tests_100', totalTests >= 100);
  check('wpm_30', bestWpm >= 30);
  check('wpm_40', bestWpm >= 40);
  check('wpm_50', bestWpm >= 50);
  check('wpm_60', bestWpm >= 60);
  check('wpm_80', bestWpm >= 80);
  check('wpm_100', bestWpm >= 100);
  check('acc_90', bestAcc >= 90);
  check('acc_95', bestAcc >= 95);
  check('acc_98', bestAcc >= 98);
  check('acc_100', bestAcc >= 100);
  check('streak_3', (streak?.current || 0) >= 3);
  check('streak_7', (streak?.current || 0) >= 7);
  check('streak_30', (streak?.current || 0) >= 30);
  check('chars_1000', totalChars >= 1000);
  check('chars_10000', totalChars >= 10000);
  check('chars_50000', totalChars >= 50000);
  check('perfect_test', history.some(t => t.accuracy === 100));

  if (newlyUnlocked.length > 0) {
    safeSet(KEYS.ACHIEVEMENTS, unlocked);
  }

  return { unlocked, newlyUnlocked };
}

// ===========================
// AGGREGATE STATS
// ===========================
export function getAggregateStats() {
  const history = getTestHistory();
  const streak = getStreak();

  if (history.length === 0) {
    return {
      bestWpm: 0,
      averageWpm: 0,
      bestAccuracy: 0,
      averageAccuracy: 0,
      testsCompleted: 0,
      totalCharsTyped: 0,
      totalPracticeTime: 0,
      currentStreak: streak.current || 0,
      longestStreak: streak.longest || 0,
    };
  }

  const wpms = history.map(t => t.wpm || 0);
  const accs = history.map(t => t.accuracy || 0);
  const bestWpm = Math.max(...wpms);
  const averageWpm = Math.round(wpms.reduce((s, v) => s + v, 0) / wpms.length);
  const bestAccuracy = Math.max(...accs);
  const averageAccuracy = Math.round((accs.reduce((s, v) => s + v, 0) / accs.length) * 10) / 10;
  const totalCharsTyped = history.reduce((s, t) => s + (t.correctChars || 0), 0);
  const totalPracticeTime = history.reduce((s, t) => s + (t.duration || 0), 0);

  return {
    bestWpm,
    averageWpm,
    bestAccuracy,
    averageAccuracy,
    testsCompleted: history.length,
    totalCharsTyped,
    totalPracticeTime,
    currentStreak: streak.current || 0,
    longestStreak: streak.longest || 0,
  };
}

// ===========================
// RESET ALL
// ===========================
export function resetAllData() {
  Object.values(KEYS).forEach(k => safeRemove(k));
}
