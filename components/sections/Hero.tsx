"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SkeletonHero } from "@/components/ui";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { Profile } from "@/types";

const defaultProfile: Profile = {
  name: "Arn Christian",
  title: "BSIT Student",
  bio: "",
  avatar: "/images/avatar/avatar-1.jpg",
  aboutImage: "",
  about: [],
  details: [],
  email: "",
  github: "",
  location: "",
  copyright: "",
};

export default function Hero() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const snap = await getDoc(doc(db, "profile", "main"));
      if (snap.exists()) {
        const data = snap.data() as Profile;
        if (!data.avatar) data.avatar = defaultProfile.avatar;
        setProfile(data);
      }
    } catch {
      // Use default profile
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <SkeletonHero />;
  }

  return (
    <section id="hero" className="min-h-screen flex items-center px-6 py-20 md:py-0">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 gap-16 items-center md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-mono text-xs text-fg-subtle tracking-[0.12em] uppercase mb-6">
              Open to opportunities
            </p>
            <h1 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] text-fg mb-4">
              Hi, I&apos;m<br />{profile.name}.
            </h1>
            <p className="font-display italic text-[clamp(1.4rem,3vw,2rem)] text-fg-muted mb-6">
              {profile.title}
            </p>
            <p className="text-base leading-7 text-fg-muted max-w-[520px] mb-10">
              {profile.bio}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/projects"
                className="bg-fg text-bg px-6 py-3 rounded-[var(--radius-theme)] font-body text-sm font-medium no-underline hover:opacity-80 transition-opacity inline-block"
              >
                View Projects
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-fg px-6 py-3 rounded-[var(--radius-theme)] font-body text-sm font-medium no-underline border border-border-strong hover:border-fg transition-colors inline-block"
              >
                Contact Me
              </Link>
            </div>
          </div>

          {profile.avatar && (
            <div className="w-60 shrink-0 hidden md:block mx-auto md:mx-0">
              <div className="w-60 h-60 rounded-full overflow-hidden border-2 border-border bg-bg-secondary">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
