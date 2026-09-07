import type { Metadata } from "next";
import Certificates from "@/components/sections/Certificates";

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "View Arn Christian's certifications, training completions, and academic achievements.",
  openGraph: {
    title: "Certificates | Arn Christian",
    description:
      "View Arn Christian's certifications and academic achievements.",
  },
};

export default function CertificatesPage() {
  return (
    <div className="stagger">
      <Certificates />
    </div>
  );
}
