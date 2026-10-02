// Web Audio API based sound effects
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(frequency, duration, type = 'sine', volume = 0.05) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors
  }
}

export const sounds = {
  keyPress: () => playTone(800, 0.04, 'sine', 0.04),
  keyError: () => playTone(200, 0.08, 'square', 0.06),
  testComplete: () => {
    playTone(523, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 120);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.1), 240);
  },
  achievement: () => {
    playTone(523, 0.08, 'sine', 0.08);
    setTimeout(() => playTone(659, 0.08, 'sine', 0.08), 80);
    setTimeout(() => playTone(784, 0.08, 'sine', 0.08), 160);
    setTimeout(() => playTone(1047, 0.15, 'sine', 0.08), 240);
  },
};

let soundEnabled = false;

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
}

export function playSound(name) {
  if (!soundEnabled) return;
  if (sounds[name]) {
    sounds[name]();
  }
}
