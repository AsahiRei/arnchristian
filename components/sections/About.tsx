"use client";

import { useEffect, useState } from "react";
import { SectionHeader, SkeletonAbout } from "@/components/ui";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Profile } from "@/types";

const defaultProfile: Profile = {
  name: "Arn Christian",
  title: "BSIT Student",
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

export default function About() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const snap = await getDoc(doc(db, "profile", "main"));
      if (snap.exists()) {
        setProfile(snap.data() as Profile);
      }
    } catch {
      // Use default profile
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <SkeletonAbout />;
  }

  return (
    <section id="about" className="min-h-screen flex items-center py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="01 — About" title="Who I am." />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 items-start">
          <div>
            <div className="w-full max-w-[400px] aspect-[4/5] rounded-[var(--radius-theme)] overflow-hidden bg-bg-secondary border border-border">
              {profile.aboutImage ? (
                <img
                  src={profile.aboutImage}
                  alt={`${profile.name} profile`}
                  className="w-full h-full object-cover grayscale"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-fg-muted text-sm">
                  No image
                </div>
              )}
            </div>
          </div>
          <div>
            {profile.about.map((paragraph, i) => (
              <p key={i} className={`text-[17px] leading-[1.8] text-fg-muted ${i < profile.about.length - 1 ? "mb-8" : "mb-10"}`}>
                {paragraph}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {profile.details.map(({ label, value }) => (
                <div key={label} className="py-5 border-b border-border">
                  <p className="font-mono text-[11px] text-fg-subtle uppercase tracking-wider mb-1.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-fg">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
