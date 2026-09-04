import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui";
import { ExternalLink, X } from "@/components/icons";
import { CERTIFICATES } from "@/data";
import type { Certificate } from "@/types";

export default function Certificates() {
  const [selected, setSelected] = useState<Certificate | null>(null);

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
    <section id="certificates" className="min-h-screen py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="05 — Certifications" title="Courses & Certificates." />
        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.name}
              className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden hover:border-border-strong transition-colors duration-150"
            >
              <div className="h-40 overflow-hidden bg-bg-secondary">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-[17px] text-fg mb-1.5">{cert.name}</h3>
                <p className="text-[13px] text-fg-muted mb-1">{cert.issuer}</p>
                <p className="font-mono text-[11px] text-fg-subtle mb-4">{cert.date}</p>
                <button
                  type="button"
                  onClick={() => setSelected(cert)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-border rounded-md text-xs font-medium text-fg-muted cursor-pointer bg-transparent hover:border-fg hover:text-fg transition-colors duration-150"
                >
                  <ExternalLink size={12} /> View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {createPortal(
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
                  <h3 className="font-display text-lg text-fg m-0">{selected.name}</h3>
                  <button type="button" aria-label="Close" onClick={() => setSelected(null)} className="flex items-center justify-center w-8 h-8 bg-transparent border border-border rounded-md text-fg-muted cursor-pointer hover:border-fg hover:text-fg transition-colors duration-150">
                    <X size={16} />
                  </button>
                </div>
                <div className="bg-bg-secondary overflow-auto flex-1">
                  {selected.image ? (
                    <img src={selected.image} alt={selected.name} className="w-full max-h-[75vh] object-contain" />
                  ) : (
                    <div className="h-64 flex items-center justify-center font-mono text-xs text-fg-subtle">No image available.</div>
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
