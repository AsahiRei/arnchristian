import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "@/components/icons";
import { NavLink } from "@/components/ui";
import { PROFILE } from "@/data";
import type { NavLink as NavLinkType } from "@/types";

const NAV_LINKS: NavLinkType[] = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Activities" },
  { href: "#certificates", label: "Certificates" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-bg border-b border-border" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" className="no-underline">
            <span className="font-display text-xl text-fg">
              {PROFILE.name}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} />
            ))}
            <button
              onClick={() => setDark(!dark)}
              className="bg-transparent border border-border rounded-md text-fg-muted cursor-pointer p-1.5 flex items-center hover:border-border-strong hover:text-fg transition-colors duration-150"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="bg-transparent border border-border rounded-md text-fg-muted cursor-pointer p-1.5 flex items-center hover:border-border-strong hover:text-fg transition-colors duration-150"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-transparent border-none text-fg cursor-pointer flex p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-bg border-t border-border px-6 py-4 pb-6 md:hidden">
          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} onClick={closeMenu} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
