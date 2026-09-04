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
