// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  // 1) Grab the current session on the server
  const session = await getServerSession(authOptions);

  // 2) If there's no session, send them back to /login
  if (!session) {
    console.log("🔴 No session found, redirecting to /login");
    redirect("/login");
  }

  // 3) If we have a session, display a simple dashboard
  const userName = session.user?.name || "User";

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Hi, {userName} 👋</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">My Notes</h2>
        <p className="text-gray-600 mb-4">
          (This is where all your private notes will show up.)
        </p>
        {/* Placeholder: no notes yet */}
        <div className="p-6 bg-white rounded-lg shadow-sm text-center text-gray-400">
          You have no notes yet.{" "}
          <Link
            href="/note/new"
            className="text-purple-600 underline hover:text-purple-800"
          >
            Create your first note →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Shared Notes</h2>
        <p className="text-gray-600 mb-4">
          (This is where public/shared notes from everyone will appear.)
        </p>
        {/* Placeholder: no shared notes yet */}
        <div className="p-6 bg-white rounded-lg shadow-sm text-center text-gray-400">
          There are no public notes yet. Check back soon!
        </div>
      </section>
    </main>
  );
}
