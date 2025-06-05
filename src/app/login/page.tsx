"use client";

import { useSearchParams } from "next/navigation"; // from Next.js App Router
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in, redirect to /dashboard
  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  // Grab ?error=Callback (or any other) from URL
  const params = useSearchParams();
  const errorType = params.get("error"); // e.g. "Callback"

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, callbackUrl: "/dashboard" });
    setLoading(false);
  };

  // Map NextAuth error codes to human messages:
  const errorMessages: Record<string, string> = {
    Callback: "Something went wrong when returning from Google. Please try again.",
    OAuthAccountNotLinked:
      "This Google account is already linked to another login method.",
    Configuration:
      "There is a problem with the authentication configuration. Contact the admin.",
    AccessDenied: "You must grant permission to log in.",
    // …add others if you like (e.g. SessionRequired, etc.)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-purple-700 text-center mb-6">
          NotaGeng – Log Masuk
        </h1>

        {/* If there’s an error, show it here */}
        {errorType && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errorMessages[errorType] ||
              "An unexpected error occurred. Please try again."}
          </div>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Sign in with Google
        </button>

        <div className="text-center text-gray-500 mb-4">atau</div>

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
