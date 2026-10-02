import React, { useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Practice } from './pages/Practice';
import { Test } from './pages/Test';
import { Progress } from './pages/Progress';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { Lessons } from './pages/Lessons';
import { NotFound } from './pages/NotFound';
import { Privacy } from './pages/Privacy';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { useTheme } from './hooks/useTheme';

function AppContent({ theme, changeTheme }) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-gray-50 text-gray-900'
        : 'bg-gray-950 text-white'
    }`}>
      <Navbar theme={theme} changeTheme={changeTheme} />
      <main className="pb-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/test" element={<Test />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings theme={theme} changeTheme={changeTheme} />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className={`border-t px-4 py-5 text-sm ${
        theme === 'light'
          ? 'border-gray-200 text-gray-500'
          : 'border-white/[0.06] text-gray-500'
      }`}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>TypeFlow</span>
          <nav aria-label="Footer">
            <div className="flex items-center gap-5">
              <Link
                to="/about"
                className="transition-colors hover:text-indigo-400"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="transition-colors hover:text-indigo-400"
              >
                Contact
              </Link>
              <Link
                to="/privacy"
                className="transition-colors hover:text-indigo-400"
              >
                Privacy Policy
              </Link>
            </div>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const { theme, changeTheme } = useTheme();

  return (
    <BrowserRouter>
      <AppContent theme={theme} changeTheme={changeTheme} />
    </BrowserRouter>
  );
}
