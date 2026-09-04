import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    name: "Lunaria",
    description:
      "Offline AI-powered study reviewer that runs entirely on-device. Generates flashcards, quizzes, and summaries from your notes without needing an internet connection.",
    image: "/images/projects/1.png",
    picture: "/images/projects-view/1.png",
    tags: ["React Native", "Expo", "llama.cpp", "SQLite"],
    github: "https://github.com/AsahiRei/lunaria",
  },
  {
    name: "Project Amadeus",
    description: "AI companion inspired by the Amadeus System from Steins;Gate.",
    image: "/images/projects/2.webp",
    picture: "/images/projects-view/2.jpg",
    tags: ["Java", "XML", "TensorFlow Lite", "TensorFlow"],
    github: "https://github.com/AsahiRei/project-amadeus",
  },
  {
    name: "C.Studio Cards",
    description:
      "Contains a collection of custom cards developed for use in compatible EDOPRO.",
    image: "/images/projects/3.jpg",
    picture: "/images/projects-view/3.jpg",
    tags: ["Lua Script", "SQLite"],
    github: "https://github.com/AsahiRei/cstudios-cards",
  },
];
