import type { Metadata } from "next";
import BlogPost from "@/components/sections/BlogPost";

export const metadata: Metadata = {
  title: "Blog Post",
  description: "Read this blog post by Arn Christian.",
  openGraph: {
    type: "article",
  },
};

export default function BlogPostPage() {
  return (
    <div className="stagger">
      <BlogPost />
    </div>
  );
}
