import profile from "./profile.json";
import skills from "./skills.json";
import projects from "./projects.json";
import experience from "./experience.json";
import certificates from "./certificates.json";
import blog from "./blog.json";

import type { Profile, SkillCategory, Project, Experience, Certificate, BlogPost } from "@/types";

export const PROFILE: Profile = profile;
export const SKILLS: SkillCategory[] = skills;
export const PROJECTS: Project[] = projects;
export const EXPERIENCES: Experience[] = experience;
export const CERTIFICATES: Certificate[] = certificates;
export const BLOG: BlogPost[] = blog;
