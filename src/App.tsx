import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Sidebar, Footer } from "@/components/layout";
import {
  HomePage,
  AboutPage,
  SkillsPage,
  ProjectsPage,
  ExperiencePage,
  CertificatesPage,
  ContactPage,
  BlogPage,
  BlogPostPage,
  CreateBlogPostPage,
  EditBlogPostPage,
} from "@/pages";

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/experience" element={<ExperiencePage />} />
      <Route path="/certificates" element={<CertificatesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/create" element={<CreateBlogPostPage />} />
      <Route path="/blog/edit" element={<EditBlogPostPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
    </Routes>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <BrowserRouter>
      <div className="bg-bg text-fg min-h-screen">
        <Sidebar dark={dark} setDark={setDark} />
        <main className="md:ml-[220px] pt-14 md:pt-0">
          <AnimatedRoutes />
          <Footer />
        </main>
      </div>
    </BrowserRouter>
  );
}
