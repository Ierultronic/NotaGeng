// src/components/Navbar.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-sm">
      <Link href="/" className="text-2xl font-extrabold text-purple-700">
        NotaGeng
      </Link>

      {session ? (
        <nav className="space-x-4 flex items-center">
          <span className="text-gray-700">Hi, {session.user?.name}</span>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 text-sm font-medium text-purple-700 border-2 border-purple-700 rounded-md hover:bg-purple-700 hover:text-white transition"
          >
            Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3 py-1.5 text-sm font-medium text-red-600 border-2 border-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
          >
            Log Keluar
          </button>
        </nav>
      ) : (
        <nav className="space-x-4">
          <Link
            href="/login"
            className="px-3 py-1.5 text-sm font-medium text-purple-700 border-2 border-purple-700 rounded-md hover:bg-purple-700 hover:text-white transition"
          >
            Log Masuk
          </Link>
          <Link
            href="/register"
            className="px-3 py-1.5 text-sm font-medium text-white bg-purple-700 rounded-md hover:bg-purple-800 transition"
          >
            Daftar
          </Link>
        </nav>
      )}
    </header>
  );
}
