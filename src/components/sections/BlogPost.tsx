import { useParams, Link } from "react-router-dom";
import { Tag } from "@/components/ui";
import { BLOG } from "@/data";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section className="min-h-screen py-24 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-fg-muted font-mono text-sm">Post not found.</p>
          <Link to="/blog" className="text-fg-muted hover:text-fg transition-colors text-sm no-underline mt-4 inline-block">
            &larr; Back to blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <Link to="/blog" className="text-fg-muted hover:text-fg transition-colors text-sm no-underline mb-8 inline-block">
          &larr; Back to blog
        </Link>

        <article>
          <time className="font-mono text-xs text-fg-subtle">{post.date}</time>
          <h1 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-fg mt-3 mb-6">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {post.tags.map((t) => <Tag key={t} label={t} />)}
            </div>
          )}

          <div className="h-64 md:h-80 overflow-hidden bg-bg-secondary rounded-[var(--radius-theme)] mb-10">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover grayscale"
            />
          </div>

          <div className="text-base leading-8 text-fg-muted">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-6">{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}