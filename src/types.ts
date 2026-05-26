export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  stars?: number;
  forks?: number;
  category: string;
  features?: string[];
  imageUrl?: string;
}

export interface Skill {
  name: string;
  level: number; // 1-100
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Tools & DevOps';
  iconName: string; // Dynamic icon rendering or matching ID
  description?: string;
  yearsOfExp?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  credentialUrl: string;
}

export interface Achievement {
  id: string;
  metric: string;
  label: string;
  description: string;
}

export interface NavLink {
  label: string;
  targetId: string;
}
