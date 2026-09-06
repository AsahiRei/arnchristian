"use client";

import { useEffect, useState } from "react";
import { GithubIcon, Mail } from "@/components/icons";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
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
  copyright: "© 2024 Arn Christian. All rights reserved.",
};

export default function Footer() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

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
    }
  }

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <p className="font-mono text-xs text-fg-subtle m-0">
          {profile.copyright}
        </p>
        <div className="flex items-center gap-5">
          {[
            { icon: <GithubIcon size={16} />, href: profile.github, label: "GitHub" },
            { icon: <Mail size={16} />, href: `mailto:${profile.email}`, label: "Email" },
          ].filter(({ href }) => href).map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-fg-subtle hover:text-fg transition-colors duration-150"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
