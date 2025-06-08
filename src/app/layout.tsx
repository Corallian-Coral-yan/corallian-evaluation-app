"use client";

import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  if (typeof window !== "undefined") {
    console.log("CLIENT");
  } else {
    console.log("SERVER");
  }

  const pathname = usePathname();
  const showNavbar = !pathname?.startsWith("/login"); // hide Navbar on /login

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Providers>
          {showNavbar && <Navbar />}
          <main className="flex-grow w-full max-w-6xl mx-auto p-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
