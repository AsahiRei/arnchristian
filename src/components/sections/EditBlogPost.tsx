import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SectionHeader, ConfirmModal } from "@/components/ui";
import { db } from "@/utils/firebase";
import { uploadToCloudinary } from "@/utils/cloudinary";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import type { BlogPost } from "@/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const postsRef = collection(db, "blogPosts");

export default function EditBlogPost() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!slugEdited) {
      setPostSlug(slugify(title));
    }
  }, [title, slugEdited]);

  async function loadPosts() {
    const q = query(postsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    setPosts(
      snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost))
    );
    setLoading(false);
  }

  function startEditing(post: BlogPost) {
    setEditing(post);
    setTitle(post.title);
    setPostSlug(post.slug);
    setSlugEdited(false);
    setExcerpt(post.excerpt);
    setDate(post.date);
    setTags(post.tags.join(", "));
    setCoverFile(null);
    setCoverPreview(post.cover);
    setCoverUrlInput("");
    setContent(post.content);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditing(null);
    setSaved(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
    setCoverUrlInput("");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.id || !title.trim() || !content.trim()) return;

    setPublishing(true);
    try {
      let coverUrl = coverUrlInput.trim();
      if (coverFile) {
        coverUrl = await uploadToCloudinary(coverFile);
      } else if (!coverUrl) {
        coverUrl = coverPreview;
      }

      if (!coverUrl) {
        alert("Please upload a cover image or paste a URL.");
        setPublishing(false);
        return;
      }

      await updateDoc(doc(db, "blogPosts", editing.id), {
        title: title.trim(),
        slug: postSlug.trim() || slugify(title),
        excerpt: excerpt.trim(),
        date,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        cover: coverUrl,
        content: content.trim(),
      });

      setSaved(true);
      loadPosts();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to update: ${msg}`);
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, "blogPosts", id));
    if (editing?.id === id) setEditing(null);
    setDeleteConfirmId(null);
    loadPosts();
  }

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  return (
    <section id="edit-blog" className="min-h-screen py-24 px-6">
      <div className="max-w-[800px] mx-auto">
        <SectionHeader
          label="Blog — Manage"
          title={editing ? "Edit your post." : "Edit or delete posts."}
        />

        {editing && (
          <>
            {saved && (
              <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-theme)] text-sm text-green-600 dark:text-green-400">
                Post updated successfully.
              </div>
            )}

            <form onSubmit={handleUpdate} className="flex flex-col gap-5 mb-12">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={postSlug}
                  onChange={(e) => {
                    setPostSlug(e.target.value);
                    setSlugEdited(true);
                  }}
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
                        ? "Saving..."
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
                  {publishing ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="text-sm text-fg-muted hover:text-fg transition-colors bg-transparent border-none cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}

        <div className="flex flex-col gap-1.5 mb-8">
          <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, tag, or slug..."
            className={inputClass}
          />
        </div>

        {loading ? (
          <p className="text-fg-muted text-sm">Loading posts...</p>
        ) : filtered.length === 0 ? (
          <p className="text-fg-muted text-sm">
            {posts.length === 0 ? "No posts yet." : "No posts match your search."}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((post) => (
              <div
                key={post.id}
                className={`bg-bg-card border rounded-[var(--radius-theme)] p-5 flex items-start justify-between gap-4 ${
                  editing?.id === post.id
                    ? "border-border-strong"
                    : "border-border"
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="font-display text-[16px] text-fg no-underline hover:underline"
                  >
                    {post.title}
                  </Link>
                  <time className="font-mono text-xs text-fg-subtle">
                    {post.date}
                  </time>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-bg-secondary border border-border rounded text-[10px] text-fg-subtle"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEditing(post)}
                    className="text-xs text-fg-subtle hover:text-fg transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(post.id!)}
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
          open={deleteConfirmId !== null}
          title="Delete post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={() => handleDelete(deleteConfirmId!)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      </div>
    </section>
  );
}
