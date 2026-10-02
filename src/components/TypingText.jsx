import React, { useEffect, useLayoutEffect, useRef, useMemo, useState } from 'react';
import { CHAR_STATE } from '../utils/typingUtils';

// Wrap text into display lines at word boundaries
function wrapIntoLines(text, charsPerLine = 55) {
  const lines = [];
  const words = [];
  let startIdx = 0;

  // Split by spaces and newlines while preserving indices
  let i = 0;
  while (i < text.length) {
    if (text[i] === '\n') {
      if (startIdx < i) {
        words.push({ text: text.slice(startIdx, i), start: startIdx });
      }
      words.push({ text: '\n', start: i });
      startIdx = i + 1;
      i++;
    } else if (text[i] === ' ') {
      if (startIdx < i) {
        words.push({ text: text.slice(startIdx, i), start: startIdx });
      }
      words.push({ text: ' ', start: i });
      startIdx = i + 1;
      i++;
    } else {
      i++;
    }
  }
  if (startIdx < text.length) {
    words.push({ text: text.slice(startIdx), start: startIdx });
  }

  // Now build lines
  let currentLine = { chars: [], lineStart: 0 };
  let lineLen = 0;

  for (const word of words) {
    if (word.text === '\n') {
      // newline char itself
      currentLine.chars.push({ char: '\n', index: word.start });
      lines.push(currentLine);
      currentLine = { chars: [], lineStart: word.start + 1 };
      lineLen = 0;
    } else if (word.text === ' ') {
      if (lineLen > 0) {
        currentLine.chars.push({ char: ' ', index: word.start });
        lineLen += 1;
      }
    } else {
      const wordLen = word.text.length;
      if (lineLen > 0 && lineLen + wordLen > charsPerLine) {
        // Start new line
        lines.push(currentLine);
        currentLine = { chars: [], lineStart: word.start };
        lineLen = 0;
      }
      for (let ci = 0; ci < word.text.length; ci++) {
        currentLine.chars.push({ char: word.text[ci], index: word.start + ci });
      }
      lineLen += wordLen;
    }
  }

  if (currentLine.chars.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

export function TypingText({ text, charStates, currentIndex, caretStyle = 'line' }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [charsPerLine, setCharsPerLine] = useState(55);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    if (!container || !textElement) return undefined;

    const updateLineLength = () => {
      const characterWidth = textElement.firstElementChild?.firstElementChild?.getBoundingClientRect().width;
      if (!characterWidth) return;
      setCharsPerLine(Math.max(1, Math.floor(container.clientWidth / characterWidth) - 1));
    };

    const observer = new ResizeObserver(updateLineLength);
    observer.observe(container);
    updateLineLength();
    return () => observer.disconnect();
  }, []);

  const lines = useMemo(() => wrapIntoLines(text, charsPerLine), [text, charsPerLine]);

  // Find current line index
  const currentLineIdx = useMemo(() => {
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      if (line.chars.length === 0) continue;
      const first = line.chars[0].index;
      const last = line.chars[line.chars.length - 1].index;
      if (currentIndex >= first && currentIndex <= last + 1) {
        return li;
      }
    }
    return 0;
  }, [lines, currentIndex]);

  // Show lines: always show 3 lines, centered on current
  const visibleStart = Math.max(0, currentLineIdx - 1);
  const visibleLines = lines.slice(visibleStart, visibleStart + 3);

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ height: '7.25rem' }}
      aria-label="Typing text area"
    >
      {/* Top fade */}
      <div
        className="typing-text-fade-top absolute inset-x-0 top-0 h-5 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(3,7,18,0.98) 0%, transparent 100%)' }}
      />
      {/* Bottom fade */}
      <div
        className="typing-text-fade-bottom absolute inset-x-0 bottom-0 h-5 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(3,7,18,0.98) 0%, transparent 100%)' }}
      />

      <div ref={textRef} className="typing-font text-2xl leading-[2.4rem] font-medium tracking-[0.01em]">
        {visibleLines.map((line, li) => {
          const isCurrentLine = visibleStart + li === currentLineIdx;
          const isPrevLine = visibleStart + li < currentLineIdx;

          return (
            <div
              key={`${visibleStart}-${li}`}
              className={`transition-all duration-200 ${
                isCurrentLine ? 'opacity-100' : isPrevLine ? 'opacity-20' : 'opacity-35'
              }`}
            >
              {line.chars.map(({ char, index }) => {
                const state = charStates[index] || CHAR_STATE.PENDING;
                const isCurrent = index === currentIndex;

                let charClass = '';
                switch (state) {
                  case CHAR_STATE.CORRECT:
                    charClass = 'text-emerald-400';
                    break;
                  case CHAR_STATE.INCORRECT:
                    charClass = char === ' '
                      ? 'bg-red-500/30 rounded-sm'
                      : 'text-red-400';
                    break;
                  case CHAR_STATE.CURRENT:
                  case CHAR_STATE.PENDING:
                    charClass = 'text-gray-100';
                    break;
                  default:
                    charClass = 'text-gray-100';
                }

                return (
                  <span
                    key={index}
                    className={`relative inline-block ${charClass}`}
                  >
                    {isCurrent && (
                      <span className={`typing-current-caret absolute left-0 bg-indigo-300 caret-blink ${
                        caretStyle === 'block'
                          ? 'top-[0.08em] h-[1em] w-[1ch] rounded-sm opacity-50'
                          : caretStyle === 'underline'
                            ? 'bottom-[0.08em] h-[3px] w-[0.8em] rounded-full'
                            : 'top-[0.08em] h-[1.55em] w-[3px] shadow-[0_0_8px_rgba(165,180,252,0.9)] rounded-full'
                      }`} />
                    )}
                    {char === ' ' ? '\u00a0' : char === '\n' ? '↵' : char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
