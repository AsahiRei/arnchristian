"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { SkillCategory, Skill } from "@/types";

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [skillsText, setSkillsText] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    try {
      const snap = await getDoc(doc(db, "skills", "main"));
      if (snap.exists()) {
        const data = snap.data();
        setCategories(data.categories || []);
      }
    } catch {
      // Use empty categories
    } finally {
      setLoading(false);
    }
  }

  function startEditing(index: number) {
    setEditingIndex(index);
    setCategoryName(categories[index].category);
    setSkillsText(
      categories[index].skills
        .map((s) => `${s.name}: ${s.icon}`)
        .join("\n")
    );
  }

  function startCreating() {
    setEditingIndex(-1);
    setCategoryName("");
    setSkillsText("");
  }

  function cancelEditing() {
    setEditingIndex(null);
    setCategoryName("");
    setSkillsText("");
  }

  async function handleSave() {
    if (!categoryName.trim()) return;

    setSaving(true);
    try {
      const skills: Skill[] = skillsText
        .split("\n")
        .map((line) => {
          const [name, ...iconParts] = line.split(":");
          return {
            name: name?.trim() || "",
            icon: iconParts.join(":").trim() || "",
          };
        })
        .filter((s) => s.name);

      const newCategory: SkillCategory = {
        category: categoryName.trim(),
        skills,
      };

      let updated: SkillCategory[];
      if (editingIndex !== null && editingIndex >= 0) {
        updated = [...categories];
        updated[editingIndex] = newCategory;
      } else {
        updated = [...categories, newCategory];
      }

      await setDoc(doc(db, "skills", "main"), { categories: updated });
      setCategories(updated);
      setSaved(true);
      cancelEditing();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      alert(`Failed to save skills: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(index: number) {
    if (!confirm("Delete this category and all its skills?")) return;

    setSaving(true);
    try {
      const updated = categories.filter((_, i) => i !== index);
      await setDoc(doc(db, "skills", "main"), { categories: updated });
      setCategories(updated);
      cancelEditing();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      alert(`Failed to delete category: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fg-muted text-sm">Loading skills...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="font-display text-2xl text-fg m-0">Skills</h1>
          <p className="text-sm text-fg-subtle mt-1">Manage your skill categories</p>
        </div>
        <button
          onClick={startCreating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none self-start"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Category
        </button>
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-theme)] text-sm text-green-500">
          Skills saved successfully.
        </div>
      )}

      {/* Form */}
      {editingIndex !== null && (
        <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6 mb-8">
          <h2 className="font-display text-lg text-fg m-0 mb-4">
            {editingIndex >= 0 ? "Edit Category" : "New Category"}
          </h2>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Frontend, Backend, etc."
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
                Skills (one per line, format: Name: icon-name)
              </label>
              <textarea
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React: react&#10;TypeScript: typescript&#10;Tailwind CSS: tailwind"
                rows={8}
                className={`${inputClass} resize-y min-h-[150px] font-mono text-xs`}
              />
              <p className="text-xs text-fg-subtle">
                Icon names: react, typescript, javascript, nodejs, python, mongodb, postgresql, firebase, git, docker, etc.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleSave}
                disabled={saving || !categoryName.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none disabled:opacity-50"
              >
                {saving ? "Saving..." : editingIndex >= 0 ? "Update Category" : "Create Category"}
              </button>
              <button
                onClick={cancelEditing}
                className="text-sm text-fg-muted hover:text-fg transition-colors bg-transparent border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <p className="text-fg-muted text-sm">No skill categories yet. Add your first category!</p>
      ) : (
        <div className="stagger flex flex-col gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`bg-bg-card border rounded-[var(--radius-theme)] p-5 ${
                editingIndex === index ? "border-border-strong" : "border-border"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <h3 className="font-display text-lg text-fg m-0">{cat.category}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditing(index)}
                    className="text-xs text-fg-subtle hover:text-fg transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(index)}
                    className="text-xs text-fg-subtle hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-border rounded-md"
                  >
                    <span className="text-xs text-fg">{skill.name}</span>
                    {skill.icon && (
                      <span className="text-[10px] text-fg-subtle">({skill.icon})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
