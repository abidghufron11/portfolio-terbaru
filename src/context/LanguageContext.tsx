import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavLink, Skill, Project, Certificate, Achievement } from '../types';
import {
  personalData as personalDataID,
  navLinks as navLinksID,
  skillsData as skillsDataID,
  projectsData as projectsDataID,
  certificatesData as certificatesDataID,
  achievementsData as achievementsDataID
} from '../data';

// --- EN TYPE TRANSLATIONS ---
export const personalDataEN = {
  name: "Abid Ghufron",
  title: "A Full-Stack & Frontend Engineer",
  subtitle: "Building Modern Digital Solutions with Maximum Performance and Perfect Aesthetics",
  aboutText1: "I am a Frontend Developer and Full-Stack Engineer who is highly dedicated to creating interactive, responsive, and high-performance web applications. With over 3 years of experience, I blend solid backend functionality with captivating frontend visual aesthetics.",
  aboutText2: "Based in Ponorogo, Indonesia, I focus on modern ecosystems like React, Node.js, Next.js, and serverless architectures. I always strive to write clean, maintainable code, while applying standard SEO practices and global accessibility to deliver the best user experiences.",
  avatarUrl: personalDataID.avatarUrl,
  cvUrl: personalDataID.cvUrl,
  location: "Ponorogo, Indonesia",
  email: "abidghufron11@gmail.com",
  socials: personalDataID.socials
};

export const navLinksEN: NavLink[] = [
  { label: 'Home', targetId: 'hero' },
  { label: 'About', targetId: 'about' },
  { label: 'Skills', targetId: 'skills' },
  { label: 'Projects', targetId: 'projects' },
  { label: 'Credentials', targetId: 'resume' },
  { label: 'Contact', targetId: 'contact' }
];

export const skillsDataEN: Skill[] = [
  { 
    ...skillsDataID[0],
    description: 'Interactive SPA/SSR web development with high performance and reactivity.'
  },
  { 
    ...skillsDataID[1],
    description: 'Writing large-scale code with a strict type system to minimize bugs.'
  },
  { 
    ...skillsDataID[2],
    description: 'Developing modern responsive layouts with lighting-fast utility classes.'
  },
  { 
    ...skillsDataID[3],
    description: 'Creating smooth, fluid micro-interactions and interface transitions.'
  },
  { 
    ...skillsDataID[4],
    description: 'Efficient centralized state management for large-scale application sync.'
  },
  { 
    ...skillsDataID[5],
    description: 'Building reliable, secure, scalable APIs and object-oriented backend architectures.'
  },
  { 
    ...skillsDataID[6],
    description: 'Postgres database integration, secure authentication, real-time socket, and storage.'
  },
  { 
    ...skillsDataID[7],
    description: 'Native mobile app development with dynamic user interface and stable performance.'
  },
  { 
    ...skillsDataID[8],
    description: 'Foundations of high-performance cross-platform mobile application development.'
  },
  { 
    ...skillsDataID[9],
    description: 'Structured version control, git flow collaboration, and thorough code reviews.'
  },
  { 
    ...skillsDataID[10],
    description: 'Instant automated deployments integrated with git CI/CD and cloud optimization.'
  },
  { 
    ...skillsDataID[11],
    description: 'Build automation pipelines, reliable unit testing, and quality assurance.'
  }
];

export const projectsDataEN: Project[] = [
  {
    ...projectsDataID[0],
    description: 'An AI-powered conversation client integrating modern language models, instant streaming responses, clean bento UI layout, and secure chat history.',
    features: [
      'Integrated Gemini Pro language model',
      'Instant responses with stream chunks',
      'Super-responsive contemporary Bento layout',
      'Persistently saved conversation history'
    ]
  },
  {
    ...projectsDataID[1],
    description: 'An encrypted blockchain-based digital health records management system, preserving patient medical privacy with secure Web3 smart contracts.',
    features: [
      'Audited Ethereum Solidity smart contracts',
      'Fully encrypted electronic medical records',
      'Web3 MetaMask wallet integration',
      'GDPR-compliant data architecture'
    ]
  },
  {
    ...projectsDataID[2],
    description: 'A modern interactive dark-ambient portfolio website with optimized performance, a modular bento-grid, artistic transitions, and dynamic glowing background particles.',
    features: [
      'Silky 60 FPS interface transition animations',
      'Build optimization with Tailwind v4 utilities',
      'Interactive background particle simulation',
      'Fully SEO friendly and globally accessible'
    ]
  }
];

