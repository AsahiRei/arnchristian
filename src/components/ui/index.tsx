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
