import React from 'react';
import { Hand } from 'lucide-react';
import { FINGER_COLORS, FINGER_LABELS, getFingerForKey } from '../utils/fingerGuide';

const FINGER_GROUPS = [
  ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
  ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
];

function formatKey(key) {
  if (key === ' ') return 'Space';
  if (key === '\n') return 'Enter';
  return key?.toUpperCase();
}

export function FingerGuide({ nextKey, showNextKey = true }) {
  const finger = getFingerForKey(nextKey);

  return (
    <section className="rounded-xl bg-white/5 border border-white/10 p-4" aria-label="Finger placement guide">
      {showNextKey && nextKey && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-3 mb-3 border-b border-white/10">
          <span className="text-sm text-gray-400">Next key: <strong className="text-white font-semibold">{formatKey(nextKey)}</strong></span>
          <span className="text-sm text-gray-400">Use: <strong className="text-indigo-300 font-semibold">{finger ? FINGER_LABELS[finger] : 'Shift / symbol key'}</strong></span>
        </div>
      )}
      <div className="flex items-center justify-center gap-2 mb-3 text-xs font-medium text-gray-300">
        <Hand size={15} className="text-indigo-400" aria-hidden="true" />
        Finger Placement
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        {FINGER_GROUPS.map((group, index) => (
          <div key={index} className="space-y-1.5">
            {group.map(id => (
              <div key={id} className={`rounded-md border px-2 py-1 text-[11px] text-gray-200 ${FINGER_COLORS[id]}`}>
                {FINGER_LABELS[id]}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-gray-500">Thumbs: Space</p>
    </section>
  );
}
