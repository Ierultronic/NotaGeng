// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  Plus,
  Tag,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTagCloud, setShowTagCloud] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Theme toggle effect
  useEffect(() => {
    const cls = document.documentElement.classList;
    if (darkMode) cls.add("dark");
    else cls.remove("dark");
  }, [darkMode]);

  if (status === "loading") return null;

  // Build breadcrumbs from path segments
  const segments = router.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    return { label: seg.charAt(0).toUpperCase() + seg.slice(1), href };
  });

  return (
    <nav className="fixed top-0 w-full z-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LEFT GROUP */}
        <div className="flex items-center space-x-4 relative">
          {/* Logo */}
          <Link href="/" className="text-3xl font-extrabold text-purple-700 dark:text-pink-400">
            NotaGeng
          </Link>
        </div>

        {/* CENTER: Search */}
        <div className="hidden md:block flex-grow mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white border-white" size={16} />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-8 pr-4 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
          </div>
        </div>

        {/* RIGHT GROUP */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="hidden sm:inline text-gray-800 dark:text-gray-200">
                Hi, <strong>{session.user?.name?.split(" ")[0]}</strong> 👋
              </span>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
              >
                Log Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-purple-700 border border-purple-700 rounded-full hover:bg-purple-700 hover:text-white transition">
                Log Masuk
              </Link>
              <Link href="/register" className="px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition">
                Daftar
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE PANEL */}
      {mobileOpen && (
        <div className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/notes" onClick={() => setMobileOpen(false)}>My Notes</Link>
            <Link href="/notes/new" onClick={() => setMobileOpen(false)}>+ New Note</Link>
            {session ? (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setMobileOpen(false);
                }}
                className="text-red-500"
              >
                Log Keluar
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>Log Masuk</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
