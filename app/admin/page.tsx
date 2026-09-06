"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Stats {
  projects: number;
  certificates: number;
  blogPosts: number;
  experience: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    certificates: 0,
    blogPosts: 0,
    experience: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, certificates, blogPosts, experience] = await Promise.all([
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "certificates")),
          getDocs(collection(db, "blogPosts")),
          getDocs(collection(db, "experience")),
        ]);

        setStats({
          projects: projects.size,
          certificates: certificates.size,
          blogPosts: blogPosts.size,
          experience: experience.size,
        });
      } catch {
        // Stats will remain at 0
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, href: "/admin/projects", color: "text-blue-500" },
    { label: "Certificates", value: stats.certificates, href: "/admin/certificates", color: "text-green-500" },
    { label: "Blog Posts", value: stats.blogPosts, href: "/admin/blog", color: "text-purple-500" },
    { label: "Experience", value: stats.experience, href: "/admin/experience", color: "text-orange-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl text-fg m-0">Dashboard</h1>
        <p className="text-sm text-fg-subtle mt-1">Manage your portfolio content</p>
      </div>

      <div className="stagger grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-5 no-underline hover:border-border-strong transition-colors"
          >
            <p className="text-xs text-fg-subtle uppercase tracking-wider m-0">{card.label}</p>
            <p className={`font-display text-3xl ${card.color} mt-2 m-0`}>
              {loading ? "—" : card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6">
        <h2 className="font-display text-lg text-fg m-0 mb-4">Quick Actions</h2>
        <div className="stagger flex flex-wrap gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg no-underline hover:opacity-80 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Project
          </Link>
          <Link
            href="/admin/certificates"
            className="inline-flex items-center gap-2 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg no-underline hover:opacity-80 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Certificate
          </Link>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-fg rounded-md text-[13px] font-medium text-bg no-underline hover:opacity-80 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Blog Post
          </Link>
          <Link
            href="/admin/profile"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md text-[13px] font-medium text-fg-muted no-underline hover:border-fg hover:text-fg transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
