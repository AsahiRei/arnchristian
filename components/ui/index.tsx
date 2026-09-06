"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-bg-secondary rounded ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden flex flex-col">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonListCard() {
  return (
    <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden flex flex-col sm:flex-row">
      <Skeleton className="w-full sm:w-48 h-48 sm:h-auto rounded-none shrink-0" />
      <div className="p-6 flex flex-col gap-2 flex-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md mt-1" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <section id="hero" className="min-h-screen flex items-center px-6 py-20 md:py-0">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 gap-16 items-center md:grid-cols-[1fr_auto]">
          <div>
            <Skeleton className="h-3 w-36 mb-6" />
            <div className="mb-4">
              <Skeleton className="h-[clamp(2.8rem,7vw,5.5rem)] w-3/4 mb-2" />
              <Skeleton className="h-[clamp(2.8rem,7vw,5.5rem)] w-1/2" />
            </div>
            <Skeleton className="h-[clamp(1.4rem,3vw,2rem)] w-48 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-10" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-32 rounded-[var(--radius-theme)]" />
              <Skeleton className="h-11 w-28 rounded-[var(--radius-theme)]" />
            </div>
          </div>
          <div className="w-60 shrink-0 hidden md:block mx-auto md:mx-0">
            <Skeleton className="w-60 h-60 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonAbout() {
  return (
    <section id="about" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <Skeleton className="h-3 w-28 mb-3" />
          <Skeleton className="h-[clamp(2rem,4vw,3rem)] w-40" />
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 items-start">
          <div>
            <Skeleton className="w-full max-w-[400px] aspect-[4/5] rounded-[var(--radius-theme)]" />
          </div>
          <div>
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-5/6 mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-2/3 mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-5 border-b border-border">
                  <Skeleton className="h-2.5 w-16 mb-2" />
                  <Skeleton className="h-3.5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkeletonSkills() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col p-5 bg-bg-card border border-border rounded-[var(--radius-theme)]"
        >
          <Skeleton className="h-2.5 w-20 mb-4" />
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonProjectCard() {
  return (
    <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden flex flex-col">
      <Skeleton className="h-50 w-full rounded-none" />
      <div className="p-6 flex flex-col gap-4">
        <Skeleton className="h-6 w-2/3" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-18 rounded" />
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <div className="flex gap-2.5 pt-1">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCertificateCard() {
  return (
    <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden flex flex-col">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 flex flex-col gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2.5 pt-2 mt-auto">
          <Skeleton className="h-9 w-36 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonExperience() {
  return (
    <div className="flex flex-col gap-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-6">
          <div className="flex flex-col items-center">
            <Skeleton className="w-3 h-3 rounded-full shrink-0" />
            <Skeleton className="w-px flex-1" />
          </div>
          <div className="flex-1 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3.5 w-32 mb-3" />
            <Skeleton className="h-3.5 w-full mb-1.5" />
            <Skeleton className="h-3.5 w-full mb-1.5" />
            <Skeleton className="h-3.5 w-3/4 mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-14 rounded" />
              <Skeleton className="h-6 w-18 rounded" />
              <Skeleton className="h-6 w-12 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="bg-bg-secondary text-fg-muted border border-border font-mono text-[11px] px-2 py-0.5 rounded">
      {label}
    </span>
  );
}

export function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-16">
      <p className="text-fg-subtle font-mono text-xs tracking-widest uppercase mb-3">
        {label}
      </p>
      <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-fg">
        {title}
      </h2>
    </div>
  );
}

export function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-fg-muted hover:text-fg transition-colors duration-150"
    >
      {label}
    </a>
  );
}

export function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4"
          onClick={onCancel}
        >
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-bg-card border border-border rounded-[var(--radius-theme)] w-full max-w-[400px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-display text-lg text-fg m-0">{title}</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-fg-muted m-0">{message}</p>
            </div>
            <div className="flex items-center gap-3 justify-end px-6 py-4 border-t border-border">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm text-fg-muted hover:text-fg transition-colors bg-transparent border border-border rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors rounded-md cursor-pointer border-none"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
