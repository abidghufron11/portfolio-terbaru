import { Project, Skill, Certificate, Achievement, NavLink } from './types';

export const personalData = {
  name: "Abid Ghufron",
  title: "Seorang Full-Stack & Frontend Engineer",
  subtitle: "Membangun Solusi Digital Modern dengan Performa Maksimal dan Estetika Sempurna",
  aboutText1: "Saya adalah seorang Frontend Developer dan Full-Stack Engineer yang berdedikasi tinggi untuk menciptakan aplikasi web interaktif, responsif, dan berperforma tinggi. Dengan pengalaman lebih dari 3 tahun, saya memadukan fungsionalitas backend yang kokoh dengan estetika visual frontend yang memikat.",
  aboutText2: "Berbasis di Ponorogo, Indonesia, saya fokus pada ekosistem modern seperti React, Node.js, Next.js, dan arsitektur Cloud Serverless. Saya selalu berupaya menulis kode yang bersih, mudah dikelola, serta menerapkan standar praktik SEO dan aksesibilitas global demi menghadirkan pengalaman pengguna terbaik.",
  avatarUrl: "/02.jpg", // Placeholder for avatar, styled beautifully
  cvUrl: "#", // Global CV link placeholder
  location: "Ponorogo, Indonesia",
  email: "abidghufron11@gmail.com",
  socials: {
    github: "https://github.com/abidghufron11",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com"
  }
};

export const navLinks: NavLink[] = [
  { label: 'Beranda', targetId: 'hero' },
  { label: 'Tentang', targetId: 'about' },
  { label: 'Keahlian', targetId: 'skills' },
  { label: 'Proyek', targetId: 'projects' },
  { label: 'Sertifikat', targetId: 'resume' },
  { label: 'Kontak', targetId: 'contact' }
];

export const skillsData: Skill[] = [
  // Frontend
  { 
    name: 'React.js / Next.js', 
    level: 80, 
    category: 'Frontend', 
    iconName: 'Code2',
    description: 'Pengembangan web berbasis SPA/SSR interaktif, reaktif, dan performa tinggi.',
    yearsOfExp: 3
  },
  { 
    name: 'TypeScript', 
    level: 80, 
    category: 'Frontend', 
    iconName: 'ShieldAlert',
    description: 'Penulisan kode berskala besar dengan typed system ketat demi meminimalisir bug.',
    yearsOfExp: 3
  },
  { 
    name: 'Tailwind CSS', 
    level: 80, 
    category: 'Frontend', 
    iconName: 'Palette',
    description: 'Pengembangan layout responsif modern dengan utility classes super-cepat.',
    yearsOfExp: 3
  },
  { 
    name: 'Framer Motion', 
    level: 80, 
    category: 'Frontend', 
    iconName: 'Activity',
    description: 'Pembuatan micro-interactions dan animasi transisi yang halus, responsif & fluid.',
    yearsOfExp: 2
  },
  { 
    name: 'Redux Toolkit / Zustand', 
    level: 80, 
    category: 'Frontend', 
    iconName: 'Layers',
    description: 'Manajemen state terpusat yang efisien untuk sinkronisasi aplikasi skala besar.',
    yearsOfExp: 3
  },
  
  // Backend
  { 
    name: 'Node.js (Express / NestJS)', 
    level: 70, 
    category: 'Backend', 
    iconName: 'Server',
    description: 'Membangun API handal, aman, scalable, dan arsitektur backend berorientasi objek.',
    yearsOfExp: 2
  },
  { 
    name: 'Supabase', 
    level: 80, 
    category: 'Backend', 
    iconName: 'Database',
    description: 'Integrasi database Postgres, otentikasi aman, realtime socket, dan storage.',
    yearsOfExp: 2
  },

  // Mobile
  { 
    name: 'Android Studio', 
    level: 70, 
    category: 'Mobile', 
    iconName: 'Smartphone',
    description: 'Pembuatan aplikasi mobile native dengan antarmuka dinamis dan performansi stabil.',
    yearsOfExp: 2
  },
  { 
    name: 'Flutter Basics', 
    level: 45, 
    category: 'Mobile', 
    iconName: 'Laptop',
    description: 'Dasar-dasar pengembangan aplikasi cross-platform berkinerja tinggi.',
    yearsOfExp: 1
  },

  // Tools & DevOps
  { 
    name: 'Git & GitHub Workflows', 
    level: 60, 
    category: 'Tools & DevOps', 
    iconName: 'GitBranch',
    description: 'Kontrol versi terstruktur, kolaborasi git flow, rebase log, dan review kode.',
    yearsOfExp: 3
  },
  { 
    name: 'Vercel / AWS Amplify', 
    level: 80, 
    category: 'Tools & DevOps', 
    iconName: 'Cloud',
    description: 'Pendeployan instant otomatis terintegrasi CI/CD git dan cloud optimization.',
    yearsOfExp: 2
  },
  { 
    name: 'CI/CD & Jest Testing', 
    level: 80, 
    category: 'Tools & DevOps', 
    iconName: 'CheckSquare',
    description: 'Implementasi otomatisasi build run, unit testing handal, dan asuransi kualitas.',
    yearsOfExp: 2
  }
];

