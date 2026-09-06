"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tag, Skeleton } from "@/components/ui";
import { db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import type { BlogPost as BlogPostType } from "@/types";
import type { Profile } from "@/types";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [createdPosts, setCreatedPosts] = useState<BlogPostType[]>([]);
  const [avatarImg, setAvatarImg] = useState("/images/avatar/avatar-1.jpg");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const [postsSnap, profileSnap] = await Promise.all([
          getDocs(query(collection(db, "blogPosts"), orderBy("date", "desc"))),
          getDoc(doc(db, "profile", "main")),
        ]);
        setCreatedPosts(
          postsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPostType))
        );
        if (profileSnap.exists()) {
          const data = profileSnap.data() as Profile;
          if (data.avatar) setAvatarImg(data.avatar);
        }
      } catch {
        setCreatedPosts([]);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const post = [...createdPosts].find((p) => p.slug === slug);

  if (loading) {
    return (
      <section className="min-h-screen py-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <Skeleton className="h-4 w-24 mb-8" />
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-10 w-3/4 mb-6" />
          <div className="flex gap-1.5 mb-8">
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-5 w-12 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-64 md:h-80 w-full rounded-[var(--radius-theme)] mb-10" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="min-h-screen py-24 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-fg-muted font-mono text-sm">Post not found.</p>
          <Link href="/blog" className="text-fg-muted hover:text-fg transition-colors text-sm no-underline mt-4 inline-block">
            &larr; Back to blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <Link href="/blog" className="text-fg-muted hover:text-fg transition-colors text-sm no-underline mb-8 inline-block">
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

          <div className="flex items-center gap-3 mb-8">
            <img src={avatarImg} alt="Arn Christian" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-sm text-fg m-0">Arn Christian</p>
              <p className="text-xs text-fg-muted m-0">Author</p>
            </div>
          </div>

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
