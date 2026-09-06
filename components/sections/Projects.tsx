"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader, Tag, SkeletonProjectCard } from "@/components/ui";
import { GithubIcon, Maximize2, X } from "@/components/icons";
import { db } from "@/utils/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Project } from "@/types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    loadProjects();
  }, []);

  useEffect(() => {
    if (!selected) {
      document.body.style.overflow = "";
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft" && selected?.images?.length) {
        setGalleryIndex((i) => (i > 0 ? i - 1 : (selected.images?.length || 1) - 1));
      }
      if (e.key === "ArrowRight" && selected?.images?.length) {
        setGalleryIndex((i) => (i < (selected.images?.length || 1) - 1 ? i + 1 : 0));
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  async function loadProjects() {
    try {
      const q = query(collection(db, "projects"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  const allImages = selected
    ? [selected.picture, ...(selected.images || [])].filter(Boolean)
    : [];

  return (
    <section id="projects" className="min-h-screen py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="03 — Projects" title="Things I've built." />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(540px,1fr))] gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonProjectCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-fg-muted text-sm">No projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(540px,1fr))] gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden hover:border-border-strong transition-colors duration-150 flex flex-col"
              >
                <div className="h-50 overflow-hidden bg-bg-secondary shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover grayscale hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <h3 className="font-display text-[22px] text-fg m-0">
                    {p.name}
                  </h3>
                  <p className="text-sm leading-7 text-fg-muted m-0 flex-1">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => <Tag key={t} label={t} />)}
                  </div>
                  <div className="flex gap-2.5 pt-1">
                    <a
                      href={p.github}
                      className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-md text-[13px] font-medium text-fg-muted no-underline hover:border-fg hover:text-fg transition-colors duration-150"
                    >
                      <GithubIcon size={14} /> GitHub
                    </a>
                    {(p.picture || p.images?.length > 0) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(p);
                          setGalleryIndex(0);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg border-none cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <Maximize2 size={13} /> View Pictures
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {selected && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 md:p-8"
              onClick={() => setSelected(null)}
            >
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-bg-card border border-border rounded-[var(--radius-theme)] w-full max-w-4xl max-h-full overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                  <h3 className="font-display text-lg text-fg m-0">
                    {selected.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {allImages.length > 1 && (
                      <span className="text-xs text-fg-subtle">
                        {galleryIndex + 1} / {allImages.length}
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setSelected(null)}
                      className="flex items-center justify-center w-8 h-8 bg-transparent border border-border rounded-md text-fg-muted cursor-pointer hover:border-fg hover:text-fg transition-colors duration-150"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="bg-bg-secondary overflow-auto flex-1 relative">
                  {allImages.length > 0 ? (
                    <>
                      <img
                        src={allImages[galleryIndex]}
                        alt={selected.name}
                        className="w-full max-h-[75vh] object-contain"
                      />
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setGalleryIndex((i) => (i > 0 ? i - 1 : allImages.length - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-bg/80 border border-border rounded-full flex items-center justify-center text-fg-muted cursor-pointer hover:border-fg hover:text-fg transition-colors"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setGalleryIndex((i) => (i < allImages.length - 1 ? i + 1 : 0))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-bg/80 border border-border rounded-full flex items-center justify-center text-fg-muted cursor-pointer hover:border-fg hover:text-fg transition-colors"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="h-64 flex items-center justify-center font-mono text-xs text-fg-subtle">
                      No pictures added yet.
                    </div>
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="flex items-center justify-center gap-2 px-6 py-3 border-t border-border shrink-0 overflow-x-auto">
                    {allImages.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIndex(i)}
                        className={`w-12 h-12 rounded border overflow-hidden cursor-pointer shrink-0 ${
                          i === galleryIndex ? "border-fg" : "border-border opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
