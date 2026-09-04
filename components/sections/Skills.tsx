"use client";

import { SectionHeader } from "@/components/ui";
import { SKILLS } from "@/data";

export default function Skills() {
  return (
    <section id="skills" className="min-h-screen py-24 px-6 bg-bg-secondary">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="02 — Skills" title="What I work with." />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {SKILLS.map((cat) => (
            <div
              key={cat.category}
              className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6 hover:border-border-strong transition-colors duration-150"
            >
              <p className="font-mono text-[11px] text-fg-subtle uppercase tracking-widest mb-5">
                {cat.category}
              </p>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {cat.skills.map((s) => (
                  <li key={s.name} className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center bg-bg-secondary border border-border rounded font-mono text-[10px] text-fg-muted shrink-0">
                      {s.icon}
                    </span>
                    <span className="text-sm text-fg font-normal">{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
