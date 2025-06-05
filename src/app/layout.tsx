// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";    // <-- still a Client Component
import Providers from "@/app/providers";         // <-- the new Client Component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NotaGeng",
  description: "Nota-sharing app untuk geng belajar 📚",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 
          Here, we only import the Client Component <Providers />. 
          Since Providers is marked `"use client";`, it is entirely rendered on the client,
          and inside it we can safely render <SessionProvider> and any context‐using components. 
        */}
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
