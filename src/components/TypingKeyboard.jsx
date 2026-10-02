import React from 'react';
import { FINGER_COLORS, KEY_FINGER_MAP, keysMatch } from '../utils/fingerGuide';

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space'],
];

const KEY_WIDTHS = {
  'Backspace': 'w-8 sm:w-16',
  'Tab': 'w-8 sm:w-14',
  '\\': 'w-8 sm:w-14',
  'Caps': 'w-8 sm:w-16',
  'Enter': 'w-9 sm:w-20',
  'Shift': 'w-9 sm:w-24',
  'Space': 'flex-1',
};

function Key({ keyLabel, isPressed, isNext, showFingers }) {
  const widthClass = KEY_WIDTHS[keyLabel] || 'w-[1.35rem] sm:w-10';
  const fingerClass = showFingers && KEY_FINGER_MAP[keyLabel.toLowerCase()]
    ? FINGER_COLORS[KEY_FINGER_MAP[keyLabel.toLowerCase()]]
    : 'bg-gray-800/80 border-gray-700/50';

  const displayLabel = keyLabel === 'Space' ? '' : keyLabel === 'Backspace' ? '⌫' : keyLabel;

  return (
    <div
      className={`
        ${widthClass} h-8 sm:h-10 rounded-md border text-[9px] sm:text-xs flex items-center justify-center
        font-medium transition-all duration-75 select-none cursor-default
        ${isPressed
          ? 'bg-indigo-500 border-indigo-400 text-white scale-95 shadow-lg shadow-indigo-500/30'
          : isNext
            ? 'bg-indigo-500/20 border-indigo-400/60 text-indigo-300 shadow-sm shadow-indigo-500/20'
            : showFingers && KEY_FINGER_MAP[keyLabel.toLowerCase()]
              ? `${fingerClass} text-gray-300`
              : 'bg-gray-800/80 border-gray-700/50 text-gray-400'
        }
      `}
    >
      {displayLabel}
    </div>
  );
}

export function TypingKeyboard({ pressedKey, nextKey, showFingers = false }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      {/* Finger legend */}
      {showFingers && (
        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {[
            { label: 'L. Pinky', color: 'bg-pink-500/30 border-pink-500/50' },
            { label: 'L. Ring', color: 'bg-purple-500/30 border-purple-500/50' },
            { label: 'L. Middle', color: 'bg-blue-500/30 border-blue-500/50' },
            { label: 'L. Index', color: 'bg-cyan-500/30 border-cyan-500/50' },
            { label: 'R. Index', color: 'bg-green-500/30 border-green-500/50' },
            { label: 'R. Middle', color: 'bg-yellow-500/30 border-yellow-500/50' },
            { label: 'R. Ring', color: 'bg-orange-500/30 border-orange-500/50' },
            { label: 'R. Pinky', color: 'bg-red-500/30 border-red-500/50' },
          ].map(f => (
            <span key={f.label} className={`text-xs px-2 py-0.5 rounded border ${f.color} text-gray-300`}>
              {f.label}
            </span>
          ))}
        </div>
      )}

      {/* Keyboard rows */}
      <div className="space-y-1 sm:space-y-1.5">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-px sm:gap-1.5 justify-center">
            {row.map((key, keyIndex) => {
              const isPressed = keysMatch(key, pressedKey);
              const isNext = keysMatch(key, nextKey);

              return (
                <Key
                  key={`${key}-${keyIndex}`}
                  keyLabel={key}
                  isPressed={isPressed}
                  isNext={isNext && !isPressed}
                  showFingers={showFingers}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
