import type { Metadata } from "next";
import Skills from "@/components/sections/Skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Explore Arn Christian's technical skills in web development, programming languages, frameworks, and tools.",
  openGraph: {
    title: "Skills | Arn Christian",
    description:
      "Explore Arn Christian's technical skills in web development, programming languages, and frameworks.",
  },
};

export default function SkillsPage() {
  return (
    <div className="stagger">
      <Skills />
    </div>
  );
}
