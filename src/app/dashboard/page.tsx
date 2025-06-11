// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import { authOptions } from "@/lib/auth";
import NoteCard from "@/components/NoteCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userName = session.user.name?.split(" ")[0] ?? "Geng";

  // Fetch the 3 most recent notes for this user
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, content, slug, subject:subjects(name), created_at")
    .eq("author_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const recentNotes = (notes ?? []).map((n) => ({
    ...n,
    excerpt: n.content.length > 80 ? n.content.slice(0, 80) + "…" : n.content,
  }));

  return (
    <main className="pt-20 min-h-screen bg-[#FFE1E9] p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-purple-800 mb-1">
              Hai, {userName}! 🎉
            </h1>
            <p className="text-gray-600">Here’s your latest notes</p>
          </div>
          <Link href="/notes">
            <button className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
              View All Notes →
            </button>
          </Link>
        </header>

        {/* Sneak-peek of My Notes */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  slug={note.slug}
                  created_at={note.created_at}
                  subjectName={note.subject?.name}
                />
              ))
            ) : (
              <div className="col-span-full p-6 bg-white rounded-2xl shadow-sm text-center text-gray-500">
                You haven’t made any notes yet.{" "}
                <Link href="/notes/new" className="text-pink-500 underline">
                  Create your first note
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Shared Notes preview (you can replicate above) */}
      </div>
    </main>
  );
}
