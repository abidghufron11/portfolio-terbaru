import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { ArrowUp, Code2, Heart, ExternalLink, HelpCircle, X, Keyboard } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Contact from './components/Contact';
import { useLanguage } from './context/LanguageContext';
import ParticleBackground from './components/ParticleBackground';
import AccessibilityControls from './components/AccessibilityControls';

export default function App() {
  const { language, t, personalData } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState(language === 'en' ? 'Initializing virtual modules...' : 'Inisialisasi sistem...');
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Keyboard Shortcuts to navigate between sections using Arrow Keys and '?'
  useEffect(() => {
    let isTransitioning = false;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events if user is typing in form inputs, textareas, etc.
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName.toLowerCase() === 'input' || 
        activeEl.tagName.toLowerCase() === 'textarea' || 
        activeEl.hasAttribute('contenteditable') ||
        (activeEl as HTMLElement).isContentEditable
      );

      // Handle Escape to close modal
      if (e.key === 'Escape') {
        setShowHelpModal(prev => {
          if (prev) {
            e.preventDefault();
            return false;
          }
          return false;
        });
        return;
      }

      // Handle '?' key to toggle help modal (only if not typed in an input field)
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShowHelpModal(prev => !prev);
        return;
      }

      // Tab focus trapping inside Help Modal
      if (showHelpModal && e.key === 'Tab') {
        const modal = document.getElementById('help-modal-dialog');
        if (modal) {
          const focusable = modal.querySelectorAll('button, a, [tabindex="0"]');
          if (focusable.length > 0) {
            const first = focusable[0] as HTMLElement;
            const last = focusable[focusable.length - 1] as HTMLElement;
            if (e.shiftKey) {
              if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
              }
            }
          }
        }
        return;
      }

      if (isInput || showHelpModal) {
        return;
      }

      const sections = ['hero', 'about', 'skills', 'projects', 'resume', 'contact'];
      
      // Determine what's currently in view or nearest to scroll position
      const scrollPosition = window.scrollY + 160; // offset of scrollspy
      let currentSectionIdx = 0;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          const offsetTop = window.scrollY + rect.top;
          if (scrollPosition >= offsetTop) {
            currentSectionIdx = i;
            break;
          }
        }
      }

      let newIdx = currentSectionIdx;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentSectionIdx < sections.length - 1) {
          newIdx = currentSectionIdx + 1;
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentSectionIdx > 0) {
          newIdx = currentSectionIdx - 1;
        }
      } else {
        return; // ignore non-arrow keys
      }

      // Check if already transitioning to avoid jittery step scrolling
      if (isTransitioning) return;
      isTransitioning = true;
      setTimeout(() => { isTransitioning = false; }, 800);

      const targetId = sections[newIdx];
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Shift logical focus to the active section for correct native Tab progression
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });

        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelpModal]);

  // Accessibility focus management on Help Modal state changes
  useEffect(() => {
    if (showHelpModal) {
      lastActiveElementRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        const closeBtn = document.getElementById('close-help-modal');
        if (closeBtn) {
          closeBtn.focus();
        }
      }, 50);
    } else {
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
        lastActiveElementRef.current.focus();
      }
    }
  }, [showHelpModal]);

  // Advanced dynamic progress-based skeleton loading state sequence
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Tick random increments
      currentProgress += Math.floor(Math.random() * 12) + 6;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 120);
      }
      setLoadingProgress(currentProgress);

      if (currentProgress < 25) {
        setLoadingStatus(language === 'en' ? 'Initializing virtual modules...' : 'Inisialisasi modul virtual...');
      } else if (currentProgress < 55) {
        setLoadingStatus(language === 'en' ? 'Downloading portfolio assets...' : 'Mengunduh aset portfolio...');
      } else if (currentProgress < 85) {
        setLoadingStatus(language === 'en' ? 'Optimizing visual layouts...' : 'Mengoptimalkan tata letak visual...');
      } else {
        setLoadingStatus(language === 'en' ? 'System ready to launch...' : 'Sistem siap diluncurkan...');
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Monitor scroll height to show/hide "Back to Top" float button
  useEffect(() => {
    const checkScrollDepth = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollDepth);
    return () => window.removeEventListener('scroll', checkScrollDepth);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-bg-base text-gray-200 min-h-screen relative font-sans antialiased selection:bg-primary/30 selection:text-primary">
      {/* Interactive Floating Particle Background across all sections */}
      <ParticleBackground />

      <AnimatePresence mode="wait">
        {isInitialLoading ? (
          <motion.div
            key="initial-skeleton-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-6 md:p-12 overflow-hidden"
          >
            {/* Ambient Background Glowing Accents inside loader */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-navy-blue/15 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '0.6s' }} />

            {/* Skeleton Navbar */}
            <div className="flex items-center justify-between border-b border-navy-blue/30 pb-6 w-full max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-navy-blue/50 animate-pulse" />
                <div className="w-24 h-4 bg-navy-blue/35 rounded animate-pulse" />
              </div>
              <div className="hidden md:flex items-center gap-6">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="w-14 h-3 bg-navy-blue/25 rounded animate-pulse" style={{ animationDelay: `${idx * 0.1}s` }} />
                ))}
              </div>
              <div className="w-10 h-10 rounded-full bg-navy-blue/40 animate-pulse" />
            </div>

            {/* Perfectly Centered Skeleton Initialization Content */}
            <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center my-auto text-center relative z-10 px-4">
              {/* Dynamic Brand Logo Loading Emblem */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/10 to-navy-blue border border-navy-blue/80 flex items-center justify-center mb-6 animate-pulse shadow-xl">
                <Code2 className="w-7 h-7 text-primary" />
              </div>

              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="w-48 h-6 rounded-full bg-navy-blue/30 border border-navy-blue/50 animate-pulse" />
                <div className="w-full max-w-lg h-9 bg-navy-blue/40 rounded-xl animate-pulse" />
              </div>

              {/* Dynamic Status Progress Hub */}
              <div className="w-full max-w-sm mt-8 space-y-3.5 border border-navy-blue/40 bg-bg-card/45 p-6 rounded-2xl select-none shadow-xl relative overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400 tracking-wider font-mono">{language === 'en' ? 'SYSTEM TELEMETRY' : 'TELEMETRI MUTASI'}</span>
                  <span className="text-primary font-bold tracking-widest">{loadingProgress}%</span>
                </div>
                {/* Glowing progress slider track */}
                <div className="w-full h-1.5 bg-navy-blue/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.15 }}
                    style={{ boxShadow: '0 0 10px rgba(255, 101, 0, 0.7)' }}
                  />
                </div>
                <div className="text-[10px] font-mono tracking-wider text-gray-500 animate-pulse pt-0.5">
                  {loadingStatus}
                </div>
              </div>

              {/* Centered subtle visual placeholder lines */}
              <div className="space-y-2.5 mt-8 w-64 mx-auto opacity-75 hidden sm:block">
                <div className="w-full h-2 bg-navy-blue/25 rounded-full animate-pulse" />
                <div className="w-5/6 h-2 bg-navy-blue/25 rounded-full animate-pulse mx-auto" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>

            {/* Skeleton Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-navy-blue/30 pt-6 text-xs text-gray-600 font-mono gap-4 w-full max-w-7xl mx-auto">
              <div className="w-32 h-3 bg-navy-blue/20 rounded animate-pulse" />
              <div className="w-44 h-3 bg-navy-blue/20 rounded animate-pulse" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main-app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55 }}
          >
            {/* Elegant Reading/Portfolio Scroll Progress Bar */}
            <motion.div
              className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-[#FF8C00] to-primary origin-left z-[100001] pointer-events-none"
              style={{ scaleX }}
            />

            {/* Primary Sticky Top Navbar */}
            <Navbar />


            {/* Structured Sections Scroll Layout */}
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Resume />
              <Contact />
            </main>

            {/* Aesthetic Footer section */}
            <footer className="bg-black border-t border-navy-blue py-12 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-primary/3 blur-[100px] pointer-events-none" />

              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
                
                {/* Logo Brand description */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <div className="p-1.5 rounded-lg bg-navy-blue border border-navy-blue/80 text-primary">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <span className="font-sans font-extrabold text-sm text-white tracking-wider">
                      {personalData.name.toUpperCase()} <span className="text-primary font-mono text-xs">PORTFOLIO</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-1">{t('footerSubtitle')}</p>
                </div>

                {/* Core Navigation Links shortcut */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-mono text-gray-400">
                  <a href="#hero" className="hover:text-primary transition-colors">{t('footerHome')}</a>
                  <a href="#about" className="hover:text-primary transition-colors">{t('footerAbout')}</a>
                  <a href="#skills" className="hover:text-primary transition-colors">{t('footerSkills')}</a>
                  <a href="#projects" className="hover:text-primary transition-colors">{t('footerProjects')}</a>
                  <a href="#resume" className="hover:text-primary transition-colors">{t('footerResume')}</a>
                  <a href="#contact" className="hover:text-primary transition-colors">{t('footerContact')}</a>
                </div>

                {/* Credits */}
                <div className="text-xs text-gray-500 font-mono flex items-center gap-1">
                  <span>{t('madeWith')}</span>
                  <Heart className="w-3 h-3 text-primary fill-primary animate-pulse" />
                  <span>{t('by')}</span>
                  <span className="text-white hover:text-primary transition-colors font-semibold">Abid Ghufron</span>
                  <span>&copy; {new Date().getFullYear()}</span>
                </div>

              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Accessibility Control Panel & Dark Reader Filter Engine */}
      <AccessibilityControls />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={handleScrollTop}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-black shadow-[0_4px_15px_rgba(255,101,0,0.3)] border border-primary/20 outline-none cursor-pointer"
            initial={{ opacity: 0, scale: 0.5, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 15 }}
            whileHover={{ 
              scale: 1.15,
              y: -5,
              boxShadow: '0 8px 25px rgba(255, 101, 0, 0.6)',
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 12 }}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Keyboard Shortcuts Guide */}
      <AnimatePresence>
        {!isInitialLoading && showKeyboardGuide && (
          <motion.div
            className="fixed bottom-6 left-6 z-40 p-5 rounded-2xl bg-bg-card/95 border border-navy-blue/80 backdrop-blur-md shadow-2xl max-w-xs flex flex-col gap-2.5 pointer-events-auto text-left"
            initial={{ opacity: 0, scale: 0.9, x: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-between gap-4 font-sans">
              <span className="text-[10px] text-primary font-bold font-mono uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded border border-primary/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                {t('kbTitle')}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="text-gray-400 hover:text-primary p-1 rounded hover:bg-navy-blue transition-colors outline-none cursor-pointer"
                  aria-label={t('kbReopenGuide')}
                  title={`${t('kbReopenGuide')} (?)`}
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowKeyboardGuide(false)}
                  className="text-gray-500 hover:text-white text-xs transition-colors p-1 cursor-pointer outline-none"
                  title="✕"
                  aria-label="✕"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              {t('kbHelperDesc')}
            </p>
            <div className="grid grid-cols-1 gap-2 text-[10px] font-mono mt-1 text-gray-300">
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/85 text-xs font-bold text-white shadow-sm min-w-[24px] text-center">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/85 text-xs font-bold text-white shadow-sm min-w-[24px] text-center">↓</kbd>
                <span>{t('kbArrowNav')}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/85 text-xs font-bold text-white shadow-sm min-w-[24px] text-center">←</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/85 text-xs font-bold text-white shadow-sm min-w-[24px] text-center">→</kbd>
                <span>{t('kbArrowNav')}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/85 text-[10px] font-bold text-white shadow-sm min-w-[32px] text-center">Tab</kbd>
                <span>{t('kbTabNav')}</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/85 text-[10px] font-bold text-white shadow-sm min-w-[32px] text-center">Enter</kbd>
                <span>{t('kbEnterNav')}</span>
              </div>
            </div>
            <div className="border-t border-navy-blue/50 pt-2 mt-1 flex items-center justify-between text-[10px] text-gray-400 font-sans">
              <span>{t('kbNeedHelp')}</span>
              <button 
                onClick={() => setShowHelpModal(true)}
                className="text-primary hover:underline font-mono font-bold cursor-pointer outline-none"
              >
                {t('kbPressHelp')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-open guide Floating Toggle Button */}
      <AnimatePresence>
        {!isInitialLoading && !showKeyboardGuide && (
          <motion.button
            onClick={() => setShowKeyboardGuide(true)}
            className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-bg-card border border-navy-blue/85 text-gray-400 shadow-lg hover:text-primary hover:border-primary/50 cursor-pointer outline-none flex items-center justify-center bg-shadow-card"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 450, damping: 12 }}
            aria-label="Show keyboard guide"
            title={t('kbReopenGuide')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="12" x="2" y="6" rx="2" ry="2"/><path d="M6 10h.01"/><path d="M10 10h.01"/><path d="M14 10h.01"/><path d="M18 10h.01"/><path d="M6 14h.01"/><path d="M18 14h.01"/><path d="M10 14h4"/></svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Interactive Accessible Help Modal Dialog */}
      <AnimatePresence>
        {showHelpModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            role="presentation"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              id="help-modal-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-primary/30 bg-bg-card/95 p-6 md:p-8 shadow-[0_24px_50px_rgba(255,101,0,0.25)] relative text-left outline-none"
              tabIndex={0}
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              {/* Decorative Accent Glow */}
              <div className="absolute top-0 right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 border-b border-navy-blue/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/25 text-primary">
                    <Keyboard className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 id="help-modal-title" className="text-base font-sans font-bold text-white tracking-tight">
                      {t('kbModalTitle')}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wide uppercase">{t('kbModalSubtitle')}</p>
                  </div>
                </div>
                <button
                  id="close-help-modal"
                  onClick={() => setShowHelpModal(false)}
                  className="p-1.5 rounded-full border border-navy-blue/80 bg-navy-blue/40 text-gray-400 hover:text-white transition-all cursor-pointer outline-none hover:border-primary/50"
                  aria-label={language === 'en' ? 'Close Help' : 'Tutup Panduan'}
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-gray-300 font-sans">
                <p className="font-sans text-gray-400 leading-normal bg-navy-blue/20 border border-navy-blue/40 p-3 rounded-xl text-[11px]">
                  {t('kbModalIntro')}
                </p>

                {/* Key Guide Categories */}
                <div className="space-y-2 font-mono">
                  <div className="grid grid-cols-1 gap-2">
                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-navy-blue/15 border border-navy-blue/30">
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">↑</kbd>
                        <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">↓</kbd>
                        <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">←</kbd>
                        <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">→</kbd>
                      </div>
                      <span className="text-gray-400 text-right">{t('kbModalArrowDesc')}</span>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-navy-blue/15 border border-navy-blue/30">
                      <kbd className="px-2 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">Tab</kbd>
                      <span className="text-gray-400 text-right">{t('kbModalTabDesc')}</span>
                    </div>

                    {/* Activation Enter */}
                    <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-navy-blue/15 border border-navy-blue/30">
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">Enter</kbd>
                        <span className="text-gray-500">/</span>
                        <kbd className="px-2 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">{language === 'en' ? 'Space' : 'Spasi'}</kbd>
                      </div>
                      <span className="text-gray-400 text-right">{t('kbModalEnterDesc')}</span>
                    </div>

                    {/* Help Modal Toggle */}
                    <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-navy-blue/15 border border-navy-blue/30">
                      <kbd className="px-2 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">?</kbd>
                      <span className="text-gray-400 text-right">{t('kbModalQDesc')}</span>
                    </div>

                    {/* Escape Toggle */}
                    <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-navy-blue/15 border border-navy-blue/30">
                      <kbd className="px-2 py-0.5 rounded bg-navy-blue border border-navy-blue/80 font-bold text-white shadow-md">Esc</kbd>
                      <span className="text-gray-400 text-right">{t('kbModalEscDesc')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer section inside Help Modal */}
                <div className="pt-3 border-t border-navy-blue/60 flex items-center justify-between gap-4 text-[11px] font-sans">
                  <span className="text-gray-400">{t('kbLabelOrange')}</span>
                  <button
                    onClick={() => {
                      setShowKeyboardGuide(!showKeyboardGuide);
                      setShowHelpModal(false);
                    }}
                    className="text-primary hover:text-white font-mono text-[10px] transition-colors cursor-pointer outline-none py-1 px-3 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/50 text-center"
                  >
                    {showKeyboardGuide ? t('kbHideHint') : t('kbShowHint')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
