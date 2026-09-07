import type { Metadata } from "next";
import { Sidebar } from "@/components/layout";
import ThemeProvider from "./ThemeProvider";
import ConditionalFooter from "./ConditionalFooter";
import "@/index.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://arnchristian.com"),
  title: {
    default: "Arn Christian | BSIT Portfolio",
    template: "%s | Arn Christian",
  },
  description:
    "Portfolio of Arn Christian, a BSIT student showcasing projects, skills, certifications, and blog posts in web development and technology.",
  keywords: [
    "Arn Christian",
    "portfolio",
    "BSIT",
    "web developer",
    "full-stack",
    "React",
    "Next.js",
    "TypeScript",
    "Philippines",
  ],
  authors: [{ name: "Arn Christian" }],
  creator: "Arn Christian",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Arn Christian Portfolio",
    title: "Arn Christian | BSIT Portfolio",
    description:
      "Portfolio of Arn Christian, a BSIT student showcasing projects, skills, certifications, and blog posts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arn Christian | BSIT Portfolio",
    description:
      "Portfolio of Arn Christian, a BSIT student showcasing projects, skills, certifications, and blog posts.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Arn Christian",
  url: "https://arnchristian.com",
  jobTitle: "BSIT Student",
  description:
    "BSIT student and aspiring full-stack web developer from the Philippines.",
  knowsAbout: [
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Firebase",
    "Node.js",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Sidebar />
          <main className="md:ml-[220px] pt-14 md:pt-0">
            {children}
            <ConditionalFooter />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
