"use client";

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Profile } from "@/types";

const defaultProfile: Profile = {
  name: "",
  title: "",
  bio: "",
  avatar: "",
  aboutImage: "",
  about: [],
  details: [],
  email: "",
  github: "",
  location: "",
  copyright: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [detailsText, setDetailsText] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const snap = await getDoc(doc(db, "profile", "main"));
        if (snap.exists()) {
          const data = snap.data() as Profile;
          setProfile(data);
          setAboutText(data.about.join("\n\n"));
          setDetailsText(
            data.details.map((d) => `${d.label}: ${d.value}`).join("\n")
          );
        }
      } catch {
        // Use default profile
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadToCloudinary(file);
      setProfile((prev) => ({ ...prev, avatar: url }));

      // Update favicon
      const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (link) link.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(`Failed to upload avatar: ${msg}`);
    }
  }

  async function handleAboutImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadToCloudinary(file);
      setProfile((prev) => ({ ...prev, aboutImage: url }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      alert(`Failed to upload image: ${msg}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const about = aboutText
        .split("\n\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const details = detailsText
        .split("\n")
        .map((line) => {
          const [label, ...valueParts] = line.split(":");
          return {
            label: label?.trim() || "",
            value: valueParts.join(":").trim() || "",
          };
        })
        .filter((d) => d.label && d.value);

      await setDoc(doc(db, "profile", "main"), {
        ...profile,
        about,
        details,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      alert(`Failed to save profile: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fg-muted text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl text-fg m-0">Profile</h1>
        <p className="text-sm text-fg-subtle mt-1">Manage your personal information</p>
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-[var(--radius-theme)] text-sm text-green-500">
          Profile saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="stagger flex flex-col gap-6">
        {/* Avatar Section */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6">
          <h2 className="font-display text-lg text-fg m-0 mb-4">Avatar</h2>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-border shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-fg-subtle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-secondary border border-dashed border-border rounded-[var(--radius-theme)] cursor-pointer hover:border-border-strong transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-sm text-fg-muted">Upload new avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-fg-subtle mt-2">
                Also updates the tab icon
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6">
          <h2 className="font-display text-lg text-fg m-0 mb-4">Basic Information</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                rows={3}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6">
          <h2 className="font-display text-lg text-fg m-0 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">GitHub</label>
              <input
                type="text"
                value={profile.github}
                onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))}
                placeholder="https://github.com/username"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">Copyright</label>
              <input
                type="text"
                value={profile.copyright}
                onChange={(e) => setProfile((p) => ({ ...p, copyright: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* About Image */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6">
          <h2 className="font-display text-lg text-fg m-0 mb-4">About Image</h2>
          <div className="flex flex-col gap-4">
            {profile.aboutImage && (
              <img
                src={profile.aboutImage}
                alt="About"
                className="w-full h-48 object-cover rounded-[var(--radius-theme)] border border-border"
              />
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-6 bg-bg-secondary border border-dashed border-border rounded-[var(--radius-theme)] cursor-pointer hover:border-border-strong transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-fg-subtle">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="text-sm text-fg-muted">Upload about image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAboutImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6">
          <h2 className="font-display text-lg text-fg m-0 mb-4">About Section</h2>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              About paragraphs (separate with blank lines)
            </label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={6}
              placeholder="First paragraph about yourself...&#10;&#10;Second paragraph..."
              className={`${inputClass} resize-y min-h-[150px]`}
            />
          </div>
        </div>

        {/* Details */}
        <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6">
          <h2 className="font-display text-lg text-fg m-0 mb-4">Details</h2>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              Details (one per line, format: Label: Value)
            </label>
            <textarea
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
              rows={4}
              placeholder="Degree: BSIT&#10;School: STI College Lipa&#10;Status: Student"
              className={`${inputClass} resize-y min-h-[100px]`}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