export const certificatesDataEN: Certificate[] = [
  { ...certificatesDataID[0], date: 'December 2025' },
  { ...certificatesDataID[1], date: 'October 2025' },
  { ...certificatesDataID[2], date: 'March 2025' },
  { ...certificatesDataID[3], date: 'January 2025' }
];

export const achievementsDataEN: Achievement[] = [
  { id: 'ach-1', metric: '3+', label: 'Years of Experience', description: 'Actively working and designing enterprise-grade software' },
  { id: 'ach-2', metric: '25+', label: 'Projects Completed', description: 'From custom web solutions, internal systems, to sustainable mobile apps' },
  { id: 'ach-3', metric: '100%', label: 'Satisfied Clients', description: 'Delivering fast value, clean codebase, and solution-driven communication' },
  { id: 'ach-4', metric: '14k+', label: 'Code Contributions', description: 'Actively contributing to open-source communities at a global scale' }
];

// --- STATS DICTIONARY TRANSLATIONS ---
const UI_TRANSLATIONS = {
  id: {
    // Navbar / Brand
    devBadge: "DEV",
    viewIdentity: "Lihat Identitas",
    identityVerified: "Identitas Terverifikasi",
    shortBio: "Bio Singkat",
    locationLabel: "Lokasi",
    emailLabel: "Email Resmi",
    shortYears: "Tahun Pengalaman",
    shortProjects: "Project Sukses",
    contractAvailable: "Tersedia untuk Pekerjaan Kontrak / Penuh Waktu",
    sendMessageCTA: "Kirim Pesan",
    saveUrl: "Simpan URL",
    pasteCustomUrl: "Atau tempel URL foto kustom Anda di sini...",
    avatarConfigTitle: "Konfigurasi Avatar Dinamis",
    avatarConfigNote: "*Pilihan Anda disimpan otomatis di penjelajah lokal (Local Storage) browser Anda.",
    close: "Tutup",
    menu: "Menu",
    skillsTab: "Kemahiran",
    contactMeBtn: "Hubungi Saya",
    themeToggleLight: "Aktifkan Mode Terang",
    themeToggleDark: "Aktifkan Mode Gelap",

    // Hero Section
    collaborationAvailable: "Tersedia untuk Kolaborasi",
    greetingTitle: "SEORANG FRONTEND & FULL-STACK ENGINEER",
    mainHeading: "Membangun Aplikasi",
    subHeading: "Digital Masa Depan",
    viewProjects: "Lihat Project Saya",
    checkResume: "Cek Kredensial & CV",
    latestStack: "Teranyar Stack",

    // About Section
    aboutSectionBadge: "Tentang Saya",
    aboutHeadingIntro: "Mengenal",
    aboutHeadingPrimary: "Lebih Dekat",
    aboutHeadingOutro: "Profil Saya",
    aboutMissionTitle: "Misi & Filosofi Kerja Saya",
    workflowHeading: "SISTEM ALUR KERJA",
    workflowSub: "Pondasi pengembangan mengedepankan keamanan, performa loading kilat, struktur modular scalable, dan render sisi server (SSR) adaptif.",

    // Skills Section
    skillsSectionBadge: "Keahlian",
    skillsHeadingIntro: "Kumpulan",
    skillsHeadingPrimary: "Keahlian",
    skillsHeadingOutro: "Teknis Saya",
    skillsFilterAll: "Semua",
    skillsSortLabel: "Urutkan:",
    skillsSortLevel: "Kemahiran",
    skillsSortName: "Abjad",
    skillsNoCategory: "Tidak ada keahlian di kategori ini.",
    skillsSearchPlaceholder: "Cari keahlian teknis (React, Ts, dll)...",

    // Projects Section
    projectsSectionBadge: "Proyek Terpilih",
    projectsHeadingIntro: "Karya",
    projectsHeadingPrimary: "Pilihan Terbaik",
    projectsHeadingOutro: "Selesai",
    projectsSub: "Eksplorasi mahakarya digital komersial dan open-source yang dirancang dengan performa mutakhir, antarmuka fluid, dan logika bersih.",
    projectsCategoryAll: "Semua Kategori",
    projectsNoFound: "Tidak ketemu karya di bawah filter ini.",
    projectsStatTotal: "TOTAL PROYEK",
    projectsStatStars: "BINTANG GITHUB",
    projectsStatForks: "SALINAN REPO (FORKS)",
    projectsStatTech: "KATEGORI UTAMA",
    projectsRadarSub: "DISTRIBUSI",
    projectsRadarMain: "Bobot Stack Teknologi",
    projectCardFork: "salinan",
    projectCardStar: "bintang",
    projectLivePreview: "Pratinjau Langsung",
    projectSourceCode: "Kode Sumber",
    projectCoreTech: "Arsitektur Inti",
    projectCoreTechSub: "Fitur & rekayasa sistem yang diintegrasikan:",

    // Resume/Certificates Section
    certSectionBadge: "Sertifikat & Riwayat",
    certHeadingIntro: "Kredensial",
    certHeadingPrimary: "Profesional",
    certHeadingOutro: "Terverifikasi",
    cvDownloadBtn: "Unduh Salinan CV Lengkap",
    cvViewTitle: "Daftar Sertifikat Berkala",

    // Contact Section
    contactSectionBadge: "Kirim Pesan",
    contactHeadingIntro: "Mulai",
    contactHeadingPrimary: "Kolaborasi",
    contactHeadingOutro: "Hebat",
    contactIntroTitle: "Mari Berdiskusi",
    contactIntroText: "Apakah Anda memiliki proyek menarik? Ingin mengundang saya berkolaborasi penuh waktu atau sekadar mengobrol tentang teknologi? Silakan hubungi saya kapan saja. Saya akan merespons secepat mungkin.",
    contactFormName: "NAMA LENGKAP",
    contactFormNamePlaceholder: "Masukkan nama Anda...",
    contactFormEmail: "ALAMAT SUREL (EMAIL)",
    contactFormEmailPlaceholder: "alamat@surel.com",
    contactFormMsg: "PESAN KOLABORASI",
    contactFormMsgPlaceholder: "Tuliskan detail ide atau undangan kolaborasi Anda di sini...",
    contactFormSubmit: "Kirim Sekarang",
    contactFormSending: "Mengirimkan Pesan...",
    contactToastSuccess: "Pesan Terkirim!",
    contactToastSuccessSub: "Terima kasih! Pesan Anda telah disimulasikan sukses terkirim. Ghufron akan segera menghubungi Anda.",
    validationNameRequired: "Nama lengkap wajib diisi.",
    validationNameLength: "Nama harus memiliki minimal 3 karakter.",
    validationEmailRequired: "Alamat email wajib diisi.",
    validationEmailFormat: "Format email tidak valid (contoh: nama@domain.com).",
    validationMessageRequired: "Pesan kolaborasi wajib diisi.",
    validationMessageLength: "Pesan harus memiliki minimal 15 karakter.",

    // Keyboard Accessibility Support
    kbTitle: "AKSESIBILITAS KEYBOARD",
    kbHelperDesc: "Gunakan tombol keyboard berikut untuk menjelajahi portofolio dengan mudah secara penuh:",
    kbArrowNav: "Seksi Sebelum / Selanjutnya",
    kbTabNav: "Pindahkan Fokus Navigasi",
    kbEnterNav: "Aktifkan Elemen Aktif",
    kbNeedHelp: "Butuh bantuan lebih?",
    kbPressHelp: "Tekan [?]",
    kbReopenGuide: "Tampilkan panduan keyboard",
    kbModalTitle: "Bantuan Navigasi Keyboard",
    kbModalSubtitle: "Aksesibilitas Portofolio",
    kbModalIntro: "Web ini mendukung aksesibilitas penuh! Anda dapat menjelajah dengan nyaman hanya menggunakan keyboard. Semua elemen interaktif memiliki garis fokus berwarna Jingga berpendar yang mencolok saat dipilih.",
    kbModalArrowDesc: "Pindah Seksi Portofolio",
    kbModalTabDesc: "Fokus ke Menu, Kartu, atau Tombol",
    kbModalEnterDesc: "Aktivasi / Klik Elemen Aktif",
    kbModalQDesc: "Buka / Tutup Bantuan Ini",
    kbModalEscDesc: "Tutup Jendela Ini",
    kbLabelOrange: "Gaya berpendar Jingga mencolok.",
    kbShowHint: "Tampilkan Hint Layar",
    kbHideHint: "Sembunyikan Hint Layar",

    // Footer
    footerSubtitle: "Arsitektur portofolio interaktif modern bertenaga React.",
    madeWith: "Dibuat dengan",
    by: "oleh",
    footerHome: "Beranda",
    footerAbout: "Tentang",
    footerSkills: "Keahlian",
    footerProjects: "Proyek",
    footerResume: "Sertifikat",
    footerContact: "Kontak"
  },
  en: {
    // Navbar / Brand
    devBadge: "DEV",
    viewIdentity: "View Identity",
    identityVerified: "Identity Verified",
    shortBio: "Short Bio",
    locationLabel: "Location",
    emailLabel: "Official Email",
    shortYears: "Years Of Experience",
    shortProjects: "Successful Projects",
    contractAvailable: "Available for Contract / Full-Time Roles",
    sendMessageCTA: "Send Message",
    saveUrl: "Save URL",
    pasteCustomUrl: "Or paste your custom avatar photo URL here...",
    avatarConfigTitle: "Dynamic Avatar Configuration",
    avatarConfigNote: "*Your choice is automatically preserved in your browser's Local Storage.",
    close: "Close",
    menu: "Menu",
    skillsTab: "Proficiency",
    contactMeBtn: "Contact Me",
    themeToggleLight: "Activate Light Mode",
    themeToggleDark: "Activate Dark Mode",

    // Hero Section
    collaborationAvailable: "Available for Collaboration",
    greetingTitle: "A FRONTEND & FULL-STACK ENGINEER",
    mainHeading: "Building Modern",
    subHeading: "Digital Solutions",
    viewProjects: "View My Work",
    checkResume: "Verify Credentials & CV",
    latestStack: "Latest Stack",

    // About Section
    aboutSectionBadge: "About Me",
    aboutHeadingIntro: "Getting to",
    aboutHeadingPrimary: "Know My",
    aboutHeadingOutro: "Profile",
    aboutMissionTitle: "My Mission & Work Philosophy",
    workflowHeading: "SYSTEM WORKFLOWS",
    workflowSub: "The core design principles prioritize security, blazing-fast loading speeds, clean modular structures, and server-side ready execution.",

    // Skills Section
    skillsSectionBadge: "Technical Skills",
    skillsHeadingIntro: "My technical",
    skillsHeadingPrimary: "Toolbox",
    skillsHeadingOutro: "& Stack",
    skillsFilterAll: "All",
    skillsSortLabel: "Sort By:",
    skillsSortLevel: "Proficiency",
    skillsSortName: "Alphabetical",
    skillsNoCategory: "No skills listed for this category.",
    skillsSearchPlaceholder: "Search technical skills (React, TS, nesting)...",

    // Projects Section
    projectsSectionBadge: "Featured Work",
    projectsHeadingIntro: "My Finely",
    projectsHeadingPrimary: "Crafted",
    projectsHeadingOutro: "Creations",
    projectsSub: "Explore production-ready open-source and commercial solutions built with exceptional performance, fluid layouts, and strict architecture.",
    projectsCategoryAll: "All Categories",
    projectsNoFound: "No creations match the selected filters.",
    projectsStatTotal: "TOTAL PROJECTS",
    projectsStatStars: "GITHUB STARS",
    projectsStatForks: "GITHUB FORKS",
    projectsStatTech: "CORE CATEGORIES",
    projectsRadarSub: "DISTRIBUTION",
    projectsRadarMain: "Technology Stack Weight",
    projectCardFork: "forks",
    projectCardStar: "stars",
    projectLivePreview: "Live Preview",
    projectSourceCode: "Source Code",
    projectCoreTech: "Core Architecture",
    projectCoreTechSub: "Systems and features engineered into this solution:",

    // Resume/Certificates Section
    certSectionBadge: "Certificates & Credentials",
    certHeadingIntro: "Verified",
    certHeadingPrimary: "Professional",
    certHeadingOutro: "Achievements",
    cvDownloadBtn: "Download Copy of Resume",
    cvViewTitle: "Professional Credentials List",

    // Contact Section
    contactSectionBadge: "Get In Touch",
    contactHeadingIntro: "Start A",
    contactHeadingPrimary: "Great",
    contactHeadingOutro: "Collaboration",
    contactIntroTitle: "Let's Talk Business",
    contactIntroText: "Have an exciting project in mind? Want to invite me to join your team, discuss contracting work, or talk about modern tech? Feel free to write me anytime. I respond promptly.",
    contactFormName: "FULL NAME",
    contactFormNamePlaceholder: "Your full name...",
    contactFormEmail: "EMAIL ADDRESS",
    contactFormEmailPlaceholder: "name@domain.com",
    contactFormMsg: "COLLABORATION MESSAGE",
    contactFormMsgPlaceholder: "Write your message, project ideas or proposal details here...",
    contactFormSubmit: "Send Message Now",
    contactFormSending: "Sending Message...",
    contactToastSuccess: "Successfully Delivered!",
    contactToastSuccessSub: "Thank you! Your message has been successfully simulated and sent. Ghufron will contact you shortly.",
    validationNameRequired: "Full name is required.",
    validationNameLength: "Name must be at least 3 characters.",
    validationEmailRequired: "Email address is required.",
    validationEmailFormat: "Invalid email format (example: name@domain.com).",
    validationMessageRequired: "Message content is required.",
    validationMessageLength: "Message must be at least 15 characters.",

    // Keyboard Accessibility Support
    kbTitle: "KEYBOARD ACCESSIBILITY",
    kbHelperDesc: "Use these keyboard shortcuts to navigate the entire portfolio seamlessly:",
    kbArrowNav: "Previous / Next Section",
    kbTabNav: "Shift focus on Navigation Elements",
    kbEnterNav: "Activate Active UI elements",
    kbNeedHelp: "Need more details?",
    kbPressHelp: "Press [?]",
    kbReopenGuide: "Show keyboard help",
    kbModalTitle: "Keyboard Accessibility Guide",
    kbModalSubtitle: "Sitemap Access",
    kbModalIntro: "This site supports full keyboard accessibility! You can easily browse everything without a mouse. All interactive elements have high-visibility Orange glowing borders when focused.",
    kbModalArrowDesc: "Navigate Sections",
    kbModalTabDesc: "Select Menu links, Cards, or Buttons",
    kbModalEnterDesc: "Activate selected item",
    kbModalQDesc: "Toggle this help dialog",
    kbModalEscDesc: "Close this helper modal",
    kbLabelOrange: "High contrast glowing orange indicator.",
    kbShowHint: "Show Hint Overlay",
    kbHideHint: "Hide Hint Overlay",

    // Footer
    footerSubtitle: "Sleek interactive dark-theme React single page architecture.",
    madeWith: "Made with",
    by: "by",
    footerHome: "Home",
    footerAbout: "About",
    footerSkills: "Skills",
    footerProjects: "Projects",
    footerResume: "Credentials",
    footerContact: "Contact"
  }
};

