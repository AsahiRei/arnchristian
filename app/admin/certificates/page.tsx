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
import type { Certificate } from "@/types";

const emptyCertificate: Omit<Certificate, "id"> = {
  name: "",
  issuer: "",
  date: "",
  image: "",
  url: "",
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState<Omit<Certificate, "id">>(emptyCertificate);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCertificates();
  }, []);

  async function loadCertificates() {
    try {
      const q = query(collection(db, "certificates"), orderBy("date", "desc"));
      const snap = await getDocs(q);
      setCertificates(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Certificate)));
    } catch {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }

  function startEditing(cert: Certificate) {
    setEditing(cert);
    setShowForm(true);
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      image: cert.image,
      url: cert.url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startCreating() {
    setEditing(null);
    setShowForm(true);
    setForm({ ...emptyCertificate, date: new Date().toISOString().split("T")[0] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditing(null);
    setShowForm(false);
    setForm(emptyCertificate);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(`Failed to upload image: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    try {
      if (editing?.id) {
        await updateDoc(doc(db, "certificates", editing.id), form);
      } else {
        await addDoc(collection(db, "certificates"), form);
      }

      setSaved(true);
      cancelEditing();
      loadCertificates();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      alert(`Failed to save certificate: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, "certificates", id));
      setDeleteId(null);
      if (editing?.id === id) cancelEditing();
      loadCertificates();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      alert(`Failed to delete certificate: ${msg}`);
    }
  }

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="font-display text-2xl text-fg m-0">Certificates</h1>
          <p className="text-sm text-fg-subtle mt-1">Manage your certifications</p>
        </div>
        <button
          onClick={startCreating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none self-start"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Certificate
        </button>
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-theme)] text-sm text-green-500">
          Certificate saved successfully.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6 mb-8">
          <h2 className="font-display text-lg text-fg m-0 mb-4">
            {editing ? "Edit Certificate" : "New Certificate"}
          </h2>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Certificate Name"
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Issuer</label>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))}
                  placeholder="Issuing Organization"
                  className={inputClass}
                />
              </div>
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
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Credential URL</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Certificate Image */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Certificate Image</label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-6 bg-bg-secondary border border-dashed border-border rounded-[var(--radius-theme)] cursor-pointer hover:border-border-strong transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span className="text-sm text-fg-muted">
                    {uploading ? "Uploading..." : form.image ? "Change image" : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {form.image && (
                  <div className="relative">
                    <img
                      src={form.image}
                      alt="Certificate"
                      className="w-full h-40 object-cover rounded-[var(--radius-theme)] border border-border"
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

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none disabled:opacity-50"
              >
                {saving ? "Saving..." : editing ? "Update Certificate" : "Create Certificate"}
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

      {/* Certificates List */}
      {loading ? (
        <p className="text-fg-muted text-sm">Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <p className="text-fg-muted text-sm">No certificates yet. Add your first certificate!</p>
      ) : (
        <div className="stagger flex flex-col gap-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`bg-bg-card border rounded-[var(--radius-theme)] p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                editing?.id === cert.id ? "border-border-strong" : "border-border"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                {cert.image && (
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-16 h-16 object-cover rounded border border-border shrink-0"
                  />
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="font-display text-[16px] text-fg m-0">{cert.name}</h3>
                  <p className="text-xs text-fg-subtle m-0">{cert.issuer}</p>
                  <time className="font-mono text-xs text-fg-subtle">{cert.date}</time>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-fg-subtle hover:text-fg transition-colors px-2 py-1"
                  >
                    View
                  </a>
                )}
                <button
                  onClick={() => startEditing(cert)}
                  className="text-xs text-fg-subtle hover:text-fg transition-colors bg-transparent border-none cursor-pointer px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(cert.id!)}
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
        title="Delete certificate"
        message="Are you sure you want to delete this certificate? This action cannot be undone."
        onConfirm={() => handleDelete(deleteId!)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
