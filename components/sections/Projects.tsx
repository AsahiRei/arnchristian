"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader, Tag } from "@/components/ui";
import { GithubIcon, Maximize2, X } from "@/components/icons";
import { PROJECTS } from "@/data";
import type { Project } from "@/types";

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selected) {
      document.body.style.overflow = "";
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="projects" className="min-h-screen py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="03 — Projects" title="Things I've built." />
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(540px,1fr))] gap-6">
          {PROJECTS.map((p) => (
            <div
              key={p.name}
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
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg border-none cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Maximize2 size={13} /> View Picture
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                className="bg-bg-card border border-border rounded-[var(--radius-theme)] w-full max-w-3xl max-h-full overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                  <h3 className="font-display text-lg text-fg m-0">
                    {selected.name}
                  </h3>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setSelected(null)}
                    className="flex items-center justify-center w-8 h-8 bg-transparent border border-border rounded-md text-fg-muted cursor-pointer hover:border-fg hover:text-fg transition-colors duration-150"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="bg-bg-secondary overflow-auto flex-1">
                  {selected.picture ? (
                    <img
                      src={selected.picture}
                      alt={selected.name}
                      className="w-full max-h-[75vh] object-contain"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center font-mono text-xs text-fg-subtle">
                      No picture added yet.
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
