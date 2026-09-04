"use client";

import { SectionHeader } from "@/components/ui";
import { PROFILE } from "@/data";

export default function About() {
  return (
    <section id="about" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="01 — About" title="Who I am." />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 items-start">
          <div>
            <div className="w-full max-w-[400px] aspect-[4/5] rounded-[var(--radius-theme)] overflow-hidden bg-bg-secondary border border-border">
              <img
                src={PROFILE.aboutImage}
                alt={`${PROFILE.name} profile`}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
          <div>
            {PROFILE.about.map((paragraph, i) => (
              <p key={i} className={`text-[17px] leading-[1.8] text-fg-muted ${i < PROFILE.about.length - 1 ? "mb-8" : "mb-10"}`}>
                {paragraph}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {PROFILE.details.map(({ label, value }) => (
                <div key={label} className="py-5 border-b border-border">
                  <p className="font-mono text-[11px] text-fg-subtle uppercase tracking-wider mb-1.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-fg">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
