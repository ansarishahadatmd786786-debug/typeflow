import { useState, useEffect, useRef, useCallback } from 'react';
import { generateText } from '../utils/textGenerator';
import { calculateWPM, calculateAccuracy, calculateConsistency, CHAR_STATE } from '../utils/typingUtils';
import {
  saveTestResult,
  recordMeaningfulPractice,
  recordPracticeKeystroke,
  checkAndUnlockAchievements,
  getStreak,
} from '../utils/storage';

export const TEST_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  FINISHED: 'finished',
};

export function useTypingTest({ duration = 60, mode = 'intermediate', text: fixedText, onComplete } = {}) {
  const [text, setText] = useState(() => fixedText || generateText(mode, duration));
  const [charStates, setCharStates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState(TEST_STATUS.IDLE);
  const [isPracticeReady, setIsPracticeReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [result, setResult] = useState(null);
  const [wpmHistory, setWpmHistory] = useState([]);

  // Refs for performance-critical values (avoid stale closures in timer)
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const correctCharsRef = useRef(0);
  const totalTypedRef = useRef(0);
  const errorsRef = useRef(0);
  const currentIndexRef = useRef(0);
  const charStatesRef = useRef([]);
  const wpmHistoryRef = useRef([]);
  const statusRef = useRef(TEST_STATUS.IDLE);
  const textRef = useRef(text);
  const lastWpmSampleRef = useRef(0);
  const lastKeyActivityRef = useRef(null);
  const activePracticeSecondsRef = useRef(0);

  // Initialize char states when text changes
  useEffect(() => {
    const states = new Array(text.length).fill(CHAR_STATE.PENDING);
    if (states.length > 0) states[0] = CHAR_STATE.CURRENT;
    setCharStates(states);
    charStatesRef.current = states;
    textRef.current = text;
  }, [text]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const recordActiveKeystroke = useCallback(() => {
    const now = Date.now();
    const activeSeconds = recordPracticeKeystroke(lastKeyActivityRef.current, now);
    activePracticeSecondsRef.current += activeSeconds;
    lastKeyActivityRef.current = now;
  }, []);

  const finishTest = useCallback((completedText = false) => {
    if (statusRef.current === TEST_STATUS.FINISHED) return;
    statusRef.current = TEST_STATUS.FINISHED;
    setStatus(TEST_STATUS.FINISHED);
    stopTimer();

    const elapsed = startTimeRef.current
      ? Math.max(0.5, (Date.now() - startTimeRef.current) / 1000)
      : duration;

    const usedDuration = Math.min(elapsed, duration);
    const finalCorrectChars = correctCharsRef.current;
    const finalTotalTyped = totalTypedRef.current;
    const finalErrors = errorsRef.current;
    const finalWpm = calculateWPM(finalCorrectChars, usedDuration);
    const finalAccuracy = calculateAccuracy(finalCorrectChars, finalTotalTyped);
    const consistency = calculateConsistency(wpmHistoryRef.current);

    const testResult = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      correctChars: finalCorrectChars,
      incorrectChars: finalErrors,
      totalChars: finalTotalTyped,
      errors: finalErrors,
      duration,
      mode: 'time',
      practiceMode: mode,
      activePracticeSeconds: Math.round(activePracticeSecondsRef.current * 10) / 10,
      completedText,
      consistency,
    };

    const savedEntry = saveTestResult(testResult);
    if (completedText) recordMeaningfulPractice();
    const streak = getStreak();
    const { newlyUnlocked } = checkAndUnlockAchievements({}, streak);

    const finalResult = { ...testResult, id: savedEntry.id, newlyUnlocked };
    setResult(finalResult);
    setWpm(finalWpm);
    setAccuracy(finalAccuracy);

    if (onComplete) {
      onComplete(finalResult);
    }
  }, [duration, mode, onComplete, stopTimer]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    lastWpmSampleRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      const remaining = Math.max(0, duration - elapsed);

      setTimeLeft(Math.ceil(remaining));

      // Update live WPM smoothly
      const liveWpm = calculateWPM(correctCharsRef.current, Math.max(1, elapsed));
      setWpm(liveWpm);

      // Record WPM sample every 5 seconds
      const secsSinceLastSample = (now - lastWpmSampleRef.current) / 1000;
      if (secsSinceLastSample >= 5) {
        wpmHistoryRef.current.push(liveWpm);
        setWpmHistory([...wpmHistoryRef.current]);
        lastWpmSampleRef.current = now;
      }

      if (remaining <= 0) {
        finishTest();
      }
    }, 100);
  }, [duration, finishTest]);

  const handleKeyPress = useCallback((key) => {
    if (statusRef.current === TEST_STATUS.FINISHED) return;
    if (!isPracticeReady) return;

    const currentText = textRef.current;
    const idx = currentIndexRef.current;

    if (key === 'Backspace') {
      if (idx <= 0) return;

      const prevIdx = idx - 1;
      const states = [...charStatesRef.current];

      // Can only backspace if previous char was incorrect
      if (states[prevIdx] === CHAR_STATE.INCORRECT) {
        recordActiveKeystroke();
        states[prevIdx] = CHAR_STATE.CURRENT;
        states[idx] = CHAR_STATE.PENDING;

        currentIndexRef.current = prevIdx;
        charStatesRef.current = states;
        setCurrentIndex(prevIdx);
        setCharStates([...states]);
      }
      return;
    }

    // Ignore control/function keys
    if (key.length > 1 && key !== 'Enter') return;

    // Start test on first meaningful keypress
    if (statusRef.current === TEST_STATUS.IDLE) {
      statusRef.current = TEST_STATUS.RUNNING;
      setStatus(TEST_STATUS.RUNNING);
      startTimer();
    }

    if (idx >= currentText.length) return;

    recordActiveKeystroke();
    const expectedChar = currentText[idx];
    
    // Handle Enter key as newline
    const typedChar = key === 'Enter' ? '\n' : key;
    const isCorrect = typedChar === expectedChar;

    const states = [...charStatesRef.current];
    states[idx] = isCorrect ? CHAR_STATE.CORRECT : CHAR_STATE.INCORRECT;

    // Update typed counters
    totalTypedRef.current += 1;
    if (isCorrect) {
      correctCharsRef.current += 1;
    } else {
      errorsRef.current += 1;
    }

    const nextIdx = idx + 1;
    currentIndexRef.current = nextIdx;

    if (nextIdx < currentText.length) {
      states[nextIdx] = CHAR_STATE.CURRENT;
    }

    charStatesRef.current = states;
    setCharStates([...states]);
    setCurrentIndex(nextIdx);
    setCorrectChars(correctCharsRef.current);
    setTotalTyped(totalTypedRef.current);
    setErrors(errorsRef.current);

    // Update accuracy live
    const acc = calculateAccuracy(correctCharsRef.current, totalTypedRef.current);
    setAccuracy(acc);

    // Check if text is complete
    if (nextIdx >= currentText.length) {
      finishTest(true);
    }
  }, [startTimer, finishTest, isPracticeReady, recordActiveKeystroke]);

  const startPractice = useCallback(() => {
    if (statusRef.current !== TEST_STATUS.FINISHED) {
      setIsPracticeReady(true);
    }
  }, []);

  const resetTest = useCallback((newMode, newDuration) => {
    stopTimer();

    // Reset all refs
    statusRef.current = TEST_STATUS.IDLE;
    currentIndexRef.current = 0;
    correctCharsRef.current = 0;
    totalTypedRef.current = 0;
    errorsRef.current = 0;
    wpmHistoryRef.current = [];
    startTimeRef.current = null;
    lastWpmSampleRef.current = 0;
    lastKeyActivityRef.current = null;
    activePracticeSecondsRef.current = 0;

    // Reset all state
    setStatus(TEST_STATUS.IDLE);
    setIsPracticeReady(false);
    setCurrentIndex(0);
    setTimeLeft(newDuration !== undefined ? newDuration : duration);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCorrectChars(0);
    setTotalTyped(0);
    setResult(null);
    setWpmHistory([]);

    // Generate new text
    const modeToUse = newMode !== undefined ? newMode : mode;
    const durToUse = newDuration !== undefined ? newDuration : duration;
    const newText = fixedText || generateText(modeToUse, durToUse);
    setText(newText);
  }, [duration, fixedText, mode, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Calculate progress
  const progress = text.length > 0 ? Math.min(100, (currentIndex / text.length) * 100) : 0;

  return {
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
    wpmHistory,
    progress,
    handleKeyPress,
    startPractice,
    resetTest,
  };
}
