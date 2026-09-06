"use client";

import { useState, useEffect } from "react";
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
import type { Project } from "@/types";

const emptyProject: Omit<Project, "id"> = {
  name: "",
  description: "",
  image: "",
  images: [],
  picture: "",
  tags: [],
  github: "",
  order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const q = query(collection(db, "projects"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project)));
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  function startEditing(project: Project) {
    setEditing(project);
    setShowForm(true);
    setForm({
      name: project.name,
      description: project.description,
      image: project.image,
      images: project.images || [],
      picture: project.picture,
      tags: project.tags,
      github: project.github,
      order: project.order,
    });
    setTagsInput(project.tags.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startCreating() {
    setEditing(null);
    setShowForm(true);
    setForm({ ...emptyProject, order: projects.length });
    setTagsInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditing(null);
    setShowForm(false);
    setForm(emptyProject);
    setTagsInput("");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: "image" | "picture") {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(`Failed to upload image: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map((file) => uploadToCloudinary(file))
      );
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(`Failed to upload images: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      const data = {
        ...form,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editing?.id) {
        await updateDoc(doc(db, "projects", editing.id), data);
      } else {
        await addDoc(collection(db, "projects"), data);
      }

      setSaved(true);
      cancelEditing();
      loadProjects();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      alert(`Failed to save project: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, "projects", id));
      setDeleteId(null);
      if (editing?.id === id) cancelEditing();
      loadProjects();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      alert(`Failed to delete project: ${msg}`);
    }
  }

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="font-display text-2xl text-fg m-0">Projects</h1>
          <p className="text-sm text-fg-subtle mt-1">Manage your project portfolio</p>
        </div>
        <button
          onClick={startCreating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none self-start"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Project
        </button>
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-theme)] text-sm text-green-500">
          Project saved successfully.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6 mb-8">
          <h2 className="font-display text-lg text-fg m-0 mb-4">
            {editing ? "Edit Project" : "New Project"}
          </h2>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Project Name"
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">GitHub URL</label>
              <input
                type="text"
                value={form.github}
                onChange={(e) => setForm((p) => ({ ...p, github: e.target.value }))}
                placeholder="https://github.com/username/repo"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, TypeScript, Tailwind"
                className={inputClass}
              />
            </div>

            {/* Thumbnail Image */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Thumbnail Image</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-6 bg-bg-secondary border border-dashed border-border rounded-[var(--radius-theme)] cursor-pointer hover:border-border-strong transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span className="text-sm text-fg-muted">
                    {uploading ? "Uploading..." : form.image ? "Change thumbnail" : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "image")}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.image && (
                  <div className="relative">
                    <img
                      src={form.image}
                      alt="Thumbnail"
                      className="w-full h-32 object-cover rounded-[var(--radius-theme)] border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, image: "" }))}
                      className="absolute top-2 right-2 w-6 h-6 bg-bg/80 border border-border rounded-full flex items-center justify-center text-fg-muted hover:text-fg cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Image */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Preview Image (Modal)</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-6 bg-bg-secondary border border-dashed border-border rounded-[var(--radius-theme)] cursor-pointer hover:border-border-strong transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span className="text-sm text-fg-muted">
                    {uploading ? "Uploading..." : form.picture ? "Change preview" : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "picture")}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.picture && (
                  <div className="relative">
                    <img
                      src={form.picture}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-[var(--radius-theme)] border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, picture: "" }))}
                      className="absolute top-2 right-2 w-6 h-6 bg-bg/80 border border-border rounded-full flex items-center justify-center text-fg-muted hover:text-fg cursor-pointer"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Images */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Gallery Images</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-6 bg-bg-secondary border border-dashed border-border rounded-[var(--radius-theme)] cursor-pointer hover:border-border-strong transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span className="text-sm text-fg-muted">
                    {uploading ? "Uploading..." : "Click to upload multiple images"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt={`Gallery ${i + 1}`}
                          className="w-full h-24 object-cover rounded-[var(--radius-theme)] border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-bg/80 border border-border rounded-full flex items-center justify-center text-fg-muted hover:text-fg cursor-pointer"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Project" : "Create Project"}
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

      {/* Projects List */}
      {loading ? (
        <p className="text-fg-muted text-sm">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-fg-muted text-sm">No projects yet. Create your first project!</p>
      ) : (
        <div className="stagger flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`bg-bg-card border rounded-[var(--radius-theme)] p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                editing?.id === project.id ? "border-border-strong" : "border-border"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-16 h-16 object-cover rounded border border-border shrink-0"
                  />
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="font-display text-[16px] text-fg m-0">{project.name}</h3>
                  <p className="text-xs text-fg-subtle m-0 line-clamp-2">{project.description}</p>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.tags.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-bg-secondary border border-border rounded text-[10px] text-fg-subtle">
                          {t}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-[10px] text-fg-subtle">+{project.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  {project.images.length > 0 && (
                    <span className="text-[10px] text-fg-subtle">{project.images.length} gallery images</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEditing(project)}
                  className="text-xs text-fg-subtle hover:text-fg transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(project.id!)}
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
        title="Delete project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={() => handleDelete(deleteId!)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
