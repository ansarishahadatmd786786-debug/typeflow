import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, LockKeyhole, RotateCcw } from 'lucide-react';
import { Button } from '../components/Button';
import { TypingTest } from '../components/TypingTest';
import { getLessonProgress, getSettings, saveLessonResult } from '../utils/storage';
import { getLessonFeedback, getLessonRecommendation, LESSONS } from '../utils/lessons';

export function Lessons() {
  const location = useLocation();
  const [progress, setProgress] = useState(() => getLessonProgress());
  const [selectedLessonId, setSelectedLessonId] = useState(() =>
    LESSONS.some(lesson => lesson.id === location.state?.lessonId) ? location.state.lessonId : null
  );
  const settings = getSettings();
  const accuracyThreshold = Number(settings.lessonAccuracyThreshold) || 90;
  const recommendation = useMemo(
    () => getLessonRecommendation(progress, accuracyThreshold),
    [progress, accuracyThreshold],
  );
  const selectedLesson = LESSONS.find(lesson => lesson.id === selectedLessonId);
  const completedCount = LESSONS.filter(lesson => progress.completed[lesson.id]).length;

  const selectLesson = lesson => setSelectedLessonId(lesson.id);

  const handleComplete = result => {
    const updated = saveLessonResult(selectedLesson, result);
    setProgress(updated);
  };

  if (selectedLesson) {
    const lessonIndex = LESSONS.findIndex(lesson => lesson.id === selectedLesson.id);
    const nextLesson = LESSONS[lessonIndex + 1];
    const lastAttempt = progress.attempts[selectedLesson.id];

    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLessonId(null)}>
              <ArrowLeft size={16} />
              All lessons
            </Button>
            <div>
              <p className="text-xs text-indigo-300">Stage {selectedLesson.stage} of {LESSONS.length}</p>
              <h1 className="text-xl font-bold text-white">{selectedLesson.title}</h1>
            </div>
          </div>
          {progress.completed[selectedLesson.id] && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
              <CheckCircle size={16} aria-hidden="true" />
              Completed
            </span>
          )}
        </div>

        <section className="rounded-xl bg-white/5 border border-white/10 p-5">
          <h2 className="font-semibold text-white mb-1">Objective</h2>
          <p className="text-sm text-gray-300">{selectedLesson.objective}</p>
          <p className="text-sm text-gray-500 mt-3">{selectedLesson.instructions}</p>
          {lastAttempt && (
            <p className="text-xs text-gray-500 mt-3">
              Last attempt: {lastAttempt.wpm} WPM · {lastAttempt.accuracy}% accuracy
            </p>
          )}
        </section>

        <TypingTest
          key={selectedLesson.id}
          initialDuration={300}
          initialMode={selectedLesson.practiceMode}
          showSettings={false}
          showKeyboard={settings.showKeyboard !== false}
          showFingers={settings.showFingerGuide !== false}
          fixedText={selectedLesson.passage}
          onComplete={handleComplete}
          renderResultActions={result => (
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                {getLessonFeedback(result, accuracyThreshold)}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  onClick={() => setSelectedLessonId(null)}
                >
                  <RotateCcw size={14} />
                  Browse lessons
                </Button>
                <Button
                  size="sm"
                  className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                  onClick={() => nextLesson && selectLesson(nextLesson)}
                  disabled={!nextLesson}
                  aria-label={nextLesson ? `Continue to ${nextLesson.title}` : 'All lessons complete'}
                >
                  {nextLesson ? `Next: ${nextLesson.title}` : 'All lessons complete'}
                  {nextLesson && <ChevronRight size={14} />}
                </Button>
              </div>
            </div>
          )}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Typing Lessons</h1>
          <p className="text-sm text-gray-500 mt-1">
            Build your skills in stages. Retry any lesson whenever you like.
          </p>
        </div>
        <p className="text-sm text-gray-400" aria-live="polite">
          {completedCount} of {LESSONS.length} lessons completed
        </p>
      </header>

      <section className="rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-5">
        <p className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
          {recommendation.retry ? 'Suggested practice' : 'Continue learning'}
        </p>
        <h2 className="text-lg font-semibold text-white">{recommendation.lesson.title}</h2>
        <p className="text-sm text-gray-400 mt-1">{recommendation.message}</p>
        <Button
          className="mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
          size="sm"
          onClick={() => selectLesson(recommendation.lesson)}
        >
          {recommendation.retry ? 'Retry suggested lesson' : 'Start suggested lesson'}
          <ChevronRight size={15} />
        </Button>
      </section>

      <div className="space-y-3">
        {LESSONS.map(lesson => {
          const completion = progress.completed[lesson.id];
          const attempt = progress.attempts[lesson.id];
          return (
            <article
              key={lesson.id}
              className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  completion ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-gray-400'
                }`}>
                  {completion
                    ? <CheckCircle size={18} aria-label="Completed" />
                    : <span className="text-sm font-semibold">{lesson.stage}</span>}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Stage {lesson.stage}</p>
                  <h2 className="font-semibold text-white">{lesson.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{lesson.objective}</p>
                  {attempt && (
                    <p className="text-xs text-gray-600 mt-1">
                      Latest: {attempt.wpm} WPM · {attempt.accuracy}% accuracy
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant={completion ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => selectLesson(lesson)}
                className="w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label={`${completion ? 'Review' : 'Start'} ${lesson.title}`}
              >
                {completion ? 'Review' : 'Start lesson'}
                {completion ? <RotateCcw size={14} /> : <ChevronRight size={14} />}
              </Button>
            </article>
          );
        })}
      </div>

      <p className="flex items-center gap-2 text-xs text-gray-600">
        <LockKeyhole size={13} aria-hidden="true" />
        Accuracy targets guide recommendations only. Every lesson stays available.
      </p>
    </div>
  );
}
