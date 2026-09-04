import { SectionHeader, Tag } from "@/components/ui";
import { EXPERIENCES } from "@/data";

export default function Experience() {
  return (
    <section id="experience" className="min-h-screen py-24 px-6 bg-bg-secondary">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="04 — Activities" title="What I've been up to." />
        <div className="max-w-[760px]">
          {EXPERIENCES.map((exp, i) => (
            <div
              key={i}
              className="grid grid-cols-[32px_1fr] gap-y-0 gap-x-6 relative"
            >
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-fg shrink-0 mt-1.5" />
                {i < EXPERIENCES.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-2 mb-0" />
                )}
              </div>
              <div className={i < EXPERIENCES.length - 1 ? "pb-12" : ""}>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h3 className="font-display text-xl text-fg m-0 mb-1">{exp.position}</h3>
                    <p className="text-sm text-fg-muted m-0">{exp.company}</p>
                  </div>
                  <span className="font-mono text-xs text-fg-subtle whitespace-nowrap">{exp.date}</span>
                </div>
                <p className="text-sm leading-7 text-fg-muted mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((t) => <Tag key={t} label={t} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
