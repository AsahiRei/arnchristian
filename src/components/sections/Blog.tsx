import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui";
import { BLOG } from "@/data";

export default function Blog() {
  return (
    <section id="blog" className="min-h-screen py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="04 — Blog" title="Thoughts & stories." />
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
          {BLOG.map((post) => (
            <article key={post.slug} className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden hover:border-border-strong transition-colors duration-150 flex flex-col">
              <div className="h-48 overflow-hidden bg-bg-secondary shrink-0">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-full object-cover grayscale hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <time className="font-mono text-xs text-fg-subtle">{post.date}</time>
                <h3 className="font-display text-[18px] text-fg m-0 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm leading-7 text-fg-muted m-0 flex-1">{post.excerpt}</p>
                <div className="pt-1">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg no-underline hover:opacity-80 transition-opacity"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}