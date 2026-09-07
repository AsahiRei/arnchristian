import type { Metadata } from "next";
import Projects from "@/components/sections/Projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse Arn Christian's portfolio of web development projects, applications, and software solutions.",
  openGraph: {
    title: "Projects | Arn Christian",
    description:
      "Browse Arn Christian's portfolio of web development projects and software solutions.",
  },
};

export default function ProjectsPage() {
  return (
    <div className="stagger">
      <Projects />
    </div>
  );
}
