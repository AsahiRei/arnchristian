import type { Metadata } from "next";
import Blog from "@/components/sections/Blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read Arn Christian's articles on web development, programming, technology, and student life.",
  openGraph: {
    title: "Blog | Arn Christian",
    description:
      "Read Arn Christian's articles on web development, programming, and technology.",
  },
};

export default function BlogPage() {
  return (
    <div className="stagger">
      <Blog />
    </div>
  );
}
