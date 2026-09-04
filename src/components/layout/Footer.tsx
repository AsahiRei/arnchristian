import { GithubIcon, Mail } from "@/components/icons";
import { PROFILE } from "@/data";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <p className="font-mono text-xs text-fg-subtle m-0">
          {PROFILE.copyright}
        </p>
        <div className="flex items-center gap-5">
          {[
            { icon: <GithubIcon size={16} />, href: PROFILE.github, label: "GitHub" },
            { icon: <Mail size={16} />, href: `mailto:${PROFILE.email}`, label: "Email" },
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-fg-subtle hover:text-fg transition-colors duration-150"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
