import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Arn Christian's portfolio. BSIT student and aspiring full-stack web developer from the Philippines.",
  openGraph: {
    title: "Arn Christian | BSIT Portfolio",
    description:
      "Welcome to Arn Christian's portfolio. BSIT student and aspiring full-stack web developer.",
  },
};

export default function HomePage() {
  return (
    <div className="stagger">
      <Hero />
    </div>
  );
}
