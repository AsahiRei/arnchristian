"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = login(username, password);

    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid username or password");
    }
    setLoading(false);
  }

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-strong transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-fg m-0">Admin Panel</h1>
          <p className="text-sm text-fg-subtle mt-2">Sign in to manage your portfolio</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bg-card border border-border rounded-[var(--radius-theme)] p-6 flex flex-col gap-5"
        >
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-[var(--radius-theme)] text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className={inputClass}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-fg-subtle uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-fg rounded-md text-[13px] font-medium text-bg hover:opacity-80 transition-opacity cursor-pointer border-none disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