export const projectsData: Project[] = [
  {
    id: 'proj-1',
    title: 'AI Chat Client',
    description: 'Aplikasi percakapan cerdas bertenaga AI dengan integrasi model bahasa modern, respons instant streaming, desain clean bento, serta riwayat obrolan yang aman.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Gemini API', 'Framer Motion'],
    liveUrl: 'https://ai-chat-lovat-six.vercel.app',
    githubUrl: 'https://github.com/abidghufron11/ai-chat',
    stars: 124,
    forks: 18,
    category: 'Full-Stack',
    features: [
      'Model bahasa Gemini Pro terintegrasi',
      'Respons jawaban instan dengan stream chunk',
      'Desain Bento kontemporer super-responsif',
      'Riwayat percakapan disimpan persisten'
    ],
    imageUrl: '/pointweb.png' // Placeholder image, styled beautifully
  },
  {
    id: 'proj-2',
    title: 'Medchain Pro',
    description: 'Sistem manajemen rekam medis digital terenkripsi berbasis blockchain, melestarikan privasi rekam medis pasien dengan standarisasi Web3 & smart contract aman.',
    tags: ['React', 'TypeScript', 'Solidity', 'Web3', 'Tailwind v4'],
    liveUrl: 'https://github.com/abidghufron11/medchain-pro',
    githubUrl: 'https://github.com/abidghufron11/medchain-pro',
    stars: 98,
    forks: 22,
    category: 'Backend',
    features: [
      'Smart contract Ethereum Solidity teruji',
      'Akses rekam medis pasien terenkripsi total',
      'Integrasi dompet Web3 MetaMask',
      'Arsitektur data patuh regulasi GDPR'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 'proj-3',
    title: 'My Custom Portfolio',
    description: 'Website portfolio interaktif modern bertema dark-ambient dengan performa optimal, bento-grid modular, transisi artistik, dan particle canvas berpendar dinamis.',
    tags: ['React.js', 'Framer Motion', 'Tailwind v4', 'TypeScript', 'Vite'],
    liveUrl: 'https://www.abidghufron.my.id',
    githubUrl: 'https://github.com/abidghufron11/my-portfolio',
    stars: 45,
    forks: 3,
    category: 'Frontend',
    features: [
      'Animasi transisi antramuka 60 FPS mentah',
      'Optimalisasi build utilitas Tailwind v4',
      'Simulasi partikel interaktif di latar belakang',
      'Sepenuhnya ramah SEO & aksesibilitas global'
    ],
    imageUrl: '/webutama.png' // Placeholder image, styled beautifully
  }
];

export const certificatesData: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Bimbingan Kerja & Karir',
    issuer: 'BKK SMK PGRI 2 PONOROGO',
    date: 'November 2021',
    imageUrl: '/BKK.png', 
    credentialUrl: '/Sertif-BKK.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-2',
    title: 'UKK Kubota',
    issuer: 'PT. Kubota Indonesia',
    date: 'Mei 2022',
    imageUrl: '/Kubota.png', 
    credentialUrl: '/Sertif-Kubota.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-3',
    title: 'Pendidikan Sistem Ganda',
    issuer: 'PT. Inter Tehnik Gemilang',
    date: 'September 2021',
    imageUrl: '/Magang.png', 
    credentialUrl: 'Sertif-Magang.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-4',
    title: 'Seminar Nasional & Pelatihan Minat Bakat',
    issuer: 'HIMAAKSI',
    date: 'Agustus 2024',
    imageUrl: '/Seminar.png', 
    credentialUrl: '/Sertif-Seminar.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-5',
    title: 'Sertifikasi Komputer',
    issuer: 'Trust Training Partners',
    date: 'Februari 2024',
    imageUrl: '/Serkom.png', 
    credentialUrl: '/Sertif-Serkom.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-6',
    title: 'UKK United Tractors',
    issuer: 'SMK PGRI 2 PONOROGO',
    date: 'April 2022',
    imageUrl: '/UKK UT.png', 
    credentialUrl: '/Sertif-UKK-UT.pdf' // <-- Relative to public root
  }
];

export const achievementsData: Achievement[] = [
  { id: 'ach-1', metric: '3+', label: 'Tahun Pengalaman', description: 'Bekerja aktif merancang perangkat lunak perusahaan' },
  { id: 'ach-2', metric: '25+', label: 'Project Selesai', description: 'Dari web kustom, sistem internal, hingga aplikasi mobile berkelanjutan' },
  { id: 'ach-3', metric: '100%', label: 'Klien Puas', description: 'Memberikan nilai tambah cepat, hasil kerja rapi, serta komunikasi solutif' },
  { id: 'ach-4', metric: '14k+', label: 'Baris Kontribusi', description: 'Aktif berkontribusi di komunitas open-source tingkat global' }
];
