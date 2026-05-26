import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Mail, Coffee, Sparkles, Award, User, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MagicCard from './MagicCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
    },
  },
};

export default function About() {
  const { language, t, personalData, achievementsData } = useLanguage();

  return (
    <section
      id="about"
      className="py-24 bg-bg-base relative overflow-hidden"
    >
      {/* Background radial glowing gradients */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-navy-blue/15 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          className="mb-16 text-center max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-blue border border-navy-blue/80 text-primary text-xs font-mono uppercase mb-4">
            <User className="w-3.5 h-3.5" />
            <span>{t('aboutSectionBadge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight">
            {t('aboutHeadingIntro')} <span className="text-primary">{t('aboutHeadingPrimary')}</span> {t('aboutHeadingOutro')}
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Content Bento Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {/* Bento Card 1: Philosophy & Main Intro (col-span-8) */}
          <motion.div
            className="lg:col-span-8"
            variants={itemVariants}
          >
            <MagicCard className="p-8 md:p-10 flex flex-col justify-between h-full relative group">
              <div className="space-y-4">
                <h3 className="text-xl font-sans font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>{t('aboutMissionTitle')}</span>
                </h3>
                <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
                  {personalData.aboutText1}
                </p>
                <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed">
                  {personalData.aboutText2}
                </p>
              </div>

              {/* Contacts and Locations Inline Layout */}
              <div className="flex flex-wrap gap-3 mt-8 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-bg-base border border-navy-blue rounded-xl select-none">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{personalData.location}</span>
                </div>
                <a
                  href={`mailto:${personalData.email}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-bg-base border border-navy-blue hover:border-primary/40 rounded-xl group transition-all duration-300"
                >
                  <Mail className="w-3.5 h-3.5 text-primary group-hover:scale-105 transition-transform" />
                  <span className="group-hover:text-white transition-colors">{personalData.email}</span>
                </a>
                <div className="flex items-center gap-1.5 px-3 py-2 bg-bg-base border border-navy-blue rounded-xl select-none">
                  <Coffee className="w-3.5 h-3.5 text-primary" />
                  <span>Creative Engineering</span>
                </div>
              </div>
            </MagicCard>
          </motion.div>

          {/* Bento Card 2: Personal Stats/achievements (col-span-4) */}
          <motion.div 
            className="lg:col-span-4"
            variants={itemVariants}
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              {achievementsData.map((ach) => (
                <div key={ach.id} className="h-full">
                  <MagicCard className="p-5 text-center flex flex-col justify-center items-center h-full">
                    <span className="text-3xl md:text-4xl font-extrabold font-mono text-primary mb-1">
                      {ach.metric}
                    </span>
                    <span className="text-[11px] font-sans font-extrabold text-white mb-1 uppercase tracking-wider">
                      {ach.label}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-snug">
                      {ach.description}
                    </span>
                  </MagicCard>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento Card 3: Deep Stack Architecture Flow (col-span-7) */}
          <motion.div
            className="lg:col-span-7"
            variants={itemVariants}
          >
            <MagicCard className="p-6 flex flex-col justify-between h-full relative group font-sans">
              <div>
                <div className="flex items-center justify-between border-b border-navy-blue/70 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-mono font-extrabold text-gray-400 uppercase tracking-widest">{t('workflowHeading')}</span>
                  </div>
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans mb-4">
                  {t('workflowSub')}
                </p>
              </div>

              {/* Simulated pipeline architecture in clean compact Bento rows */}
              <div className="flex flex-col gap-3 py-1 font-mono text-xs text-gray-300">
                <div className="p-3 bg-bg-base border border-navy-blue rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-xs">01 / State Orchestration</p>
                    <p className="text-[10px] text-gray-500">Zustand & Context API</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary font-bold rounded-lg uppercase">OPTIMAL</span>
                </div>
                <div className="p-3 bg-bg-base border border-navy-blue rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-xs">02 / Style Compilation</p>
                    <p className="text-[10px] text-gray-500">Tailwind Engine v4 CSS</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-navy-blue/60 border border-navy-blue text-[#1E3E62] font-bold rounded-lg uppercase">STABLE</span>
                </div>
              </div>
            </MagicCard>
          </motion.div>

          {/* Bento Card 4: Modern Illustration representation (col-span-5) */}
          <motion.div
            className="lg:col-span-5"
            variants={itemVariants}
          >
            <MagicCard className="p-6 h-full flex flex-col justify-between group cursor-default">
              <div className="aspect-[4/3] w-full bg-bg-base rounded-2xl border border-navy-blue/70 relative overflow-hidden p-6 font-mono flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>METRICS ACTIVE</span>
                  <span className="animate-pulse text-emerald-500">&#9679; ONLINE</span>
                </div>

                <div className="py-2 flex flex-col gap-1 text-[11px] text-gray-400">
                  <p className="text-gray-500 font-sans">// Lighthouse audit report</p>
                  <div className="flex items-center justify-between font-mono">
                    <span>Performance:</span>
                    <span className="text-emerald-400 font-bold">100%</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span>Accessibility:</span>
                    <span className="text-emerald-400 font-bold">100%</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span>Best Practices:</span>
                    <span className="text-emerald-400 font-bold">100%</span>
                  </div>
                </div>

                <div className="text-[9px] text-gray-600 border-t border-navy-blue/70 pt-2">
                  LOC: JAKARTA // HOSTED ON CLOUD
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-mono text-[9px] text-gray-500 uppercase">SYS REVS: 4.8.2</span>
                <span className="text-primary font-bold font-mono text-[10px]">100% SEO FRIENDLY</span>
              </div>
            </MagicCard>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
