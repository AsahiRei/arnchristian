"use client";

import { useEffect, useState } from "react";
import { SectionHeader, SkeletonExperience } from "@/components/ui";
import { db } from "@/utils/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Experience as ExperienceType } from "@/types";

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    try {
      const q = query(collection(db, "experience"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setExperiences(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ExperienceType)));
    } catch {
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="experience" className="min-h-screen py-24 px-6 bg-bg-secondary">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="05 — ACTIVITIES" title="What I've been up to." />
        {loading ? (
          <SkeletonExperience />
        ) : experiences.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-fg-muted text-sm">No experience yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {experiences.map((e) => (
              <div key={e.id} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-fg shrink-0" />
                  <div className="w-px flex-1 bg-border" />
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h3 className="font-display text-xl text-fg m-0">
                      {e.position}
                    </h3>
                    <span className="font-mono text-xs text-fg-subtle shrink-0">
                      {e.date}
                    </span>
                  </div>
                  <p className="text-sm text-fg-muted mb-3">{e.company}</p>
                  <p className="text-sm leading-7 text-fg-muted mb-4">
                    {e.description}
                  </p>
                  {e.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {e.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 bg-bg-secondary border border-border rounded text-[11px] font-mono text-fg-subtle"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
