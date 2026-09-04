"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { SectionHeader } from "@/components/ui";
import { Mail, GithubIcon } from "@/components/icons";
import { PROFILE } from "@/data";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! },
      );
      setFormSent(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setFormSent(false), 4000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-bg-secondary border border-border rounded-[var(--radius-theme)] text-fg font-body text-sm px-3.5 py-3 outline-none focus:border-fg transition-colors duration-150";
  const labelClass =
    "block font-mono text-[11px] text-fg-subtle uppercase tracking-wider mb-2";

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center py-24 px-6 bg-bg-secondary"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader label="06 — Contact" title="Let's Work Together." />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.4fr] md:gap-20 items-start">
          <div>
            <p className="text-base leading-8 text-fg-muted mb-10">
              I&apos;m open to full-time roles, contract work, and interesting
              side-project collaborations. Reach out and let&apos;s talk.
            </p>
            <div className="flex flex-col gap-5">
              {[
                {
                  icon: <Mail size={18} />,
                  label: PROFILE.email,
                  href: `mailto:${PROFILE.email}`,
                },
                {
                  icon: <GithubIcon size={18} />,
                  label: PROFILE.github.replace("https://", ""),
                  href: PROFILE.github,
                },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3.5 text-fg-muted no-underline text-sm hover:text-fg transition-colors duration-150"
                >
                  {icon} {label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Subject</label>
              <input
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="What's this about?"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Tell me about your project..."
                className={`${inputClass} resize-y min-h-[120px]`}
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-[var(--radius-theme)] px-4 py-3 text-sm flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-400 ml-3 cursor-pointer bg-transparent border-none text-lg leading-none"
                >
                  &times;
                </button>
              </div>
            )}
            {formSent && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-500 rounded-[var(--radius-theme)] px-4 py-3 text-sm">
                Message sent successfully! I&apos;ll get back to you soon.
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-fg text-bg border-none rounded-[var(--radius-theme)] px-7 py-3.5 font-body text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity self-start disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Sending..."
                : formSent
                  ? "Message Sent ✓"
                  : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
