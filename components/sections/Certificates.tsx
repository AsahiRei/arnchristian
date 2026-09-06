"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader, SkeletonCertificateCard } from "@/components/ui";
import { ExternalLink, Maximize2, X } from "@/components/icons";
import { db } from "@/utils/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { Certificate } from "@/types";

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadCertificates();
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

  async function loadCertificates() {
    try {
      const q = query(collection(db, "certificates"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setCertificates(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Certificate)));
    } catch {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="certificates" className="min-h-screen py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="05 — Certificates" title="My certifications." />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCertificateCard key={i} />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-fg-muted text-sm">No certificates yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((c) => (
              <div
                key={c.id}
                className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden hover:border-border-strong transition-colors duration-150 flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-bg-secondary shrink-0">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover grayscale hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-display text-lg text-fg m-0">
                    {c.name}
                  </h3>
                  <p className="text-sm text-fg-muted m-0">{c.issuer}</p>
                  <time className="font-mono text-xs text-fg-subtle">
                    {c.date}
                  </time>
                  <div className="flex gap-2.5 pt-2 mt-auto">
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-md text-[13px] font-medium text-fg-muted no-underline hover:border-fg hover:text-fg transition-colors duration-150"
                      >
                        <ExternalLink size={13} /> View Credential
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg border-none cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Maximize2 size={13} /> View Image
                    </button>
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
                  {selected.image ? (
                    <img
                      src={selected.image}
                      alt={selected.name}
                      className="w-full max-h-[75vh] object-contain"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center font-mono text-xs text-fg-subtle">
                      No image added yet.
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
