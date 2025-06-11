// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userName = session.user.name?.split(" ")[0] ?? "Geng";

  return (
    <main className="pt-20 relative min-h-screen bg-[#FFE1E9] overflow-hidden p-6">
      {/* Pastel “blobs” */}
      <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-pink-300/50 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-purple-300/40 animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="text-5xl font-extrabold text-purple-800 mb-2">
              Hi, {userName}! 🌟
            </h1>
            <p className="mt-2 text-lg text-gray-700">
              Ready to slay those notes?🗣️🔥
            </p>
          </div>
          <Link href="/note/new">
            <button className="mt-6 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 4v16m8-8H4" />
              </svg>
              Create Note
            </button>
          </Link>
        </header>

        {/* My Notes */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">My Notes 📚</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder card */}
            <div className="flex flex-col items-center justify-center p-6 bg-white/30 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-gray-500 mb-4">You haven’t made any notes yet.</p>
              <Link href="/note/new" className="text-pink-500 font-medium hover:underline">
                + Create Your First Note
              </Link>
            </div>
            {/* TODO: Replace with real note cards */}
          </div>
        </section>

        {/* Shared Notes */}
        <section>
          <h2 className="text-2xl font-bold text-purple-700 mb-6">Shared Notes 🌐</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-6 bg-white/30 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="text-gray-500">No shared notes yet. Stay tuned!</p>
            </div>
            {/* TODO: Replace with shared note cards */}
          </div>
        </section>
      </div>
    </main>
  );
}
