import React, { useRef, useEffect, useCallback, useState } from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import { useTypingTest, TEST_STATUS } from '../hooks/useTypingTest';
import { TypingText } from './TypingText';
import { TypingKeyboard } from './TypingKeyboard';
import { FingerGuide } from './FingerGuide';
import { ResultCard } from './ResultCard';
import { Button } from './Button';
import { formatTime } from '../utils/typingUtils';
import { playSound, setSoundEnabled } from '../utils/sounds';
import { getSettings } from '../utils/storage';

function StatDisplay({ label, value, highlight = false }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold tabular-nums ${highlight ? 'text-indigo-400' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">{label}</div>
    </div>
  );
}

const DURATION_OPTIONS = [
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '2m', value: 120 },
  { label: '5m', value: 300 },
];

export function TypingTest({
  initialDuration = 60,
  initialMode = 'intermediate',
  showSettings = true,
  showKeyboard: showKeyboardProp = true,
  showFingers = false,
  fixedText,
  onComplete,
  renderResultActions,
}) {
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [showKeyboard, setShowKeyboard] = useState(showKeyboardProp);
  const [pressedKey, setPressedKey] = useState(null);
  const [typingSettings] = useState(() => getSettings());
  const inputRef = useRef(null);
  const pressedKeyTimerRef = useRef(null);

  // Initialize sound settings
  useEffect(() => {
    const settings = getSettings();
    setSoundEnabled(settings.soundEnabled || false);
  }, []);

  const {
    text,
    charStates,
    currentIndex,
    status,
    isPracticeReady,
    timeLeft,
    wpm,
    accuracy,
    errors,
    correctChars,
    totalTyped,
    result,
    progress,
    handleKeyPress,
    startPractice,
    resetTest,
  } = useTypingTest({
    duration: selectedDuration,
    mode: selectedMode,
    text: fixedText,
    onComplete,
  });

  // Next expected character
  const nextChar = text[currentIndex] || null;

  // Focus the hidden input
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isPracticeReady && status !== TEST_STATUS.FINISHED) {
      focusInput();
    }
  }, [status, isPracticeReady, focusInput]);

  const handleKeyDown = useCallback((e) => {
    // Prevent page scroll on space/arrow
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }

    if (!isPracticeReady) return;

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key;

    // Show pressed key on keyboard
    setPressedKey(key);
    clearTimeout(pressedKeyTimerRef.current);
    pressedKeyTimerRef.current = setTimeout(() => setPressedKey(null), 150);

    // Play a key or error sound based on the expected character.
    if (key !== 'Backspace' && key.length === 1) {
      playSound(key === nextChar ? 'keyPress' : 'keyError');
    }

    handleKeyPress(key);
  }, [handleKeyPress, resetTest, selectedMode, selectedDuration, focusInput, isPracticeReady, nextChar]);

  const handleStartPractice = () => {
    startPractice();
    setTimeout(focusInput, 0);
  };

  // Cleanup
  useEffect(() => {
    return () => clearTimeout(pressedKeyTimerRef.current);
  }, []);

  const handleDurationChange = (dur) => {
    setSelectedDuration(dur);
    resetTest(selectedMode, dur);
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setSelectedMode(newMode);
    resetTest(newMode, selectedDuration);
  };

  const handleRetry = () => {
    resetTest(selectedMode, selectedDuration);
  };

  const handleNewTest = () => {
    resetTest(selectedMode, selectedDuration);
  };

  const getTimerColor = () => {
    const pct = timeLeft / selectedDuration;
    if (pct > 0.5) return 'text-white';
    if (pct > 0.25) return 'text-amber-400';
    return 'text-red-400';
  };

  if (status === TEST_STATUS.FINISHED && result) {
    return (
      <div className="w-full">
        <ResultCard result={result} onRetry={handleRetry} onNewTest={handleNewTest} />
        {renderResultActions && (
          <div className="max-w-2xl mx-auto mt-3">
            {renderResultActions(result)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Settings row */}
      {showSettings && (
        <div className="flex flex-wrap items-center gap-3">
          {/* Duration selector */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
            {DURATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleDurationChange(opt.value)}
                disabled={status === TEST_STATUS.RUNNING}
                aria-pressed={selectedDuration === opt.value}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  selectedDuration === opt.value
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Mode selector */}
          <select
            value={selectedMode}
            onChange={handleModeChange}
            disabled={status === TEST_STATUS.RUNNING}
            aria-label="Select practice mode"
            className="bg-white/5 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-white/10 transition-colors"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="speed">Speed Challenge</option>
            <option value="accuracy">Accuracy Challenge</option>
            <option value="difficult">Difficult Words</option>
            <option value="numbers">Numbers</option>
            <option value="special">Special Characters</option>
            <option value="programming">Programming</option>
          </select>

          <div className="flex-1" />

          {/* Keyboard toggle */}
          <button
            onClick={() => setShowKeyboard(p => !p)}
            aria-pressed={showKeyboard}
            aria-label={`${showKeyboard ? 'Hide' : 'Show'} on-screen keyboard`}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
              showKeyboard
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
            }`}
          >
            Keyboard
          </button>

          {/* Restart */}
          <button
            onClick={handleRetry}
            aria-label="Restart test"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-all"
            title="Restart test"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-6 py-4">
        <StatDisplay label="WPM" value={wpm} highlight />
        <div className="w-px h-8 bg-white/10" />
        <StatDisplay label="Accuracy" value={`${accuracy}%`} />
        {typingSettings.showTimer && (
          <>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className={`text-3xl font-bold tabular-nums ${status === TEST_STATUS.RUNNING ? getTimerColor() : 'text-white'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 uppercase tracking-wider">Time Left</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
          </>
        )}
        <StatDisplay label="Errors" value={errors} />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Typing area */}
      <div
        className={`
          relative border rounded-2xl p-6 cursor-text overflow-hidden
          transition-all duration-200
          ${status === TEST_STATUS.IDLE ? 'min-h-[26rem] max-sm:min-h-[28rem]' : ''}
          ${status === TEST_STATUS.IDLE
            ? 'bg-gray-950 border-white/10 hover:border-indigo-500/40'
            : status === TEST_STATUS.RUNNING
              ? 'bg-gray-950 border-indigo-500/30'
              : 'bg-gray-950 border-white/10'
          }
        `}
        onClick={isPracticeReady ? focusInput : undefined}
      >
        {/* Hidden input for capturing keypresses */}
        <input
          ref={inputRef}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
          readOnly
          aria-label="Typing input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        <TypingText
          text={text}
          charStates={charStates}
          currentIndex={currentIndex}
          caretStyle={typingSettings.caretStyle}
        />

        {/* Start prompt overlay */}
        {!isPracticeReady && (
          <div className="typing-start-overlay absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-950/45">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto mb-3">
                <Zap size={20} className="text-indigo-400" />
              </div>
              <p className="text-white font-medium">Ready to practice?</p>
              <p className="text-gray-500 text-sm mt-1 mb-4">Start when you are ready. Your timer begins with your first character.</p>
              <Button
                onClick={handleStartPractice}
                size="md"
                aria-label="Start Practice"
                className="absolute bottom-4 left-1/2 -translate-x-1/2"
              >
                <Zap size={16} />
                Start Practice
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard */}
      {showKeyboard && (
        <div>
          <TypingKeyboard
            pressedKey={pressedKey}
            nextKey={typingSettings.showNextKey ? nextChar : null}
            showFingers={showFingers && typingSettings.showFingerGuide !== false}
          />
        </div>
      )}

      {showFingers && typingSettings.showFingerGuide !== false && (
        <FingerGuide nextKey={nextChar} showNextKey={typingSettings.showNextKey} />
      )}

      {/* Tips for idle state */}
      {!isPracticeReady && (
        <p className="text-center text-xs text-gray-600">
          Press Start Practice to enable typing · Use the Restart button to start over
        </p>
      )}
    </div>
  );
}
