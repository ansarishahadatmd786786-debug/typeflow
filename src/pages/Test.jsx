import React from 'react';
import { TypingTest } from '../components/TypingTest';
import { getSettings } from '../utils/storage';

export function Test() {
  const settings = getSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Typing Test</h1>
        <p className="text-gray-500 text-sm mt-1">
          Test your typing speed and accuracy. Start when you are ready.
        </p>
      </div>

      <TypingTest
        initialDuration={settings.defaultDuration || 60}
        initialMode={settings.defaultPracticeMode || 'intermediate'}
        showSettings={true}
        showKeyboard={settings.showKeyboard !== false}
        showFingers={settings.showFingerGuide !== false}
      />
    </div>
  );
}
