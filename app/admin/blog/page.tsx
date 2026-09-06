"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/utils/firebase";
import { uploadToCloudinary } from "@/utils/cloudinary";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { ConfirmModal } from "@/components/ui";
import type { BlogPost } from "@/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const emptyPost: Omit<BlogPost, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  date: "",
  tags: [],
  cover: "",
  content: "",
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Omit<BlogPost, "id">>(emptyPost);
  const [tagsInput, setTagsInput] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!slugEdited && form.title) {
      setForm((p) => ({ ...p, slug: slugify(p.title) }));
    }
  }, [form.title, slugEdited]);

  async function loadPosts() {
    try {
      const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  function startEditing(post: BlogPost) {
    setEditing(post);
    setShowForm(true);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      date: post.date,
      tags: post.tags,
      cover: post.cover,
      content: post.content,
    });
    setTagsInput(post.tags.join(", "));
    setSlugEdited(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startCreating() {
    setEditing(null);
    setShowForm(true);
    setForm({ ...emptyPost, date: new Date().toISOString().split("T")[0] });
    setTagsInput("");
    setSlugEdited(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditing(null);
    setShowForm(false);
    setForm(emptyPost);
    setTagsInput("");
    setSlugEdited(false);
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, cover: url }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(`Failed to upload image: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setSaving(true);
    try {
      const data = {
        ...form,
        slug: form.slug || slugify(form.title),
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editing?.id) {
        await updateDoc(doc(db, "blogPosts", editing.id), data);
      } else {
        await addDoc(collection(db, "blogPosts"), data);
      }

      setSaved(true);
      cancelEditing();
      loadPosts();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      alert(`Failed to save post: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, "blogPosts", id));
      setDeleteId(null);
      if (editing?.id === id) cancelEditing();
      loadPosts();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      alert(`Failed to delete post: ${msg}`);
    }
  }

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="font-display text-2xl text-fg m-0">Blog</h1>
          <p className="text-sm text-fg-subtle mt-1">Manage your blog posts</p>
        </div>
        <button
          onClick={startCreating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none self-start"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Post
        </button>
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-theme)] text-sm text-green-500">
          Post saved successfully.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6 mb-8">
          <h2 className="font-display text-lg text-fg m-0 mb-4">
            {editing ? "Edit Post" : "New Post"}
          </h2>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="My New Blog Post"
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, slug: e.target.value }));
                    setSlugEdited(true);
                  }}
                  placeholder="my-new-blog-post"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Excerpt</label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="A short summary of your post..."
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Cover Image</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-6 bg-bg-secondary border border-dashed border-border rounded-[var(--radius-theme)] cursor-pointer hover:border-border-strong transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span className="text-sm text-fg-muted">
                    {uploading ? "Uploading..." : form.cover ? "Change image" : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.cover && (
                  <div className="relative">
                    <img
                      src={form.cover}
                      alt="Cover"
                      className="w-full h-40 object-cover rounded-[var(--radius-theme)] border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, cover: "" }))}
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
                    value={form.cover}
                    onChange={(e) => setForm((p) => ({ ...p, cover: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                placeholder="Write your blog post content here. Separate paragraphs with blank lines."
                rows={12}
                className={`${inputClass} resize-y min-h-[250px]`}
                required
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Post" : "Publish Post"}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="text-sm text-fg-muted hover:text-fg transition-colors bg-transparent border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="flex flex-col gap-1.5 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or tag..."
          className={inputClass}
        />
      </div>

      {/* Posts List */}
      {loading ? (
        <p className="text-fg-muted text-sm">Loading posts...</p>
      ) : filtered.length === 0 ? (
        <p className="text-fg-muted text-sm">
          {posts.length === 0 ? "No posts yet. Create your first post!" : "No posts match your search."}
        </p>
      ) : (
        <div className="stagger flex flex-col gap-3">
          {filtered.map((post) => (
            <div
              key={post.id}
              className={`bg-bg-card border rounded-[var(--radius-theme)] p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                editing?.id === post.id ? "border-border-strong" : "border-border"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                {post.cover && (
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded border border-border shrink-0"
                  />
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-display text-[16px] text-fg no-underline hover:underline"
                    target="_blank"
                  >
                    {post.title}
                  </Link>
                  <time className="font-mono text-xs text-fg-subtle">{post.date}</time>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {post.tags.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-bg-secondary border border-border rounded text-[10px] text-fg-subtle">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEditing(post)}
                  className="text-xs text-fg-subtle hover:text-fg transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(post.id!)}
                  className="text-xs text-fg-subtle hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteId !== null}
        title="Delete post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={() => handleDelete(deleteId!)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
