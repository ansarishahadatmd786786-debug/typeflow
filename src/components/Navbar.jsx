import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Target, TrendingUp, Trophy, Settings, Sun, Moon, Monitor, Menu, X, Zap, GraduationCap } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/practice', label: 'Practice', icon: BookOpen },
  { to: '/lessons', label: 'Lessons', icon: GraduationCap },
  { to: '/test', label: 'Test', icon: Target },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
];

function ThemeDropdown({ theme, changeTheme }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = [
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];
  const current = options.find(o => o.value === theme) || options[0];
  const Icon = current.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        <Icon size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-gray-900 border border-white/10 shadow-2xl z-50 overflow-hidden">
          {options.map(opt => {
            const OIcon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => { changeTheme(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                  theme === opt.value
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <OIcon size={14} />
                {opt.label}
                {theme === opt.value && <span className="ml-auto text-indigo-400">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Navbar({ theme, changeTheme }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-gray-950/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center group-hover:bg-indigo-400 transition-colors shadow-md shadow-indigo-500/30">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Type<span className="text-indigo-400">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-indigo-400 bg-indigo-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-0.5">
            <ThemeDropdown theme={theme} changeTheme={changeTheme} />
            <Link
              to="/settings"
              className={`p-2 rounded-lg transition-all ${
                location.pathname === '/settings'
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={18} />
            </Link>
            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-gray-950/98">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-indigo-400 bg-indigo-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
            <Link
              to="/settings"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/settings'
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Settings size={16} />
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
