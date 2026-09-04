import { Link } from "react-router-dom";
import { PROFILE } from "@/data";

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center px-6 py-20 md:py-0">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 gap-16 items-center md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-xs text-fg-subtle tracking-[0.12em] uppercase mb-6">
              Open to opportunities
            </p>
            <h1 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] text-fg mb-4">
              Hi, I&apos;m<br />{PROFILE.name}.
            </h1>
            <p className="font-display italic text-[clamp(1.4rem,3vw,2rem)] text-fg-muted mb-6">
              {PROFILE.title}
            </p>
            <p className="text-base leading-7 text-fg-muted max-w-[520px] mb-10">
              {PROFILE.bio}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/projects"
                className="bg-fg text-bg px-6 py-3 rounded-[var(--radius-theme)] font-body text-sm font-medium no-underline hover:opacity-80 transition-opacity inline-block"
              >
                View Projects
              </Link>
              <Link
                to="/contact"
                className="bg-transparent text-fg px-6 py-3 rounded-[var(--radius-theme)] font-body text-sm font-medium no-underline border border-border-strong hover:border-fg transition-colors inline-block"
              >
                Contact Me
              </Link>
            </div>
          </div>

          <div className="w-60 shrink-0 hidden md:block mx-auto md:mx-0">
            <div className="w-60 h-60 rounded-full overflow-hidden border-2 border-border bg-bg-secondary">
              <img
                src={PROFILE.avatar}
                alt={PROFILE.name}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
