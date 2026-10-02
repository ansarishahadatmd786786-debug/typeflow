export const LESSON_ACCURACY_DEFAULT = 90;

export const LESSONS = [
  {
    id: 'home-row',
    stage: 1,
    title: 'Home row',
    objective: 'Build a relaxed, accurate reach from the home-row keys.',
    instructions: 'Rest your fingers on ASDF and JKL;. Return to the home row after each reach.',
    passage: 'asdf jkl; asdf jkl; fjdk sl;a asdf jkl; fdsa ;lkj',
    practiceMode: 'beginner',
  },
  {
    id: 'top-row',
    stage: 2,
    title: 'Top-row letters',
    objective: 'Reach to the top row while keeping your fingers anchored.',
    instructions: 'Use the finger guide for each reach, then bring your fingers back to the home row.',
    passage: 'qwer uiop qwerty poiuy trewq iop qwe rty uio p',
    practiceMode: 'beginner',
  },
  {
    id: 'bottom-row',
    stage: 3,
    title: 'Bottom-row letters',
    objective: 'Practice smooth reaches to the bottom row.',
    instructions: 'Keep your wrists relaxed and use the correct finger for each key.',
    passage: 'zxcv nm,. zxcv nm,. cvbn m,./ xzcv ,mnb',
    practiceMode: 'beginner',
  },
  {
    id: 'row-combinations',
    stage: 4,
    title: 'Row combinations',
    objective: 'Move between rows without losing your home-row position.',
    instructions: 'Type each short phrase steadily. Prioritize clean transitions over speed.',
    passage: 'ask the dad; fall; glad; jump; quick; vex a fox.',
    practiceMode: 'intermediate',
  },
  {
    id: 'common-words',
    stage: 5,
    title: 'Common words',
    objective: 'Build rhythm with familiar words and short word groups.',
    instructions: 'Keep an even pace through each word and use the space bar with your thumb.',
    passage: 'the quick brown dog will make a good friend and play in the warm sun.',
    practiceMode: 'intermediate',
  },
  {
    id: 'capitals-punctuation',
    stage: 6,
    title: 'Capitals and punctuation',
    objective: 'Coordinate Shift with letters and common punctuation.',
    instructions: 'Use the opposite Shift key from the hand typing a capital letter.',
    passage: 'Ready, set, type! Keep your hands relaxed, and make each letter count.',
    practiceMode: 'intermediate',
  },
  {
    id: 'numbers-symbols',
    stage: 7,
    title: 'Numbers and symbols',
    objective: 'Reach for numbers and familiar symbols with control.',
    instructions: 'Look at the next key, reach deliberately, and return to the home row.',
    passage: 'Room 24 costs $18.50; save 10% today! Call 555-0142.',
    practiceMode: 'numbers',
  },
  {
    id: 'sentences-paragraphs',
    stage: 8,
    title: 'Sentences and paragraphs',
    objective: 'Apply comfortable rhythm and accuracy to connected writing.',
    instructions: 'Read a few words ahead, keep a steady pace, and let accuracy guide your speed.',
    passage: 'A steady practice habit is built one focused session at a time. Keep your shoulders loose, your fingers close to the keys, and your eyes on the words ahead. When you make a mistake, reset your rhythm and continue with care.',
    practiceMode: 'advanced',
  },
];

export function getLessonRecommendation(progress, accuracyThreshold = LESSON_ACCURACY_DEFAULT) {
  const attempts = Object.values(progress?.attempts || {});
  const latestAttempt = attempts
    .filter(attempt => attempt?.attemptedAt)
    .sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt))[0];

  if (latestAttempt && latestAttempt.accuracy < accuracyThreshold) {
    const lesson = LESSONS.find(item => item.id === latestAttempt.lessonId);
    if (lesson) {
      return {
        lesson,
        retry: true,
        message: `Your last result was ${latestAttempt.accuracy}% accuracy. Retry this lesson at a comfortable pace; the suggested target is ${accuracyThreshold}%.`,
      };
    }
  }

  const lesson = LESSONS.find(item => !progress?.completed?.[item.id]) || LESSONS[LESSONS.length - 1];
  if (progress?.completed && LESSONS.every(item => progress.completed[item.id])) {
    return {
      lesson,
      retry: true,
      message: 'You have completed every lesson. Revisit this paragraph to keep your practice varied.',
    };
  }

  return {
    lesson,
    retry: false,
    message: latestAttempt
      ? `Your last attempt reached ${latestAttempt.accuracy}% accuracy. Continue with the next lesson when you are ready.`
      : 'Start with the home row and work through each stage at your own pace.',
  };
}

export function getLessonFeedback(result, accuracyThreshold = LESSON_ACCURACY_DEFAULT) {
  if (result.accuracy < accuracyThreshold) {
    return `You typed at ${result.wpm} WPM with ${result.accuracy}% accuracy. Slow down slightly and focus on matching each character; ${accuracyThreshold}% is a suggested target, not a requirement.`;
  }
  return `You typed at ${result.wpm} WPM with ${result.accuracy}% accuracy. Your accuracy meets the suggested ${accuracyThreshold}% target; you can continue or retry for practice.`;
}
