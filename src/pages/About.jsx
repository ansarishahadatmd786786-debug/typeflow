import React from 'react';
import { BookOpen, ChartNoAxesCombined, Keyboard, Target, Trophy } from 'lucide-react';

const features = [
  {
    title: 'Typing practice',
    description: 'Choose focused practice modes for words, punctuation, numbers, or programming-style text.',
    icon: Keyboard,
  },
  {
    title: 'Structured lessons',
    description: 'Work through typing lessons and keep track of your lesson attempts and completions.',
    icon: BookOpen,
  },
  {
    title: 'Speed tests',
    description: 'Complete timed typing tests and review your speed, accuracy, and other results.',
    icon: Target,
  },
  {
    title: 'Progress tracking',
    description: 'Review your test history, practice activity, and progress over time.',
    icon: ChartNoAxesCombined,
  },
  {
    title: 'Achievements',
    description: 'See achievements earned through your practice and typing milestones.',
    icon: Trophy,
  },
];

export function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 border-b border-gray-200 pb-7 dark:border-white/10 sm:mb-10 sm:pb-9">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-400">
          About TypeFlow
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Build your typing skills, one practice at a time.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-700 dark:text-gray-300">
          TypeFlow is a typing practice and speed improvement website. It brings
          practice, lessons, tests, and progress tracking together so you can work
          on typing at your own pace.
        </p>
      </header>

      <section
        aria-labelledby="who-its-for-heading"
        className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:mb-10 sm:p-7"
      >
        <h2
          id="who-its-for-heading"
          className="text-xl font-semibold text-gray-900 dark:text-white"
        >
          Who TypeFlow is for
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-700 dark:text-gray-400 sm:text-base">
          Whether you are learning to type, returning to regular practice, or
          looking to improve your speed and accuracy, TypeFlow offers tools to
          support your individual practice. Choose a lesson or practice mode, take
          a speed test, and use your results to guide what you work on next.
        </p>
      </section>

      <section aria-labelledby="features-heading">
        <div className="mb-4 sm:mb-5">
          <h2
            id="features-heading"
            className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl"
          >
            What you can do with TypeFlow
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
            The current TypeFlow experience includes:
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Icon size={19} aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