interface LanguageContextProps {
  language: 'id' | 'en';
  toggleLanguage: () => void;
  setLanguage: (lang: 'id' | 'en') => void;
  t: (key: keyof typeof UI_TRANSLATIONS['id']) => string;
  personalData: typeof personalDataID;
  navLinks: typeof navLinksID;
  skillsData: typeof skillsDataID;
  projectsData: typeof projectsDataID;
  certificatesData: typeof certificatesDataID;
  achievementsData: typeof achievementsDataID;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<'id' | 'en'>(() => {
    return (localStorage.getItem('portfolio_lang') as 'id' | 'en') || 'id';
  });

  const setLanguage = (lang: 'id' | 'en') => {
    localStorage.setItem('portfolio_lang', lang);
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const t = (key: keyof typeof UI_TRANSLATIONS['id']): string => {
    return UI_TRANSLATIONS[language][key] || UI_TRANSLATIONS['id'][key] || '';
  };

  // Dynamically computed data according to locale
  const personalData = language === 'en' ? personalDataEN : personalDataID;
  const navLinks = language === 'en' ? navLinksEN : navLinksID;
  const skillsData = language === 'en' ? skillsDataEN : skillsDataID;
  const projectsData = language === 'en' ? projectsDataEN : projectsDataID;
  const certificatesData = language === 'en' ? certificatesDataEN : certificatesDataID;
  const achievementsData = language === 'en' ? achievementsDataEN : achievementsDataID;

  return (
    <LanguageContext.Provider value={{
      language,
      toggleLanguage,
      setLanguage,
      t,
      personalData,
      navLinks,
      skillsData,
      projectsData,
      certificatesData,
      achievementsData
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
