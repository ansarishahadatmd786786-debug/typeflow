import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../utils/storage';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const settings = getSettings();
    return settings.theme || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (t) => {
      if (t === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else if (t === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        // system
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          root.classList.remove('light');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      }
    };

    applyTheme(theme);

    // Listen for system theme changes
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const changeTheme = (newTheme, { persist = true } = {}) => {
    setTheme(newTheme);
    if (persist) {
      const settings = getSettings();
      saveSettings({ ...settings, theme: newTheme });
    }
  };

  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return { theme, changeTheme, isDark };
}
