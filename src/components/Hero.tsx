import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Terminal, ChevronRight, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MagicCard from './MagicCard';

export default function Hero() {
  const { language, t, personalData } = useLanguage();
  const [displayText, setDisplayText] = useState('');
  const fullText = personalData.title;

  // Simple typewriter simulation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.substring(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [fullText]);

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
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
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-bg-base grid-mesh pt-28 pb-16 overflow-hidden"
    >
      {/* Background ambient light effects */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-navy-blue/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Intro Bento Block (8 Columns) */}
          <motion.div 
            className="lg:col-span-8 group"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MagicCard className="p-8 md:p-12 flex flex-col justify-center relative overflow-hidden h-full min-h-[500px]">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/4 opacity-10 blur-[110px] rounded-full group-hover:bg-primary/8 transition-all duration-500 pointer-events-none" />
              
              {/* Greeting badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-base border border-navy-blue text-sm w-fit mb-6 animate-pulse-subtle">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-gray-300 font-mono text-xs font-semibold">{t('collaborationAvailable')}</span>
              </div>

              {/* Intro description */}
              <p className="text-primary font-mono text-xs tracking-[0.25em] font-bold uppercase mb-4">
                {t('greetingTitle')}
              </p>

              {/* Large Name */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight text-white mb-2 leading-none">
                {language === 'en' ? (
                  <>Building <span className="text-primary font-sans">Digital</span><br />Modern Solutions</>
                ) : (
                  <>Membangun <span className="text-primary font-sans">Aplikasi</span><br />Digital Masa Depan</>
                )}
              </h1>

              {/* Typewritten Title */}
              <div className="min-h-[3rem] sm:min-h-[4rem] mb-6 flex items-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-sans font-medium text-gray-300">
                  {displayText}
                  <span className="inline-block w-1.5 h-5 ml-1 bg-primary animate-pulse" />
                </h2>
              </div>

              {/* Subtitle description */}
              <p className="text-gray-400 font-sans text-sm sm:text-base max-w-xl leading-relaxed mb-8">
                {personalData.subtitle}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-2">
                <motion.button
                  onClick={(e) => handleCtaClick(e, 'projects')}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -4,
                    boxShadow: '0 15px 35px rgba(255, 101, 0, 0.45)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 12 }}
                  className="px-6 py-3.5 rounded-xl text-black font-extrabold tracking-wide bg-primary shadow-lg shadow-primary/25 text-center cursor-pointer flex items-center justify-center gap-2 text-sm relative z-10 outline-none"
                >
                  {t('viewProjects')}
                  <ArrowDownRight className="w-4 h-4" />
                </motion.button>

                <a
                  href="#resume"
                  onClick={(e) => handleCtaClick(e, 'resume')}
                  className="px-6 py-3.5 rounded-xl text-white font-semibold font-sans tracking-wide bg-navy-blue/20 border border-navy-blue hover:bg-navy-blue/40 hover:border-primary/50 transition-all duration-300 text-center flex items-center justify-center gap-2 text-sm"
                >
                  {t('checkResume')}
                  <ChevronRight className="w-4 h-4 text-primary animate-pulse" />
                </a>
              </div>
            </MagicCard>
          </motion.div>

          {/* Core Info Bento Block (4 Columns) */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <MagicCard className="p-6 flex flex-col justify-between h-full relative overflow-hidden group">
              {/* Visual Header */}
              <div className="flex items-center justify-between border-b border-navy-blue/70 pb-4 mb-4 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E3E62]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-wider text-gray-500">ENGINE_LOG.SH</span>
                </div>
                <Terminal className="w-4 h-4 text-primary" />
              </div>

              {/* Simulated interactive stack code console */}
              <div className="flex-1 flex flex-col justify-center py-4 font-mono text-[11px] text-gray-400 gap-3">
                <p className="text-gray-500 font-sans">// {language === 'en' ? 'Active Profile Abid Ghufron' : 'Profil Aktif Abid Ghufron'}</p>
                <p>
                  <span className="text-primary">const</span> engineer = &#123;<br />
                  <span className="pl-4">name: <span className="text-emerald-400">"{personalData.name}"</span>,</span><br />
                  <span className="pl-4">status: <span className="text-emerald-400">"NEWBIE"</span>,</span><br />
                  <span className="pl-4">base: <span className="text-emerald-400 font-mono">"ID_PNG"</span>,</span><br />
                  <span className="pl-4">cleanCode: <span className="text-primary">true</span></span><br />
                  &#125;;
                </p>
                <div className="p-3 bg-bg-base border border-navy-blue rounded-xl mt-2 flex flex-col gap-1 hover:border-primary/45 transition-all duration-300">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold block">{t('latestStack')}</span>
                  <span className="font-sans font-bold text-white text-xs">ViteJS + React 19 + Tailwind v4 + Framer Motion v12</span>
                </div>
              </div>

              {/* Static Stats inside Bento */}
              <div className="border-t border-navy-blue/70 pt-4 mt-4 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold text-primary font-mono leading-none">3+</span>
                  <span className="text-[9px] font-mono text-gray-500 uppercase mt-1">{t('shortYears')}</span>
                </div>
                <div className="w-px h-8 bg-navy-blue" />
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold text-primary font-mono leading-none">25+</span>
                  <span className="text-[9px] font-mono text-gray-500 uppercase mt-1">{t('shortProjects')}</span>
                </div>
              </div>
            </MagicCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
