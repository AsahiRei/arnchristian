"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogEditRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/blog");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-fg-muted text-sm">Redirecting to admin panel...</p>
    </div>
  );
}
