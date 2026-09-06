export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  image: string;
  images: string[];
  picture: string;
  tags: string[];
  github: string;
  order: number;
}

export interface Experience {
  id?: string;
  position: string;
  company: string;
  date: string;
  description: string;
  technologies: string[];
}

export interface Certificate {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  image: string;
  url: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  aboutImage: string;
  about: string[];
  details: { label: string; value: string }[];
  email: string;
  github: string;
  location: string;
  copyright: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags: string[];
  cover: string;
  content: string;
}
