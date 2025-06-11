// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, Search, Plus } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (status === "loading") return null;

  return (
    <nav className="fixed top-0 w-full z-20 bg-white/50 backdrop-blur-sm shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold text-purple-700">
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            NotaGeng
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 caret-black" size={16} />
            <input
              type="text"
              placeholder="Search notes..."
              className="pl-8 pr-4 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900 caret-black focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {session ? (
            <>
              <span className="text-gray-800">Hi, <strong>{session.user?.name?.split(" ")[0]}</strong> 👋</span>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
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
              <Link
                href="/login"
                className="px-4 py-2 text-purple-700 border border-purple-700 rounded-full hover:bg-purple-700 hover:text-white transition"
              >
                Log Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-sm border-t border-gray-200">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/note/new" onClick={() => setMobileOpen(false)}>
                  + New Note
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setMobileOpen(false);
                  }}
                  className="text-red-500"
                >
                  Log Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Log Masuk
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
