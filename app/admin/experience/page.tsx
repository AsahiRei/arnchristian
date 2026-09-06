"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
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
import type { Experience } from "@/types";

const emptyExperience: Omit<Experience, "id"> = {
  position: "",
  company: "",
  date: "",
  description: "",
  technologies: [],
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(emptyExperience);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    try {
      const q = query(collection(db, "experience"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setExperiences(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Experience)));
    } catch {
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  }

  function startEditing(exp: Experience) {
    setEditing(exp);
    setShowForm(true);
    setForm({
      position: exp.position,
      company: exp.company,
      date: exp.date,
      description: exp.description,
      technologies: exp.technologies,
    });
    setTechInput(exp.technologies.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startCreating() {
    setEditing(null);
    setShowForm(true);
    setForm(emptyExperience);
    setTechInput("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditing(null);
    setShowForm(false);
    setForm(emptyExperience);
    setTechInput("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.position.trim()) return;

    setSaving(true);
    try {
      const data = {
        ...form,
        technologies: techInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editing?.id) {
        await updateDoc(doc(db, "experience", editing.id), data);
      } else {
        await addDoc(collection(db, "experience"), data);
      }

      setSaved(true);
      cancelEditing();
      loadExperiences();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      alert(`Failed to save experience: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, "experience", id));
      setDeleteId(null);
      if (editing?.id === id) cancelEditing();
      loadExperiences();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      alert(`Failed to delete experience: ${msg}`);
    }
  }

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="font-display text-2xl text-fg m-0">Experience</h1>
          <p className="text-sm text-fg-subtle mt-1">Manage your work experience</p>
        </div>
        <button
          onClick={startCreating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none self-start"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Experience
        </button>
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-theme)] text-sm text-green-500">
          Experience saved successfully.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6 mb-8">
          <h2 className="font-display text-lg text-fg m-0 mb-4">
            {editing ? "Edit Experience" : "New Experience"}
          </h2>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Position</label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
                  placeholder="Job Title"
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="Company Name"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Date</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                placeholder="2020 - 2022"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                placeholder="Describe your role and responsibilities..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Technologies (comma separated)</label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React, Node.js, MongoDB"
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Experience" : "Create Experience"}
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

      {/* Experience List */}
      {loading ? (
        <p className="text-fg-muted text-sm">Loading experiences...</p>
      ) : experiences.length === 0 ? (
        <p className="text-fg-muted text-sm">No experiences yet. Add your first experience!</p>
      ) : (
        <div className="stagger flex flex-col gap-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className={`bg-bg-card border rounded-[var(--radius-theme)] p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                editing?.id === exp.id ? "border-border-strong" : "border-border"
              }`}
            >
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="font-display text-[16px] text-fg m-0">{exp.position}</h3>
                <p className="text-xs text-fg-subtle m-0">{exp.company}</p>
                <time className="font-mono text-xs text-fg-subtle">{exp.date}</time>
                {exp.description && (
                  <p className="text-xs text-fg-muted mt-2 m-0 line-clamp-2">{exp.description}</p>
                )}
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-bg-secondary border border-border rounded text-[10px] text-fg-subtle">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startEditing(exp)}
                  className="text-xs text-fg-subtle hover:text-fg transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(exp.id!)}
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
        title="Delete experience"
        message="Are you sure you want to delete this experience? This action cannot be undone."
        onConfirm={() => handleDelete(deleteId!)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
