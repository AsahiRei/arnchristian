"use client";

import { useState, useEffect } from "react";
import { Sidebar, Footer } from "@/components/layout";
import "@/index.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/avatar/avatar-1.jpg" />
        <title>Arn Christian</title>
      </head>
      <body>
        <div className="bg-bg text-fg min-h-screen">
          <Sidebar dark={dark} setDark={setDark} />
          <main className="md:ml-[220px] pt-14 md:pt-0">
            {children}
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
