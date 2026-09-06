"use client";

import { useEffect, useState } from "react";
import { SectionHeader, SkeletonSkills } from "@/components/ui";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { SkillCategory } from "@/types";

export default function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      const snap = await getDoc(doc(db, "skills", "main"));
      if (snap.exists()) {
        const data = snap.data();
        setCategories(data.categories || []);
      }
    } catch {
      // Use empty categories
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="skills" className="min-h-screen py-24 px-6 bg-bg-secondary">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="02 — SKILLS" title="What I work with." />
        {loading ? (
          <SkeletonSkills />
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-fg-muted text-sm">No skills added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.category}
                className="flex flex-col p-5 bg-bg-card border border-border rounded-[var(--radius-theme)] hover:border-border-strong transition-colors duration-150"
              >
                <h3 className="font-mono text-xs text-fg-subtle uppercase tracking-widest mb-4">
                  {cat.category}
                </h3>
                <div className="flex flex-col gap-2">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2"
                    >
                      <span className="flex items-center justify-center w-6 h-6 text-xs text-fg-muted bg-bg-elevated border border-border rounded">
                        {skill.icon}
                      </span>
                      <span className="text-sm text-fg">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
