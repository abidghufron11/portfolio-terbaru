import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Sliders, RefreshCw, Sparkles, X, Sun, Moon, Info, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Localized translation definitions for the accessibility panel to coordinate perfectly with the app
const TRANSLATIONS = {
  en: {
    panelTitle: "Accessibility Engine",
    panelSubtitle: "Dark Reader Filters",
    enableFilter: "Enable Accessibility Filter",
    optimizeMode: "Invert Colors (Dark Reader Mode)",
    optimizeModeSub: "Smart color inversion keeps images intact",
    brightness: "Brightness",
    contrast: "Contrast",
    sepia: "Warmth (Sepia)",
    grayscale: "Monochrome (Grayscale)",
    hueRotate: "Color Shift (Hue Rotate)",
    presetsTitle: "Accessibility Presets",
    presetDefault: "Default Off",
    presetHighContrast: "High Contrast",
    presetWarmNight: "Warm Night (Sepia)",
    presetMono: "Monochrome / Grayscale",
    presetInverted: "Inverted Dark Reader",
    resetBtn: "Reset Filter Mode",
    infoText: "Adjust visual contrast, brightness, or set custom tint properties to optimize readability on your monitor.",
    ariaClose: "Close Accessibility Settings",
    ariaOpen: "Open Accessibility Options",
    statusEnabled: "Active Filter",
    statusDisabled: "Standard Theme",
    shortcutsBtn: "Keyboard Shortcuts Legend",
    shortcutsTitle: "Keyboard Shortcuts",
    shortcutTab: "Tab",
    shortcutTabDesc: "Navigate focus forward",
    shortcutShiftTab: "Shift+Tab",
    shortcutShiftTabDesc: "Navigate focus backward",
    shortcutArrows: "Arrows ← →",
    shortcutArrowsDesc: "Adjust filter sliders",
    shortcutEsc: "Esc",
    shortcutEscDesc: "Close panel/details",
    shortcutQuestion: "?",
    shortcutQuestionDesc: "Toggle keyboard shortcuts"
  },
  id: {
    panelTitle: "Mesin Aksesibilitas",
    panelSubtitle: "Filter Pembaca Gelap",
    enableFilter: "Aktifkan Filter Aksesibilitas",
    optimizeMode: "Inversi Warna (Mode Dark Reader)",
    optimizeModeSub: "Inversi cerdas menjaga foto tetap normal",
    brightness: "Kecerahan",
    contrast: "Kontras",
    sepia: "Kehangatan (Sepia)",
    grayscale: "Monokrom (Skala Abu)",
    hueRotate: "Rotasi Warna (Ubah Rona)",
    presetsTitle: "Preset Aksesibilitas",
    presetDefault: "Baku (Mati)",
    presetHighContrast: "Kontras Tinggi",
    presetWarmNight: "Malam Hangat (Sepia)",
    presetMono: "Monokrom / Skala Abu",
    presetInverted: "Mode Balik Gelap/Terang",
    resetBtn: "Setel Ulang Filter",
    infoText: "Sesuaikan kontras visual, kecerahan, atau atur tingkat rona hangat demi membaca dengan nyaman di layar monitor Anda.",
    ariaClose: "Tutup Pengaturan Aksesibilitas",
    ariaOpen: "Buka Pilihan Aksesibilitas",
    statusEnabled: "Filter Sedang Aktif",
    statusDisabled: "Tema Standar",
    shortcutsBtn: "Legenda Pintasan Keyboard",
    shortcutsTitle: "Pintasan Keyboard",
    shortcutTab: "Tab",
    shortcutTabDesc: "Navigasi fokus maju",
    shortcutShiftTab: "Shift+Tab",
    shortcutShiftTabDesc: "Navigasi fokus mundur",
    shortcutArrows: "Panah ← →",
    shortcutArrowsDesc: "Sesuaikan slider filter",
    shortcutEsc: "Esc",
    shortcutEscDesc: "Tutup panel/detail",
    shortcutQuestion: "?",
    shortcutQuestionDesc: "Buka/tutup info pintasan"
  }
};

