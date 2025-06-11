// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  // 1) Always call these hooks at the top:
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 2) Redirect **inside** a useEffect, never in render.
  // only redirect if *both* status is authenticated *and* you see a real user ID
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // 3) While loading, you can show a spinner or nothing:
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  // 4) Now the actual render for “not signed in yet”
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, callbackUrl: "/dashboard" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-purple-700 text-center mb-6">
          NotaGeng – Log Masuk
        </h1>

        {/* Google Sign-In */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Sign in with Google
        </button>

        <div className="text-center text-gray-500 mb-4">atau</div>

        {/* Email Magic Link */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <label className="block text-gray-700">Alamat Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            {loading ? "Menghantar Link..." : "Kirim Magic Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Belum ada akaun?{" "}
          <Link href="/register" className="text-purple-600 font-medium hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
