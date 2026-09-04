"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { db } from "@/utils/firebase";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { collection, addDoc } from "firebase/firestore";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const postsRef = collection(db, "blogPosts");

export default function CreateBlogPost() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tags, setTags] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
    setCoverUrlInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setPublishing(true);
    try {
      let coverUrl = coverUrlInput.trim();

      if (!coverUrl && coverFile) {
        coverUrl = await uploadToCloudinary(coverFile);
      }

      if (!coverUrl) {
        alert("Please upload a cover image or paste a URL.");
        setPublishing(false);
        return;
      }

      const newPost = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        excerpt: excerpt.trim(),
        date,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        cover: coverUrl,
        content: content.trim(),
      };

      await addDoc(postsRef, newPost);

      setTitle("");
      setSlug("");
      setSlugEdited(false);
      setExcerpt("");
      setDate(new Date().toISOString().split("T")[0]);
      setTags("");
      setCoverFile(null);
      setCoverPreview("");
      setCoverUrlInput("");
      setContent("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to publish: ${msg}`);
    } finally {
      setPublishing(false);
    }
  }

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  return (
    <section id="create-blog" className="min-h-screen py-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <SectionHeader label="Blog — Create" title="Write a new post." />

        {saved && (
          <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-theme)] text-sm text-green-600 dark:text-green-400">
            Post saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My New Blog Post"
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="my-new-blog-post"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              Excerpt
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary of your post..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              Cover Image
            </label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-center gap-2 px-4 py-6 bg-bg-secondary border border-dashed border-border rounded-[var(--radius-theme)] cursor-pointer hover:border-border-strong transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-sm text-fg-muted">
                  {publishing
                    ? "Publishing..."
                    : coverPreview
                      ? "Change image"
                      : "Click to upload an image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={publishing}
                />
              </label>
              {coverPreview && (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-40 object-cover rounded-[var(--radius-theme)] border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview("");
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-bg/80 border border-border rounded-full flex items-center justify-center text-fg-muted hover:text-fg cursor-pointer"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-wider">Or paste a URL</span>
                <input
                  type="text"
                  value={coverUrlInput}
                  onChange={(e) => {
                    setCoverUrlInput(e.target.value);
                    setCoverPreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here. Separate paragraphs with blank lines."
              rows={10}
              className={`${inputClass} resize-y min-h-[200px]`}
              required
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={publishing}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Publish Post"}
            </button>
            <Link
              href="/blog"
              className="text-sm text-fg-muted hover:text-fg transition-colors no-underline"
            >
              View all posts
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
