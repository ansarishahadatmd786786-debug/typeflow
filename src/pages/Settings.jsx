import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Monitor, Volume2, VolumeX, Keyboard, Eye, Timer, Hand, Trash2, RefreshCw, ChevronRight, Download, Upload, CircleCheck, CircleAlert } from 'lucide-react';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  createBackup,
  getSettings,
  restoreBackup,
  saveSettings,
  clearTestHistory,
  resetAllData,
  validateBackup,
} from '../utils/storage';

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
        checked ? 'bg-indigo-500' : 'bg-white/10'
      }`}
      aria-checked={checked}
      aria-label={label}
      role="switch"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function SettingRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon size={16} className="text-gray-400" />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium text-white">{label}</div>
          {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
        </div>
      </div>
      <div className="flex w-full flex-shrink-0 justify-end sm:w-auto">
        {children}
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</h2>
      {children}
    </div>
  );
}

export function Settings({ theme, changeTheme }) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => getSettings());
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pendingBackup, setPendingBackup] = useState(null);
  const [backupMessage, setBackupMessage] = useState(null);
  const fileInputRef = useRef(null);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleClearHistory = () => {
    clearTestHistory();
    setConfirmClearHistory(false);
    navigate('/');
  };

  const handleResetAll = () => {
    resetAllData();
    setConfirmResetAll(false);
    // Reload to reset the app state
    window.location.href = '/';
  };

  const handleExportBackup = () => {
    try {
      const backup = createBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `typeflow-backup-${date}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setBackupMessage({ type: 'success', text: 'Backup exported successfully.' });
    } catch (error) {
      setBackupMessage({
        type: 'error',
        text: `Could not export backup. ${error.message || 'Check browser storage and try again.'}`,
      });
    }
  };

  const handleBackupFile = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBackupMessage(null);
    try {
      const content = await file.text();
      const backup = JSON.parse(content);
      validateBackup(backup);
      setPendingBackup(backup);
    } catch (error) {
      setPendingBackup(null);
      setBackupMessage({
        type: 'error',
        text: error instanceof SyntaxError
          ? 'This file is not valid JSON. Choose a TypeFlow backup file and try again.'
          : error.message || 'The selected file could not be validated.',
      });
    }
  };

  const handleConfirmRestore = () => {
    try {
      restoreBackup(pendingBackup);
      const restoredSettings = getSettings();
      setSettings(restoredSettings);
      changeTheme(restoredSettings.theme, { persist: false });
      setPendingBackup(null);
      setBackupMessage({ type: 'success', text: 'Backup restored successfully.' });
    } catch (error) {
      setPendingBackup(null);
      setBackupMessage({
        type: 'error',
        text: error.message || 'Could not restore this backup. Your existing data was not changed.',
      });
    }
  };

  const THEME_OPTIONS = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const DURATION_OPTIONS = [
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' },
    { value: 300, label: '5 minutes' },
  ];

  const MODE_OPTIONS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'speed', label: 'Speed Challenge' },
    { value: 'accuracy', label: 'Accuracy Challenge' },
    { value: 'difficult', label: 'Difficult Words' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'special', label: 'Special Characters' },
    { value: 'programming', label: 'Programming' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Customize your TypeFlow experience</p>
        </div>
        {saved && (
          <span className="text-xs text-emerald-400 animate-pulse">✓ Saved</span>
        )}
      </div>

      {/* Appearance */}
      <SectionCard title="Appearance">
        <SettingRow icon={Sun} label="Theme" description="Choose your preferred color scheme">
          <div className="flex flex-wrap justify-end gap-2">
            {THEME_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    changeTheme(opt.value);
                    updateSetting('theme', opt.value);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    theme === opt.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={12} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </SettingRow>
      </SectionCard>

      {/* Typing Preferences */}
      <SectionCard title="Typing Preferences">
        <SettingRow
          icon={Volume2}
          label="Sound Effects"
          description="Play subtle sounds while typing"
        >
          <ToggleSwitch
            checked={settings.soundEnabled}
            onChange={v => updateSetting('soundEnabled', v)}
            label="Sound Effects"
          />
        </SettingRow>

        <SettingRow
          icon={Keyboard}
          label="Show Keyboard"
          description="Display the on-screen keyboard visualization"
        >
          <ToggleSwitch
            checked={settings.showKeyboard}
            onChange={v => updateSetting('showKeyboard', v)}
            label="Show Keyboard"
          />
        </SettingRow>

        <SettingRow
          icon={Eye}
          label="Show Next Key"
          description="Highlight the next expected key on the keyboard"
        >
          <ToggleSwitch
            checked={settings.showNextKey}
            onChange={v => updateSetting('showNextKey', v)}
            label="Show Next Key"
          />
        </SettingRow>

        <SettingRow
          icon={Hand}
          label="Finger Guide"
          description="Show finger placement and next-finger guidance"
        >
          <ToggleSwitch
            checked={settings.showFingerGuide}
            onChange={v => updateSetting('showFingerGuide', v)}
            label="Finger Guide"
          />
        </SettingRow>

        <SettingRow
          icon={Timer}
          label="Show Timer"
          description="Display the countdown timer during tests"
        >
          <ToggleSwitch
            checked={settings.showTimer}
            onChange={v => updateSetting('showTimer', v)}
            label="Show Timer"
          />
        </SettingRow>

        <SettingRow
          label="Caret Style"
          description="Choose how your position is indicated"
        >
          <div className="flex gap-2">
            {[
              { value: 'line', label: '|' },
              { value: 'block', label: '▌' },
              { value: 'underline', label: '_' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => updateSetting('caretStyle', opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${
                  settings.caretStyle === opt.value
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </SettingRow>
      </SectionCard>

      {/* Test Defaults */}
      <SectionCard title="Test Defaults">
        <SettingRow label="Default Duration" description="Duration used for new typing tests">
          <select
            value={settings.defaultDuration}
            onChange={e => updateSetting('defaultDuration', parseInt(e.target.value))}
            className="w-full max-w-full bg-white/10 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5 text-sm cursor-pointer sm:w-auto"
          >
            {DURATION_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </SettingRow>

        <SettingRow label="Default Practice Mode" description="Mode selected when you open the test page">
          <select
            value={settings.defaultPracticeMode}
            onChange={e => updateSetting('defaultPracticeMode', e.target.value)}
            className="w-full max-w-full bg-white/10 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5 text-sm cursor-pointer sm:w-auto"
          >
            {MODE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </SettingRow>
      </SectionCard>

      <SectionCard title="Practice Goals">
        <SettingRow
          label="Daily practice target"
          description="Choose how many minutes of active typing to aim for"
        >
          <select
            value={[5, 10, 15, 20].includes(Number(settings.dailyPracticeGoalMinutes))
              ? Number(settings.dailyPracticeGoalMinutes)
              : 15}
            onChange={e => updateSetting('dailyPracticeGoalMinutes', parseInt(e.target.value, 10))}
            aria-label="Daily practice target"
            className="w-full max-w-full bg-white/10 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:w-auto"
          >
            {[5, 10, 15, 20].map(minutes => (
              <option key={minutes} value={minutes}>{minutes} minutes</option>
            ))}
          </select>
        </SettingRow>
        <SettingRow
          label="Lesson accuracy target"
          description="Used for lesson recommendations, never as a lock"
        >
          <select
            value={[80, 85, 90, 95, 100].includes(Number(settings.lessonAccuracyThreshold))
              ? Number(settings.lessonAccuracyThreshold)
              : 90}
            onChange={e => updateSetting('lessonAccuracyThreshold', parseInt(e.target.value, 10))}
            aria-label="Lesson accuracy recommendation target"
            className="w-full max-w-full bg-white/10 border border-white/10 text-gray-300 rounded-lg px-3 py-1.5 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:w-auto"
          >
            {[80, 85, 90, 95, 100].map(accuracy => (
              <option key={accuracy} value={accuracy}>{accuracy}%</option>
            ))}
          </select>
        </SettingRow>
      </SectionCard>

      {/* Data Management */}
      <SectionCard title="Data">
        <SettingRow
          icon={Download}
          label="Export Backup"
          description="Download your history, settings, streaks, goals, achievements, and lesson progress as JSON."
        >
          <Button variant="outline" size="sm" onClick={handleExportBackup}>
            <Download size={14} />
            Export
          </Button>
        </SettingRow>

        <SettingRow
          icon={Upload}
          label="Restore Backup"
          description="Validate and restore a previously exported TypeFlow JSON backup."
        >
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleBackupFile}
              className="sr-only"
              aria-label="Choose TypeFlow backup JSON file"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} />
              Choose file
            </Button>
          </>
        </SettingRow>

        {backupMessage && (
          <div
            role={backupMessage.type === 'error' ? 'alert' : 'status'}
            aria-live={backupMessage.type === 'error' ? 'assertive' : 'polite'}
            className={`flex items-start gap-2 py-3 text-sm ${
              backupMessage.type === 'error' ? 'text-red-300' : 'text-emerald-300'
            }`}
          >
            {backupMessage.type === 'error'
              ? <CircleAlert size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
              : <CircleCheck size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />}
            <span>{backupMessage.text}</span>
          </div>
        )}

        <SettingRow
          icon={Trash2}
          label="Clear Test History"
          description="Remove all test results. Stats and achievements are preserved."
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmClearHistory(true)}
            className="text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            Clear History
          </Button>
        </SettingRow>

        <SettingRow
          icon={RefreshCw}
          label="Reset All Progress"
          description="Permanently remove all data including history, achievements, and settings."
        >
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmResetAll(true)}
          >
            Reset Everything
          </Button>
        </SettingRow>
      </SectionCard>

      {/* About */}
      <SectionCard title="About">
        <div className="py-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">App</span>
            <span className="text-white font-medium">TypeFlow</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Version</span>
            <span className="text-gray-400">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Storage</span>
            <span className="text-gray-400">LocalStorage (browser)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tagline</span>
            <span className="text-gray-400">Type faster. Type smarter.</span>
          </div>
        </div>
      </SectionCard>

      {/* Confirm dialogs */}
      <ConfirmDialog
        isOpen={Boolean(pendingBackup)}
        title="Restore TypeFlow Backup?"
        message="Restoring replaces the TypeFlow data currently stored in this browser, including history, settings, achievements, streaks, daily goals, and lesson progress. This cannot be undone. Continue only if this is the backup you want to restore."
        confirmLabel="Restore Backup"
        onConfirm={handleConfirmRestore}
        onCancel={() => {
          setPendingBackup(null);
          setBackupMessage({ type: 'success', text: 'Restore canceled. Your existing data was not changed.' });
        }}
      />

      <ConfirmDialog
        isOpen={confirmClearHistory}
        title="Clear Test History"
        message="This will permanently remove all your test results. Your achievements and streak will be preserved. This cannot be undone."
        confirmLabel="Clear History"
        onConfirm={handleClearHistory}
        onCancel={() => setConfirmClearHistory(false)}
      />

      <ConfirmDialog
        isOpen={confirmResetAll}
        title="Reset All Progress"
        message="This will permanently remove your typing history, achievements, streak, and all settings. This cannot be undone."
        confirmLabel="Reset Everything"
        onConfirm={handleResetAll}
        onCancel={() => setConfirmResetAll(false)}
      />
    </div>
  );
}
