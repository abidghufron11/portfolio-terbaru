import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Skill } from '../types';
import MagicCard from './MagicCard';

// A comprehensive mapping of various technology names and casings to standard Lucide icons
const ICON_MAPPING: Record<string, string> = {
  // Direct lowercase matching support
  'code2': 'Code2',
  'shieldalert': 'ShieldAlert',
  'palette': 'Palette',
  'activity': 'Activity',
  'layers': 'Layers',
  'server': 'Server',
  'database': 'Database',
  'smartphone': 'Smartphone',
  'laptop': 'Laptop',
  'gitbranch': 'GitBranch',
  'cloud': 'Cloud',
  'checksquare': 'CheckSquare',

  // Tech alias resolutions
  'typescript': 'ShieldAlert',
  'typescriptbasics': 'ShieldAlert',
  'javascript': 'Code2',
  'react': 'Code2',
  'reactjs': 'Code2',
  'nextjs': 'Code2',
  'next': 'Code2',
  'tailwindcss': 'Palette',
  'tailwind': 'Palette',
  'framermotion': 'Activity',
  'motion': 'Activity',
  'redux': 'Layers',
  'reduxtoolkit': 'Layers',
  'zustand': 'Layers',
  'nodejs': 'Server',
  'node': 'Server',
  'nestjs': 'Server',
  'express': 'Server',
  'supabase': 'Database',
  'firebase': 'Database',
  'sql': 'Database',
  'android': 'Smartphone',
  'androidstudio': 'Smartphone',
  'flutter': 'Laptop',
  'flutterbasics': 'Laptop',
  'git': 'GitBranch',
  'github': 'GitBranch',
  'gitworkflows': 'GitBranch',
  'vercel': 'Cloud',
  'amplify': 'Cloud',
  'aws': 'Cloud',
  'testing': 'CheckSquare',
  'jest': 'CheckSquare',
  'cicd': 'CheckSquare',
};

interface DynamicSkillIconProps {
  name: string;
  className?: string;
}

// Suspense-based lazy dynamic icon loader
const DynamicSkillIcon = ({ name, className = "w-5 h-5 text-primary" }: DynamicSkillIconProps) => {
  const IconComponent = React.useMemo(() => {
    return React.lazy(() => 
      import('lucide-react')
        .then((module: any) => {
          // 1. Check if direct key exists as exported by Lucide (e.g. 'Code2' or 'ShieldAlert')
          if (module[name]) {
            return { default: module[name] };
          }

          // 2. Normalize and check mapping dictionary
          const normalized = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const mappedName = ICON_MAPPING[normalized];
          
          if (mappedName && module[mappedName]) {
            return { default: module[mappedName] };
          }

          // 3. Try to find a case-insensitive key match from all module exports
          const lowerCaseName = name.toLowerCase();
          const foundKey = Object.keys(module).find(
            (key) => key.toLowerCase() === lowerCaseName
          );
          if (foundKey && module[foundKey]) {
            return { default: module[foundKey] };
          }

          // 4. Default safe fallback
          return { default: module.Wrench || module.HelpCircle };
        })
        .catch(() => {
          // Static fallback in case dynamics or lazy resolution fail (e.g. offline browser)
          return { default: LucideIcons.Wrench };
        })
    );
  }, [name]);

  return (
    <React.Suspense 
      fallback={
        <div className="w-5 h-5 rounded-md bg-primary/10 animate-pulse border border-primary/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary/40" />
        </div>
      }
    >
      <IconComponent className={className} />
    </React.Suspense>
  );
};

interface SkillItemProps {
  skill: Skill;
  key?: string;
}

