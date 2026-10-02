import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PracticeCard } from '../components/PracticeCard';
import { TypingTest } from '../components/TypingTest';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';
import { getSettings } from '../utils/storage';

const PRACTICE_MODES = [
  {
    id: 'beginner',
    icon: '🌱',
    title: 'Beginner',
    description: 'Learn proper finger placement and build typing confidence.',
    difficulty: 'Beginner',
    badge: 'Start here',
  },
  {
    id: 'intermediate',
    icon: '⚡',
    title: 'Intermediate',
    description: 'Standard sentences and common vocabulary. The most balanced practice mode.',
    difficulty: 'Intermediate',
  },
  {
    id: 'advanced',
    icon: '🔥',
    title: 'Advanced',
    description: 'Complex sentences with punctuation, less common words, and longer passages.',
    difficulty: 'Advanced',
  },
  {
    id: 'speed',
    icon: '🚀',
    title: 'Speed Challenge',
    description: 'Push your maximum typing speed.',
    difficulty: 'Challenge',
    badge: '🎯 Max speed',
  },
  {
    id: 'accuracy',
    icon: '🎯',
    title: 'Accuracy Challenge',
    description: 'Focus on typing correctly with fewer mistakes.',
    difficulty: 'Challenge',
    badge: '💎 High precision',
  },
  {
    id: 'difficult',
    icon: '📚',
    title: 'Difficult Words',
    description: 'Practice words that commonly slow you down.',
    difficulty: 'Advanced',
  },
  {
    id: 'numbers',
    icon: '🔢',
    title: 'Numbers',
    description: 'Build confidence with number-row typing.',
    difficulty: 'Specialized',
    badge: '0-9',
  },
  {
    id: 'special',
    icon: '⌨️',
    title: 'Special Characters',
    description: 'Practice punctuation and symbols.',
    difficulty: 'Specialized',
    badge: '!@#$',
  },
  {
    id: 'programming',
    icon: '💻',
    title: 'Programming',
    description: 'Practice code-style text and programming characters.',
    difficulty: 'Specialized',
    badge: '</> Code',
  },
];

export function Practice() {
  const navigate = useNavigate();
  const settings = getSettings();
  const [selectedMode, setSelectedMode] = useState(null);

  const handleStartMode = (modeId) => {
    setSelectedMode(modeId);
  };

  const handleBack = () => {
    setSelectedMode(null);
  };

  if (selectedMode) {
    const mode = PRACTICE_MODES.find(m => m.id === selectedMode);
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {mode.icon} {mode.title}
            </h1>
            <p className="text-gray-500 text-sm">{mode.description}</p>
          </div>
        </div>

        <TypingTest
          initialDuration={settings.defaultDuration || 60}
          initialMode={selectedMode}
          showSettings={true}
          showKeyboard={settings.showKeyboard !== false}
          showFingers={settings.showFingerGuide !== false}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Practice Modes</h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose a practice mode tailored to your skill level and goals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRACTICE_MODES.map(mode => (
          <PracticeCard
            key={mode.id}
            icon={mode.icon}
            title={mode.title}
            description={mode.description}
            difficulty={mode.difficulty}
            badge={mode.badge}
            onClick={() => handleStartMode(mode.id)}
          />
        ))}
      </div>

      {/* Tips section */}
      <div className="mt-8 rounded-xl bg-white/5 border border-white/10 p-5">
        <h2 className="font-semibold text-white mb-3">Practice Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '🎯', tip: 'Prioritize accuracy first, then work on increasing your pace.' },
            { icon: '⌨️', tip: 'Keep your fingers on the home row (ASDF JKL;) at all times.' },
            { icon: '👀', tip: 'When you feel comfortable, try looking at the screen instead of your keyboard.' },
            { icon: '🔄', tip: 'Practice regularly at a pace that fits your schedule.' },
          ].map(item => (
            <div key={item.icon} className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <p className="text-sm text-gray-400">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
