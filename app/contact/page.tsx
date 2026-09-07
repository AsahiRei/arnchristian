import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Arn Christian for collaborations, opportunities, or inquiries.",
  openGraph: {
    title: "Contact | Arn Christian",
    description:
      "Get in touch with Arn Christian for collaborations, opportunities, or inquiries.",
  },
};

export default function ContactPage() {
  return (
    <div className="stagger">
      <Contact />
    </div>
  );
}
