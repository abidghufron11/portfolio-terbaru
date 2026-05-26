import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, ExternalLink, Star, GitFork, ArrowUpRight, Search, Cpu, Clock } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { Project } from '../types';
import MagicCard from './MagicCard';

const calculateReadingTime = (description: string, features?: string[]) => {
  const combinedText = [description, ...(features || [])].join(' ');
  const words = combinedText.trim().split(/\s+/).filter(Boolean).length;
  // Estimate based on standard 180 words per minute for technical reading
  return Math.max(1, Math.ceil(words / 180));
};

const GithubIcon = ({ className = "w-3.5 h-3.5", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Projects() {
  const { language, t, projectsData } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>(language === 'en' ? 'All' : 'Semua');
  const [pendingCategory, setPendingCategory] = useState<string>(language === 'en' ? 'All' : 'Semua');
  const [isPending, setIsPending] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setActiveCategory(language === 'en' ? 'All' : 'Semua');
    setPendingCategory(language === 'en' ? 'All' : 'Semua');
  }, [language]);

  const categories = language === 'en' 
    ? ['All', 'Full-Stack', 'Frontend', 'Backend', 'Mobile']
    : ['Semua', 'Full-Stack', 'Frontend', 'Backend', 'Mobile'];

  const filteredProjects = activeCategory === 'Semua' || activeCategory === 'All'
    ? projectsData
    : projectsData.filter(proj => proj.category === activeCategory);

  const pendingProjects = pendingCategory === 'Semua' || pendingCategory === 'All'
    ? projectsData
    : projectsData.filter(proj => proj.category === pendingCategory);

  const handleCategoryChange = (cat: string) => {
    if (cat === activeCategory || isPending) return;
    setPendingCategory(cat);
    setIsPending(true);
    setTimeout(() => {
      setActiveCategory(cat);
      setIsPending(false);
    }, 450); // simulated asynchronous latency for elite feels
  };

  // Metrics calculation
  const totalProjects = projectsData.length;
  const totalStars = projectsData.reduce((acc, p) => acc + (p.stars || 0), 0);
  const totalForks = projectsData.reduce((acc, p) => acc + (p.forks || 0), 0);
  const totalCategories = new Set(projectsData.map(p => p.category)).size;

  // Dynamic parsing & normalization of technology tags for Recharts radar chart
  const techMap: Record<string, number> = {};
  projectsData.forEach((project) => {
    project.tags.forEach((tag) => {
      let normalized = tag;
      if (tag === 'React.js' || tag === 'React') {
        normalized = 'React';
      } else if (tag.includes('Tailwind')) {
        normalized = 'Tailwind';
      } else if (tag === 'Solidity' || tag === 'Web3') {
        normalized = 'Blockchain';
      } else if (tag.includes('Gemini')) {
        normalized = 'Gemini AI';
      } else if (tag === 'Framer Motion') {
        normalized = 'Motion';
      }
      techMap[normalized] = (techMap[normalized] || 0) + 1;
    });
  });

  const radarData = Object.entries(techMap)
    .map(([tech, count]) => ({
      subject: tech,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // show top 6 tech tags for visual balance

  interface TooltipProps {
    active?: boolean;
    payload?: { name: string; value: any; payload: any }[];
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-card border border-navy-blue p-2.5 rounded-xl shadow-xl backdrop-blur-md font-sans">
          <p className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
            {payload[0].payload.subject}
          </p>
          <p className="text-xs font-sans text-primary mt-1">
            {language === 'en' ? 'Used: ' : 'Digunakan: '}<span className="font-mono font-bold text-white">{payload[0].value} {language === 'en' ? 'Projects' : 'Proyek'}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Pulse loader skeleton layout structure that dynamically matches card count in incoming view
  const renderSkeletons = (count: number) => (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx}>
          <MagicCard className="p-6 flex flex-col justify-between h-full relative overflow-hidden select-none">
            {/* Shimmer light bar sweeping animation via Framer Motion for premium cross-platform robustness */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: 'linear'
              }}
            />

            <div className="w-full">
              {/* Card head: Folders and Github stats */}
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 bg-bg-base border border-navy-blue rounded-xl text-primary/30 w-11 h-11 flex items-center justify-center animate-pulse">
                  <Folder className="w-5 h-5 text-navy-blue/40" />
                </div>
                
                {/* Repository metrics placeholders */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 animate-pulse bg-navy-blue/20 px-2 py-1 rounded">
                    <Star className="w-3.5 h-3.5 text-navy-blue/30 fill-navy-blue/10" />
                    <div className="w-4 h-3.5 bg-navy-blue/30 rounded" />
                  </div>
                  <div className="flex items-center gap-1 animate-pulse bg-navy-blue/20 px-2 py-1 rounded">
                    <GitFork className="w-3.5 h-3.5 text-navy-blue/30" />
                    <div className="w-4 h-3.5 bg-navy-blue/30 rounded" />
                  </div>
                </div>
              </div>

              {/* Simulated premium image aspect-ratio placeholder with deep styling */}
              <div className="relative aspect-[16/10] rounded-xl bg-navy-blue/15 border border-navy-blue/40 mb-5 animate-pulse w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <div className="w-10 h-10 rounded-full border-2 border-navy-blue/20 border-t-primary/20 animate-spin" />
              </div>

              {/* Title and category tag layout */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <div className="inline-block px-2.5 py-1 rounded-md border border-navy-blue/40 bg-bg-base/50 animate-pulse">
                    <div className="w-12 h-3 bg-navy-blue/25 rounded" />
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-md border border-navy-blue/40 bg-bg-base/50 animate-pulse">
                    <div className="w-16 h-3 bg-navy-blue/25 rounded" />
                  </div>
                </div>
                <div className="w-3/4 h-6 bg-navy-blue/35 rounded-md mt-3 animate-pulse" />
              </div>

              {/* Description */}
              <div className="space-y-2 mb-4">
                <div className="w-full h-3.5 bg-navy-blue/20 rounded animate-pulse" />
                <div className="w-11/12 h-3.5 bg-navy-blue/20 rounded animate-pulse" />
              </div>
            </div>

            {/* Tags and trigger action buttons */}
            <div className="w-full">
              {/* Technology stacks inside badge array */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className="h-6 w-14 bg-bg-base rounded-md border border-navy-blue/30 animate-pulse flex items-center justify-center"
                  >
                    <div className="w-8 h-2 bg-navy-blue/20 rounded" />
                  </div>
                ))}
              </div>

              {/* Operational Links */}
              <div className="grid grid-cols-2 gap-3 border-t border-navy-blue/50 pt-4">
                <div className="h-10 rounded-xl border border-navy-blue/30 bg-navy-blue/10 animate-pulse flex items-center justify-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 text-navy-blue/30" />
                  <div className="w-12 h-3 bg-navy-blue/20 rounded" />
                </div>
                
                <div className="h-10 rounded-xl bg-bg-base border border-navy-blue/30 animate-pulse flex items-center justify-center gap-1">
                  <GithubIcon className="w-3.5 h-3.5 text-navy-blue/30" />
                  <div className="w-12 h-3 bg-navy-blue/20 rounded" />
                </div>
              </div>
            </div>
          </MagicCard>
        </div>
      ))}
    </>
  );

  // Framer Motion staggered variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 85,
        damping: 15
      } 
    }
  };

  return (
    <section
      id="projects"
      className="py-24 bg-bg-base relative overflow-hidden"
    >
      {/* Background grids */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-navy-blue/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          className="mb-12 text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-blue border border-navy-blue/80 text-primary text-xs font-mono uppercase mb-4">
            <Folder className="w-3.5 h-3.5" />
            <span>{t('projectsSectionBadge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight">
            {t('projectsHeadingIntro')} <span className="text-primary">{t('projectsHeadingPrimary')}</span> {t('projectsHeadingOutro')}
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Dynamic Project Statistics & Technology Distribution Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto mb-12 items-stretch font-sans">
          {/* Left: 4 Metrics Cards */}
          <motion.div 
            className="lg:col-span-7 grid grid-cols-2 gap-4 h-full"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-bg-card/45 border border-navy-blue/50 rounded-2xl p-5 text-center hover:border-primary/30 transition-all select-none group flex flex-col justify-center">
              <span className="block text-[10px] uppercase font-mono text-gray-500 group-hover:text-primary transition-colors tracking-wider mb-1">{t('projectsStatTotal')}</span>
              <span className="text-2xl font-bold text-white font-sans">{totalProjects}</span>
            </div>
            <div className="bg-bg-card/45 border border-navy-blue/50 rounded-2xl p-5 text-center hover:border-primary/30 transition-all select-none group flex flex-col justify-center">
              <span className="block text-[10px] uppercase font-mono text-gray-500 group-hover:text-primary transition-colors tracking-wider mb-1">{t('projectsStatStars')}</span>
              <span className="text-2xl font-bold text-primary font-sans">★ {totalStars}</span>
            </div>
            <div className="bg-bg-card/45 border border-navy-blue/50 rounded-2xl p-5 text-center hover:border-primary/30 transition-all select-none group flex flex-col justify-center">
              <span className="block text-[10px] uppercase font-mono text-gray-500 group-hover:text-primary transition-colors tracking-wider mb-1">{t('projectsStatForks')}</span>
              <span className="text-2xl font-bold text-white font-sans">{totalForks}</span>
            </div>
            <div className="bg-bg-card/45 border border-navy-blue/50 rounded-2xl p-5 text-center hover:border-primary/30 transition-all select-none group flex flex-col justify-center">
              <span className="block text-[10px] uppercase font-mono text-gray-500 group-hover:text-primary transition-colors tracking-wider mb-1">{t('projectsStatTech')}</span>
              <span className="text-2xl font-bold text-white font-sans">{totalCategories}</span>
            </div>
          </motion.div>

          {/* Right: Modern Technology Radar Chart */}
          <motion.div
            className="lg:col-span-5 h-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MagicCard className="p-5 h-full flex flex-col justify-between" disableHoverAmbient={false}>
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <div>
                  <span className="block text-[9px] uppercase font-mono text-primary font-bold tracking-widest">{t('projectsRadarSub')}</span>
                  <h4 className="text-sm font-sans font-extrabold text-white">{t('projectsRadarMain')}</h4>
                </div>
              </div>
              
              <div className="relative w-full h-[180px] flex items-center justify-center min-w-0 min-h-0">
                {hasMounted && (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace', fontWeight: 600 }}
                      />
                      <Radar
                        name="Proyek"
                        dataKey="value"
                        stroke="#ff6500"
                        fill="#ff6500"
                        fillOpacity={0.25}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </MagicCard>
          </motion.div>
        </div>

        {/* Project filtering tabs */}
        <motion.div 
          role="tablist"
          aria-label={language === 'en' ? 'Project categories' : 'Kategori proyek'}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                role="tab"
                aria-selected={isActive}
                aria-controls="projects-grid"
                aria-label={cat === 'Semua' || cat === 'All' ? (language === 'en' ? 'Show all projects' : 'Tampilkan semua proyek') : `${language === 'en' ? 'Show' : 'Tampilkan'} ${cat}`}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-medium tracking-wide border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border-primary bg-primary text-black font-semibold shadow-[0_4px_15px_rgba(255,101,0,0.25)]'
                    : 'border-navy-blue text-gray-400 bg-bg-card hover:text-white hover:border-navy-blue/100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Staggered grid of layouts */}
        <div 
          id="projects-grid" 
          role="tabpanel" 
          aria-label={`Katalog proyek kategori ${activeCategory}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {isPending ? (
              renderSkeletons(pendingProjects.length)
            ) : (
              filteredProjects.map((project) => {
                const isHovered = hoveredProjectId === project.id;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.94,
                      y: 15,
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } 
                    }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 110, 
                      damping: 18,
                      mass: 1
                    }}
                    onMouseEnter={() => setHoveredProjectId(project.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                  >
                    <MagicCard className="p-6 flex flex-col justify-between h-full relative">
                      <div>
                        {/* Card head: Folders and Github stats */}
                        <div className="flex items-center justify-between mb-5 select-none">
                          <div className={`p-3 bg-bg-base border border-navy-blue rounded-xl text-primary transition-all duration-300 ${isHovered ? 'scale-110 bg-primary/5 border-primary/30 text-primary' : 'text-primary/90'}`}>
                            <Folder className="w-5 h-5" />
                          </div>
                          
                          {/* Repository metrics */}
                          <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                            {project.stars && (
                              <div className={`flex items-center gap-1 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-gray-400'}`}>
                                <Star className={`w-3.5 h-3.5 transition-colors duration-300 ${isHovered ? 'fill-primary/25 text-primary' : 'fill-primary/5 text-gray-500'}`} />
                                <span>{project.stars}</span>
                              </div>
                            )}
                            {project.forks && (
                              <div className="flex items-center gap-1">
                                <GitFork className="w-3.5 h-3.5 text-gray-500" />
                                <span>{project.forks}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Thumbnail Image with premium absolute slide hover overlay */}
                        {project.imageUrl && (
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-navy-blue/40 mb-5 bg-navy-blue/15">
                            <motion.img
                              src={project.imageUrl}
                              alt={project.title}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              animate={{ 
                                scale: isHovered ? 1.05 : 1,
                                filter: isHovered ? 'blur(1px)' : 'blur(0px)'
                              }}
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />                             <AnimatePresence>
                              {isHovered && project.features && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 15 }}
                                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                  className="absolute inset-0 bg-bg-card/95 backdrop-blur-md flex flex-col justify-center p-5 z-10 pointer-events-none border border-primary/10 rounded-xl"
                                >
                                  <span className="block text-[9px] uppercase font-mono text-primary font-bold tracking-widest mb-2.5 text-left">
                                    {t('projectsHoverFeature')}
                                  </span>
                                  <div className="space-y-1.5 text-left">
                                    {project.features.map((feat, index) => (
                                      <div key={index} className="flex items-start gap-1.5 text-xs font-sans text-gray-200">
                                        <span className="text-primary text-[11px] select-none mt-0.5 font-bold font-mono">✓</span>
                                        <span className="leading-snug">{feat}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {/* Title and category tag layout */}
                        <div className="mb-3 font-sans">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-gray-400 bg-bg-base px-2.5 py-1 rounded-md border border-navy-blue/80">
                              {project.category}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-mono font-bold text-gray-400 bg-navy-blue/20 px-2.5 py-1 rounded-md border border-navy-blue/40">
                              <Clock className="w-3 h-3 text-primary" />
                              <span>{calculateReadingTime(project.description, project.features)} {language === 'en' ? 'min read' : 'menit baca'}</span>
                            </span>
                          </div>
                          <h3 className={`text-lg font-sans font-bold mt-3 transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-white'}`}>
                            {project.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 font-sans text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                      </div>

                  {/* Tags and trigger action buttons */}
                  <div className="font-sans">
                    {/* Technology stacks inside badge array */}
                    <div className="flex flex-wrap gap-2 mb-6 font-mono">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono font-medium tracking-wide text-gray-300 px-2.5 py-1 bg-bg-base rounded-md border border-navy-blue/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Operational Links */}
                    <div className="grid grid-cols-2 gap-3 border-t border-navy-blue/80 pt-4 font-sans">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="referrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-primary text-primary font-sans font-semibold text-xs uppercase tracking-wider bg-transparent hover:bg-primary hover:text-black transition-all duration-200 select-none cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                      
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="referrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-bg-base border border-navy-blue hover:border-gray-600 font-mono text-xs text-gray-300 hover:text-white transition-all duration-200 select-none cursor-pointer"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Code Repo</span>
                      </a>
                    </div>
                  </div>
                </MagicCard>
              </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Global CTA pointing to GitHub profile */}
        <div className="mt-16 text-center font-sans">
          <motion.a
            href="https://github.com/abidghufron11"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-bg-card border border-navy-blue hover:border-primary/50 text-white hover:text-primary text-sm font-sans font-semibold transition-all duration-300 group shadow-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span>{t('projectsViewMoreGithub')}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-primary" />
          </motion.a>
        </div>

      </div>
    </section>
  );
}
