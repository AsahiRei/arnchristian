import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SkeletonCard, SkeletonListCard } from "@/components/ui";
import { db } from "@/utils/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { BlogPost } from "@/types";
import avatarImg from "@/assets/images/avatar/1.jpg";

export default function Blog() {
  const [createdPosts, setCreatedPosts] = useState<BlogPost[]>([]);
  const [view, setView] = useState<"grid" | "list">("list");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      setCreatedPosts(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost))
      );
      setLoading(false);
    }
    loadPosts();
  }, []);

  const allPosts = [...createdPosts];

  return (
    <section id="blog" className="min-h-screen py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <p className="text-fg-subtle font-mono text-xs tracking-widest uppercase mb-3">
              04 — Blog
            </p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-fg">
              Thoughts &amp; stories.
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-bg-secondary border border-border rounded-[var(--radius-theme)] p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-[6px] border-none cursor-pointer transition-colors ${
                view === "grid"
                  ? "bg-bg-card text-fg shadow-sm"
                  : "bg-transparent text-fg-muted hover:text-fg"
              }`}
              aria-label="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-[6px] border-none cursor-pointer transition-colors ${
                view === "list"
                  ? "bg-bg-card text-fg shadow-sm"
                  : "bg-transparent text-fg-muted hover:text-fg"
              }`}
              aria-label="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonListCard key={i} />
              ))}
            </div>
          )
        ) : allPosts.length === 0 ? (
          <p className="text-fg-muted text-sm text-center py-16">
            No blogs found.
          </p>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
            {allPosts.map((post) => (
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
                  <div className="flex items-center gap-3 pt-1">
                    <img src={avatarImg} alt="Arn Christian" className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-xs text-fg-muted">Arn Christian</span>
                  </div>
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
        ) : (
          <div className="flex flex-col gap-4">
            {allPosts.map((post) => (
              <article key={post.slug} className="bg-bg-card border border-border rounded-[var(--radius-theme)] overflow-hidden hover:border-border-strong transition-colors duration-150 flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-48 sm:h-auto overflow-hidden bg-bg-secondary shrink-0">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <time className="font-mono text-xs text-fg-subtle">{post.date}</time>
                  <h3 className="font-display text-[18px] text-fg m-0 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-7 text-fg-muted m-0">{post.excerpt}</p>
                  <div className="flex items-center gap-3 pt-2">
                    <img src={avatarImg} alt="Arn Christian" className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-xs text-fg-muted">Arn Christian</span>
                  </div>
                  <div className="pt-2">
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
        )}
      </div>
    </section>
  );
}