function SkillCard({ skill }: SkillItemProps) {
  const { language, t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      key={skill.name}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative h-full transition-[z-index] ${isHovered ? 'z-50' : 'z-0'}`}
    >
      {/* Tooltip rendered outside MagicCard to bypass overflow-hidden */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-[260px] p-4 bg-bg-card border border-navy-blue rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.85)] z-50 pointer-events-none text-left backdrop-blur-md"
          >
            <div className="flex flex-col gap-1.5 font-sans">
              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
                {skill.name}
              </span>
              <p className="text-[11px] font-sans text-gray-300 leading-relaxed">
                {skill.description || (language === 'en' ? 'Technical and architectural skills at production scale.' : 'Keahlian teknis dan arsitektural berskala produksi.')}
              </p>
              {skill.yearsOfExp !== undefined && (
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/95 font-bold uppercase tracking-widest border-t border-navy-blue/80 pt-2 mt-1">
                  <LucideIcons.Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{language === 'en' ? 'Experience' : 'Pengalaman'}: {skill.yearsOfExp} {language === 'en' ? 'Years' : 'Tahun'}</span>
                </div>
              )}
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-bg-card border-r border-b border-navy-blue rotate-45 -mt-1.5" />
          </motion.div>
        )}
      </AnimatePresence>

      <MagicCard className="p-5 flex flex-col justify-between h-full group cursor-default">
        {/* Header card skill */}
        <div className="flex items-center gap-3.5 mb-5 select-none font-sans">
          <div className="p-3 bg-bg-base border border-navy-blue rounded-xl flex items-center justify-center group-hover:border-primary/45 group-hover:bg-primary/5 transition-all duration-300">
            <DynamicSkillIcon name={skill.iconName} className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-sans font-bold text-white group-hover:text-primary transition-colors duration-300">
              {skill.name}
            </h3>
            <span className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-widest block mt-0.5">
              {skill.category}
            </span>
          </div>
        </div>

        {/* Progress Level bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-1.5 font-sans">
            <span>{t('skillsSortLevel')}</span>
            <span className="text-primary font-bold">{skill.level}%</span>
          </div>
          
          {/* Progress track container */}
          <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden border border-navy-blue/80">
            <motion.div
              className="h-full bg-primary rounded-full shadow-[0_0_8px_#FF6500]"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </MagicCard>
    </motion.div>
  );
}

export default function Skills() {
  const { language, t, skillsData } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>(language === 'en' ? 'All' : 'Semua');
  const [sortBy, setSortBy] = useState<'level' | 'alphabetical'>('level');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light'));

    const observer = new MutationObserver(() => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setSelectedCategory(language === 'en' ? 'All' : 'Semua');
  }, [language]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categories = language === 'en' 
    ? ['All', 'Frontend', 'Backend', 'Mobile', 'Tools & DevOps']
    : ['Semua', 'Frontend', 'Backend', 'Mobile', 'Tools & DevOps'];

  const filteredSkills = (selectedCategory === 'Semua' || selectedCategory === 'All'
    ? skillsData 
    : skillsData.filter(skill => skill.category === selectedCategory)
  ).slice().sort((a, b) => {
    if (sortBy === 'level') {
      return b.level - a.level;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Helper to render lucide icon dynamically
  const renderSkillIcon = (iconName: string) => {
    return <DynamicSkillIcon name={iconName} className="w-5 h-5 text-primary" />;
  };

  return (
    <section
      id="skills"
      className="py-24 bg-bg-base relative overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-10 w-[400px] h-[400px] rounded-full bg-navy-blue/15 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <motion.div 
          className="mb-16 text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-blue border border-navy-blue/80 text-primary text-xs font-mono uppercase mb-4">
            <LucideIcons.Wrench className="w-3.5 h-3.5" />
            <span>{t('skillsSectionBadge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight">
            {t('skillsHeadingIntro')} <span className="text-primary">{t('skillsHeadingPrimary')}</span> {t('skillsHeadingOutro')}
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Filter and Sort bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          {/* Filter Navigation Tabs */}
          <div 
            role="tablist" 
            aria-label="Kategori keahlian" 
            className="flex flex-wrap items-center justify-center md:justify-start gap-2"
          >
            {categories.map((cat, idx) => {
              const isActive = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="skills-grid"
                  aria-label={cat === 'Semua' || cat === 'All' ? (language === 'en' ? 'Show all skills' : 'Tampilkan semua keahlian') : `${language === 'en' ? 'Show' : 'Tampilkan'} ${cat}`}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono font-semibold tracking-wider uppercase border transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? 'border-primary/50 text-primary bg-primary/8 shadow-[0_4px_15px_rgba(255,101,0,0.15)]'
                      : 'border-navy-blue text-gray-400 bg-bg-card/45 hover:text-white hover:border-navy-blue/100'
                  }`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              );
            })}
          </div>

          {/* Sort Dropdown Selector */}
          <div ref={dropdownRef} className="relative self-center md:self-auto min-w-[200px] z-20">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-bg-card/45 border border-navy-blue hover:border-primary/50 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer outline-none"
              aria-expanded={isSortOpen}
              aria-haspopup="listbox"
              aria-label="Urutkan keahlian"
            >
              <span className="flex items-center gap-2">
                <LucideIcons.ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                <span>Sort: {sortBy === 'level' ? (language === 'en' ? 'Highest Level' : 'Tingkat Teratas') : (language === 'en' ? 'Alphabetical (A-Z)' : 'Abjad (A-Z)')}</span>
              </span>
              <LucideIcons.ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 left-0 md:left-auto md:w-56 mt-2 rounded-xl bg-bg-card border border-navy-blue overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-30 font-sans"
                  role="listbox"
                  aria-label="Opsi pengurutan"
                >
                  <button
                    onClick={() => {
                      setSortBy('level');
                      setIsSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortBy === 'level'}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-xs font-mono text-left cursor-pointer transition-colors ${
                      sortBy === 'level'
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-400 hover:bg-navy-blue hover:text-white'
                    }`}
                  >
                    <span>{language === 'en' ? 'Highest Level' : 'Tingkat Teratas'}</span>
                    {sortBy === 'level' && <LucideIcons.Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('alphabetical');
                      setIsSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortBy === 'alphabetical'}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-xs font-mono text-left cursor-pointer transition-colors ${
                      sortBy === 'alphabetical'
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-400 hover:bg-navy-blue hover:text-white'
                    }`}
                  >
                    <span>{language === 'en' ? 'Alphabetical (A-Z)' : 'Sesuai Abjad (A-Z)'}</span>
                    {sortBy === 'alphabetical' && <LucideIcons.Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Skills Cards Grid */}
        <motion.div 
          layout
          id="skills-grid"
          role="tabpanel"
          aria-label={`Daftar keahlian kategori ${selectedCategory}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom micro-copy helper layout */}
        <div className="mt-12 text-center">
          <p className="text-xs font-mono text-gray-500 max-w-xl mx-auto leading-relaxed">
            {language === 'en' 
              ? '* Proficiency levels correspond to successful product delivery, production contribution hours, and architectural elegance.' 
              : '* Tingkat kemahiran berdasarkan akumulasi keberhasilan proyek, jam kontribusi produksi, dan efisiensi arsitektural.'}
          </p>
        </div>

        {/* Infinite Looping Logo Marquee */}
        <div className="relative w-full overflow-hidden mt-16 py-6 bg-transparent">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-scroll {
              display: flex;
              width: max-content;
              animation: marquee 35s linear infinite;
            }
            .animate-marquee-scroll:hover {
              animation-play-state: paused;
            }
          `}} />
          
          {/* Fading Edge overlays */}
          <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden w-full py-6">
            <div className="animate-marquee-scroll flex items-center whitespace-nowrap">
              {/* Loop items list part 1 */}
              <div className="flex shrink-0 items-center gap-16 pr-16 py-4">
                {[
                  { name: 'TypeScript', url: 'https://cdn.simpleicons.org/typescript' },
                  { name: 'Tailwind CSS', url: 'https://cdn.simpleicons.org/tailwindcss' },
                  { name: 'React', url: 'https://cdn.simpleicons.org/react' },
                  { name: 'Next.js', url: isLightMode ? 'https://cdn.simpleicons.org/nextdotjs/000000' : 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
                  { name: 'Framer Motion', url: isLightMode ? 'https://cdn.simpleicons.org/framer/000000' : 'https://cdn.simpleicons.org/framer/ffffff' },
                  { name: 'Node.js', url: 'https://cdn.simpleicons.org/nodedotjs' },
                  { name: 'Supabase', url: 'https://cdn.simpleicons.org/supabase' },
                  { name: 'Android', url: 'https://cdn.simpleicons.org/android' },
                  { name: 'Flutter', url: 'https://cdn.simpleicons.org/flutter' },
                  { name: 'Solidity', url: isLightMode ? 'https://cdn.simpleicons.org/solidity/000000' : 'https://cdn.simpleicons.org/solidity/ffffff' },
                  { name: 'GitHub', url: isLightMode ? 'https://cdn.simpleicons.org/github/000000' : 'https://cdn.simpleicons.org/github/ffffff' },
                  { name: 'Vercel', url: isLightMode ? 'https://cdn.simpleicons.org/vercel/000000' : 'https://cdn.simpleicons.org/vercel/ffffff' },
                  { name: 'Vite', url: 'https://cdn.simpleicons.org/vite' },
                ].map((tech, index) => (
                  <img
                    key={`tech-logo-1-${index}`}
                    src={tech.url}
                    alt={tech.name}
                    title={tech.name}
                    referrerPolicy="no-referrer"
                    className="h-10 md:h-12 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-120 hover:drop-shadow-[0_0_15px_rgba(255,101,0,0.65)] select-none cursor-pointer"
                  />
                ))}
              </div>
              {/* Loop items list part 2 (duplicate for seamless loop) */}
              <div className="flex shrink-0 items-center gap-16 pr-16 py-4">
                {[
                  { name: 'TypeScript', url: 'https://cdn.simpleicons.org/typescript' },
                  { name: 'Tailwind CSS', url: 'https://cdn.simpleicons.org/tailwindcss' },
                  { name: 'React', url: 'https://cdn.simpleicons.org/react' },
                  { name: 'Next.js', url: isLightMode ? 'https://cdn.simpleicons.org/nextdotjs/000000' : 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
                  { name: 'Framer Motion', url: isLightMode ? 'https://cdn.simpleicons.org/framer/000000' : 'https://cdn.simpleicons.org/framer/ffffff' },
                  { name: 'Node.js', url: 'https://cdn.simpleicons.org/nodedotjs' },
                  { name: 'Supabase', url: 'https://cdn.simpleicons.org/supabase' },
                  { name: 'Android', url: 'https://cdn.simpleicons.org/android' },
                  { name: 'Flutter', url: 'https://cdn.simpleicons.org/flutter' },
                  { name: 'Solidity', url: isLightMode ? 'https://cdn.simpleicons.org/solidity/000000' : 'https://cdn.simpleicons.org/solidity/ffffff' },
                  { name: 'GitHub', url: isLightMode ? 'https://cdn.simpleicons.org/github/000000' : 'https://cdn.simpleicons.org/github/ffffff' },
                  { name: 'Vercel', url: isLightMode ? 'https://cdn.simpleicons.org/vercel/000000' : 'https://cdn.simpleicons.org/vercel/ffffff' },
                  { name: 'Vite', url: 'https://cdn.simpleicons.org/vite' },
                ].map((tech, index) => (
                  <img
                    key={`tech-logo-2-${index}`}
                    src={tech.url}
                    alt={tech.name}
                    title={tech.name}
                    referrerPolicy="no-referrer"
                    className="h-10 md:h-12 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-120 hover:drop-shadow-[0_0_15px_rgba(255,101,0,0.65)] select-none cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
