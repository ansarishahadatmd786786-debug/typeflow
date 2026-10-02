export const FINGER_LABELS = {
  'left-pinky': 'Left Pinky',
  'left-ring': 'Left Ring',
  'left-middle': 'Left Middle',
  'left-index': 'Left Index',
  'right-index': 'Right Index',
  'right-middle': 'Right Middle',
  'right-ring': 'Right Ring',
  'right-pinky': 'Right Pinky',
  thumb: 'Thumb',
};

export const FINGER_COLORS = {
  'left-pinky': 'bg-pink-500/30 border-pink-500/50',
  'left-ring': 'bg-purple-500/30 border-purple-500/50',
  'left-middle': 'bg-blue-500/30 border-blue-500/50',
  'left-index': 'bg-cyan-500/30 border-cyan-500/50',
  'right-index': 'bg-green-500/30 border-green-500/50',
  'right-middle': 'bg-yellow-500/30 border-yellow-500/50',
  'right-ring': 'bg-orange-500/30 border-orange-500/50',
  'right-pinky': 'bg-red-500/30 border-red-500/50',
  thumb: 'bg-gray-500/30 border-gray-500/50',
};

export const KEY_FINGER_MAP = {
  '`': 'left-pinky',
  '1': 'left-pinky',
  q: 'left-pinky',
  a: 'left-pinky',
  z: 'left-pinky',

  '2': 'left-ring',
  w: 'left-ring',
  s: 'left-ring',
  x: 'left-ring',

  '3': 'left-middle',
  e: 'left-middle',
  d: 'left-middle',
  c: 'left-middle',

  '4': 'left-index',
  r: 'left-index',
  f: 'left-index',
  v: 'left-index',

  '5': 'left-index',
  t: 'left-index',
  g: 'left-index',
  b: 'left-index',

  '6': 'right-index',
  y: 'right-index',
  h: 'right-index',
  n: 'right-index',

  '7': 'right-index',
  u: 'right-index',
  j: 'right-index',
  m: 'right-index',

  '8': 'right-middle',
  i: 'right-middle',
  k: 'right-middle',
  ',': 'right-middle',

  '9': 'right-ring',
  o: 'right-ring',
  l: 'right-ring',
  '.': 'right-ring',

  '0': 'right-pinky',
  p: 'right-pinky',
  ';': 'right-pinky',
  '/': 'right-pinky',

  '-': 'right-pinky',
  '[': 'right-pinky',
  "'": 'right-pinky',
  '=': 'right-pinky',
  ']': 'right-pinky',
  '\\': 'right-pinky',

  ' ': 'thumb',
};

const SHIFTED_KEY_MAP = {
  '~': '`',
  '!': '1',
  '@': '2',
  '#': '3',
  $: '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',

  _: '-',
  '+': '=',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
};

export function normalizeTypingKey(key = '') {
  // Prevent crashes when the keyboard receives null/undefined.
  if (key == null) {
    return '';
  }

  if (key === 'Space') {
    return ' ';
  }

  const stringKey = String(key);

  return SHIFTED_KEY_MAP[stringKey] || stringKey.toLowerCase();
}

export function getFingerForKey(key) {
  const normalizedKey = normalizeTypingKey(key);

  return KEY_FINGER_MAP[normalizedKey] || null;
}

export function keysMatch(keyLabel, key) {
  return normalizeTypingKey(keyLabel) === normalizeTypingKey(key);
}