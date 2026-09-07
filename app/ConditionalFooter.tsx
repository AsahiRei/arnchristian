"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/community-chat")) return null;
  return <Footer />;
}
