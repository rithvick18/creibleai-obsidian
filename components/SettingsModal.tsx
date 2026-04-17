import React, { useState, useEffect, useRef } from 'react';
import { AppSettings } from '../types';

type Provider = 'gemini' | 'mistral' | 'grok';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

const PROVIDER_META: Record<Provider, { label: string; icon: string; color: string; placeholder: string }> = {
  gemini: {
    label: 'Gemini',
    icon: 'auto_awesome',
    color: '#4285F4',
    placeholder: 'AIza...',
  },
  mistral: {
    label: 'Mistral',
    icon: 'wind_power',
    color: '#FF7043',
    placeholder: 'sk-...',
  },
  grok: {
    label: 'Grok',
    icon: 'psychology',
    color: '#9C27B0',
    placeholder: 'xai-...',
  },
};

const KEY_MAP: Record<Provider, keyof AppSettings> = {
  gemini: 'geminiKey',
  mistral: 'mistralKey',
  grok: 'grokKey',
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider>(settings.provider as Provider);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // When modal opens or provider changes, load the saved key for that provider
  useEffect(() => {
    if (isOpen) {
      setSelectedProvider(settings.provider as Provider);
      setSaved(false);
      setShowKey(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const keyField = KEY_MAP[selectedProvider];
    const stored = localStorage.getItem(`creible_${keyField}`) ?? (settings[keyField] as string) ?? '';
    setApiKey(stored);
    setSaved(false);
    setShowKey(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [selectedProvider]);

  const handleSave = () => {
    const keyField = KEY_MAP[selectedProvider];

    // Persist the key individually
    localStorage.setItem(`creible_${keyField}`, apiKey.trim());

    // Update global settings
    const updated: AppSettings = {
      ...settings,
      provider: selectedProvider,
      [keyField]: apiKey.trim(),
    };
    setSettings(updated);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter') handleSave();
  };

  const meta = PROVIDER_META[selectedProvider];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#16161c] border border-white/10 rounded-3xl shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        {/* Top glow bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl transition-all duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ color: meta.color }}>
                settings
              </span>
            </div>
            <div>
              <h2 className="text-[17px] font-bold font-headline text-white tracking-tight">AI Provider Settings</h2>
              <p className="text-[11px] text-white/40 font-label uppercase tracking-widest mt-0.5">
                Configure your API key
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-7 space-y-5">
          {/* Provider Dropdown */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.18em] font-label flex items-center gap-2">
              <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
              Provider
            </label>
            <div className="relative">
              <select
                id="provider-select"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as Provider)}
                className="w-full bg-[#0e0e14] border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-[14px] font-body appearance-none focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                {(Object.keys(PROVIDER_META) as Provider[]).map((p) => (
                  <option key={p} value={p}>
                    {PROVIDER_META[p].label}
                  </option>
                ))}
              </select>
              {/* Custom chevron */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-[16px] text-white/30">expand_more</span>
              </div>
              {/* Provider color accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300"
                style={{ background: meta.color }}
              />
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label
              htmlFor="api-key-input"
              className="text-[11px] font-bold text-white/40 uppercase tracking-[0.18em] font-label flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[13px]">key</span>
              API Key — <span style={{ color: meta.color }}>{meta.label}</span>
            </label>
            <div className="relative group">
              <input
                ref={inputRef}
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={meta.placeholder}
                className="w-full bg-[#0e0e14] border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-[14px] font-mono placeholder:text-white/15 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-white/20 hover:text-white/60 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showKey ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="text-[10px] text-white/25 leading-relaxed pl-0.5">
              Keys are stored only in your browser's localStorage — never sent to our servers.
            </p>
          </div>

          {/* Currently active provider hint */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ color: meta.color, fontVariationSettings: "'FILL' 1" }}
            >
              {meta.icon}
            </span>
            <span className="text-[11px] text-white/40 font-label">
              Active:&nbsp;
              <span className="text-white/70 font-bold">{meta.label}</span>
              {apiKey.trim()
                ? ` · Key ending in …${apiKey.trim().slice(-4)}`
                : ' · No key saved'}
            </span>
          </div>

          {/* Save Button */}
          <button
            id="save-settings-btn"
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-[14px] font-headline tracking-wide transition-all duration-300 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: saved ? '#10b981' : `linear-gradient(135deg, ${meta.color}dd, ${meta.color}88)`,
              boxShadow: saved ? '0 0 30px rgba(16,185,129,0.3)' : `0 0 30px ${meta.color}30`,
            }}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {saved ? 'check_circle' : 'save'}
            </span>
            {saved ? 'Saved!' : 'Save & Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
