import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';

export function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center sm:px-12">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
          <SearchX size={26} aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">404</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base">
          We couldn’t find the page you were looking for. It may have moved, or the address may be incorrect.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
