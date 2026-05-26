import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MapPin, Send, MessageSquare, Sparkles, CheckSquare, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MagicCard from './MagicCard';

const GithubIcon = ({ className = "w-5 h-5", ...props }) => (
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

const LinkedinIcon = ({ className = "w-5 h-5", ...props }) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5", ...props }) => (
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
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5", ...props }) => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Contact() {
  const { language, t, personalData } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false
  });

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    if (name === 'name') {
      if (!value.trim()) {
        errorMsg = t('validationNameRequired');
      } else if (value.trim().length < 3) {
        errorMsg = t('validationNameLength');
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        errorMsg = t('validationEmailRequired');
      } else if (!emailRegex.test(value.trim())) {
        errorMsg = t('validationEmailFormat');
      }
    } else if (name === 'message') {
      if (!value.trim()) {
        errorMsg = t('validationMessageRequired');
      } else if (value.trim().length < 15) {
        errorMsg = t('validationMessageLength');
      }
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as 'name' | 'email' | 'message']) {
      validateField(name, value);
    }
  };

  const handleInputBlur = (name: 'name' | 'email' | 'message') => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Set all fields touched and perform full sync validation
    const fullTouched = { name: true, email: true, message: true };
    setTouched(fullTouched);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;
    const newErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) {
      newErrors.name = t('validationNameRequired');
      hasError = true;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('validationNameLength');
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validationEmailRequired');
      hasError = true;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = t('validationEmailFormat');
      hasError = true;
    }

    if (!formData.message.trim()) {
      newErrors.message = t('validationMessageRequired');
      hasError = true;
    } else if (formData.message.trim().length < 15) {
      newErrors.message = t('validationMessageLength');
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setIsSubmitting(true);

    // Simulated network latency
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });

      // Reset success status after 5 seconds
      setTimeout(() => {
        setIsSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="py-24 bg-bg-base relative overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-navy-blue/15 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          className="mb-16 text-center max-w-xl mx-auto pb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-blue border border-navy-blue/80 text-primary text-xs font-mono uppercase mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('contactSectionBadge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight">
            {t('contactHeadingIntro')} <span className="text-primary">{t('contactHeadingPrimary')}</span> {t('contactHeadingOutro')}
          </h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Form and Coordinates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
          
          {/* Column Left: Information Panel & Socials (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8 h-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <MagicCard className="p-8 flex flex-col gap-6 h-full font-sans">
                <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>{t('contactIntroTitle')}</span>
                </h3>
                <p className="text-gray-400 font-sans text-sm leading-relaxed">
                  {t('contactIntroText')}
                </p>

                <hr className="border-navy-blue/60" />

                {/* Geographical and electronic cards */}
                <div className="flex flex-col gap-4 text-sm font-sans">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-bg-base border border-navy-blue text-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono">{language === 'en' ? 'LOCATION' : 'LOKASI'}</p>
                      <p className="font-semibold text-white">{personalData.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-bg-base border border-navy-blue text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono">{language === 'en' ? 'OFFICIAL EMAIL' : 'SUREL RESMI'}</p>
                      <a href={`mailto:${personalData.email}`} className="font-semibold text-white hover:text-primary transition-colors">
                        {personalData.email}
                      </a>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </motion.div>

            {/* Social Media links with transition effects */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-xs font-mono text-gray-500 font-semibold tracking-widest uppercase">{language === 'en' ? 'CONNECT ON SOCIALS' : 'TERHUBUNG DI MEDIA SOSIAL'}</p>
              
              <div className="flex items-center gap-3">
                <motion.a
                  href={personalData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-bg-card border border-navy-blue text-gray-300 hover:text-primary hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                  whileHover={{ y: -6, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <GithubIcon className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href={personalData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-bg-card border border-navy-blue text-gray-300 hover:text-primary hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                  whileHover={{ y: -6, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <LinkedinIcon className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href={personalData.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-bg-card border border-navy-blue text-gray-300 hover:text-primary hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                  whileHover={{ y: -6, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <TwitterIcon className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href={personalData.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-bg-card border border-navy-blue text-gray-300 hover:text-primary hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                  whileHover={{ y: -6, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <InstagramIcon className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Column Right: Interactive minimal glowing contact form (7 Columns) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <MagicCard className="p-8 h-full font-sans">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans">
                  
                  {/* Inputs Row (Name) */}
                  <div className="flex flex-col gap-2 font-sans">
                    <label htmlFor="name-input" className="text-xs font-mono font-bold text-gray-400 tracking-wider font-mono">{t('contactFormName')}</label>
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => handleInputBlur('name')}
                      placeholder={t('contactFormNamePlaceholder')}
                      className={`w-full bg-bg-base/70 border focus:outline-none focus:ring-1 rounded-xl p-3.5 text-sm font-sans text-gray-200 placeholder-gray-600 transition-all duration-300 ${
                        touched.name && errors.name
                          ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                          : 'border-navy-blue focus:border-primary focus:ring-primary/40'
                      }`}
                    />
                    {touched.name && errors.name && (
                      <span className="text-red-500 text-xs font-mono select-none mt-1">{errors.name}</span>
                    )}
                  </div>

                  {/* Inputs Row (Email) */}
                  <div className="flex flex-col gap-2 font-sans">
                    <label htmlFor="email-input" className="text-xs font-mono font-bold text-gray-400 tracking-wider font-mono">{t('contactFormEmail')}</label>
                    <input
                      id="email-input"
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={() => handleInputBlur('email')}
                      placeholder={t('contactFormEmailPlaceholder')}
                      className={`w-full bg-bg-base/70 border focus:outline-none focus:ring-1 rounded-xl p-3.5 text-sm font-sans text-gray-200 placeholder-gray-600 transition-all duration-300 ${
                        touched.email && errors.email
                          ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                          : 'border-navy-blue focus:border-primary focus:ring-primary/40'
                      }`}
                    />
                    {touched.email && errors.email && (
                      <span className="text-red-500 text-xs font-mono select-none mt-1">{errors.email}</span>
                    )}
                  </div>

                  {/* Inputs Row (Message) */}
                  <div className="flex flex-col gap-2 font-sans">
                    <label htmlFor="message-input" className="text-xs font-mono font-bold text-gray-400 tracking-wider font-mono">{t('contactFormMsg')}</label>
                    <textarea
                      id="message-input"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={() => handleInputBlur('message')}
                      placeholder={t('contactFormMsgPlaceholder')}
                      className={`w-full bg-bg-base/70 border focus:outline-none focus:ring-1 rounded-xl p-3.5 text-sm font-sans text-gray-200 placeholder-gray-600 transition-all duration-300 resize-none ${
                        touched.message && errors.message
                          ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30'
                          : 'border-navy-blue focus:border-primary focus:ring-primary/40'
                      }`}
                    />
                    {touched.message && errors.message && (
                      <span className="text-red-500 text-xs font-mono select-none mt-1">{errors.message}</span>
                    )}
                  </div>

                  {/* Submit button with glow dynamics */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ 
                      scale: 1.03, 
                      y: -2,
                      boxShadow: '0 12px 30px rgba(255, 101, 0, 0.45)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 12 }}
                    className="w-full py-4 rounded-xl bg-primary text-black font-sans font-bold text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(255,101,0,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 relative z-10 outline-none"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>{t('contactFormSending')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('contactFormSubmit')}</span>
                      </>
                    )}
                  </motion.button>

                </form>
              </MagicCard>
            </motion.div>
          </div>

        </div>

      </div>

      {/* Floating Toast Success Notification */}
      <AnimatePresence>
        {isSubmitSuccess && (
          <motion.div
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 max-w-sm w-[calc(100vw-3rem)] bg-bg-card border border-navy-blue border-l-4 border-l-primary shadow-[0_15px_40px_rgba(0,0,0,0.6)] rounded-2xl p-4 flex gap-4 items-start select-none backdrop-blur-md"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div className="flex-shrink-0 p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 font-sans">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">{t('contactToastSuccess')}</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                {t('contactToastSuccessSub')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSubmitSuccess(false)}
              className="flex-shrink-0 text-gray-500 hover:text-white transition-colors p-1 hover:bg-navy-blue rounded-lg cursor-pointer outline-none"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
