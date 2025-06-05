"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in, redirect to /dashboard
  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // NextAuth’s Email provider will send a signup link if the email is new
    await signIn("email", { email, callbackUrl: "/dashboard" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-purple-700 text-center mb-6">
          NotaGeng - Daftar
        </h1>

        {/* Google “Register” (which is really just sign-in with Google) */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.9-1.6-35.3-4.6-52.1H272v98.6h146.9c-6.3 34-25 62.9-53.1 82.3v68.3h85.6c50.1-46.1 79.1-113.9 79.1-197z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c71.4 0 131.4-23.5 175.3-63.8l-85.6-68.3c-23.8 16-54.3 25.4-89.7 25.4-68.9 0-127.3-46.5-148.3-109.1H36.2v68.6c43.7 86 132.5 147.2 235.8 147.2z"
              fill="#34A853"
            />
            <path
              d="M123.7 323.8a162.4 162.4 0 0 1 0-103.2v-68.6H36.2a275 275 0 0 0 0 240.4l87.5-68.6z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.2c39 0 74 13.5 101.6 40l76.3-76.3C404.1 24.6 344.1 0 272 0c-103.3 0-192.1 61.2-235.8 147.2l87.5 68.6C144.7 153.7 203.1 107.2 272 107.2z"
              fill="#EA4335"
            />
          </svg>
          Register with Google
        </button>

        <div className="text-center text-gray-500 mb-4">atau</div>

        {/* Email (Magic Link) Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-4">
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
          Sudah ada akaun?{" "}
          <Link href="/login" className="text-purple-600 font-medium hover:underline">
            Log Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
