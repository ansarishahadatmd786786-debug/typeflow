import React from 'react';
import { HardDrive, Mail, RefreshCw, ShieldCheck, Users, WifiOff } from 'lucide-react';

const sections = [
  {
    id: 'information',
    title: 'Information we handle',
    icon: ShieldCheck,
    content: (
      <>
        <p>
          TypeFlow is a typing practice app. In the current version, typing progress,
          settings, achievements, and related preferences are stored locally in your
          browser using localStorage.
        </p>
        <p>
          This can include test performance summaries (such as speed and accuracy),
          practice streaks, daily practice, lesson progress, achievements, and app
          preferences. Test history stores result details such as the date, speed,
          accuracy, character and error counts, duration, and practice mode. It does
          not store the passage text or a per-key keystroke log. Daily practice
          tracking stores accumulated practice time and a recent activity timestamp,
          not the keys typed.
        </p>
      </>
    ),
  },
  {
    id: 'local-storage',
    title: 'Local storage and your choices',
    icon: HardDrive,
    content: (
      <>
        <p>
          This information stays in the browser profile on the device where you use
          TypeFlow. It is not an account or a cloud-backed copy, and it may be
          available to anyone who can use that browser profile.
        </p>
        <p>
          You can remove locally saved information by clearing this site’s browser
          storage. Doing so may erase your saved progress and preferences. Browser
          storage behavior and controls depend on the browser you use.
        </p>
      </>
    ),
  },
  {
    id: 'third-parties',
    title: 'Third-party services',
    icon: WifiOff,
    content: (
      <>
        <p>
          The current version does not provide user accounts, cloud syncing, or
          payment processing. The app code does not include analytics or advertising
          integrations, and it does not send saved practice records to a third-party
          service.
        </p>
        <p>
          TypeFlow uses browser features to run and cache the app for offline use.
          The app makes same-site requests to load its pages and resources. The
          website host necessarily receives those requests and may keep server logs;
          its handling of request data depends on the hosting provider.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children’s privacy',
    icon: Users,
    content: (
      <p>
        TypeFlow does not ask you to create an account or submit personal profile
        details to use the current app. Progress saved in a browser remains on that
        device, including when the user is a child. A parent or guardian can clear
        the site’s browser storage using the browser’s controls.
      </p>
    ),
  },
  {
    id: 'updates',
    title: 'Policy updates',
    icon: RefreshCw,
    content: (
      <p>
        TypeFlow may add features that change how information is handled. If that
        happens, this Privacy Policy will be updated to describe the changed
        practices. Please check this page for the latest version.
      </p>
    ),
  },
];

export function Privacy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 border-b border-gray-200 pb-7 dark:border-white/10 sm:mb-10 sm:pb-9">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-400">
          TypeFlow
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Last updated: October 2, 2026</p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-700 dark:text-gray-300">
          This page explains what the current version of TypeFlow stores and how
          that information is handled.
        </p>
      </header>

      <div className="space-y-4 sm:space-y-5">
        {sections.map(({ id, title, icon: Icon, content }) => (
          <section
            key={id}
            aria-labelledby={`${id}-heading`}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-7"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Icon size={19} aria-hidden="true" />
              </span>
              <h2
                id={`${id}-heading`}
                className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl"
              >
                {title}
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-7 text-gray-700 dark:text-gray-400 sm:text-base">
              {content}
            </div>
          </section>
        ))}

        <section
          aria-labelledby="contact-heading"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-400/20 dark:bg-amber-400/[0.06] sm:p-7"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
              <Mail size={19} aria-hidden="true" />
            </span>
            <h2 id="contact-heading" className="text-lg font-semibold text-amber-950 dark:text-white sm:text-xl">
              Contact
            </h2>
          </div>
          <p className="text-sm leading-7 text-amber-950 dark:text-gray-300 sm:text-base">
            Contact email:{' '}
            <a
              href="mailto:ansarish8880@gmail.com"
              className="font-medium text-indigo-700 underline decoration-indigo-300 underline-offset-4 transition-colors hover:text-indigo-900 dark:text-indigo-300 dark:decoration-indigo-500 dark:hover:text-indigo-200"
            >
              ansarish8880@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
