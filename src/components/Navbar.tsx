import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Code2, Sparkles, Sun, Moon, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AVATAR_PRESETS = [
  {
    name: "Classic Elegant",
    url: "/public/02.jpg"
  },
  {
    name: "Tech Nomad",
    url: "/public/03.jpeg"
  },
  {
    name: "Cyber Orange",
    url: "/public/04.png"
  },
  {
    name: "Artistic Minimalist",
    url: "/public/05.jpeg"
  }
];

export default function Navbar() {
  const { language, toggleLanguage, t, personalData, navLinks } = useLanguage();
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('profile_avatar_url') || personalData.avatarUrl;
  });
  const [newAvatarUrlInput, setNewAvatarUrlInput] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [transitionState, setTransitionState] = useState<{
    isAnimating: boolean;
    x: number;
    y: number;
    maxRadius: number;
    targetTheme: 'light' | 'dark';
  }>({
    isAnimating: false,
    x: 0,
    y: 0,
    maxRadius: 0,
    targetTheme: 'dark',
  });

  // Track root class list for light/dark mode persistence
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (transitionState.isAnimating) return;

    let x = window.innerWidth - 60; // default layout center of the navbar toggles
    let y = 40;

    if (e && e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const targetTheme: 'light' | 'dark' = theme === 'dark' ? 'light' : 'dark';

    setTransitionState({
      isAnimating: true,
      x,
      y,
      maxRadius,
      targetTheme,
    });
  };

  // Monitor scroll to change navbar background style and utilize IntersectionObserver to update active links smoothly
  useEffect(() => {
    const handleScroll = () => {
      // 1. Navbar style background toggle
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. If at the absolute top of the page, forcefully reset active section to hero
      if (window.scrollY < 50) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Execute initial check
    handleScroll();

    // 3. Smooth, accurate Scrollspy utilizing standard IntersectionObserver
    // Margin focused around 15% top offset and 45% bottom offset to capture target section
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-15% 0px -45% 0px',
      threshold: [0, 0.1, 0.25, 0.5]
    };

    // Keep memory map of all intersecting sections with their respective ratios
    const intersectingRatios = new Map<string, number>();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          intersectingRatios.set(id, entry.intersectionRatio);
        } else {
          intersectingRatios.delete(id);
        }
      });

      // Avoid overriding if user is scrolled cleanly up
      if (window.scrollY < 50) {
        setActiveSection('hero');
        return;
      }

      // Select the section with the highest visual ratio in view
      let highestRatioId = '';
      let highestRatio = -1;

      intersectingRatios.forEach((ratio, id) => {
        if (ratio > highestRatio) {
          highestRatio = ratio;
          highestRatioId = id;
        }
      });

      if (highestRatioId) {
        setActiveSection(highestRatioId);
      }
    };

    const scrollspyObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Dynamic section observation subscription
    navLinks.forEach((link) => {
      const element = document.getElementById(link.targetId);
      if (element) {
        scrollspyObserver.observe(element);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      scrollspyObserver.disconnect();
    };
  }, []);

  // Handle escape key pressed globally for modern accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileModalOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-shadow-card/90 bg-bg-base/80 backdrop-blur-md border-b border-navy-blue py-4 shadow-lg shadow-black/3 overlay-glow'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo / Brand */}
          <motion.a
            href="#hero"
            onClick={(e) => handleLinkClick(e, 'hero')}
            className="flex items-center gap-2 group cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsProfileModalOpen(true);
              }}
              className="w-10 h-10 rounded-lg overflow-hidden border border-navy-blue/80 group-hover:border-primary transition-all duration-300 bg-navy-blue relative shrink-0 cursor-pointer"
              title={t('viewIdentity')}
            >
              <img
                src={avatarUrl}
                alt={personalData.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors duration-300">
              {personalData.name} <span className="text-primary font-mono text-xs ml-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">DEV</span>
            </span>
          </motion.a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, idx) => {
              const isActive = activeSection === link.targetId;
              return (
                <motion.a
                  key={link.targetId}
                  href={`#${link.targetId}`}
                  onClick={(e) => handleLinkClick(e, link.targetId)}
                  className={`relative px-4 py-2 rounded-md text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary shadow-[0_0_8px_#FF6500]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          {/* Contact Accent CTA button desktop & Theme switcher */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-full border border-navy-blue/80 text-xs font-mono font-bold text-gray-400 hover:text-primary hover:border-primary/50 bg-bg-card select-none cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-110 active:scale-95 duration-200 outline-none uppercase"
              title={language === 'id' ? 'Switch to English' : 'Ubah ke Bahasa Indonesia'}
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{language}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={(e) => toggleTheme(e)}
              className="p-2.5 rounded-full border border-navy-blue/80 text-gray-400 hover:text-primary hover:border-primary/50 transition-all select-none cursor-pointer flex items-center justify-center bg-bg-card shadow-md hover:scale-110 active:scale-95 duration-200 outline-none"
              title={theme === 'dark' ? t('themeToggleLight') : t('themeToggleDark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500 fill-amber-500/10" /> : <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/10" />}
            </button>
            <motion.a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="px-5 py-2.5 rounded-full text-xs font-mono tracking-wider font-semibold uppercase bg-transparent border border-primary text-primary hover:bg-primary hover:text-black transition-colors duration-200 cursor-pointer inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.08, 
                y: -2,
                boxShadow: '0 0 25px rgba(255, 101, 0, 0.45)',
              }}
              whileTap={{ scale: 0.94 }}
              transition={{ 
                type: 'spring', 
                stiffness: 450, 
                damping: 12,
              }}
            >
              {t('contactMeBtn')}
            </motion.a>
          </div>

          {/* Mobile Menu Actions & Trigger */}
          <div className="flex items-center gap-2.5 md:hidden">
            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-bg-card border border-navy-blue text-gray-300 hover:text-primary active:scale-95 transition-all outline-none cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold uppercase select-none"
              title={language === 'id' ? 'Switch to English' : 'Ubah ke Bahasa Indonesia'}
            >
              <Globe className="w-4 h-4 text-primary" />
              <span>{language}</span>
            </button>
            <button
              onClick={(e) => toggleTheme(e)}
              className="p-2 rounded-lg bg-bg-card border border-navy-blue text-gray-300 hover:text-primary active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center animate-none"
              title={theme === 'dark' ? t('themeToggleLight') : t('themeToggleDark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500 fill-amber-500/10" /> : <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/10" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-bg-card border border-navy-blue text-gray-300 hover:text-white active:scale-95 transition-all outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-in */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm z-50 bg-bg-card border-l border-navy-blue flex flex-col p-8"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-sans font-bold text-lg text-white">{t('menu')}</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-bg-base border border-navy-blue/85 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links List */}
              <div className="flex flex-col gap-4 mb-auto">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.targetId;
                  return (
                    <a
                      key={link.targetId}
                      href={`#${link.targetId}`}
                      onClick={(e) => handleLinkClick(e, link.targetId)}
                      className={`text-lg font-medium p-3 rounded-lg border transition-all duration-300 ${
                        isActive
                          ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                          : 'border-transparent text-gray-400 hover:text-white hover:bg-navy-blue/40'
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>

              {/* Social or Contact indicators inside Mobile drawer */}
              <div className="border-t border-navy-blue/60 pt-6">
                <p className="text-gray-500 font-mono text-xs mb-3">{t('contractAvailable')}</p>
                <motion.a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  whileHover={{ 
                    scale: 1.04, 
                    boxShadow: '0 8px 25px rgba(255, 101, 0, 0.45)',
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 12 }}
                  className="block text-center py-3 rounded-xl bg-primary text-black font-semibold text-sm cursor-pointer outline-none relative z-10 font-sans"
                >
                  {t('sendMessageCTA')}
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Info Modal Pop Up */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              onClick={() => setIsProfileModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-navy-blue/80 bg-bg-card p-6 md:p-8 shadow-2xl shadow-black/80 z-10 text-left custom-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-bg-base/80 border border-navy-blue text-gray-400 hover:text-white hover:border-primary/50 transition-all cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Title inside Modal */}
              <div className="flex items-center gap-2 mb-6 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">{t('identityVerified')}</span>
              </div>

              {/* Profile Card Header Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-navy-blue/50 mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-lg shadow-primary/10 relative shrink-0">
                  <img
                    src={avatarUrl}
                    alt={personalData.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center sm:text-left flex-1 space-y-2 font-sans">
                  <h3 className="text-2xl font-bold font-sans tracking-tight text-white">{personalData.name}</h3>
                  <p className="text-sm text-primary font-medium font-sans">{personalData.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">{personalData.subtitle}</p>
                </div>
              </div>

              {/* Expandable Avatar Config Section */}
              <div className="mb-6 p-4 rounded-xl border border-navy-blue/50 bg-bg-base/30 text-left">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase">{t('avatarConfigTitle')}</h4>
                  <span className="text-[9px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">{t('devBadge')}</span>
                </div>
                
                {/* Preset List */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {AVATAR_PRESETS.map((preset, idx) => {
                    const isSelected = avatarUrl === preset.url;
                    return (
                      <button
                        key={idx}
                        title={preset.name}
                        onClick={() => {
                          localStorage.setItem('profile_avatar_url', preset.url);
                          setAvatarUrl(preset.url);
                        }}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative cursor-pointer ${
                          isSelected ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-x-0 bottom-0 bg-black/80 flex items-center justify-center py-0.5">
                            <span className="text-[8px] text-primary font-mono font-bold uppercase tracking-wider">{language === 'en' ? 'Active' : 'Aktif'}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom URL Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('pasteCustomUrl')}
                    value={newAvatarUrlInput}
                    onChange={(e) => setNewAvatarUrlInput(e.target.value)}
                    className="flex-1 bg-bg-base/80 border border-navy-blue focus:border-primary focus:outline-none rounded-lg px-3 py-1.5 text-xs text-gray-200 placeholder-gray-600 transition-all font-sans"
                  />
                  <button
                    onClick={() => {
                      if (newAvatarUrlInput.trim()) {
                        localStorage.setItem('profile_avatar_url', newAvatarUrlInput.trim());
                        setAvatarUrl(newAvatarUrlInput.trim());
                        setNewAvatarUrlInput('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-black font-sans font-bold text-[10px] hover:bg-hover active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {t('saveUrl')}
                  </button>
                </div>
                <div className="text-[9px] text-gray-500 font-mono mt-2 leading-relaxed font-sans">
                  {t('avatarConfigNote')}
                </div>
              </div>

              {/* Identity Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-bg-base/30 p-3 rounded-xl border border-navy-blue/30 font-sans">
                  <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">{t('locationLabel')}</span>
                    <span className="text-xs font-sans text-gray-200 font-medium">{personalData.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-bg-base/30 p-3 rounded-xl border border-navy-blue/30 font-sans">
                  <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">{t('emailLabel')}</span>
                    <span className="text-xs font-sans text-gray-200 font-medium select-all">{personalData.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-bg-base/30 p-3 rounded-xl border border-navy-blue/30 font-sans">
                  <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">{t('shortBio')}</span>
                    <span className="text-xs font-sans text-gray-300 leading-relaxed block">{personalData.aboutText1}</span>
                  </div>
                </div>
              </div>

              {/* Bottom 3 social link actions: Instagram, WhatsApp, GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={personalData.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E1306C]/40 hover:border-[#E1306C] bg-[#E1306C]/5 hover:bg-[#E1306C]/10 text-[#E1306C] hover:text-[#FF4081] font-sans font-semibold text-xs transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  Instagram
                </a>

                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#25D366] hover:text-[#34D399] font-sans font-semibold text-xs transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7a2 2 0 0 1 2 1.72z"/></svg>
                  WhatsApp
                </a>

                <a
                  href={personalData.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-navy-blue hover:border-primary/50 bg-bg-base/40 hover:bg-bg-base/70 text-gray-300 hover:text-white font-sans font-semibold text-xs transition-all duration-300 font-sans"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  GitHub
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Circle Clip Theme Transition Reveal Overlay */}
      <AnimatePresence>
        {transitionState.isAnimating && (
          <motion.div
            initial={{ clipPath: `circle(0px at ${transitionState.x}px ${transitionState.y}px)` }}
            animate={{ clipPath: `circle(${transitionState.maxRadius}px at ${transitionState.x}px ${transitionState.y}px)` }}
            exit={{ opacity: 0 }}
            transition={{ 
              clipPath: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.15, ease: 'easeOut' }
            }}
            onAnimationComplete={() => {
              // Commit the theme change when screen is fully blanketed by the circle path
              setTheme(transitionState.targetTheme);
              setTransitionState(prev => ({ ...prev, isAnimating: false }));
            }}
            className="fixed inset-0 z-[99999] pointer-events-none"
            style={{
              backgroundColor: transitionState.targetTheme === 'light' ? '#F8FAFC' : '#020617',
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