export default function AccessibilityControls() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem('a11y_panel_open') === 'true';
  });

  const [showShortcuts, setShowShortcuts] = useState(false);

  // Track panel open/close state persistently in localStorage
  useEffect(() => {
    localStorage.setItem('a11y_panel_open', String(isOpen));
  }, [isOpen]);
  
  // Accessibility Filter States (hydrated from localStorage)
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem('a11y_filter_enabled') === 'true';
  });
  const [brightness, setBrightness] = useState(() => {
    return Number(localStorage.getItem('a11y_brightness') || '100');
  });
  const [contrast, setContrast] = useState(() => {
    return Number(localStorage.getItem('a11y_contrast') || '100');
  });
  const [sepia, setSepia] = useState(() => {
    return Number(localStorage.getItem('a11y_sepia') || '0');
  });
  const [grayscale, setGrayscale] = useState(() => {
    return Number(localStorage.getItem('a11y_grayscale') || '0');
  });
  const [hueRotate, setHueRotate] = useState(() => {
    return Number(localStorage.getItem('a11y_huerotate') || '0');
  });
  const [invert, setInvert] = useState(() => {
    return localStorage.getItem('a11y_invert') === 'true';
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Apply filters on Document Root element
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('a11y_filter_enabled', String(enabled));
    
    if (enabled) {
      localStorage.setItem('a11y_brightness', String(brightness));
      localStorage.setItem('a11y_contrast', String(contrast));
      localStorage.setItem('a11y_sepia', String(sepia));
      localStorage.setItem('a11y_grayscale', String(grayscale));
      localStorage.setItem('a11y_huerotate', String(hueRotate));
      localStorage.setItem('a11y_invert', String(invert));

      // Construct CSS filter string matching true Dark Reader logic
      // e.g. brightness(100%) contrast(100%) sepia(20%) grayscale(0%) hue-rotate(0deg) invert(1)
      const filterStr = [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        `sepia(${sepia}%)`,
        `grayscale(${grayscale}%)`,
        `hue-rotate(${hueRotate}deg)`,
        invert ? 'invert(1) hue-rotate(180deg)' : ''
      ].filter(Boolean).join(' ');

      root.style.setProperty('--accessibility-filter', filterStr);
      root.classList.add('access-filter-active');
    } else {
      root.style.removeProperty('--accessibility-filter');
      root.classList.remove('access-filter-active');
    }
  }, [enabled, brightness, contrast, sepia, grayscale, hueRotate, invert]);

  // Handle escape globally to close the panel cleanly and "?" to toggle shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else {
          setIsOpen(false);
          toggleBtnRef.current?.focus();
        }
      } else if (e.key === '?' || (e.key === '/' && !e.shiftKey)) {
        // Prevent key triggers if user is actively writing text in an input/textarea
        const isWriting = document.activeElement && (
          (document.activeElement.tagName === 'INPUT' && (document.activeElement as HTMLInputElement).type !== 'range') ||
          document.activeElement.tagName === 'TEXTAREA'
        );
        if (!isWriting) {
          e.preventDefault();
          setShowShortcuts(prev => !prev);
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showShortcuts]);

  // Click outside to close accessibility settings panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Preset Applicator
  const applyPreset = (presetName: 'default' | 'highContrast' | 'warmNight' | 'mono' | 'inverted') => {
    setEnabled(true);
    switch (presetName) {
      case 'default':
        setEnabled(false);
        setBrightness(100);
        setContrast(100);
        setSepia(0);
        setGrayscale(0);
        setHueRotate(0);
        setInvert(false);
        break;
      case 'highContrast':
        setBrightness(95);
        setContrast(130);
        setSepia(5);
        setGrayscale(0);
        setHueRotate(0);
        setInvert(false);
        break;
      case 'warmNight':
        setBrightness(85);
        setContrast(90);
        setSepia(65);
        setGrayscale(10);
        setHueRotate(0);
        setInvert(false);
        break;
      case 'mono':
        setBrightness(100);
        setContrast(115);
        setSepia(0);
        setGrayscale(100);
        setHueRotate(0);
        setInvert(false);
        break;
      case 'inverted':
        setBrightness(95);
        setContrast(110);
        setSepia(15);
        setGrayscale(0);
        setHueRotate(0);
        setInvert(true);
        break;
    }
  };

  const resetAll = () => {
    applyPreset('default');
  };

  return (
    <div className="relative font-sans antialiased text-left">
      {/* Floating Accessibility Trigger Button */}
      <button
        ref={toggleBtnRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={t.ariaOpen}
        title={t.ariaOpen}
        className={`fixed bottom-6 right-20 z-[60] p-3 rounded-full shadow-[0_4px_15px_rgba(255,101,0,0.15)] border transition-all duration-300 outline-none cursor-pointer flex items-center justify-center ${
          enabled 
            ? 'bg-primary border-primary text-black shadow-[0_4px_20px_rgba(255,101,0,0.55)]' 
            : 'bg-bg-card border-navy-blue text-gray-400 hover:text-primary hover:border-primary/50'
        }`}
      >
        <Eye className={`w-5 h-5 ${enabled ? 'animate-pulse' : ''}`} />
        {enabled && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border border-primary" />
        )}
      </button>

      {/* Settings Modal/Card Slider Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 z-[60] w-full max-w-[340px] max-h-[calc(100vh-120px)] rounded-2xl border border-navy-blue/90 bg-bg-card/95 backdrop-blur-md shadow-2xl shadow-black/90 pointer-events-auto flex flex-col overflow-hidden"
          >
            {/* Header section with branding accent and close button */}
            <div className="flex items-center justify-between p-4 pb-2.5 border-b border-navy-blue/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/15 text-primary">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight font-sans">{t.panelTitle}</h3>
                  <p className="text-[10px] text-gray-400 font-mono tracking-wide uppercase">{t.panelSubtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    showShortcuts
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-bg-base/70 border-navy-blue text-gray-500 hover:text-white'
                  }`}
                  aria-label={t.shortcutsBtn}
                  title={t.shortcutsBtn}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-bg-base/70 border border-navy-blue text-gray-500 hover:text-white transition-all cursor-pointer"
                  aria-label={t.ariaClose}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3.5 custom-a11y-scrollbar text-left">
              {/* User instruction banner */}
              <p className="text-[10.5px] text-gray-400 leading-normal font-sans border border-navy-blue/30 bg-bg-base/20 p-2.5 rounded-lg">
                {t.infoText}
              </p>

              {/* Keyboard Shortcuts Legend Panel */}
              <AnimatePresence>
                {showShortcuts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 14 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden border border-primary/30 bg-primary/5 rounded-xl p-3"
                  >
                    <h4 className="text-[11px] font-bold text-white mb-2 flex items-center gap-1.5 uppercase tracking-wider font-sans">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                      {t.shortcutsTitle}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-gray-400 font-sans">{t.shortcutTabDesc}</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-bg-base border border-navy-blue text-[10px] text-white font-mono shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {t.shortcutTab}
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-gray-400 font-sans">{t.shortcutShiftTabDesc}</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-bg-base border border-navy-blue text-[10px] text-white font-mono shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {t.shortcutShiftTab}
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-gray-400 font-sans">{t.shortcutArrowsDesc}</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-bg-base border border-navy-blue text-[10px] text-white font-mono shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {t.shortcutArrows}
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-gray-400 font-sans">{t.shortcutEscDesc}</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-bg-base border border-navy-blue text-[10px] text-white font-mono shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {t.shortcutEsc}
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-gray-400 font-sans">{t.shortcutQuestionDesc}</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-bg-base border border-navy-blue text-[10px] text-white font-mono shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {t.shortcutQuestion}
                        </kbd>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Master Toggle */}
              <div className="flex items-center justify-between gap-4 py-1.5 border-b border-navy-blue/20">
                <span className="text-xs font-bold text-gray-300 font-sans">{t.enableFilter}</span>
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer outline-none ${
                    enabled ? 'bg-primary' : 'bg-navy-blue'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                      enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Filters Area */}
              <div className={`space-y-3.5 ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none select-none'} transition-all duration-300`}>
                
                {/* Presets Grid */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block font-sans">{t.presetsTitle}</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => applyPreset('highContrast')}
                      className="px-2 py-1 text-[10px] text-left rounded-md bg-navy-blue/35 border border-navy-blue hover:border-primary/50 text-white font-sans transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sliders className="w-2.5 h-2.5 text-primary shrink-0" />
                      <span className="truncate">{t.presetHighContrast}</span>
                    </button>
                    <button
                      onClick={() => applyPreset('warmNight')}
                      className="px-2 py-1 text-[10px] text-left rounded-md bg-navy-blue/35 border border-navy-blue hover:border-primary/50 text-white font-sans transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sun className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                      <span className="truncate">{t.presetWarmNight}</span>
                    </button>
                    <button
                      onClick={() => applyPreset('inverted')}
                      className="px-2 py-1 text-[10px] text-left rounded-md bg-navy-blue/35 border border-navy-blue hover:border-primary/50 text-white font-sans transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Moon className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{t.presetInverted}</span>
                    </button>
                    <button
                      onClick={() => applyPreset('mono')}
                      className="px-2 py-1 text-[10px] text-left rounded-md bg-navy-blue/35 border border-navy-blue hover:border-primary/50 text-white font-sans transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{t.presetMono}</span>
                    </button>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="space-y-2.5 pt-2 border-t border-navy-blue/10">
                  {/* Brightness */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] font-sans text-gray-400">
                      <span>{t.brightness}</span>
                      <span className="font-mono text-white text-[10px]">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => {
                        setBrightness(Number(e.target.value));
                        setEnabled(true);
                      }}
                      className="w-full accent-primary h-1 rounded bg-bg-base cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] font-sans text-gray-400">
                      <span>{t.contrast}</span>
                      <span className="font-mono text-white text-[10px]">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => {
                        setContrast(Number(e.target.value));
                        setEnabled(true);
                      }}
                      className="w-full accent-primary h-1 rounded bg-bg-base cursor-pointer"
                    />
                  </div>

                  {/* Sepia */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] font-sans text-gray-400">
                      <span>{t.sepia}</span>
                      <span className="font-mono text-white text-[10px]">{sepia}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sepia}
                      onChange={(e) => {
                        setSepia(Number(e.target.value));
                        setEnabled(true);
                      }}
                      className="w-full accent-primary h-1 rounded bg-bg-base cursor-pointer"
                    />
                  </div>

                  {/* Grayscale */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] font-sans text-gray-400">
                      <span>{t.grayscale}</span>
                      <span className="font-mono text-white text-[10px]">{grayscale}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={grayscale}
                      onChange={(e) => {
                        setGrayscale(Number(e.target.value));
                        setEnabled(true);
                      }}
                      className="w-full accent-primary h-1 rounded bg-bg-base cursor-pointer"
                    />
                  </div>

                  {/* Hue Rotate */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] font-sans text-gray-400">
                      <span>{t.hueRotate}</span>
                      <span className="font-mono text-white text-[10px]">{hueRotate}deg</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={hueRotate}
                      onChange={(e) => {
                        setHueRotate(Number(e.target.value));
                        setEnabled(true);
                      }}
                      className="w-full accent-primary h-1 rounded bg-bg-base cursor-pointer"
                    />
                  </div>
                </div>

                {/* Inversion Dark Reader Switch */}
                <div className="flex items-center justify-between gap-4 py-2 mt-1 bg-navy-blue/15 border border-navy-blue/40 px-3 rounded-xl">
                  <div className="flex flex-col text-left font-sans">
                    <span className="text-[11px] font-bold text-white font-sans">{t.optimizeMode}</span>
                    <span className="text-[9px] text-gray-500 font-sans leading-tight mt-0.5">{t.optimizeModeSub}</span>
                  </div>
                  <button
                    onClick={() => {
                      setInvert(!invert);
                      setEnabled(true);
                    }}
                    className={`w-9 h-5 rounded-full transition-colors relative shrink-0 cursor-pointer outline-none ${
                      invert ? 'bg-primary' : 'bg-navy-blue'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                        invert ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>
            </div>

            {/* Utility options: Reset button */}
            <div className="p-4 pt-3 border-t border-navy-blue/50 flex items-center justify-between bg-bg-card/95">
              <span className="text-[10px] font-bold font-mono tracking-wide text-gray-500 uppercase flex items-center gap-1.5 font-sans">
                <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-primary' : 'bg-gray-700 animate-pulse'}`} />
                {enabled ? t.statusEnabled : t.statusDisabled}
              </span>
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-blue hover:text-primary hover:border-primary/50 text-gray-400 text-[10px] font-mono font-semibold hover:bg-navy-blue/20 transition-all cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>{t.resetBtn}</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
