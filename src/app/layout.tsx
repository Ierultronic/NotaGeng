// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";    // <-- still a Client Component
import Providers from "@/app/providers";         // <-- the new Client Component
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NotaGeng",
  description: "Nota-sharing app untuk geng belajar 📚",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

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
          {session && <Sidebar />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
