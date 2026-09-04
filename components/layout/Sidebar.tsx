"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "@/components/icons";
import { PROFILE } from "@/data";

const NAV_LINKS = [
  { path: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { path: "/about", label: "About", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { path: "/skills", label: "Skills", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { path: "/projects", label: "Projects", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  { path: "/experience", label: "Activities", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { path: "/certificates", label: "Certificates", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { path: "/contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { path: "/blog", label: "Blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
];

export default function Sidebar({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 no-underline ${
      pathname === path
        ? "bg-bg-secondary text-fg font-medium"
        : "text-fg-muted hover:text-fg hover:bg-bg-secondary/50"
    }`;

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[220px] flex-col border-r border-border bg-bg z-50">
        <div className="px-5 pt-6 pb-4">
          <Link href="/" className="no-underline">
            <span className="font-display text-lg text-fg">{PROFILE.name}</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.path} href={l.path} className={linkClass(l.path)}>
              <span className="w-5 h-5 flex items-center justify-center opacity-60">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={l.icon} />
                </svg>
              </span>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-fg-muted hover:text-fg hover:bg-bg-secondary/50 transition-colors duration-150 bg-transparent border-none cursor-pointer"
            aria-label="Toggle theme"
          >
            <span className="w-5 h-5 flex items-center justify-center opacity-60">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </span>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </aside>

      <header className={`md:hidden fixed top-0 left-0 right-0 h-14 bg-bg border-b border-border z-50 flex items-center justify-between px-5 transition-transform duration-300 ${mobileOpen ? "-translate-y-full" : "translate-y-0"}`}>
        <Link href="/" className="no-underline">
          <span className="font-display text-lg text-fg">{PROFILE.name}</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-transparent border-none text-fg cursor-pointer p-1 flex items-center"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`md:hidden fixed inset-0 w-full bg-bg z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <Link href="/" className="no-underline" onClick={() => setMobileOpen(false)}>
            <span className="font-display text-lg text-fg">{PROFILE.name}</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="bg-transparent border-none text-fg-muted cursor-pointer p-1 flex items-center"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <Link key={l.path} href={l.path} className={linkClass(l.path)} onClick={() => setMobileOpen(false)}>
              <span className="w-5 h-5 flex items-center justify-center opacity-60">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={l.icon} />
                </svg>
              </span>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-fg-muted hover:text-fg hover:bg-bg-secondary/50 transition-colors duration-150 bg-transparent border-none cursor-pointer"
            aria-label="Toggle theme"
          >
            <span className="w-5 h-5 flex items-center justify-center opacity-60">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </span>
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </aside>
    </>
  );
}
