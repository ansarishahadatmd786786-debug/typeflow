import React from 'react';
import { Bug, Lightbulb, Mail, MessageCircleQuestion } from 'lucide-react';

const reasons = [
  {
    title: 'Feedback',
    description: 'Tell us what is working well or how TypeFlow could be better.',
    icon: MessageCircleQuestion,
  },
  {
    title: 'Questions',
    description: 'Get in touch if you have a question about using TypeFlow.',
    icon: Mail,
  },
  {
    title: 'Bug reports',
    description: 'Let us know if something does not work as expected.',
    icon: Bug,
  },
  {
    title: 'Suggestions',
    description: 'Share ideas for features or improvements you would like to see.',
    icon: Lightbulb,
  },
];

export function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 border-b border-gray-200 pb-7 dark:border-white/10 sm:mb-10 sm:pb-9">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-400">
          Get in touch
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Contact TypeFlow
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-700 dark:text-gray-300">
          We welcome your feedback, questions, bug reports, and suggestions.
          Choose the email link below to contact TypeFlow.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reasons.map(({ title, description, icon: Icon }) => (
          <section
            key={title}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Icon size={19} aria-hidden="true" />
            </div>
            <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-400">
              {description}
            </p>
          </section>
        ))}
      </div>

      <section
        aria-labelledby="email-heading"
        className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:mt-5 sm:p-7"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="email-heading" className="text-lg font-semibold text-gray-900 dark:text-white">
              Email us
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400">
              Your email app will open with a message addressed to TypeFlow.
            </p>
          </div>
          <a
            href="mailto:ansarish8880@gmail.com"
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus-visible:ring-offset-gray-950 sm:self-auto"
          >
            <Mail size={16} aria-hidden="true" />
            ansarish8880@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
