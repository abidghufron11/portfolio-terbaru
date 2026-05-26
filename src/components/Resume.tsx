import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, FileDown, Calendar, ArrowUpRight, CheckCircle, ShieldAlert, X, Eye, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Certificate } from '../types';
import MagicCard from './MagicCard';

export default function Resume() {
  const { language, t, certificatesData } = useLanguage();
  const [activeCredentialModal, setActiveCredentialModal] = useState<Certificate | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [marqueeDuration, setMarqueeDuration] = useState(24); // speed duration in seconds

  const marqueeRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const targetSpeedFactorRef = useRef(1);
  const currentSpeedFactorRef = useRef(1);
  const lastTimeRef = useRef<number | null>(null);

  // Setup smooth physics-driven speed-interpolation marquee ticker loop
  useEffect(() => {
    let animationId: number;
    let isLooping = true;
    
    // Reset tracker time-steps to prevent sudden coordinate jumps on tab visibility/dependency changes
    lastTimeRef.current = null;

    const animate = (time: number) => {
      if (!isLooping) return;

      // If document is invisible, stall animation (don't schedule next frame) to save CPU/battery
      if (document.hidden) {
        lastTimeRef.current = null;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const dt = Math.min(time - lastTimeRef.current, 100); // capped to avoid jumps on focus/sleep status
      lastTimeRef.current = time;

      // Linear interpolation (lerp) toward target speed factor to make transitions look gorgeous and lag-free
      const lerpFactor = 0.045; // smaller value = smoother transition easing
      currentSpeedFactorRef.current += (targetSpeedFactorRef.current - currentSpeedFactorRef.current) * lerpFactor;

      if (isPlaying) {
        // Base linear velocity represents covering a single group length (50% range) over marqueeDuration seconds
        const baseSpeed = 50 / (marqueeDuration * 1000); // % of element length per millisecond
        const increment = baseSpeed * dt * currentSpeedFactorRef.current;
        xRef.current -= increment;

        // Perfectly seamless looping wrap check without resetting or popping
        if (xRef.current <= -50) {
          xRef.current += 50;
        }
      }

      if (marqueeRef.current) {
        marqueeRef.current.style.transform = `translate3d(${xRef.current}%, 0, 0)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastTimeRef.current = null;
        // Resume looping when tab becomes visible
        animationId = requestAnimationFrame(animate);
      } else {
        lastTimeRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial trigger
    if (!document.hidden) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      isLooping = false;
      cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      lastTimeRef.current = null;
    };
  }, [isPlaying, marqueeDuration]);

  const handleMouseEnter = () => {
    targetSpeedFactorRef.current = 0.12; // slow crawl, absolutely seamless instead of frozen
  };

  const handleMouseLeave = () => {
    targetSpeedFactorRef.current = 1.0; // gracefully and smoothly accelerate back to full cruising speed
  };

  // Listen for Escape key to close the credential modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCredentialModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDownloadCv = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Elegant CV print orchestration
    e.preventDefault();
    window.print();
  };

  return (
    <section
      id="resume"
      className="py-24 bg-bg-base relative overflow-hidden"
    >
      {/* Background radial highlight */}
      <div className="absolute top-0 right-10 w-[450px] h-[450px] rounded-full bg-navy-blue/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header and CV Action button block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <motion.div 
            className="max-w-xl text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-blue border border-navy-blue/80 text-primary text-xs font-mono uppercase mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>{t('certSectionBadge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight">
              {t('certHeadingIntro')} <span className="text-primary">{t('certHeadingPrimary')}</span> {t('certHeadingOutro')}
            </h2>
            <div className="w-12 h-1 bg-primary mt-4 rounded-full" />
          </motion.div>

          {/* Download/Print CV button, styled in vibrant orange #FF6500 */}
          <motion.button
            onClick={handleDownloadCv}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-black font-sans font-semibold text-sm tracking-wide shadow-[0_4px_20px_rgba(255,101,0,0.25)] cursor-pointer select-none outline-none relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05, 
              y: -4,
              boxShadow: '0 15px 35px rgba(255, 101, 0, 0.45)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 12 }}
          >
            <FileDown className="w-4 h-4" />
            <span>{t('cvDownloadBtn')}</span>
          </motion.button>
        </div>

        {/* Continuous marquee-driven smooth view */}
        <div className="relative py-6 select-none">
          {/* Main viewport mask wrapper with fine borders and visual depth */}
          <div className="relative overflow-hidden rounded-2xl p-4 bg-[#080d19]/25 border border-navy-blue/35 backdrop-blur-xs">
            {/* Faded edges to give an authentic continuous infinity backdrop aesthetic */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-bg-base via-bg-base/70 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg-base via-bg-base/70 to-transparent z-20 pointer-events-none" />

            <div 
              ref={marqueeRef}
              className="flex py-2 select-none"
              style={{ 
                width: 'max-content',
                willChange: 'transform',
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Group A (First symmetric half) */}
              <div className="flex gap-6 pr-6 shrink-0">
                {certificatesData.map((cert) => (
                  <div 
                    key={`${cert.id}-g1`} 
                    className="w-[280px] sm:w-[325px] shrink-0 transform hover:-translate-y-1 transition-all duration-300 animate-none"
                  >
                    <MagicCard
                      onClick={() => setActiveCredentialModal(cert)}
                      disableHoverAmbient={true}
                      className="group flex flex-col justify-between h-full cursor-pointer bg-bg-card duration-300"
                    >
                      {/* Lazy Loading Image container */}
                      <div className="relative aspect-[3/2] overflow-hidden bg-navy-blue/15 border-b border-navy-blue/50">
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        />
                        
                        {/* Image overlay with modern glass lookup icon */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                          <div className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary flex items-center gap-1.5 text-xs font-mono font-bold uppercase transition-all">
                            <Eye className="w-4 h-4" />
                            <span>{language === 'en' ? 'View Proof' : 'Lihat Bukti'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Certificate content and tags */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>{cert.date}</span>
                          </div>
                          <h3 className="text-sm font-sans font-bold text-white group-hover:text-primary transition-colors duration-250 leading-snug text-left">
                            {cert.title}
                          </h3>
                          <p className="text-gray-400 font-sans text-xs mt-1 text-left">
                            {language === 'en' ? 'Issued by:' : 'Penerbit: '}{' '}
                            <span className="text-gray-300 font-medium">{cert.issuer}</span>
                          </p>
                        </div>

                        {/* Status credential verification footer */}
                        <div className="border-t border-navy-blue/70 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono font-semibold text-emerald-500">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 stroke-2" />
                            <span className="uppercase">{language === 'en' ? 'VERIFIED CREDENTIAL' : 'KREDENSIAL TERVERIFIKASI'}</span>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </div>
                    </MagicCard>
                  </div>
                ))}
              </div>

              {/* Group B (Second symmetric half for seamless mathematical loop) */}
              <div className="flex gap-6 pr-6 shrink-0" aria-hidden="true">
                {certificatesData.map((cert) => (
                  <div 
                    key={`${cert.id}-g2`} 
                    className="w-[280px] sm:w-[325px] shrink-0 transform hover:-translate-y-1 transition-all duration-300 animate-none"
                  >
                    <MagicCard
                      onClick={() => setActiveCredentialModal(cert)}
                      disableHoverAmbient={true}
                      className="group flex flex-col justify-between h-full cursor-pointer bg-bg-card duration-300"
                    >
                      {/* Lazy Loading Image container */}
                      <div className="relative aspect-[3/2] overflow-hidden bg-navy-blue/15 border-b border-navy-blue/50">
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        />
                        
                        {/* Image overlay with modern glass lookup icon */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                          <div className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary flex items-center gap-1.5 text-xs font-mono font-bold uppercase transition-all">
                            <Eye className="w-4 h-4" />
                            <span>{language === 'en' ? 'View Proof' : 'Lihat Bukti'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Certificate content and tags */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>{cert.date}</span>
                          </div>
                          <h3 className="text-sm font-sans font-bold text-white group-hover:text-primary transition-colors duration-250 leading-snug text-left">
                            {cert.title}
                          </h3>
                          <p className="text-gray-400 font-sans text-xs mt-1 text-left">
                            {language === 'en' ? 'Issued by:' : 'Penerbit: '}{' '}
                            <span className="text-gray-300 font-medium">{cert.issuer}</span>
                          </p>
                        </div>

                        {/* Status credential verification footer */}
                        <div className="border-t border-navy-blue/70 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono font-semibold text-emerald-500">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 stroke-2" />
                            <span className="uppercase">{language === 'en' ? 'VERIFIED CREDENTIAL' : 'KREDENSIAL TERVERIFIKASI'}</span>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </div>
                    </MagicCard>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls indicators: Speed selection and Autoplay status play/pause */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 select-none">
            {/* Play/Pause control state toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-navy-blue/35 border border-navy-blue/50 text-[11px] font-mono font-bold text-gray-300 hover:text-primary hover:border-primary/40 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-black/20"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current text-primary" />
                  <span>{language === 'en' ? 'AUTOPLAY: ACTIVE' : 'AUTOPLAY: AKTIF'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-gray-400" />
                  <span>{language === 'en' ? 'AUTOPLAY: PAUSED' : 'AUTOPLAY: JEDA'}</span>
                </>
              )}
            </button>

            {/* Custom Interactive Speed Adjuster */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D1A]/60 border border-navy-blue/40">
              <span className="text-[10px] font-mono uppercase font-bold text-gray-500 mr-1">
                {language === 'en' ? 'Speed:' : 'Kecepatan:'}
              </span>
              {[
                { duration: 40, label: language === 'en' ? 'Slow' : 'Lambat' },
                { duration: 24, label: language === 'en' ? 'Normal' : 'Normal' },
                { duration: 12, label: language === 'en' ? 'Fast' : 'Cepat' }
              ].map((opt) => (
                <button
                  key={opt.duration}
                  onClick={() => {
                    setMarqueeDuration(opt.duration);
                    setIsPlaying(true);
                  }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-sans font-semibold transition-all cursor-pointer ${
                    marqueeDuration === opt.duration
                      ? 'bg-primary text-black font-bold shadow-[0_2px_10px_rgba(255,101,0,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PDF layout printable view helper (will render offscreen by default and display during standard window.print()) */}
        <div className="hidden print:block bg-white text-black p-8 font-sans">
          <h1 className="text-3xl font-extrabold">{certificatesData[0].issuer} and other partners</h1>
          <p className="mt-2 text-sm text-gray-600">Curriculum Vitae summary - Abid Ghufron portfolio document</p>
        </div>

      </div>

      {/* Certification Details Modal slide-up overlay */}
      <AnimatePresence>
        {activeCredentialModal && (
          <>
            {/* Modal backdrop wrapper click layer */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCredentialModal(null)}
            >
              {/* Modal window container card */}
              <motion.div
                className="bg-bg-card border border-navy-blue rounded-2xl w-full max-w-2xl overflow-hidden relative"
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header title close block */}
                <div className="p-5 border-b border-navy-blue flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="font-sans font-bold text-sm text-white uppercase tracking-wider">
                      {language === 'en' ? 'Credential Details' : 'Kredensial Sertifikasi'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveCredentialModal(null)}
                    className="p-1.5 rounded-lg bg-bg-base border border-navy-blue text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Preview certificate representation image inside modal */}
                <div className="aspect-[16/9] w-full bg-black relative border-b border-navy-blue">
                  <img
                    src={activeCredentialModal.imageUrl}
                    alt={activeCredentialModal.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 p-2 bg-emerald-500/10 backdrop-blur-sm rounded-lg border border-emerald-500/30 text-emerald-500 text-[10px] font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 bg-emerald-500/20 rounded-full" />
                    <span className="uppercase">{language === 'en' ? 'SECURE SSL VERIFIED' : 'VERIFIKASI SSL AMAN'}</span>
                  </div>
                </div>

                {/* Info block details inside modal */}
                <div className="p-6">
                  <h3 className="text-xl font-sans font-extrabold text-white mb-1">
                    {activeCredentialModal.title}
                  </h3>
                  <p className="text-sm font-sans text-gray-400">
                    {language === 'en' ? 'Official Issuer:' : 'Penerbit Resmi:'}{' '}
                    <span className="text-primary font-semibold">{activeCredentialModal.issuer}</span> &middot; {activeCredentialModal.date}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed font-sans">
                    {language === 'en' 
                      ? 'This certificate proves Abid Ghufron maintains exceptional proficiency in serverless cloud architecture, global state management interfaces, responsive pixel alignment grid networks, and modern Web Performance.'
                      : 'Sertifikat ini membuktikan Abid Ghufron berhak atas kemahiran yang tercantum dalam standar kualifikasi arsitektur cloud serverless, integrasi state manager global, penataan grid responsive, dan praktik terbaik Web Performance.'}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <motion.a
                      href={activeCredentialModal.credentialUrl}
                      target={activeCredentialModal.credentialUrl.endsWith('.pdf') ? '_blank' : undefined}
                      rel={activeCredentialModal.credentialUrl.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                      whileHover={{ 
                        scale: 1.04, 
                        y: -2,
                        boxShadow: '0 8px 25px rgba(255, 101, 0, 0.35)',
                      }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 12 }}
                      className="flex-1 py-3 px-4 rounded-xl bg-primary text-black font-semibold text-center text-xs tracking-wider uppercase cursor-pointer relative z-10"
                    >
                      {language === 'en' ? 'Open Official Credential' : 'Buka Kredensial Resmi'}
                    </motion.a>
                    <button
                      onClick={() => setActiveCredentialModal(null)}
                      className="flex-1 py-3 px-4 rounded-xl bg-bg-base border border-navy-blue text-gray-300 text-xs font-mono font-semibold hover:border-gray-500 transition-all text-center cursor-pointer"
                    >
                      {language === 'en' ? 'Close Preview' : 'Tutup Pratinjau'}
                    </button>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}