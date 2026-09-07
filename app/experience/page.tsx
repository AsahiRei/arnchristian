import type { Metadata } from "next";
import Experience from "@/components/sections/Experience";

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Discover Arn Christian's extracurricular activities, involvement, and professional experiences.",
  openGraph: {
    title: "Activities | Arn Christian",
    description:
      "Discover Arn Christian's extracurricular activities and professional experiences.",
  },
};

export default function ExperiencePage() {
  return (
    <div className="stagger">
      <Experience />
    </div>
  );
}
