import type { Metadata } from "next";
import About from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Arn Christian, a BSIT student passionate about web development, software engineering, and technology.",
  openGraph: {
    title: "About | Arn Christian",
    description:
      "Learn more about Arn Christian, a BSIT student passionate about web development and technology.",
  },
};

export default function AboutPage() {
  return (
    <div className="stagger">
      <About />
    </div>
  );
}
